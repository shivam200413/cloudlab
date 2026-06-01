const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');
const net = require('net');
const { workspaces } = require('../workspaceStore');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const TEMPLATES = {
  nodejs:    { id: 'nodejs',    name: 'Node.js 20',  image: 'cloudlab-node:latest',      tags: ['JavaScript', 'Node.js', 'npm'] },
  python:    { id: 'python',    name: 'Python 3.11', image: 'cloudlab-python:latest',    tags: ['Python', 'pip', 'Jupyter'] },
  fullstack: { id: 'fullstack', name: 'Full Stack',  image: 'cloudlab-fullstack:latest', tags: ['Node.js', 'Python', 'PostgreSQL'] },
};

async function findFreePort(start = 8100, end = 8200) {
  for (let port = start; port <= end; port++) {
    const free = await new Promise(resolve => {
      const srv = net.createServer();
      srv.listen(port, () => srv.close(() => resolve(true)));
      srv.on('error', () => resolve(false));
    });
    if (free) return port;
  }
  throw new Error('No free ports in range 8100–8200');
}

async function getContainerStatus(containerId) {
  if (!containerId) return 'stopped';
  try {
    const info = await docker.getContainer(containerId).inspect();
    return info.State.Running ? 'running' : 'stopped';
  } catch {
    return 'stopped';
  }
}

async function getTemplates() {
  return Object.values(TEMPLATES);
}

async function listWorkspaces(userId) {
  const result = [];
  for (const [id, ws] of workspaces) {
    if (ws.userId !== userId) continue;
    const status = await getContainerStatus(ws.containerId);
    const updated = { ...ws, status };
    workspaces.set(id, updated);
    result.push(updated);
  }
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function createWorkspace(userId, { name, templateId }) {
  const template = TEMPLATES[templateId];
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const running = [];
  for (const [, ws] of workspaces) {
    if (ws.userId === userId) {
      const s = await getContainerStatus(ws.containerId);
      if (s === 'running') running.push(ws);
    }
  }
  if (running.length >= 2) throw new Error('Free tier: max 2 running workspaces');

  const id = uuidv4();
  const shortId = id.slice(0, 8);
  const containerName = `cloudlab-ws-${shortId}`;
  const hostPort = await findFreePort();
  const password = process.env.CODE_SERVER_PASSWORD || 'cloudlab123';

  let container;
  try {
    container = await docker.createContainer({
      Image: template.image,
      name: containerName,
      Env: [`PASSWORD=${password}`, `WORKSPACE_ID=${id}`],
      ExposedPorts: { '8080/tcp': {} },
      HostConfig: {
        PortBindings: { '8080/tcp': [{ HostPort: String(hostPort) }] },
        Memory: 536870912,   // 512 MB
        CpuShares: 512,
        NetworkMode: 'cloudlab_network',
        Binds: [`cloudlab-data-${shortId}:/home/coder/project`],
      },
      Labels: {
        'cloudlab.workspace': id,
        'cloudlab.user': userId,
        'cloudlab.template': templateId,
      },
    });
    await container.start();
  } catch (err) {
    if (err.statusCode === 404) {
      throw new Error(`Image "${template.image}" not found. Run: make build-images`);
    }
    throw err;
  }

  const workspace = {
    id, userId,
    name: name || `${template.name} Workspace`,
    templateId, template,
    containerId: container.id,
    containerName,
    hostPort,
    status: 'running',
    createdAt: new Date().toISOString(),
  };
  workspaces.set(id, workspace);
  return workspace;
}

async function stopWorkspace(workspaceId, userId) {
  const ws = workspaces.get(workspaceId);
  if (!ws) throw new Error('Workspace not found');
  if (ws.userId !== userId) throw new Error('Unauthorized');
  try {
    await docker.getContainer(ws.containerId).stop({ t: 10 });
  } catch (e) {
    if (e.statusCode !== 304) throw e; // 304 = already stopped, ignore
  }
  const updated = { ...ws, status: 'stopped' };
  workspaces.set(workspaceId, updated);
  return updated;
}

async function startWorkspace(workspaceId, userId) {
  const ws = workspaces.get(workspaceId);
  if (!ws) throw new Error('Workspace not found');
  if (ws.userId !== userId) throw new Error('Unauthorized');
  await docker.getContainer(ws.containerId).start();
  const updated = { ...ws, status: 'running' };
  workspaces.set(workspaceId, updated);
  return updated;
}

async function deleteWorkspace(workspaceId, userId) {
  const ws = workspaces.get(workspaceId);
  if (!ws) throw new Error('Workspace not found');
  if (ws.userId !== userId) throw new Error('Unauthorized');
  try {
    const c = docker.getContainer(ws.containerId);
    try { await c.stop({ t: 5 }); } catch {}
    await c.remove({ force: true, v: false });
  } catch (e) {
    if (e.statusCode !== 404) throw e;
  }
  workspaces.delete(workspaceId);
}

async function getWorkspaceLogs(workspaceId, userId) {
  const ws = workspaces.get(workspaceId);
  if (!ws || ws.userId !== userId) throw new Error('Not found');
  const buf = await docker.getContainer(ws.containerId).logs({
    stdout: true, stderr: true, tail: 100, timestamps: true,
  });
  return buf.toString('utf8');
}

async function getContainerStats(workspaceId, userId) {
  const ws = workspaces.get(workspaceId);
  if (!ws || ws.userId !== userId) throw new Error('Not found');
  const stats = await docker.getContainer(ws.containerId).stats({ stream: false });
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const sysDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  return {
    cpu: sysDelta > 0 ? +((cpuDelta / sysDelta) * 100).toFixed(1) : 0,
    memUsageMB: Math.round(stats.memory_stats.usage / 1048576),
    memLimitMB: Math.round(stats.memory_stats.limit / 1048576),
  };
}

async function getHostMetrics() {
  try {
    const containers = await docker.listContainers({ all: true });
    const running = containers.filter(c => c.State === 'running').length;
    return {
      runningContainers: running,
      totalContainers: containers.length,
      freeTier: {
        ec2HoursUsed: Math.floor(Date.now() / 3600000) % 750,
        ec2HoursTotal: 750,
        storageUsedGB: 4.1,
        storageTotalGB: 30,
        dataTransferGB: 8.2,
        dataTransferTotalGB: 100,
      },
    };
  } catch {
    return { runningContainers: 0, totalContainers: 0, freeTier: null };
  }
}

module.exports = {
  docker,
  getTemplates,
  listWorkspaces,
  createWorkspace,
  stopWorkspace,
  startWorkspace,
  deleteWorkspace,
  getWorkspaceLogs,
  getContainerStats,
  getHostMetrics,
};
