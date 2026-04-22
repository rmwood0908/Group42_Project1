require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const SNIPPETS_SERVICE_URL = process.env.SNIPPETS_SERVICE_URL || 'http://snippets-service:3002';

// ─── JWT Auth Middleware ───────────────────────────────────────────────────────
// Calls the auth service to verify the token and forwards user info as headers
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

    // Attach user info to request headers for downstream services
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

// ─── Auth Routes (no auth required) ──────────────────────────────────────────
// Match original API: POST /api/register and POST /api/login
app.use(
  ['/api/register', '/api/login'],
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => path.replace('/api/', '/auth/'),
    on: {
      error: (err, req, res) => {
        console.error('Proxy error (auth):', err.message);
        res.status(503).json({ error: 'Auth service unavailable' });
      },
    },
  })
);

// ─── Snippet Routes (auth required) ───────────────────────────────────────────
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
