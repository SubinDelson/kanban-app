// server/controllers/boardController.js
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');
const List = require('../models/List');

exports.createBoard = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;
  try {
    const board = await Board.create({ title, workspace: workspaceId, lists: [] });
    await Workspace.findByIdAndUpdate(workspaceId, { $push: { boards: board._id } });
    // create default lists (To Do, Doing, Done)
    const todo = await List.create({ title: 'To Do', board: board._id });
    const doing = await List.create({ title: 'Doing', board: board._id });
    const done = await List.create({ title: 'Done', board: board._id });
    board.lists = [todo._id, doing._id, done._id];
    await board.save();
    res.status(201).json(await Board.findById(board._id).populate({ path: 'lists', populate: { path: 'cards' } }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate({ path: 'lists', populate: { path: 'cards' } });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
