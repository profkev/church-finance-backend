const Audit = require('../models/Audit');

const logAction = (action) => async (req, res, next) => {
  const user = req.user ? req.user.email : "Unknown";
  const audit = new Audit({ user, action });
  await audit.save();
  next();
};

module.exports = logAction;
