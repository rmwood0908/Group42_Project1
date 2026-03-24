class AuthController {
  constructor({ registerUser, loginUser }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
  }

  register = async (req, res) => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: err.message });
    }
  };
}

module.exports = AuthController;