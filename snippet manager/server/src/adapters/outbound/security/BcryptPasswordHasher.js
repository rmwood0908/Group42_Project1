const bcrypt = require('bcrypt');
const PasswordHasher = require('../../../core/ports/PasswordHasher');

class BcryptPasswordHasher extends PasswordHasher {
  async hash(password) {
    return await bcrypt.hash(password, 10);
  }

  async compare(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }
}

module.exports = BcryptPasswordHasher;