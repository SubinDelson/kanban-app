// server/controllers/workspaceController.js
const Workspace = require('../models/Workspace');
const User = require('../models/User');

exports.createWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const ws = await Workspace.create({ name, owner: req.user._id, members: [req.user._id] });
    // add to user's workspaces
    await User.findByIdAndUpdate(req.user._id, { $push: { workspaces: ws._id } });
    res.status(201).json(ws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id }).populate('owner', 'name email');
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkspaceById = async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id).populate({
      path: 'boards',
      populate: { path: 'lists', populate: { path: 'cards' } }
    });
    if (!ws) return res.status(404).json({ message: 'Workspace not found' });
    res.json(ws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
