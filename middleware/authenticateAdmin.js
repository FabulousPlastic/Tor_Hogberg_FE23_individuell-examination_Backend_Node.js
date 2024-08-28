const authenticateAdmin = (req, res, next) => {
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = authenticateAdmin;