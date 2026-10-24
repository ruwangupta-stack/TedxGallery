/**
 * imageProcessor.js — sharp pipeline for uploaded images.
 * Produces two output files per upload:
 *   - Full:      /uploads/full/<id>.webp   (max 1800px, quality 82)
 *   - Thumbnail: /uploads/thumb/<id>.webp  (max 600px, quality 72)
 */

const sharp  = require('sharp');
const path   = require('path');
const fs     = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const FULL_DIR    = path.join(UPLOADS_DIR, 'full');
const THUMB_DIR   = path.join(UPLOADS_DIR, 'thumb');

// Ensure directories exist
[UPLOADS_DIR, FULL_DIR, THUMB_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * Process a single uploaded file through sharp.
 *
 * @param {string} tmpPath  - path to the temp file written by multer
 * @param {string} id       - unique identifier for naming outputs
 * @returns {{ fullPath: string, thumbPath: string, imageUrl: string, thumbUrl: string }}
 */
async function processImage(tmpPath, id) {
  const filename = `${id}.webp`;
  const fullDest  = path.join(FULL_DIR,  filename);
  const thumbDest = path.join(THUMB_DIR, filename);

  const pipeline = sharp(tmpPath).rotate(); // auto-orient via EXIF

  // Full-size — max 1800px on longest edge
  await pipeline
    .clone()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(fullDest);

  // Thumbnail — max 600px on longest edge
  await pipeline
    .clone()
    .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(thumbDest);

  // Clean up temp file
  fs.unlink(tmpPath, () => {});

  return {
    fullPath:  fullDest,
    thumbPath: thumbDest,
    imageUrl:  `/uploads/full/${filename}`,
    thumbUrl:  `/uploads/thumb/${filename}`,
  };
}

module.exports = { processImage, UPLOADS_DIR, FULL_DIR, THUMB_DIR };
