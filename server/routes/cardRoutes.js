// server/routes/cardRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { createCard, moveCard, updateCard } = require('../controllers/cardController');

router.post('/:listId/cards', protect, createCard);
router.patch('/:cardId/move', protect, moveCard);
router.patch('/:cardId', protect, updateCard);

module.exports = router;
