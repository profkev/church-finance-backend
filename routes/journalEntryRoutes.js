const express = require('express');
const { listJournalEntries, getJournalEntry, addJournalEntry } = require('../controllers/journalEntryController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

router.use(authenticate, roleMiddleware('Special User'));

router.get('/', listJournalEntries);
router.get('/:id', getJournalEntry);
router.post('/', addJournalEntry);

module.exports = router; 