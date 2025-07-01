const express = require('express');
const router = express.Router();
const { getTenantById } = require('../controllers/tenantController');
const authenticate = require('../middlewares/auth');

// @route   GET api/tenants/:id
// @desc    Get tenant by ID
// @access  Private
router.get('/:id', authenticate, getTenantById);

module.exports = router; 