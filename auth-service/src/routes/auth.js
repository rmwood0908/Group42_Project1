const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.register(username, email, password);
    res.json(result);
  } catch (err) {
    if (err.message === 'EMAIL_TAKEN') return res.status(409).json({ error: 'Email already in use' });
    if (err.message === 'Username, email, and password are required')
      return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS')
      return res.status(401).json({ error: 'Invalid email or password' });
    if (err.message === 'Email and password are required')
      return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /verify  — called internally by the API Gateway to validate tokens
router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });
  try {
    const payload = AuthService.verifyToken(token);
    res.json({ valid: true, payload });
  } catch {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

module.exports = router;
