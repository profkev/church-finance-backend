const Category = require('../models/Category'); // Assuming a Mongoose model for Category exists

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    console.error('Error adding category:', error.message);
    res.status(500).json({ message: 'An error occurred while adding the category.' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories.length) {
      return res.status(404).json({ message: 'No categories found.' });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching categories.' });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Category ID is required.' });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category deleted successfully', category });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'An error occurred while deleting the category.' });
  }
};
