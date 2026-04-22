require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fetch = require('node-fetch');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const SNIPPETS_SERVICE_URL = process.env.SNIPPETS_SERVICE_URL || 'http://snippets-service:3002';

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Authorization header required' });

  const token = authHeader.split(' ')[1];
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!data.valid) return res.status(401).json({ error: 'Invalid or expired token' });

    req.headers['x-user-id'] = String(data.userId);
    req.headers['x-username'] = data.username;
    next();
  } catch (err) {
    console.error('Auth service error:', err.message);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// ─── Auth Routes — manually forwarded to preserve JSON body ──────────────────
app.post('/api/register', async (req, res) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Register proxy error:', err.message);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Login proxy error:', err.message);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
});

// ─── Snippet Routes (auth required, proxied) ──────────────────────────────────
app.use(
  '/api/snippets',
  authenticate,
  createProxyMiddleware({
    target: SNIPPETS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/snippets': '/snippets' },
    on: {
      error: (err, req, res) => {
        console.error('Proxy error (snippets):', err.message);
        res.status(503).json({ error: 'Snippets service unavailable' });
      },
    },
  })
);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
