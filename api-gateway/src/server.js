const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';
const SNIPPET_SERVICE_URL = process.env.SNIPPET_SERVICE_URL || 'http://snippet-service:4002';

app.use(cors());
app.use(express.json());

// ── JWT Authentication Middleware ────────────────────────────────────────────
// Verifies tokens by calling the Auth Service's /verify endpoint.
// On success, injects X-User-Id into the proxied request.
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/verify`, { token });
    req.userId = response.data.payload.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// ── Auth Routes (public — no authentication required) ────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { data } = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const error = err.response?.data?.error || 'Server error';
    res.status(status).json({ error });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { data } = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const error = err.response?.data?.error || 'Server error';
    res.status(status).json({ error });
  }
});

// ── Snippet Routes (protected — require valid JWT) ────────────────────────────
app.get('/api/snippets/search', authenticate, async (req, res) => {
  try {
    const { data } = await axios.get(`${SNIPPET_SERVICE_URL}/snippets/search`, {
      params: req.query,
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.get('/api/snippets', authenticate, async (req, res) => {
  try {
    const { data } = await axios.get(`${SNIPPET_SERVICE_URL}/snippets`, {
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.get('/api/snippets/:id', authenticate, async (req, res) => {
  try {
    const { data } = await axios.get(`${SNIPPET_SERVICE_URL}/snippets/${req.params.id}`, {
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.post('/api/snippets', authenticate, async (req, res) => {
  try {
    const { data } = await axios.post(`${SNIPPET_SERVICE_URL}/snippets`, req.body, {
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.put('/api/snippets/:id', authenticate, async (req, res) => {
  try {
    const { data } = await axios.put(`${SNIPPET_SERVICE_URL}/snippets/${req.params.id}`, req.body, {
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.delete('/api/snippets/:id', authenticate, async (req, res) => {
  try {
    const { data } = await axios.delete(`${SNIPPET_SERVICE_URL}/snippets/${req.params.id}`, {
      headers: { 'X-User-Id': req.userId },
    });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
