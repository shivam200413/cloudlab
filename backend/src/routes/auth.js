const router = require('express').Router();
const { register, login, authMiddleware } = require('../services/auth');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'email, password, name required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be ≥8 chars' });
    res.status(201).json(await register(email, password, name));
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    res.json(await login(email, password));
  } catch (e) { next(e); }
});

router.get('/me', authMiddleware, (req, res) => res.json({ user: req.user }));

module.exports = router;
