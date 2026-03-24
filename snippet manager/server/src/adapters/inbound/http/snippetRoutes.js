const express = require('express');

module.exports = function createSnippetRoutes(snippetController, authMiddleware) {
  const router = express.Router();

  router.get('/', authMiddleware, snippetController.getAll);
  router.get('/:id', authMiddleware, snippetController.getOne);
  router.post('/', authMiddleware, snippetController.create);
  router.put('/:id', authMiddleware, snippetController.update);
  router.delete('/:id', authMiddleware, snippetController.delete);

  return router;
};