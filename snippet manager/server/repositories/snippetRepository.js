const pool = require('../db');

// Data Access Layer — raw SQL only, no business logic

const SnippetRepository = {
  async findAllByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM snippets WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM snippets WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async search(userId, query) {
    const result = await pool.query(
      `SELECT * FROM snippets
       WHERE user_id = $1
         AND (title ILIKE $2 OR language ILIKE $2 OR description ILIKE $2)
       ORDER BY created_at DESC`,
      [userId, `%${query}%`]
    );
    return result.rows;
  },

  async create(title, description, code, language, userId) {
    const result = await pool.query(
      'INSERT INTO snippets (title, description, code, language, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, code, language, userId]
    );
    return result.rows[0];
  },

  async update(id, title, description, code, language) {
    const result = await pool.query(
      'UPDATE snippets SET title=$1, description=$2, code=$3, language=$4 WHERE id=$5 RETURNING *',
      [title, description, code, language, id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    await pool.query('DELETE FROM snippets WHERE id = $1', [id]);
  },
};

module.exports = SnippetRepository;
