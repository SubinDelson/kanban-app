// server/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { createList } = require('../controllers/listController');

router.post('/:boardId/lists', protect, createList);

module.exports = router;
