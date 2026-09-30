const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db');
const { generateTokens, setTokenCookies } = require('./auth');

const router = express.Router();

const CLIENT_ID = '933186359413-7djigk7lcuk7uqscdkc6r1e2hghikldc.apps.googleusercontent.com';

const googleClient = new OAuth2Client(
  CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET || '',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback'
);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      const userId = uuidv4();
      db.prepare(`
        INSERT INTO users (id, name, email, password, role)
        VALUES (?, ?, ?, '', 'user')
      `).run(userId, name || email.split('@')[0], email);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    }

    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = generateTokens(jwtPayload);
    setTokenCookies(res, accessToken, refreshToken);

    return res.json({
      message: 'Google authentication successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ error: 'Google authentication failed: ' + (err.message || String(err)) });
  }
});

module.exports = router;
