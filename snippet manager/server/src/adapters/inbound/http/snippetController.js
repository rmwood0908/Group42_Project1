class SnippetController {
  constructor({ getSnippets, getSnippetById, createSnippet, updateSnippet, deleteSnippet }) {
    this.getSnippets = getSnippets;
    this.getSnippetById = getSnippetById;
    this.createSnippet = createSnippet;
    this.updateSnippet = updateSnippet;
    this.deleteSnippet = deleteSnippet;
  }

  getAll = async (req, res) => {
    try {
      const snippets = await this.getSnippets.execute(req.user.id);
      res.json(snippets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  getOne = async (req, res) => {
    try {
      const snippet = await this.getSnippetById.execute(req.params.id, req.user.id);

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found' });
      }

      res.json(snippet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };

  create = async (req, res) => {
    try {
      const snippet = await this.createSnippet.execute({
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        language: req.body.language,
        isPublic: req.body.isPublic ?? false,
        userId: req.user.id
      });

      res.status(201).json(snippet);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const snippet = await this.updateSnippet.execute(req.params.id, req.user.id, {
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        language: req.body.language,
        isPublic: req.body.isPublic ?? false
      });

      if (!snippet) {
        return res.status(404).json({ error: 'Snippet not found' });
      }

      res.json(snippet);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const deleted = await this.deleteSnippet.execute(req.params.id, req.user.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Snippet not found' });
      }

      res.json({ message: 'Snippet deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
}

module.exports = SnippetController;