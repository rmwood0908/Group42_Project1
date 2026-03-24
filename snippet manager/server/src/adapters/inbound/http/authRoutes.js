const express = require('express');

module.exports = function createAuthRoutes(authController) {
  const router = express.Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
};