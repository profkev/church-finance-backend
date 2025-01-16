const Audit = require('../models/Audit');

const logAction = (action, details) => async (req, res, next) => {
  const user = req.user?.email || 'Anonymous';
  try {
    await new Audit({ user, action, details }).save();
    next();
  } catch (error) {
    console.error('Audit logging error:', error.message);
    next();
  }
};

module.exports = logAction;
