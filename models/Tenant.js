const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant; 