const mongoose = require('mongoose');

const voteheadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  account: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account',
    required: true,
    validate: {
      validator: async function(accountId) {
        const Account = mongoose.model('Account');
        const account = await Account.findById(accountId);
        return account && account.type === 'expense' && account.isActive;
      },
      message: 'Account must be an active expense account'
    }
  }
}, { timestamps: true });

const Votehead = mongoose.model('Votehead', voteheadSchema);
module.exports = Votehead;
