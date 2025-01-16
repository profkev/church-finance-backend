const Expenditure = require('../models/Expenditure');

exports.addExpenditure = async (req, res) => {
  try {
    const { category, amount, description, year } = req.body;
    const expenditure = new Expenditure({ category, amount, description, year });
    await expenditure.save();
    res.status(201).json({ message: 'Expenditure added successfully', expenditure });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find();
    res.status(200).json({ expenditures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpenditure = await Expenditure.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExpenditure) return res.status(404).json({ message: 'Expenditure not found' });
    res.status(200).json({ message: 'Expenditure updated successfully', updatedExpenditure });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpenditure = await Expenditure.findByIdAndDelete(id);
    if (!deletedExpenditure) return res.status(404).json({ message: 'Expenditure not found' });
    res.status(200).json({ message: 'Expenditure deleted successfully', deletedExpenditure });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
