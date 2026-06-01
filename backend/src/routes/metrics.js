const router = require('express').Router();
const { authMiddleware } = require('../services/auth');
const { getHostMetrics } = require('../services/docker');

router.use(authMiddleware);
router.get('/host', async (req, res, next) => {
  try { res.json(await getHostMetrics()); } catch(e) { next(e); }
});
module.exports = router;
