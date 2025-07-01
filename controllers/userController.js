const User = require('../models/User');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password, tenantName } = req.body;
  try {
    // Create a new tenant
    const tenant = new Tenant({ name: tenantName });
    await tenant.save();

    // Create a new user as an Admin for the new tenant
    // The password will be hashed by the pre-save hook in the User model
    const user = new User({ 
      name, 
      email, 
      password, // Pass the plain password
      role: 'Admin', // Assign Admin role on registration
      tenantId: tenant._id 
    });
    await user.save();

    res.status(201).json({ message: 'Tenant and Admin user registered successfully', user, tenant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = {
        id: user._id,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Log token payload for debugging
      console.log('Generated Token Payload:', payload);
  
      // Respond with token and user details
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
      });
    } catch (error) {
      console.error('Error during login:', error.message); // Log the error for debugging
      res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
    }
  };

const getUserDetails = async (req, res) => {
    try {
        // req.user is populated by the authenticate middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Invite a new user to the tenant
// @route   POST /api/users/invite
// @access  Admin
const inviteUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const { tenantId } = req.user; // Get tenant from the inviting admin

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide name, email, password, and role' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email,
            password, // The pre-save hook will hash this
            role,
            tenantId,
        });

        await user.save();
        res.status(201).json({ message: 'User invited successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    List all users in the tenant
// @route   GET /api/users
// @access  Admin
const listUsers = async (req, res) => {
    try {
        const users = await User.find({ tenantId: req.user.tenantId }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user details (e.g., role)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
        return res.status(400).json({ message: 'Role is required' });
    }

    try {
        // Ensure the user being updated is in the same tenant as the admin
        const userToUpdate = await User.findOne({ _id: id, tenantId: req.user.tenantId });

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found in this tenant' });
        }

        // Prevent an admin from changing their own role
        if (userToUpdate._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Admins cannot change their own role.' });
        }
        
        userToUpdate.role = role;
        await userToUpdate.save();

        res.json({ message: 'User role updated successfully.', user: userToUpdate });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a user from the tenant
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent an admin from deleting themselves
        if (id === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own admin account.' });
        }

        // Find the user within the admin's tenant
        const userToDelete = await User.findOne({ _id: id, tenantId: req.user.tenantId });

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found in this tenant' });
        }

        await userToDelete.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    register,
    login,
    getUserDetails,
    inviteUser,
    listUsers,
    updateUser,
    deleteUser
};
  