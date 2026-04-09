# Maison Boutique

Luxury fashion e-commerce site. React frontend + Express/PostgreSQL backend.

## Stack
- **Frontend**: React 19, Vite 8, Framer Motion, React Router 7
- **Backend**: Express 4, PostgreSQL (pg), session auth (express-session + connect-pg-simple)
- **Auth**: Session-based, bcrypt passwords, admin-only protected routes

## Project Structure
```
src/                  # React frontend
  App.jsx             # Root — BrowserRouter, providers, animated routes
  components/         # Navbar, CartDrawer, Hero, ProductCard, Footer, CustomCursor, etc.
  pages/              # Home, Shop, ProductDetail, Lookbook, Admin, Login
  context/            # ProductContext, CartContext, AuthContext
  data/               # Static data
  Images/             # Frontend images
  lib/                # Utilities
server/               # Express backend (separate package.json + node_modules)
  src/
    app.js            # Express app setup
    index.js          # Server entry
    routes/           # auth, cart, categories, images, orders, products
    middleware/        # auth, errorHandler, upload, validate
    config/           # db.js, env.js, session.js
    db/               # migrate.js, seed-admin.js, migrations/, queries/
  uploads/            # User-uploaded files
```

## Routes (Frontend)
- `/` — Home
- `/shop` — Shop listing
- `/product/:id` — Product detail
- `/lookbook` — Lookbook gallery
- `/login` — Admin login
- `/admin` — Protected admin panel (CRUD products, orders)

## Commands
```bash
# Frontend
npm run dev          # Vite dev server (port 5173)
npm run build        # Production build

# Backend (from server/)
npm run dev          # Nodemon (port 3001)
npm run migrate      # Run DB migrations
npm run seed-admin   # Create initial admin user
```

## Environment
- Backend `.env` needs: DATABASE_URL, SESSION_SECRET, CORS_ORIGIN, ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD
- DB: PostgreSQL, database name `marquise_dev`

## Dev Log
Check `dev-log/status.md` for current progress and next steps.
