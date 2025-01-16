const express = require('express');
const { addVotehead, getVoteheads, deleteVotehead } = require('../controllers/voteheadController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

router.post('/', authenticate, roleMiddleware('Special User'), addVotehead);
router.get('/', authenticate, getVoteheads);
router.delete('/:id', authenticate, roleMiddleware('Special User'), deleteVotehead);

module.exports = router;
