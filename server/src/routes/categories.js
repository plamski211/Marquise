import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/sizes
router.get('/sizes', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, sort_order FROM sizes ORDER BY sort_order'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/colors
router.get('/colors', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name FROM colors ORDER BY name'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/colors — admin, create new color
router.post('/colors', requireAdmin, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Color name is required' });
    }
    const { rows: [color] } = await pool.query(
      'INSERT INTO colors (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id, name',
      [name.trim()]
    );
    res.status(201).json(color);
  } catch (err) {
    next(err);
  }
});

export default router;
