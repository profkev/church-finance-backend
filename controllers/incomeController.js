const Income = require('../models/Income');
exports.addIncome = async (req, res) => {
    try {
      console.log('User Object in addIncome:', req.user); // Debugging log for req.user
      if (!req.user) {
        throw new Error('User not authenticated'); // Explicit error if req.user is undefined
      }
  
      const { votehead, amount, description, year } = req.body;
      const user = req.user.name; // Retrieve user name from req.user
      const income = new Income({ votehead, amount, description, year, user });
      await income.save();
      res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
      console.error('Error in addIncome:', error.message); // Debugging log
      res.status(500).json({ message: error.message });
    }
  };
  

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate('votehead', 'name'); // Populate votehead with its name
    res.status(200).json({ incomes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is defined
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { ...req.body, user: req.user.name }, // Update the user field
      { new: true }
    );

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
