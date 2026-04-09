import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateUuidParam } from '../middleware/validate.js';
import * as orderQueries from '../db/queries/orders.js';

const router = Router();

// POST /api/orders — create order from cart
router.post('/', async (req, res, next) => {
  try {
    const order = await orderQueries.createOrder(req);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/admin — list all orders (admin only)
router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const orders = await orderQueries.listAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/confirmation — order details by Stripe session (public, for confirmation page)
router.get('/confirmation', async (req, res, next) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required' });
    }
    const order = await orderQueries.getOrderByStripeSession(session_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — list user's orders (requires auth)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await orderQueries.listOrders(req.session.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id — order detail (requires auth)
router.get('/:id', requireAuth, validateUuidParam, async (req, res, next) => {
  try {
    const order = await orderQueries.getOrder(req.params.id, req.session.userId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status — admin update status
router.put('/:id/status', requireAdmin, validateUuidParam, async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${valid.join(', ')}` });
    }

    const updated = await orderQueries.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Status updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
