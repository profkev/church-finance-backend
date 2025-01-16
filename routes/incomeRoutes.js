const express = require('express');
const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const router = express.Router();
const authenticate = require('../middlewares/auth'); // Import authenticate middleware

const logAction = require('../middlewares/auditLogger');


router.post('/', addIncome);
router.get('/', getIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);
router.post('/', authenticate, logAction('Add Income', 'Added a new income record'), addIncome);
router.put('/:id', authenticate, logAction('Update Income', 'Updated income record'), updateIncome);
router.delete('/:id', authenticate, logAction('Delete Income', 'Deleted income record'), deleteIncome);
router.get('/', authenticate, getIncomes);


module.exports = router;
