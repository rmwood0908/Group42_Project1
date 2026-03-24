const express = require('express');
const router = express.Router();
const SnippetService = require('../services/snippetService');
const { authenticateToken } = require('../middleware/auth');

// API Layer — HTTP handling only, delegates all logic to SnippetService
router.use(authenticateToken);

router.get('/search', async (req, res) => {
  try {
    const snippets = await SnippetService.search(req.user.userId, req.query.q);
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const snippets = await SnippetService.getAllForUser(req.user.userId);
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const snippet = await SnippetService.getById(req.params.id);
    res.json(snippet);
  } catch (err) {
    if (err.message === 'SNIPPET_NOT_FOUND') return res.status(404).json({ error: 'Snippet not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const snippet = await SnippetService.create(req.user.userId, req.body);
    res.json(snippet);
  } catch (err) {
    if (err.message === 'Title and code are required') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const snippet = await SnippetService.update(req.params.id, req.user.userId, req.body);
    res.json(snippet);
  } catch (err) {
    if (err.message === 'SNIPPET_NOT_FOUND') return res.status(404).json({ error: 'Not found' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'Forbidden' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await SnippetService.delete(req.params.id, req.user.userId);
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    if (err.message === 'SNIPPET_NOT_FOUND') return res.status(404).json({ error: 'Not found' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'Forbidden' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
