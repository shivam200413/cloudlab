const httpProxy = require('http-proxy');
const { workspaces } = require('./workspaceStore');

const proxy = httpProxy.createProxyServer({ ws: true, changeOrigin: true });

proxy.on('error', (err, req, res) => {
  console.error('[Proxy]', err.message);
  if (res?.writeHead) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Workspace unreachable', detail: err.message }));
  }
});

function workspaceProxyMiddleware(req, res, next) {
  const m = req.path.match(/^\/([^/]+)(\/.*)?$/);
  if (!m) return next();
  const ws = workspaces.get(m[1]);
  if (!ws || ws.status !== 'running') {
    return res.status(503).json({ error: 'Workspace not running' });
  }
  req.url = m[2] || '/';
  proxy.web(req, res, { target: `http://localhost:${ws.hostPort}` });
}

function workspaceProxyUpgrade(req, socket, head) {
  const m = req.url.match(/^\/proxy\/([^/]+)(\/.*)?$/);
  if (!m) return;
  const ws = workspaces.get(m[1]);
  if (!ws) return socket.destroy();
  req.url = m[2] || '/';
  proxy.ws(req, socket, head, { target: `http://localhost:${ws.hostPort}` });
}

module.exports = { workspaceProxyMiddleware, workspaceProxyUpgrade };
