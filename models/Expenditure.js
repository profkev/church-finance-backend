const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true }
}, { timestamps: true });

const Expenditure = mongoose.model('Expenditure', expenditureSchema);
module.exports = Expenditure;
