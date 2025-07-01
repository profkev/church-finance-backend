const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user && req.user.role;

  // Admins and Special Users have unrestricted access.
  if (userRole && (userRole === 'Admin' || userRole === 'Special User')) {
    return next();
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: insufficient permissions' });
};

module.exports = roleMiddleware;
  