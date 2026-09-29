const jwt = require('jsonwebtoken');

/**
 * authenticate - Required auth middleware.
 * Extracts Bearer token, verifies it, and attaches decoded user to req.user.
 * Returns 401 if token is missing or invalid.
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired' });
    }
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

/**
 * optionalAuth - Optional auth middleware.
 * Attaches decoded user to req.user if a valid token is present.
 * Does NOT return an error if the token is missing or invalid — simply calls next().
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      req.user = decoded;
    }
  } catch (err) {
    // Silently ignore invalid/expired tokens for optional auth
  }
  next();
}

/**
 * requireAdmin - Middleware that checks req.user.role === 'admin'.
 * Must be used after authenticate.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, optionalAuth, requireAdmin };
