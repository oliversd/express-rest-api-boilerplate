const roleFilter = acceptedRoles => (req, res, next) => {
  const roles = [];
  if (!Array.isArray(acceptedRoles)) {
    roles.push(...acceptedRoles.split(' '));
  } else {
    roles.push(...acceptedRoles.join(' ').split(' '));
  }
  if (req.user && req.user.role && roles.length) {
    if (roles.includes(req.user.role)) {
      next();
    } else if (roles.includes('all')) {
      next();
    } else {
      res.status(403).json({ status: 'error', message: 'Forbidden access to user' });
    }
  } else {
    next();
  }
};

export default roleFilter;
