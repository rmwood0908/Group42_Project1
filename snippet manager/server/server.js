const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippets');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => res.json({ message: 'Layered backend is working!' }));

app.use('/api', authRoutes);
app.use('/api/snippets', snippetRoutes);

app.listen(PORT, () => console.log(`Layered server running on port ${PORT}`));
