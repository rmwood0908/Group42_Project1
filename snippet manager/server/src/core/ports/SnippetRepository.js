class SnippetRepository {
  async findAllByUserId(userId) {
    throw new Error('SnippetRepository.findAllByUserId not implemented');
  }

  async findByIdForUser(id, userId) {
    throw new Error('SnippetRepository.findByIdForUser not implemented');
  }

  async create(snippet) {
    throw new Error('SnippetRepository.create not implemented');
  }

  async updateForUser(id, userId, snippetData) {
    throw new Error('SnippetRepository.updateForUser not implemented');
  }

  async deleteForUser(id, userId) {
    throw new Error('SnippetRepository.deleteForUser not implemented');
  }
}

module.exports = SnippetRepository;