require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'auth-db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'auth_db',
});

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Initialize DB table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Auth DB initialized');
}

// POST /auth/register
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password_hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username or email already exists' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/verify — used by API gateway to validate tokens
app.post('/auth/verify', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, userId: decoded.userId, username: decoded.username });
  } catch {
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
});

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'auth-service' }));

const PORT = process.env.PORT || 3001;
initDB()
  .then(() => app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`)))
  .catch(err => { console.error('Failed to init DB:', err); process.exit(1); });
