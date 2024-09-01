/**
 * Middleware to authenticate admin users.
 * Checks if the user role in the session is 'admin'.
 * Responds with 403 if not, otherwise proceeds to the next middleware.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authenticateAdmin = (req, res, next) => {
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = authenticateAdmin;