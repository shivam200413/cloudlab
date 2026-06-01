const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'change-in-production';
const EXPIRES = process.env.JWT_EXPIRES || '7d';

// Simple in-memory user store — swap with a DB for production
const users = new Map();

(async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@cloudlab.local';
  const pass  = process.env.ADMIN_PASSWORD || 'cloudlab123';
  const hash  = await bcrypt.hash(pass, 10);
  users.set(email, { id: 'admin-001', email, name: 'Admin', passwordHash: hash, plan: 'free', createdAt: new Date().toISOString() });
  console.log(`[auth] Default user: ${email}`);
})();

const sign = user => jwt.sign({ id: user.id, email: user.email, name: user.name, plan: user.plan }, SECRET, { expiresIn: EXPIRES });

async function register(email, password, name) {
  if (users.has(email)) throw Object.assign(new Error('Email already registered'), { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: `user-${Date.now()}`, email, name, passwordHash: hash, plan: 'free', createdAt: new Date().toISOString() };
  users.set(email, user);
  const token = sign(user);
  return { token, user: { id: user.id, email, name, plan: user.plan } };
}

async function login(email, password) {
  const user = users.get(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  return { token: sign(user), user: { id: user.id, email, name: user.name, plan: user.plan } };
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(h.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { register, login, authMiddleware };
