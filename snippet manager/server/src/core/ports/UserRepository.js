class UserRepository {
  async create({ username, email, passwordHash }) {
    throw new Error('UserRepository.create not implemented');
  }

  async findByEmail(email) {
    throw new Error('UserRepository.findByEmail not implemented');
  }

  async findById(id) {
    throw new Error('UserRepository.findById not implemented');
  }
}

module.exports = UserRepository;