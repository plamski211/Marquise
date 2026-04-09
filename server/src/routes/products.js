import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateProduct, validateProductUpdate, validateUuidParam } from '../middleware/validate.js';
import * as productQueries from '../db/queries/products.js';

const router = Router();

// GET /api/products — public
router.get('/', async (req, res, next) => {
  try {
    const products = await productQueries.listProducts({
      category: req.query.category || undefined,
      featured: req.query.featured === 'true' ? true : undefined,
      isNew: req.query.is_new === 'true' ? true : undefined,
      sort: req.query.sort || undefined,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id — public (accepts UUID or slug)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await productQueries.getProductByIdOrSlug(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products — admin only
router.post('/', requireAdmin, validateProduct, async (req, res, next) => {
  try {
    const productId = await productQueries.createProduct(req.body);
    const product = await productQueries.getProductByIdOrSlug(productId);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === '23505' && err.constraint?.includes('slug')) {
      return res.status(409).json({ message: 'A product with a similar name already exists' });
    }
    next(err);
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', requireAdmin, validateProductUpdate, async (req, res, next) => {
  try {
    await productQueries.updateProduct(req.params.id, req.body);
    const product = await productQueries.getProductByIdOrSlug(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAdmin, validateUuidParam, async (req, res, next) => {
  try {
    const deleted = await productQueries.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
