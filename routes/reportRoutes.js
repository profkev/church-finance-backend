const express = require('express');
const {
  getAggregatedReports,
  downloadOriginalData,
  downloadOriginalPDF,
  downloadCombinedData, // Add handler for combined Excel data
  downloadCombinedPDF,  // Add handler for combined PDF data
  getReports,
} = require('../controllers/reportController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Report Routes

// Route to fetch all reports (income/expenditure)
router.get('/', authenticate, getReports);

// Route to fetch aggregated reports (grouped by votehead or category)
router.get('/aggregated', authenticate, getAggregatedReports);

// Route to download original data (Excel format)
router.get('/download/original', authenticate, downloadOriginalData);

// Route to download original data (PDF format)
router.get('/download/original/pdf', authenticate, downloadOriginalPDF);

// Route to download combined data (Excel format)
router.get('/download/combined', authenticate, downloadCombinedData);

// Route to download combined data (PDF format)
router.get('/download/combined/pdf', authenticate, downloadCombinedPDF);

module.exports = router;
