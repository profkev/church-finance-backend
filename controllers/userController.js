const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
