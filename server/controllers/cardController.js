// server/controllers/cardController.js
const Card = require('../models/Card');
const List = require('../models/List');

exports.createCard = async (req, res) => {
  const { title, description, deadline, assignedTo } = req.body;
  const { listId } = req.params;
  try {
    const card = await Card.create({ title, description, deadline, list: listId, assignedTo });
    await List.findByIdAndUpdate(listId, { $push: { cards: card._id } });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.moveCard = async (req, res) => {
  // body: { fromListId, toListId, newIndex }
  const { fromListId, toListId, newIndex } = req.body;
  const cardId = req.params.cardId;
  try {
    // remove from old list
    await List.findByIdAndUpdate(fromListId, { $pull: { cards: cardId } });
    // insert to new list at end (we'll push — client uses ordering)
    await List.findByIdAndUpdate(toListId, { $push: { cards: cardId } });
    // update card.list
    await Card.findByIdAndUpdate(cardId, { list: toListId });
    res.json({ message: 'moved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const updated = await Card.findByIdAndUpdate(req.params.cardId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
