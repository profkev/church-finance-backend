const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');

// List all journal entries
exports.listJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ tenantId: req.user.tenantId }).populate('entries.account').sort({ date: -1 });
    res.status(200).json({ entries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single journal entry
exports.getJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await JournalEntry.findOne({ _id: id, tenantId: req.user.tenantId }).populate('entries.account');
    if (!entry) return res.status(404).json({ message: 'Journal entry not found' });
    res.status(200).json({ entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new journal entry
exports.addJournalEntry = async (req, res) => {
  try {
    const { date, reference, description, entries, status } = req.body;
    const createdBy = req.user.name;
    let totalDebit = 0, totalCredit = 0;
    entries.forEach(line => {
      totalDebit += line.debit;
      totalCredit += line.credit;
    });
    if (totalDebit !== totalCredit) {
      return res.status(400).json({ message: 'Total debit must equal total credit' });
    }
    const journalEntry = new JournalEntry({
      date,
      reference,
      description,
      entries,
      totalDebit,
      totalCredit,
      status: status || 'draft',
      createdBy,
      tenantId: req.user.tenantId
    });
    await journalEntry.save();
    res.status(201).json({ message: 'Journal entry created', journalEntry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 