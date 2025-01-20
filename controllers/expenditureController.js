const Expenditure = require('../models/Expenditure');

exports.addExpenditure = async (req, res) => {
  try {
    console.log('User Object in addExpenditure:', req.user); // Debugging log for req.user

    if (!req.user) {
      throw new Error('User not authenticated'); // Explicit error if req.user is undefined
    }

    const { category, amount, description, year } = req.body;
    const user = req.user.name; // Retrieve user name from req.user

    // Create a new Expenditure record
    const expenditure = new Expenditure({ category, amount, description, year, user });
    await expenditure.save();

    res.status(201).json({ message: 'Expenditure added successfully', expenditure });
  } catch (error) {
    console.error('Error in addExpenditure:', error.message); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find().populate('category', 'name'); // Populate category with its name
    res.status(200).json({ expenditures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpenditure = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }

    const updatedExpenditure = await Expenditure.findByIdAndUpdate(
      id,
      { ...req.body, user: req.user.name }, // Update the user field
      { new: true }
    );

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
