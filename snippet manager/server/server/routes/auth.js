const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// API Layer — HTTP handling only, delegates all logic to AuthService

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.register(username, email, password);
    res.json(result);
  } catch (err) {
    if (err.message === 'Username, email, and password are required') {
      return res.status(400).json({ error: err.message });
    }
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
