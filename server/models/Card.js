// server/models/Card.js
const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  position: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
