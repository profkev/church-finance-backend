const express = require('express');
const { addExpenditure, getExpenditures, updateExpenditure, deleteExpenditure } = require('../controllers/expenditureController');
const router = express.Router();

router.post('/', addExpenditure);
router.get('/', getExpenditures);
router.put('/:id', updateExpenditure);
router.delete('/:id', deleteExpenditure);

module.exports = router;
