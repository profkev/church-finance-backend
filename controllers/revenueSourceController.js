const RevenueSource = require('../models/RevenueSource');
const Account = require('../models/Account');

// Add a new revenue source
exports.addRevenueSource = async (req, res) => {
  try {
    const { name, description, account } = req.body;
    // Verify the account exists and is a revenue account
    const accountDoc = await Account.findOne({ _id: account, tenantId: req.user.tenantId });
    if (!accountDoc) {
      return res.status(400).json({ message: 'Account not found for your tenant.' });
    }
    if (accountDoc.type !== 'revenue') {
      return res.status(400).json({ message: 'Account must be a revenue account' });
    }
    if (!accountDoc.isActive) {
      return res.status(400).json({ message: 'Account must be active' });
    }
    const revenueSource = new RevenueSource({ name, description, account, tenantId: req.user.tenantId });
    await revenueSource.save();
    res.status(201).json({ message: 'Revenue source added successfully', revenueSource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all revenue sources
exports.getRevenueSources = async (req, res) => {
  try {
    const revenueSources = await RevenueSource.find({ tenantId: req.user.tenantId }).populate('account', 'name code type');
    res.status(200).json({ revenueSources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a revenue source
exports.deleteRevenueSource = async (req, res) => {
  try {
    const { id } = req.params;
    const revenueSource = await RevenueSource.findOneAndDelete({ _id: id, tenantId: req.user.tenantId });
    if (!revenueSource) return res.status(404).json({ message: 'Revenue source not found' });
    res.status(200).json({ message: 'Revenue source deleted successfully', revenueSource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 