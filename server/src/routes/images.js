import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';
import { validateUuidParam, validateImageReorder } from '../middleware/validate.js';
import pool from '../config/db.js';

const router = Router();

// POST /api/products/:id/images — admin, upload images
router.post('/products/:id/images', requireAdmin, validateUuidParam, (req, res, next) => {
  uploadImages(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    try {
      // Get current max sort_order for this product
      const { rows: [{ max: maxOrder }] } = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) AS max FROM product_images WHERE product_id = $1',
        [req.params.id]
      );

      const images = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imgPath = `/uploads/products/${file.filename}`;
        const { rows: [img] } = await pool.query(`
          INSERT INTO product_images (product_id, filename, path, mime_type, size_bytes, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, path, sort_order
        `, [req.params.id, file.filename, imgPath, file.mimetype, file.size, maxOrder + 1 + i]);
        images.push(img);
      }

      res.status(201).json(images);
    } catch (err) {
      next(err);
    }
  });
});

// PUT /api/products/:id/images/reorder — admin
router.put('/products/:id/images/reorder', requireAdmin, validateImageReorder, async (req, res, next) => {
  try {
    const { imageIds } = req.body;
    for (let i = 0; i < imageIds.length; i++) {
      await pool.query(
        'UPDATE product_images SET sort_order = $1 WHERE id = $2 AND product_id = $3',
        [i, imageIds[i], req.params.id]
      );
    }
    res.json({ message: 'Reordered' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/images/:id — admin, delete single image
router.delete('/images/:id', requireAdmin, validateUuidParam, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM product_images WHERE id = $1 RETURNING filename',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'uploads', 'products', rows[0].filename);
    fs.unlink(filePath, () => {}); // fire and forget

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
