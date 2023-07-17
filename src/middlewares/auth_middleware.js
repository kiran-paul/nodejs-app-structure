const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Consider keeping the tokens as revoked for 15 mins after /logout api called
const revokedTokens = new Map();

function revokeToken(token, expirationTime) {
  revokedTokens.set(token, expirationTime);
};

function isTokenRevoked(token) {
  const expirationTime = revokedTokens.get(token);
  if (!expirationTime) {
    return false;
  }
  if (Date.now() > expirationTime) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
};

const authMiddleware = {};

authMiddleware.authenticateToken = (req, res, next) => {
  if (req.path === '/api/user/login' || req.path === '/api/database/insert' || req.path === '/api/database/update' || req.path === '/api/database/delete' || req.path === '/api/database/raw-query' || req.path === '/') {
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Unauthorized access' });
  }
  // Check if the token has been revoked
  if (isTokenRevoked(token)) {
    return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Unauthorized access' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Unauthorized access' });
    }
    req.user = user;
    next();
  });
};

authMiddleware.refreshToken = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Unauthorized access' });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Unauthorized access' });
    }
    const accessToken = jwt.sign({ user: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ accessToken });
  });
};

authMiddleware.getCurrentUser = (req, res) => {
  const { user } = req.user;
  res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ user });
};

authMiddleware.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];

      // Add the token to the revokedtoken = {token : expirationTime}
      const expirationTime = Date.now() + (15 * 60 * 1000); // 15 minutes in milliseconds
      revokeToken(token, expirationTime);
    }
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
