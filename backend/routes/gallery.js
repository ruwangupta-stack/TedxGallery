/**
 * routes/gallery.js — Public read-only API.
 * Only returns published images. Filterable by category, event, year.
 */

const express = require('express');
const db      = require('../db');

const router = express.Router();

/* ── GET /api/gallery ─────────────────────────────────────────────────────── */
router.get('/', (req, res) => {
  const { category, event, year } = req.query;

  let sql = 'SELECT * FROM images WHERE published = 1';
  const params = [];

  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (event) {
    sql += ' AND event = ?';
    params.push(event);
  }
  if (year) {
    const y = parseInt(year, 10);
    if (!isNaN(y)) {
      sql += ' AND year = ?';
      params.push(y);
    }
  }

  sql += ' ORDER BY displayOrder ASC, createdAt DESC';

  try {
    const rows = db.prepare(sql).all(...params);
    const parsed = rows.map(parseRow);
    res.json(parsed);
  } catch (err) {
    console.error('[gallery] GET /:', err);
    res.status(500).json({ error: 'Failed to fetch gallery images.' });
  }
});

/* ── GET /api/gallery/featured ───────────────────────────────────────────── */
router.get('/featured', (_req, res) => {
  try {
    const rows = db
      .prepare(
        'SELECT * FROM images WHERE published = 1 AND featured = 1 ORDER BY displayOrder ASC LIMIT 6'
      )
      .all();
    res.json(rows.map(parseRow));
  } catch (err) {
    console.error('[gallery] GET /featured:', err);
    res.status(500).json({ error: 'Failed to fetch featured images.' });
  }
});

/* ── GET /api/gallery/meta ───────────────────────────────────────────────── */
// Returns distinct events & years for filter UI
router.get('/meta', (_req, res) => {
  try {
    const events = db
      .prepare("SELECT DISTINCT event FROM images WHERE published=1 AND event IS NOT NULL ORDER BY event")
      .all()
      .map((r) => r.event);

    const years = db
      .prepare("SELECT DISTINCT year FROM images WHERE published=1 AND year IS NOT NULL ORDER BY year DESC")
      .all()
      .map((r) => r.year);

    res.json({ events, years });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meta.' });
  }
});

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function parseRow(row) {
  return {
    ...row,
    tags:     safeParse(row.tags, []),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
  };
}

function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = router;
