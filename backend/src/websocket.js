const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { docker } = require('./services/docker');

const SECRET = process.env.JWT_SECRET || 'change-in-production';

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url, 'http://x').searchParams.get('token');
    try { jwt.verify(token, SECRET); } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized' }));
      return ws.close();
    }
    ws.send(JSON.stringify({ type: 'connected' }));

    ws.on('message', async raw => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'subscribe_logs' && msg.containerId) {
          const stream = await docker.getContainer(msg.containerId).logs({ follow: true, stdout: true, stderr: true, tail: 50, timestamps: true });
          stream.on('data', chunk => {
            if (ws.readyState === WebSocket.OPEN)
              ws.send(JSON.stringify({ type: 'log', line: chunk.slice(8).toString() }));
          });
          ws.on('close', () => stream.destroy());
        }
      } catch (e) {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'error', message: e.message }));
      }
    });
  });
  console.log('[ws] WebSocket ready at /ws');
}

module.exports = { setupWebSocket };
