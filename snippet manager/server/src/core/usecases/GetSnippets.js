class GetSnippets {
  constructor(snippetRepository) {
    this.snippetRepository = snippetRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return await this.snippetRepository.findAllByUserId(userId);
  }
}

module.exports = GetSnippets;