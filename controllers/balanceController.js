const Balance = require('../models/Balance');

exports.getBalance = async (req, res) => {
    try {
      const balance = await Balance.findOne();
      if (!balance) return res.status(404).json({ message: "Balance not found" });
      res.status(200).json({ balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

exports.updateBalance = async (req, res) => {
  try {
    const { bank, cash } = req.body;
    let balance = await Balance.findOne();
    if (!balance) {
      balance = new Balance({ bank, cash });
    } else {
      balance.bank = bank || balance.bank;
      balance.cash = cash || balance.cash;
    }
    await balance.save();
    res.status(200).json({ message: "Balance updated successfully", balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.initializeBalance = async (req, res) => {
    try {
      const existingBalance = await Balance.findOne();
      if (existingBalance) {
        return res.status(400).json({ message: 'Balance already exists' });
      }
  
      const balance = new Balance({ bank: 0, cash: 0 });
      await balance.save();
      res.status(201).json({ message: 'Balance initialized successfully', balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
