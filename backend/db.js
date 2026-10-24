/**
 * db.js — SQLite setup, schema creation, and initial seed data.
 * Uses better-sqlite3 (synchronous API — safe for a single-process server).
 */

const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

const DB_PATH = path.join(__dirname, 'gallery.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl     TEXT    NOT NULL,
    thumbUrl     TEXT    NOT NULL,
    title        TEXT    NOT NULL,
    description  TEXT,
    category     TEXT    NOT NULL DEFAULT 'events',
    event        TEXT,
    year         INTEGER,
    tags         TEXT    DEFAULT '[]',   -- JSON array stored as string
    featured     INTEGER DEFAULT 0,      -- boolean: 0 | 1
    published    INTEGER DEFAULT 1,      -- boolean: 0 | 1
    displayOrder INTEGER DEFAULT 0,
    createdAt    TEXT    DEFAULT (datetime('now'))
  );
`);

// ─── Seed data ────────────────────────────────────────────────────────────────
const count = db.prepare('SELECT COUNT(*) as n FROM images').get().n;

if (count === 0) {
  const U = (id, w = 1400) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const T = (id) => U(id, 600);

  const SEED = [
    {
      imageUrl: U('1591115765373-5207764f72e7'),
      thumbUrl: T('1591115765373-5207764f72e7'),
      title: 'The Opening Ovation',
      description: 'The hall erupts as TEDxGGSIPU 2024 opens. Ideas take the stage.',
      category: 'events', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["opening","crowd","energy"]', featured: 1, published: 1, displayOrder: 1,
    },
    {
      imageUrl: U('1505373877841-8d25f7d46678'),
      thumbUrl: T('1505373877841-8d25f7d46678'),
      title: 'Voice of the Stage',
      description: 'A speaker pauses at the red circle — and the room holds its breath.',
      category: 'speakers', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["speaker","stage","podium"]', featured: 1, published: 1, displayOrder: 2,
    },
    {
      imageUrl: U('1591115765373-5207764f72e7'),
      thumbUrl: T('1591115765373-5207764f72e7'),
      title: 'Hall of Ideas',
      description: 'The main venue before doors open.',
      category: 'events', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["venue","stage","setup"]', featured: 0, published: 1, displayOrder: 3,
    },
    {
      imageUrl: U('1475721027785-f74eccf877e2'),
      thumbUrl: T('1475721027785-f74eccf877e2'),
      title: 'The Idea Worth Spreading',
      description: 'Ideas crystallised into fifteen minutes that changed a room.',
      category: 'speakers', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["speaker","talk","ideas"]', featured: 0, published: 1, displayOrder: 4,
    },
    {
      imageUrl: U('1517457373958-b7bdd4587205'),
      thumbUrl: T('1517457373958-b7bdd4587205'),
      title: 'Every Seat, Every Story',
      description: 'The audience — the silent co-authors of every talk.',
      category: 'audience', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["audience","crowd"]', featured: 1, published: 1, displayOrder: 5,
    },
    {
      imageUrl: U('1517457373958-b7bdd4587205'),
      thumbUrl: T('1517457373958-b7bdd4587205'),
      title: 'The Grand Stage',
      description: 'Where every talk begins and every idea is born.',
      category: 'events', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["stage","hall","lights"]', featured: 0, published: 1, displayOrder: 6,
    },
    {
      imageUrl: U('1528605248644-14dd04022da1'),
      thumbUrl: T('1528605248644-14dd04022da1'),
      title: 'The Team Behind the Dream',
      description: 'Before the audience arrives, this is who built the day.',
      category: 'team', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["team","community","volunteers"]', featured: 0, published: 1, displayOrder: 7,
    },
    {
      imageUrl: U('1582213782179-e0d53f98f2ca'),
      thumbUrl: T('1582213782179-e0d53f98f2ca'),
      title: 'Minds at Work',
      description: 'The rehearsal room — where chaos becomes choreography.',
      category: 'bts', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["bts","prep","team"]', featured: 0, published: 1, displayOrder: 8,
    },
    {
      imageUrl: U('1559223607-b4d0555ae227'),
      thumbUrl: T('1559223607-b4d0555ae227'),
      title: 'Light & Purpose',
      description: 'The moment before a speaker steps into the spotlight.',
      category: 'speakers', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["speaker","light","stage"]', featured: 0, published: 1, displayOrder: 9,
    },
    {
      imageUrl: U('1556761175-5973dc0f32e7'),
      thumbUrl: T('1556761175-5973dc0f32e7'),
      title: 'Behind the Curtain',
      description: 'Every flawless event has a messy, beautiful backstage.',
      category: 'bts', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["bts","backstage"]', featured: 0, published: 1, displayOrder: 10,
    },
    {
      imageUrl: U('1522202176988-66273c2fd55f'),
      thumbUrl: T('1522202176988-66273c2fd55f'),
      title: 'Ideas Continue in Corridors',
      description: 'The conversations that follow a talk are just as important.',
      category: 'audience', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["networking","audience","conversations"]', featured: 0, published: 1, displayOrder: 11,
    },
    {
      imageUrl: U('1509062522246-3755977927d7'),
      thumbUrl: T('1509062522246-3755977927d7'),
      title: 'Into the Microphone',
      description: 'Words chosen carefully. Silence used deliberately.',
      category: 'speakers', event: 'TEDxGGSIPU 2023', year: 2023,
      tags: '["speaker","microphone"]', featured: 0, published: 1, displayOrder: 12,
    },
    {
      imageUrl: U('1560472354-b33ff0c44a43'),
      thumbUrl: T('1560472354-b33ff0c44a43'),
      title: 'Setting the Scene',
      description: 'Six months of planning distilled into four hundred chairs.',
      category: 'bts', event: 'TEDxGGSIPU 2024', year: 2024,
      tags: '["setup","bts","venue"]', featured: 0, published: 1, displayOrder: 13,
    },
    {
      imageUrl: U('1606761568499-6d2451b23c66'),
      thumbUrl: T('1606761568499-6d2451b23c66'),
      title: 'A Thousand Conversations',
      description: 'The room comes alive the moment the doors open.',
      category: 'events', event: 'TEDxGGSIPU 2022', year: 2022,
      tags: '["crowd","event","energy"]', featured: 0, published: 1, displayOrder: 14,
    },
    {
      imageUrl: U('1529156069898-49953e39b3ac'),
      thumbUrl: T('1529156069898-49953e39b3ac'),
      title: 'Connections Made',
      description: 'Two strangers share an idea, and the world shifts slightly.',
      category: 'audience', event: 'TEDxGGSIPU 2022', year: 2022,
      tags: '["networking","connection"]', featured: 0, published: 1, displayOrder: 15,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO images
      (imageUrl, thumbUrl, title, description, category, event, year,
       tags, featured, published, displayOrder)
    VALUES
      (@imageUrl, @thumbUrl, @title, @description, @category, @event, @year,
       @tags, @featured, @published, @displayOrder)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  insertMany(SEED);
  console.log(`[db] Seeded ${SEED.length} placeholder images.`);
}

module.exports = db;
