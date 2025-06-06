const express = require('express');
const {
  getTrialBalance,
  getIncomeExpenditureStatement,
  getBalanceSheet,
  getCashFlowStatement,
  getGeneralLedger,
  getAccountStatement,
  getEquityStatement
} = require('../controllers/accountingController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Trial Balance
router.get('/trial-balance', roleMiddleware('Special User'), getTrialBalance);

// Income and Expenditure Statement
router.get('/income-expenditure', roleMiddleware('Special User'), getIncomeExpenditureStatement);

// Balance Sheet
router.get('/balance-sheet', roleMiddleware('Special User'), getBalanceSheet);

// Cash Flow Statement
router.get('/cash-flow', roleMiddleware('Special User'), getCashFlowStatement);

// General Ledger
router.get('/general-ledger', roleMiddleware('Special User'), getGeneralLedger);

// Account Statement
router.get('/account-statement/:accountId', roleMiddleware('Special User'), getAccountStatement);

// Equity Statement
router.get('/equity-statement', roleMiddleware('Special User'), getEquityStatement);

module.exports = router; 