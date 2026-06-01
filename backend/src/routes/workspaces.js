const router = require('express').Router();
const { authMiddleware } = require('../services/auth');
const d = require('../services/docker');

router.use(authMiddleware);

router.get('/',            async (req, res, next) => { try { res.json({ workspaces: await d.listWorkspaces(req.user.id) }); } catch(e){next(e);} });
router.get('/templates',   async (req, res, next) => { try { res.json({ templates: await d.getTemplates() }); } catch(e){next(e);} });
router.post('/',           async (req, res, next) => { try { res.status(201).json({ workspace: await d.createWorkspace(req.user.id, req.body) }); } catch(e){next(e);} });
router.post('/:id/stop',   async (req, res, next) => { try { res.json({ workspace: await d.stopWorkspace(req.params.id, req.user.id) }); } catch(e){next(e);} });
router.post('/:id/start',  async (req, res, next) => { try { res.json({ workspace: await d.startWorkspace(req.params.id, req.user.id) }); } catch(e){next(e);} });
router.delete('/:id',      async (req, res, next) => { try { await d.deleteWorkspace(req.params.id, req.user.id); res.json({ deleted: true }); } catch(e){next(e);} });
router.get('/:id/logs',    async (req, res, next) => { try { res.json({ logs: await d.getWorkspaceLogs(req.params.id, req.user.id) }); } catch(e){next(e);} });
router.get('/:id/stats',   async (req, res, next) => { try { res.json(await d.getContainerStats(req.params.id, req.user.id)); } catch(e){next(e);} });

module.exports = router;
