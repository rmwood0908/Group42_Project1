class Snippet {
  constructor({ id, title, description = '', code, language, userId, isPublic = false, createdAt }) {
    if (!title || !title.trim()) {
      throw new Error('Snippet title is required');
    }

    if (!code || !code.trim()) {
      throw new Error('Snippet code is required');
    }

    if (!language || !language.trim()) {
      throw new Error('Snippet language is required');
    }

    if (!userId) {
      throw new Error('Snippet must belong to a user');
    }

    this.id = id;
    this.title = title.trim();
    this.description = description?.trim() || '';
    this.code = code;
    this.language = language.trim().toLowerCase();
    this.userId = userId;
    this.isPublic = Boolean(isPublic);
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Snippet;