const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  votehead: { type: mongoose.Schema.Types.ObjectId, ref: 'Votehead', required: true }, // Reference to Votehead
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  year: { type: Number, default: new Date().getFullYear() },
  createdAt: { type: Date, default: Date.now },
  user: { type: String, required: true }, // Store user name from `req.user`
  assetAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Asset account (Cash/Bank)
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
