const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

const AuthService = {
  async register(username, email, password) {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error('EMAIL_TAKEN');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserRepository.create(username, email, passwordHash);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secretkey');
    return { token, user };
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secretkey');
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  },
};

module.exports = AuthService;
