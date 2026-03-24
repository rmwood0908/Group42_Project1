module.exports = function authMiddleware(tokenService) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = tokenService.verify(token);
      req.user = { id: decoded.userId };
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};