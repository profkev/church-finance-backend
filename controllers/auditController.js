const Audit = require('../models/Audit');

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find().sort({ createdAt: -1 });
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
