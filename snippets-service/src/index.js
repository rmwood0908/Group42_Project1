require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'snippets-db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'snippets_db',
});

// Initialize DB table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS snippets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      username VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      code TEXT NOT NULL,
      language VARCHAR(50),
      is_public BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Snippets DB initialized');
}

// Middleware: expect userId and username passed from gateway as headers
function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'];
  const username = req.headers['x-username'];
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = parseInt(userId);
  req.username = username;
  next();
}

// GET /snippets — get all snippets for this user
app.get('/snippets', requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM snippets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /snippets/search?q=...
app.get('/snippets/search', requireUser, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const result = await pool.query(
      `SELECT * FROM snippets
       WHERE user_id = $1
         AND (title ILIKE $2 OR language ILIKE $2 OR description ILIKE $2)
       ORDER BY created_at DESC`,
      [req.userId, `%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /snippets/:id
app.get('/snippets/:id', requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM snippets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Snippet not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /snippets
app.post('/snippets', requireUser, async (req, res) => {
  const { title, description, code, language, is_public } = req.body;
  if (!title || !code) return res.status(400).json({ error: 'Title and code required' });
  try {
    const result = await pool.query(
      `INSERT INTO snippets (user_id, username, title, description, code, language, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, req.username, title, description, code, language, is_public || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /snippets/:id
app.put('/snippets/:id', requireUser, async (req, res) => {
  const { title, description, code, language, is_public } = req.body;
  try {
    // Ownership check
    const existing = await pool.query(
      'SELECT * FROM snippets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!existing.rows[0]) return res.status(404).json({ error: 'Snippet not found' });

    const result = await pool.query(
      `UPDATE snippets SET title=$1, description=$2, code=$3, language=$4, is_public=$5
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [
        title ?? existing.rows[0].title,
        description ?? existing.rows[0].description,
        code ?? existing.rows[0].code,
        language ?? existing.rows[0].language,
        is_public ?? existing.rows[0].is_public,
        req.params.id,
        req.userId,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /snippets/:id
app.delete('/snippets/:id', requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM snippets WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Snippet not found' });
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'snippets-service' }));

const PORT = process.env.PORT || 3002;
initDB()
  .then(() => app.listen(PORT, () => console.log(`Snippets service running on port ${PORT}`)))
  .catch(err => { console.error('Failed to init DB:', err); process.exit(1); });
