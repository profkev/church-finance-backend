const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

router.get('/', authenticate, roleMiddleware('Special User'), getAuditLogs);

module.exports = router;
