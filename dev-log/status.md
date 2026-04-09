# Maison Boutique — Status

## Current State (2026-04-08)
- Project moved to `~/projects/maison-boutique/`
- React frontend + Express backend structure in place
- Pages: Home, Shop, ProductDetail, Lookbook, Admin, Login, OrderConfirmation
- Auth: session-based admin login with protected routes
- Cart: context-based with drawer UI
- **Stripe Checkout integrated** — full payment flow (checkout → Stripe → confirmation)
- **Admin orders panel** — view all orders, update status via dropdown
- DB migration 005 adds stripe_session_id + stripe_payment_intent_id to orders

## Next Steps
- Add real Stripe test keys to server/.env (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- Run migration: `cd server && npm run migrate`
- Test with Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- Email notifications on order confirmation
- Customer account pages (order history)
- Inventory/stock management
- Legal pages (privacy, terms, returns)

## Session Notes
Use this section to track what was done each session.

### 2026-04-08
- Moved project from `~/maison-boutique/` to `~/projects/maison-boutique/`
- Created CLAUDE.md and dev-log for fast context pickup
- **Stripe Checkout Sessions integration:**
  - Migration 005: stripe_session_id + stripe_payment_intent_id on orders table
  - `server/src/routes/checkout.js`: POST /api/checkout (creates order + Stripe session), webhook handler
  - Webhook mounted BEFORE express.json() in app.js (critical for signature verification)
  - CartDrawer checkout button wired to Stripe redirect with loading state
  - OrderConfirmation page: fetches order by stripe session_id, shows summary
  - Admin orders tab: lists all orders with status dropdown (confirmed/shipped/etc)
  - Added admin listing endpoint (GET /api/orders/admin) and confirmation endpoint (GET /api/orders/confirmation)
