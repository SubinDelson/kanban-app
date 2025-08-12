// server/models/Board.js
const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
}, { timestamps: true });

module.exports = mongoose.model('Board', BoardSchema);
