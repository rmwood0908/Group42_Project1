class LoginUser {
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findByEmail(email.trim().toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await this.passwordHasher.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

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

module.exports = LoginUser;