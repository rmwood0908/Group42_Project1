const UserRepository = require('../../../core/ports/UserRepository');

class PostgresUserRepository extends UserRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async create({ username, email, passwordHash }) {
    const result = await this.pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, password_hash, created_at`,
      [username, email, passwordHash]
    );

    const row = result.rows[0];

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at
    };
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      `SELECT id, username, email, password_hash, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at
    };
  }

  async findById(id) {
    const result = await this.pool.query(
      `SELECT id, username, email, password_hash, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at
    };
  }
}

module.exports = PostgresUserRepository;