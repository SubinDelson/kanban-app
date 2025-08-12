// server/routes/workspaceRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { createWorkspace, getWorkspaces, getWorkspaceById } = require('../controllers/workspaceController');

router.use(protect);
router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.get('/:id', getWorkspaceById);

module.exports = router;
