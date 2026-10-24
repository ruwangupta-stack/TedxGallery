/**
 * routes/admin.js — Admin CRUD API.
 * Full image management: upload, edit, reorder, bulk actions, delete.
 * No auth in v1 — add middleware here to restrict in production.
 */

const express        = require('express');
const path           = require('path');
const fs             = require('fs');
const db             = require('../db');
const upload         = require('../middleware/upload');
const { processImage } = require('../middleware/imageProcessor');

const router = express.Router();

/* ── Helper ──────────────────────────────────────────────────────────────── */
function parseRow(row) {
  if (!row) return null;
  return {
    ...row,
    tags:      safeParse(row.tags, []),
    featured:  Boolean(row.featured),
    published: Boolean(row.published),
  };
}
function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

/* ── GET /api/admin/images ───────────────────────────────────────────────── */
// All images including unpublished, with optional filters
router.get('/images', (req, res) => {
  const { category, event, year, published } = req.query;
  let sql = 'SELECT * FROM images WHERE 1=1';
  const params = [];

  if (category && category !== 'all') { sql += ' AND category=?'; params.push(category); }
  if (event)     { sql += ' AND event=?';     params.push(event); }
  if (year)      { sql += ' AND year=?';      params.push(parseInt(year, 10)); }
  if (published !== undefined) { sql += ' AND published=?'; params.push(published === 'true' ? 1 : 0); }

  sql += ' ORDER BY displayOrder ASC, createdAt DESC';

  try {
    res.json(db.prepare(sql).all(...params).map(parseRow));
  } catch (err) {
    console.error('[admin] GET /images:', err);
    res.status(500).json({ error: 'Failed to fetch images.' });
  }
});

/* ── POST /api/admin/images — multi-file upload ─────────────────────────── */
router.post('/images', upload.array('images', 20), async (req, res) => {
  const files = req.files ?? [];
  if (files.length === 0) return res.status(400).json({ error: 'No files uploaded.' });

  const { title, description, category, event, year, tags, featured, published } = req.body;

  const results = [];
  const errors  = [];

  for (const file of files) {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const { imageUrl, thumbUrl } = await processImage(file.path, uniqueId);

      const displayOrder = (db.prepare('SELECT MAX(displayOrder) as m FROM images').get()?.m ?? 0) + 1;

      const info = db.prepare(`
        INSERT INTO images
          (imageUrl, thumbUrl, title, description, category, event, year,
           tags, featured, published, displayOrder)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        imageUrl,
        thumbUrl,
        title || path.basename(file.originalname, path.extname(file.originalname)),
        description || null,
        category    || 'events',
        event       || null,
        year        ? parseInt(year, 10) : null,
        tags        ? JSON.stringify(tags.split(',').map((t) => t.trim()).filter(Boolean)) : '[]',
        featured    === 'true' ? 1 : 0,
        published   === 'false' ? 0 : 1,
        displayOrder,
      );

      results.push(parseRow(db.prepare('SELECT * FROM images WHERE id=?').get(info.lastInsertRowid)));
    } catch (err) {
      console.error('[admin] processImage error:', err);
      errors.push({ file: file.originalname, error: err.message });
    }
  }

  res.status(errors.length && !results.length ? 500 : 201).json({ created: results, errors });
});

/* ── PATCH /api/admin/images/reorder — bulk reorder ─────────────────────── */
router.patch('/images/reorder', (req, res) => {
  const { order } = req.body; // [{ id, displayOrder }]
  if (!Array.isArray(order)) return res.status(400).json({ error: 'Expected { order: [...] }' });

  const update = db.prepare('UPDATE images SET displayOrder=? WHERE id=?');
  const txn = db.transaction((items) => {
    for (const { id, displayOrder } of items) update.run(displayOrder, id);
  });

  try {
    txn(order);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PATCH /api/admin/images/bulk — bulk category / publish ─────────────── */
router.patch('/images/bulk', (req, res) => {
  const { ids, category, published } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: 'ids array required.' });

  const placeholders = ids.map(() => '?').join(',');
  let sql = 'UPDATE images SET ';
  const params = [];
  const sets = [];

  if (category  !== undefined) { sets.push('category=?');  params.push(category); }
  if (published !== undefined) { sets.push('published=?'); params.push(published ? 1 : 0); }

  if (sets.length === 0) return res.status(400).json({ error: 'Nothing to update.' });

  sql += sets.join(', ') + ` WHERE id IN (${placeholders})`;
  params.push(...ids);

  try {
    db.prepare(sql).run(...params);
    res.json({ ok: true, affected: ids.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PATCH /api/admin/images/:id — edit single image metadata ───────────── */
router.patch('/images/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM images WHERE id=?').get(id);
  if (!row) return res.status(404).json({ error: 'Image not found.' });

  const { title, description, category, event, year, tags, featured, published, displayOrder } = req.body;

  const updatedTags = tags !== undefined
    ? JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()).filter(Boolean))
    : row.tags;

  try {
    db.prepare(`
      UPDATE images SET
        title        = COALESCE(?, title),
        description  = ?,
        category     = COALESCE(?, category),
        event        = ?,
        year         = ?,
        tags         = ?,
        featured     = COALESCE(?, featured),
        published    = COALESCE(?, published),
        displayOrder = COALESCE(?, displayOrder)
      WHERE id = ?
    `).run(
      title       ?? null,
      description !== undefined ? description : row.description,
      category    ?? null,
      event       !== undefined ? event       : row.event,
      year        !== undefined ? parseInt(year, 10) : row.year,
      updatedTags,
      featured    !== undefined ? (featured ? 1 : 0)  : null,
      published   !== undefined ? (published ? 1 : 0) : null,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : null,
      id,
    );

    res.json(parseRow(db.prepare('SELECT * FROM images WHERE id=?').get(id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE /api/admin/images/bulk ──────────────────────────────────────── */
router.delete('/images/bulk', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: 'ids array required.' });

  deleteImages(ids);
  res.json({ ok: true, deleted: ids.length });
});

/* ── DELETE /api/admin/images/:id ───────────────────────────────────────── */
router.delete('/images/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const row = db.prepare('SELECT * FROM images WHERE id=?').get(id);
  if (!row) return res.status(404).json({ error: 'Image not found.' });

  deleteImages([id]);
  res.json({ ok: true });
});

/* ── DELETE helper (also removes uploaded files if local) ────────────────── */
function deleteImages(ids) {
  const placeholders = ids.map(() => '?').join(',');
  const rows = db.prepare(`SELECT * FROM images WHERE id IN (${placeholders})`).all(...ids);

  for (const row of rows) {
    // Only delete files that are local (start with /uploads)
    for (const urlKey of ['imageUrl', 'thumbUrl']) {
      const url = row[urlKey];
      if (url && url.startsWith('/uploads')) {
        const filePath = path.join(__dirname, '..', url);
        fs.unlink(filePath, () => {});
      }
    }
  }

  db.prepare(`DELETE FROM images WHERE id IN (${placeholders})`).run(...ids);
}

module.exports = router;
