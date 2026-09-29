const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Generate a short-lived access token (15m) and a long-lived refresh token (7d).
 */
function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m', algorithms: ['HS256'] });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d', algorithms: ['HS256'] });
  return { accessToken, refreshToken };
}

function setTokenCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Password must be 8-128 characters' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const normalizedEmail = email.toLowerCase().trim();

    db.prepare(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, 'user')
    `).run(userId, name.trim(), normalizedEmail, hashedPassword);

    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(userId);

    const payload = { id: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    setTokenCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    setTokenCookies(res, accessToken, refreshToken);

    return res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 */
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Refresh token expired, please log in again' });
      }
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Verify user still exists
    const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m', algorithms: ['HS256'] });
    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d', algorithms: ['HS256'] });
    setTokenCookies(res, newAccessToken, newRefreshToken);

    return res.json({ message: 'Token refreshed' });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user's profile.
 */
router.get('/me', authenticate, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

/**
 * POST /api/auth/logout
 * Clears auth cookies.
 */
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
