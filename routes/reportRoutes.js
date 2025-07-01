const express = require('express');
const {
  getAggregatedReports,
  getReports,
  downloadReport,
  downloadAggregatedReport
} = require('../controllers/reportController');
const authenticate = require('../middlewares/auth');
const Tenant = require('../models/Tenant');

const router = express.Router();

// Apply authentication middleware to all report routes
router.use(authenticate);

// Route to fetch all reports (income/expenditure)
router.get('/reports', getReports);

// Route to fetch aggregated reports (grouped by votehead or category)
router.get('/aggregated-reports', getAggregatedReports);

// Download reports in PDF or Excel format
router.get('/download-report', downloadReport);

// Download aggregated reports in PDF or Excel format
router.get('/download-aggregated-report', downloadAggregatedReport);

router.get('/tenants/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenant details' });
  }
});

module.exports = router;
