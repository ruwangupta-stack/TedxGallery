/**
 * upload.js — Multer v2 middleware for image file uploads.
 * Stores files temporarily in /tmp before sharp processing.
 */

const multer = require('multer');
const path   = require('path');
const os     = require('os');

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/avif',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `tedx-upload-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
  limits: {
    fileSize: 25 * 1024 * 1024,   // 25 MB per file
    files:    20,                   // max 20 files per request
  },
});

module.exports = upload;
