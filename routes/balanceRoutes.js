const express = require('express');
const { getBalance, updateBalance, initializeBalance } = require('../controllers/balanceController');
const router = express.Router();

router.get('/', getBalance); // Correctly handling GET requests
router.put('/', updateBalance);
router.post('/initialize', initializeBalance); // Add this route for one-time initialization


module.exports = router;
