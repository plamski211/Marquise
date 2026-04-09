import { Router } from 'express';
import { validateCartItem, validateCartUpdate, validateUuidParam } from '../middleware/validate.js';
import * as cartQueries from '../db/queries/cart.js';

const router = Router();

// Ensure session exists for cart operations
function ensureSession(req, res, next) {
  // Force session creation for anonymous users using the cart
  if (!req.session.initialized) {
    req.session.initialized = true;
  }
  next();
}

// GET /api/cart
router.get('/', ensureSession, async (req, res, next) => {
  try {
    const items = await cartQueries.getCart(req);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, totalItems, totalPrice });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart
router.post('/', ensureSession, validateCartItem, async (req, res, next) => {
  try {
    const items = await cartQueries.addCartItem(req, req.body);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.status(201).json({ items, totalItems, totalPrice });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/:id
router.put('/:id', ensureSession, validateCartUpdate, async (req, res, next) => {
  try {
    const items = await cartQueries.updateCartItem(req, req.params.id, req.body.quantity);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, totalItems, totalPrice });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:id
router.delete('/:id', ensureSession, validateUuidParam, async (req, res, next) => {
  try {
    const items = await cartQueries.deleteCartItem(req, req.params.id);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, totalItems, totalPrice });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart
router.delete('/', ensureSession, async (req, res, next) => {
  try {
    await cartQueries.clearCart(req);
    res.json({ items: [], totalItems: 0, totalPrice: 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
