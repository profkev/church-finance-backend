const express = require('express');
const { addExpenditure, getExpenditures, updateExpenditure, deleteExpenditure } = require('../controllers/expenditureController');
const authenticate = require('../middlewares/auth'); // Authentication middleware
const roleMiddleware = require('../middlewares/role'); // Role-based middleware

const router = express.Router();

router.post('/', authenticate, roleMiddleware('Special User'), addExpenditure);
router.get('/', authenticate, getExpenditures);
router.put('/:id', authenticate, roleMiddleware('Special User'), updateExpenditure);
router.delete('/:id', authenticate, roleMiddleware('Special User'), deleteExpenditure);

module.exports = router;
