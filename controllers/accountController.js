const Account = require('../models/Account');

// List all accounts
exports.listAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ tenantId: req.user.tenantId });
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new account
exports.addAccount = async (req, res) => {
  try {
    const { code, name, type, description } = req.body;
    const account = new Account({ code, name, type, description, tenantId: req.user.tenantId });
    await account.save();
    res.status(201).json({ message: 'Account created', account });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const account = await Account.findOneAndUpdate({ _id: id, tenantId: req.user.tenantId }, { name, description, updatedAt: new Date() }, { new: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json({ message: 'Account updated', account });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Activate/deactivate an account
exports.toggleAccountActive = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ _id: id, tenantId: req.user.tenantId });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account.isActive = !account.isActive;
    account.updatedAt = new Date();
    await account.save();
    res.status(200).json({ message: `Account ${account.isActive ? 'activated' : 'deactivated'}`, account });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 