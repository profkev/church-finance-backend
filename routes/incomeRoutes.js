const express = require('express');
const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const authenticate = require('../middlewares/auth'); // Import authenticate middleware
const logAction = require('../middlewares/auditLogger'); // Import auditLogger middleware

const router = express.Router();

// Route Definitions with Middleware
router.post(
  '/', 
  authenticate, 
  logAction('Add Income', 'Added a new income record'), 
  addIncome
);

router.get(
  '/', 
  authenticate, 
  getIncomes
);

router.put(
  '/:id', 
  authenticate, 
  logAction('Update Income', 'Updated income record'), 
  updateIncome
);

router.delete(
  '/:id', 
  authenticate, 
  logAction('Delete Income', 'Deleted income record'), 
  deleteIncome
);

module.exports = router;
