const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
  try {
    const { votehead, amount, description, year } = req.body;
    const income = new Income({ votehead, amount, description, year });
    await income.save();
    res.status(201).json({ message: 'Income added successfully', income });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json({ incomes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncome = await Income.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedIncome) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json({ message: 'Income updated successfully', updatedIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) return res.status(404).json({ message: 'Income not found' });
    res.status(200).json({ message: 'Income deleted successfully', deletedIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
