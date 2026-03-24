class PasswordHasher {
  async hash(password) {
    throw new Error('PasswordHasher.hash not implemented');
  }

  async compare(password, passwordHash) {
    throw new Error('PasswordHasher.compare not implemented');
  }
}

module.exports = PasswordHasher;