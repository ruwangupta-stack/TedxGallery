/**
 * server.js — Express entry point for the TEDx Gallery CMS backend.
 *
 * Routes:
 *   GET  /api/gallery            — public gallery (published only)
 *   GET  /api/gallery/featured   — featured images only
 *   GET  /api/gallery/meta       — distinct events & years
 *   *    /api/admin/*            — admin CRUD API
 *   GET  /admin                  — admin dashboard HTML
 *   GET  /uploads/*              — serve processed images
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Initialise DB (creates schema + seed on first run)
require('./db');

const galleryRouter = require('./routes/gallery');
const adminRouter   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static files ─────────────────────────────────────────────────────────────
// Serve processed uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/gallery', galleryRouter);
app.use('/api/admin',   adminRouter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server] Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  TEDx Gallery CMS backend`);
  console.log(`  ─────────────────────────────`);
  console.log(`  API:    http://localhost:${PORT}/api/gallery`);
  console.log(`  Admin:  http://localhost:${PORT}/admin`);
  console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});
