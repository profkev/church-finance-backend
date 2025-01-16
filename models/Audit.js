const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Audit = mongoose.model('Audit', auditSchema);
module.exports = Audit;
