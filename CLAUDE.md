# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tracecool is a bilingual (English/Arabic, with RTL support) HVAC company website with a React frontend, Express/Node.js backend, and MongoDB database. Images are hosted on Cloudinary.

## Commands

### Frontend (root directory)
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend (server/ directory)
```bash
# From root:
npm start            # Run server/index.js directly
npm run server:dev   # Run server with nodemon (auto-reload)

# From server/:
npm run dev          # nodemon index.js
npm run seed         # Seed initial data
npm run seed:products  # Seed products
```

The backend runs on port 5000 by default. In dev, Vite proxies `/api` to the backend (check `vite.config.js` if needed).

## Architecture

### Frontend (`src/`)

**Routing** — `App.jsx` splits into two entirely separate sub-apps based on pathname:
- `/admin/*` → renders `AdminApp` (no Navbar/Footer, always LTR)
- Everything else → renders public site wrapped in `Navbar` + `Footer`

**Internationalization** — `LanguageContext` provides `{ lang, setLang, t, isRTL }`. Use the `t('key.path')` function everywhere for translated strings. Language persists to `localStorage` under key `tc-lang`. Arabic (`ar`) sets `document.documentElement.dir = 'rtl'`.

**Static content** — Solutions, Services, and other public content live in `src/data/pageData.js` as plain JS arrays with both English and `_ar` suffixed Arabic fields. This is separate from the dynamic DB-driven content fetched via API.

**Scroll animations** — GSAP + ScrollTrigger is registered globally in `App.jsx`. The `ScrollToTop` component uses an `IntersectionObserver` to add `.active` to elements with class `.reveal` on route change.

**Admin frontend** (`src/admin/`) — Fully separate React sub-app with its own `AuthContext` (JWT cookie-based auth). The `AdminLayout` wraps all protected pages. The `BilingualInput` component is used throughout admin forms to enter both EN and AR content simultaneously.

### Backend (`server/`)

**Stack**: Express + Mongoose + JWT (httpOnly cookies) + Cloudinary (image uploads via `multer-storage-cloudinary`)

**Auth**: JWT stored as httpOnly cookie. Two middleware: `protect` (any authenticated admin) and `superAdminOnly` (role check). Admin roles: `admin` | `superadmin`.

**API routes** (all prefixed `/api/`):
- `auth` — login, logout, `/me`
- `admins` — CRUD for admin accounts (superadmin only)
- `categories`, `subcategories`, `products` — product catalog hierarchy
- `services` — managed services
- `agents` — (currently disabled in frontend)
- `contact-info` — company contact details

**Image uploads**: `server/middleware/upload.js` uses `multer-storage-cloudinary`. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `server/.env`.

### Required environment variables

`server/.env`:
```
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## Styling

Tailwind CSS with custom design tokens defined in `tailwind.config.js`:
- `primary` / `navy`: `#071525` (dark navy)
- `accent`: `#1A6FDB` (blue)
- `secondary`: `#5A7896`
- `surface`: `#F2F6FC`

Fonts: Inter (default) + Cairo (Arabic text). Cairo is loaded via Google Fonts in `index.html`.
