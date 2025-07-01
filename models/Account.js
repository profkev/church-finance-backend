const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  code: { type: String, required: true },
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
  updatedAt: { type: Date, default: Date.now },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
});

// Add compound unique index for tenantId + code
accountSchema.index({ tenantId: 1, code: 1 }, { unique: true });

const Account = mongoose.model('Account', accountSchema);
module.exports = Account; 