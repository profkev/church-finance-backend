const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  bank: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

const Balance = mongoose.model('Balance', balanceSchema);
module.exports = Balance;
