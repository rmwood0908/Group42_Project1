const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Get all snippets
app.get('/api/snippets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM snippets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single snippet
app.get('/api/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM snippets WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a snippet
app.post('/api/snippets', async (req, res) => {
  try {
    const { title, description, code, language, user_id } = req.body;
    const result = await pool.query(
      'INSERT INTO snippets (title, description, code, language, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, code, language, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a snippet
app.put('/api/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, code, language } = req.body;
    const result = await pool.query(
      'UPDATE snippets SET title = $1, description = $2, code = $3, language = $4 WHERE id = $5 RETURNING *',
      [title, description, code, language, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a snippet
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM snippets WHERE id = $1', [id]);
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, passwordHash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});