const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  votehead: { type: String, required: true },
  votehead: { type: mongoose.Schema.Types.ObjectId, ref: 'Votehead' },

  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true }
}, { timestamps: true });

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
