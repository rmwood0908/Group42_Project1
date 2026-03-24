class TokenService {
  generate(payload) {
    throw new Error('TokenService.generate not implemented');
  }

  verify(token) {
    throw new Error('TokenService.verify not implemented');
  }
}

module.exports = TokenService;