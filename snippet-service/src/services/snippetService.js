const SnippetRepository = require('../repositories/snippetRepository');

const SnippetService = {
  async getAllForUser(userId) {
    return SnippetRepository.findAllByUser(userId);
  },

  async getById(id) {
    const snippet = await SnippetRepository.findById(id);
    if (!snippet) throw new Error('SNIPPET_NOT_FOUND');
    return snippet;
  },

  async search(userId, query) {
    return SnippetRepository.search(userId, query || '');
  },

  async create(userId, { title, description, code, language }) {
    if (!title || !code) throw new Error('Title and code are required');
    return SnippetRepository.create(title, description, code, language, userId);
  },

  async update(id, userId, { title, description, code, language }) {
    const existing = await SnippetRepository.findById(id);
    if (!existing) throw new Error('SNIPPET_NOT_FOUND');
    if (existing.user_id !== userId) throw new Error('FORBIDDEN');
    return SnippetRepository.update(id, title, description, code, language);
  },

  async delete(id, userId) {
    const existing = await SnippetRepository.findById(id);
    if (!existing) throw new Error('SNIPPET_NOT_FOUND');
    if (existing.user_id !== userId) throw new Error('FORBIDDEN');
    await SnippetRepository.delete(id);
  },
};

module.exports = SnippetService;
