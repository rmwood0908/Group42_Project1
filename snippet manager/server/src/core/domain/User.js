class User {
  constructor({ id, username, email, passwordHash, createdAt }) {
    if (!username || !username.trim()) {
      throw new Error('Username is required');
    }

    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    this.id = id;
    this.username = username.trim();
    this.email = email.trim().toLowerCase();
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || null;
  }
}

module.exports = User;