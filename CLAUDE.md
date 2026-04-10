# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Maison Boutique — Marquise

Luxury fashion e-commerce. React 19 frontend on Vercel, Express 4 + PostgreSQL backend on Railway.

## Commands

```bash
# Frontend (project root)
npm run dev          # Vite dev server — http://localhost:5173
npm run build        # Production build (used by Vercel)

# Backend (from server/)
npm run dev          # Nodemon — http://localhost:3001
```

Migrations run automatically on server startup. No separate migrate command needed.

## Architecture

### Frontend → Backend connection
`src/lib/api.js` exports `api` (fetch wrapper) and `assetUrl(path)`. All image paths from the API are relative (`/uploads/products/...`) and must be wrapped with `assetUrl()` before use in `<img src>`. In production, `VITE_API_URL=https://marquise-production.up.railway.app` is baked in at Vite build time — without it, images 404.

### Auth flow
Session-based. `POST /api/auth/login` sets a cookie. `AuthContext` holds the user. `requireAuth` / `requireAdmin` middleware guards backend routes. Admin credentials seed from `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` env vars on first boot.

### Database migrations
`server/src/index.js` reads all `.sql` files from `server/src/db/migrations/` ordered by filename, tracks applied versions in `schema_migrations` table, and runs unapplied ones on every startup. To add a migration: create `server/src/db/migrations/NNN_description.sql`.

### Product images
Uploaded via multer to `server/uploads/products/`. Files are committed to git so they survive Railway deploys. The DB stores the path as `/uploads/products/<filename>`. Express serves them as static files at `/uploads`.

### Cart
Stored server-side in the DB (not localStorage). `CartContext` syncs with `GET /api/cart` on load and after auth changes.

### Checkout
Stripe Checkout Sessions. Flow: `POST /api/checkout` → creates order + Stripe session → returns `{url}` → frontend redirects. Webhook at `POST /api/webhooks/stripe` (must be mounted before `express.json()` — already handled in `app.js`).

### i18n
`src/context/LangContext.jsx` + `src/i18n/translations.js`. All UI strings go through `t('key')`. Two languages: `en` / `bg`. Add keys to both sections of the translations object.

## Key env vars

**Backend** (`server/.env`):
```
DATABASE_URL=
SESSION_SECRET=
CORS_ORIGIN=https://marquise-rose.vercel.app
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL=
ADMIN_EMAIL=
ADMIN_INITIAL_PASSWORD=
```

**Frontend** (Vercel env vars, baked in at build):
```
VITE_API_URL=https://marquise-production.up.railway.app
```

## Deployment

- **Frontend**: Vercel, auto-deploys from `main`. Build command: `vite build`.
- **Backend**: Railway, `nixpacks.toml` at project root overrides build — runs `cd server && npm install` only, starts with `cd server && node src/index.js`.
- **DB**: Railway PostgreSQL. Public URL: `postgresql://postgres:...@shinkansen.proxy.rlwy.net:22633/railway`.

## Frontend routes

`/`, `/shop`, `/product/:id`, `/lookbook`, `/login`, `/admin`, `/order-confirmation`, `/about`, `/contact`, `/shipping-info`, `/returns`, `/size-guide`, `/privacy`, `/terms`

All routes are lazy-loaded in `src/App.jsx`. `vercel.json` rewrites all paths to `index.html` for SPA routing.
