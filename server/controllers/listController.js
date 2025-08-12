// server/controllers/listController.js
const List = require('../models/List');
const Board = require('../models/Board');

exports.createList = async (req, res) => {
  const { title } = req.body;
  const { boardId } = req.params;
  try {
    const list = await List.create({ title, board: boardId });
    await Board.findByIdAndUpdate(boardId, { $push: { lists: list._id } });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
