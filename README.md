# TedxGallery

A full-stack photo gallery and CMS for TEDx events. Browse a curated visual archive of speakers, audiences, behind-the-scenes moments, and team photos — with a built-in admin dashboard for managing, uploading, and organising images.

---

## Tech Stack

| Layer     | Technology                                               |
| --------- | -------------------------------------------------------- |
| Frontend  | React 18, Vite 5, Vanilla CSS                           |
| Backend   | Node.js, Express 4, better-sqlite3 (SQLite)             |
| Image Processing | sharp (WebP conversion, thumbnailing)             |
| Upload    | Multer 2                                                 |

---

## Folder Structure

```
TedxGallery/
├── index.html                  # Vite entry HTML
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite config (proxy → backend)
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component
│   ├── index.css               # Global styles & design tokens
│   ├── components/
│   │   └── gallery/
│   │       ├── FeaturedSection  # Hero featured carousel
│   │       ├── FilterBar        # Category / event / year filters
│   │       ├── GalleryCard      # Individual image card
│   │       ├── GalleryHero      # Page hero banner
│   │       ├── Lightbox         # Full-screen image viewer
│   │       ├── MasonryGrid      # Responsive masonry layout
│   │       └── SkeletonGrid     # Loading placeholders
│   ├── data/
│   │   └── placeholders.js     # Fallback placeholder data
│   ├── hooks/
│   │   ├── useGallery.js       # Gallery data fetching hook
│   │   └── useLightbox.js      # Lightbox state management
│   └── pages/
│       ├── Gallery.jsx         # Main gallery page
│       └── Gallery.css
├── backend/
│   ├── server.js               # Express entry point
│   ├── db.js                   # SQLite schema + seed data
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Required environment variables
│   ├── admin/
│   │   └── index.html          # Admin dashboard (single-page)
│   ├── middleware/
│   │   ├── upload.js           # Multer file upload config
│   │   └── imageProcessor.js   # sharp image pipeline
│   ├── routes/
│   │   ├── gallery.js          # Public read-only API
│   │   └── admin.js            # Admin CRUD API
│   └── uploads/                # Processed images (git-ignored)
│       ├── full/
│       └── thumb/
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/TedxGallery.git
cd TedxGallery
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env        # Edit .env if you need to change the port
npm install
npm run dev                  # Starts on http://localhost:3001
```

The SQLite database (`gallery.db`) is created automatically on first run with seed data.

### 3. Set up the frontend

Open a **second terminal**:

```bash
# From the project root (TedxGallery/)
npm install
npm run dev                  # Starts on http://localhost:5173
```

Vite automatically proxies `/api` and `/uploads` requests to the backend.

### 4. Open in browser

- **Gallery**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:3001/admin](http://localhost:3001/admin)

---

## Environment Variables

| Variable | Default | Description         |
| -------- | ------- | ------------------- |
| `PORT`   | `3001`  | Backend server port |

Copy `backend/.env.example` → `backend/.env` and adjust as needed.

---

## API Endpoints

| Method | Route                       | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| GET    | `/api/gallery`              | Published images (filterable)      |
| GET    | `/api/gallery/featured`     | Featured images only               |
| GET    | `/api/gallery/meta`         | Distinct events & years            |
| GET    | `/api/health`               | Health check                       |
| GET    | `/api/admin/images`         | All images (including unpublished) |
| POST   | `/api/admin/images`         | Upload new images                  |
| PATCH  | `/api/admin/images/:id`     | Edit image metadata                |
| PATCH  | `/api/admin/images/reorder` | Bulk reorder                       |
| PATCH  | `/api/admin/images/bulk`    | Bulk update                        |
| DELETE | `/api/admin/images/:id`     | Delete single image                |
| DELETE | `/api/admin/images/bulk`    | Bulk delete                        |

---

## License

This project is for TEDx event use. TEDx is a programme of independently organised TED-like events.
