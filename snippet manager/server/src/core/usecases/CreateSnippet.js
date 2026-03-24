const Snippet = require('../domain/Snippet');

class CreateSnippet {
  constructor(snippetRepository) {
    this.snippetRepository = snippetRepository;
  }

  async execute({ title, description, code, language, userId, isPublic = false }) {
    const snippet = new Snippet({
      title,
      description,
      code,
      language,
      userId,
      isPublic
    });

    return await this.snippetRepository.create(snippet);
  }
}

module.exports = CreateSnippet;