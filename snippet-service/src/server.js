const express = require('express');
const cors = require('cors');
require('dotenv').config();

const snippetRoutes = require('./routes/snippets');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'snippet-service' }));
app.use('/snippets', snippetRoutes);

app.listen(PORT, () => console.log(`Snippet Service running on port ${PORT}`));
