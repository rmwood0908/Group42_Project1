class DeleteSnippet {
  constructor(snippetRepository) {
    this.snippetRepository = snippetRepository;
  }

  async execute(id, userId) {
    if (!id) {
      throw new Error('Snippet ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    return await this.snippetRepository.deleteForUser(id, userId);
  }
}

module.exports = DeleteSnippet;