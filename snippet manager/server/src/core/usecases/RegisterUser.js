class RegisterUser {
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ username, email, password }) {
    if (!username || !username.trim()) {
      throw new Error('Username is required');
    }

    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const user = await this.userRepository.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash
    });

    const token = this.tokenService.generate({ userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }
}

module.exports = RegisterUser;