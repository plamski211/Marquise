import pool from '../../config/db.js';

function ownerWhere(req, paramIdx = 1) {
  if (req.session.userId) {
    return { clause: `user_id = $${paramIdx}`, value: req.session.userId };
  }
  return { clause: `session_id = $${paramIdx}`, value: req.sessionID };
}

export async function getCart(req) {
  const { clause, value } = ownerWhere(req);
  const { rows } = await pool.query(`
    SELECT
      ci.id, ci.product_id, ci.size, ci.color, ci.quantity,
      p.name, p.price, p.gradient, p.slug,
      (
        SELECT pi.path FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.sort_order LIMIT 1
      ) AS image
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ${clause}
    ORDER BY ci.created_at
  `, [value]);

  return rows.map(r => ({
    id: r.id,
    product_id: r.product_id,
    name: r.name,
    price: parseFloat(r.price),
    size: r.size,
    color: r.color,
    quantity: r.quantity,
    gradient: r.gradient,
    slug: r.slug,
    image: r.image || null,
  }));
}

export async function addCartItem(req, { product_id, size, color, quantity }) {
  const qty = quantity || 1;

  // Try to update existing item with same product/size/color combo
  const owner = req.session.userId
    ? { field: 'user_id', value: req.session.userId }
    : { field: 'session_id', value: req.sessionID };

  const { rowCount } = await pool.query(`
    UPDATE cart_items
    SET quantity = quantity + $1, updated_at = now()
    WHERE ${owner.field} = $2 AND product_id = $3
      AND COALESCE(size, '') = COALESCE($4, '')
      AND COALESCE(color, '') = COALESCE($5, '')
  `, [qty, owner.value, product_id, size || null, color || null]);

  if (rowCount > 0) {
    return getCart(req);
  }

  // Insert new item
  await pool.query(`
    INSERT INTO cart_items (${owner.field}, product_id, size, color, quantity)
    VALUES ($1, $2, $3, $4, $5)
  `, [owner.value, product_id, size || null, color || null, qty]);

  return getCart(req);
}

export async function updateCartItem(req, itemId, quantity) {
  const { clause, value } = ownerWhere(req, 2);

  if (quantity <= 0) {
    return deleteCartItem(req, itemId);
  }

  await pool.query(`
    UPDATE cart_items SET quantity = $1, updated_at = now()
    WHERE id = $2 AND ${clause.replace(/\$\d/, '$3')}
  `, [quantity, itemId, value]);

  return getCart(req);
}

export async function deleteCartItem(req, itemId) {
  const { clause, value } = ownerWhere(req, 2);

  await pool.query(
    `DELETE FROM cart_items WHERE id = $1 AND ${clause}`,
    [itemId, value]
  );

  return getCart(req);
}

export async function clearCart(req) {
  const { clause, value } = ownerWhere(req);
  await pool.query(`DELETE FROM cart_items WHERE ${clause}`, [value]);
}

export async function mergeAnonymousCart(sessionId, userId) {
  // Move anonymous cart items to the user, merging quantities for duplicates
  const { rows: anonItems } = await pool.query(
    'SELECT id, product_id, size, color, quantity FROM cart_items WHERE session_id = $1',
    [sessionId]
  );

  for (const item of anonItems) {
    const { rowCount } = await pool.query(`
      UPDATE cart_items
      SET quantity = quantity + $1, updated_at = now()
      WHERE user_id = $2 AND product_id = $3
        AND COALESCE(size, '') = COALESCE($4, '')
        AND COALESCE(color, '') = COALESCE($5, '')
    `, [item.quantity, userId, item.product_id, item.size, item.color]);

    if (rowCount === 0) {
      await pool.query(`
        UPDATE cart_items SET user_id = $1, session_id = NULL WHERE id = $2
      `, [userId, item.id]);
    } else {
      await pool.query('DELETE FROM cart_items WHERE id = $1', [item.id]);
    }
  }
}
