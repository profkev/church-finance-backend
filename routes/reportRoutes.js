const express = require('express');
const {
  getAggregatedReports,
  getReports,
  downloadReport,
  downloadAggregatedReport
} = require('../controllers/reportController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

// Route to fetch all reports (income/expenditure)
router.get('/', authenticate, getReports);

// Route to fetch aggregated reports (grouped by votehead or category)
router.get('/aggregated', authenticate, getAggregatedReports);

// Get reports with date range filtering
router.get('/reports', getReports);

// Get aggregated reports with date range filtering
router.get('/aggregated-reports', getAggregatedReports);

// Download reports in PDF or Excel format
router.get('/download-report', downloadReport);

// Download aggregated reports in PDF or Excel format
router.get('/download-aggregated-report', downloadAggregatedReport);

module.exports = router;
