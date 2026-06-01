require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./middleware/errorHandler');
const { setupWebSocket } = require('./websocket');
const { workspaceProxyMiddleware, workspaceProxyUpgrade } = require('./proxy');

const app = express();
const server = http.createServer(app);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/metrics',    require('./routes/metrics'));

// Workspace reverse proxy (code-server)
app.use('/proxy', workspaceProxyMiddleware);

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use(errorHandler);

setupWebSocket(server);
server.on('upgrade', workspaceProxyUpgrade);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`[server] CloudLab API on :${PORT}`));
