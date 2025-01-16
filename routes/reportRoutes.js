const express = require('express');
const { getSummary } = require('../controllers/reportController');
const router = express.Router();
const { exportReportToPDF } = require('../controllers/reportController');


router.get('/summary', getSummary);
router.get('/export', exportReportToPDF);

module.exports = router;
