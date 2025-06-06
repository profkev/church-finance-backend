const Votehead = require('../models/Votehead');
const Account = require('../models/Account');

exports.addVotehead = async (req, res) => {
  try {
    const { name, description, account } = req.body;
    
    // Verify the account exists and is an expense account
    const accountDoc = await Account.findById(account);
    if (!accountDoc) {
      return res.status(400).json({ message: 'Account not found' });
    }
    if (accountDoc.type !== 'expense') {
      return res.status(400).json({ message: 'Account must be an expense account' });
    }
    if (!accountDoc.isActive) {
      return res.status(400).json({ message: 'Account must be active' });
    }

    const votehead = new Votehead({ name, description, account });
    await votehead.save();
    res.status(201).json({ message: 'Votehead added successfully', votehead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVoteheads = async (req, res) => {
  try {
    const voteheads = await Votehead.find().populate('account', 'name code type');
    res.status(200).json({ voteheads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVotehead = async (req, res) => {
  try {
    const { id } = req.params;
    const votehead = await Votehead.findByIdAndDelete(id);
    if (!votehead) return res.status(404).json({ message: 'Votehead not found' });
    res.status(200).json({ message: 'Votehead deleted successfully', votehead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
