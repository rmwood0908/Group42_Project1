class UpdateSnippet {
  constructor(snippetRepository) {
    this.snippetRepository = snippetRepository;
  }

  async execute(id, userId, { title, description, code, language, isPublic = false }) {
    if (!id) {
      throw new Error('Snippet ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!title || !title.trim()) {
      throw new Error('Snippet title is required');
    }

    if (!code || !code.trim()) {
      throw new Error('Snippet code is required');
    }

    if (!language || !language.trim()) {
      throw new Error('Snippet language is required');
    }

    return await this.snippetRepository.updateForUser(id, userId, {
      title: title.trim(),
      description: description?.trim() || '',
      code,
      language: language.trim().toLowerCase(),
      isPublic: Boolean(isPublic)
    });
  }
}

module.exports = UpdateSnippet;