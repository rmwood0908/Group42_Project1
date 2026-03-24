const SnippetRepository = require('../../../core/ports/SnippetRepository');

class PostgresSnippetRepository extends SnippetRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findAllByUserId(userId) {
    const result = await this.pool.query(
      `SELECT id, title, description, code, language, user_id, is_public, created_at
       FROM snippets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => this.#mapRow(row));
  }

  async findByIdForUser(id, userId) {
    const result = await this.pool.query(
      `SELECT id, title, description, code, language, user_id, is_public, created_at
       FROM snippets
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) return null;

    return this.#mapRow(result.rows[0]);
  }

  async create(snippet) {
    const result = await this.pool.query(
      `INSERT INTO snippets (user_id, title, description, code, language, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, code, language, user_id, is_public, created_at`,
      [
        snippet.userId,
        snippet.title,
        snippet.description,
        snippet.code,
        snippet.language,
        snippet.isPublic
      ]
    );

    return this.#mapRow(result.rows[0]);
  }

  async updateForUser(id, userId, { title, description, code, language, isPublic }) {
    const result = await this.pool.query(
      `UPDATE snippets
       SET title = $1,
           description = $2,
           code = $3,
           language = $4,
           is_public = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, title, description, code, language, user_id, is_public, created_at`,
      [title, description, code, language, isPublic, id, userId]
    );

    if (result.rows.length === 0) return null;

    return this.#mapRow(result.rows[0]);
  }

  async deleteForUser(id, userId) {
    const result = await this.pool.query(
      `DELETE FROM snippets
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    return result.rows.length > 0;
  }

  #mapRow(row) {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      code: row.code,
      language: row.language,
      userId: row.user_id,
      isPublic: row.is_public,
      createdAt: row.created_at
    };
  }
}

module.exports = PostgresSnippetRepository;