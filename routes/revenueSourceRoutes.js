const express = require('express');
const { addRevenueSource, getRevenueSources, deleteRevenueSource } = require('../controllers/revenueSourceController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

router.post('/', authenticate, roleMiddleware('Special User'), addRevenueSource);
router.get('/', authenticate, getRevenueSources);
router.delete('/:id', authenticate, roleMiddleware('Special User'), deleteRevenueSource);

module.exports = router; 