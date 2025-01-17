const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    votehead: { type: mongoose.Schema.Types.ObjectId, ref: 'Votehead', required: true }, // Reference to Votehead
    amount: { type: Number, required: true },
    description: { type: String },
    user: { type: String, required: true }, // Add user field

    date: { type: Date, default: Date.now },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
