const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  year: { type: Number, default: new Date().getFullYear() },
  createdAt: { type: Date, default: Date.now },
  user: { type: String, required: true }, // Store user name from `req.user`
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
