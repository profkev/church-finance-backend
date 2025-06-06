const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['asset', 'liability', 'equity', 'revenue', 'expense']
  },
  description: String,
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account; 