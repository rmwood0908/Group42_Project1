const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/', authRoutes);

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
