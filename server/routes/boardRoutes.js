// server/routes/boardRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const protect = require('../middlewares/auth');
const { createBoard, getBoard } = require('../controllers/boardController');

router.use(protect);

router.post('/:workspaceId/boards', createBoard); // create board in workspace
router.get('/board/:boardId', getBoard); // get board by id

module.exports = router;
