const express = require('express');
const cors = require('cors');

function createExpressApp({ authRoutes, snippetRoutes }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
  });

  app.use('/api', authRoutes);
  app.use('/api/snippets', snippetRoutes);

  return app;
}

module.exports = createExpressApp;