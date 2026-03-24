const jwt = require('jsonwebtoken');
const TokenService = require('../../../core/ports/TokenService');

class JwtTokenService extends TokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  generate(payload) {
    return jwt.sign(payload, this.secret);
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = JwtTokenService;