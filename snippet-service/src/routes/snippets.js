const express = require('express');
const router = express.Router();
const SnippetService = require('../services/snippetService');

// userId is injected by the API Gateway via X-User-Id header
function getUserId(req) {
  const id = req.headers['x-user-id'];
  if (!id) throw new Error('Missing X-User-Id header');
  return parseInt(id, 10);
}

router.get('/search', async (req, res) => {
  try {
    const snippets = await SnippetService.search(getUserId(req), req.query.q);
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const snippets = await SnippetService.getAllForUser(getUserId(req));
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
    const snippet = await SnippetService.create(getUserId(req), req.body);
    res.json(snippet);
  } catch (err) {
    if (err.message === 'Title and code are required') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const snippet = await SnippetService.update(req.params.id, getUserId(req), req.body);
    res.json(snippet);
  } catch (err) {
    if (err.message === 'SNIPPET_NOT_FOUND') return res.status(404).json({ error: 'Not found' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'Forbidden' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await SnippetService.delete(req.params.id, getUserId(req));
    res.json({ message: 'Snippet deleted' });
  } catch (err) {
    if (err.message === 'SNIPPET_NOT_FOUND') return res.status(404).json({ error: 'Not found' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'Forbidden' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
