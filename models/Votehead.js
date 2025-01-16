const mongoose = require('mongoose');

const voteheadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Votehead = mongoose.model('Votehead', voteheadSchema);
module.exports = Votehead;
