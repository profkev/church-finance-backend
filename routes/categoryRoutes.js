const express = require('express');
const { addCategory, getCategories, deleteCategory } = require('../controllers/categoryController');
const authenticate = require('../middlewares/auth'); // Auth middleware for authentication
const roleMiddleware = require('../middlewares/role'); // Middleware for role-based access control

const router = express.Router();

// Add Category (Protected, "Special User" role required)
router.post('/', authenticate, roleMiddleware('Special User'), addCategory);

// Get all Categories (Protected)
router.get('/', authenticate, getCategories);

// Delete a Category by ID (Protected, "Special User" role required)
router.delete('/:id', authenticate, roleMiddleware('Special User'), deleteCategory);

module.exports = router;
