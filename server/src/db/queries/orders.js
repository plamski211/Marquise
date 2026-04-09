import pool from '../../config/db.js';

export async function createOrder(req) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userId = req.session.userId || null;
    const sessionId = req.sessionID;

    // Get cart items with current prices
    const ownerField = userId ? 'user_id' : 'session_id';
    const ownerValue = userId || sessionId;

    const { rows: cartItems } = await client.query(`
      SELECT ci.product_id, ci.size, ci.color, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.${ownerField} = $1
    `, [ownerValue]);

    if (cartItems.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }

    const subtotal = cartItems.reduce((sum, item) =>
      sum + parseFloat(item.price) * item.quantity, 0
    );
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const { rows: [order] } = await client.query(`
      INSERT INTO orders (user_id, session_id, subtotal, shipping_cost, total)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, status, subtotal, shipping_cost, total, created_at
    `, [userId, sessionId, subtotal, shippingCost, total]);

    for (const item of cartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, size, color, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [order.id, item.product_id, item.size, item.color, item.quantity, item.price]);
    }

    // Clear the cart
    await client.query(
      `DELETE FROM cart_items WHERE ${ownerField} = $1`,
      [ownerValue]
    );

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listOrders(userId) {
  const { rows } = await pool.query(`
    SELECT id, status, subtotal, shipping_cost, total, created_at
    FROM orders WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId]);
  return rows;
}

export async function getOrder(orderId, userId) {
  const { rows: [order] } = await pool.query(`
    SELECT id, user_id, status, subtotal, shipping_cost, total,
           shipping_address, billing_address, notes, created_at
    FROM orders WHERE id = $1
  `, [orderId]);

  if (!order) return null;
  if (order.user_id !== userId) return null;

  const { rows: items } = await pool.query(`
    SELECT oi.*, p.name AS product_name, p.slug AS product_slug
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `, [orderId]);

  return { ...order, items };
}

export async function updateOrderStatus(orderId, status) {
  const { rowCount } = await pool.query(
    'UPDATE orders SET status = $1, updated_at = now() WHERE id = $2',
    [status, orderId]
  );
  return rowCount > 0;
}

export async function updateOrderStripe(orderId, stripeSessionId, stripePaymentIntentId) {
  await pool.query(`
    UPDATE orders
    SET stripe_session_id = $1, stripe_payment_intent_id = $2, updated_at = now()
    WHERE id = $3
  `, [stripeSessionId, stripePaymentIntentId, orderId]);
}

export async function confirmOrder(orderId, { paymentIntentId, shippingAddress, billingAddress }) {
  await pool.query(`
    UPDATE orders
    SET status = 'confirmed',
        stripe_payment_intent_id = $1,
        shipping_address = $2,
        billing_address = $3,
        updated_at = now()
    WHERE id = $4
  `, [paymentIntentId, JSON.stringify(shippingAddress), JSON.stringify(billingAddress), orderId]);
}

export async function getOrderByStripeSession(stripeSessionId) {
  const { rows: [order] } = await pool.query(`
    SELECT id, user_id, status, subtotal, shipping_cost, total,
           shipping_address, billing_address, created_at
    FROM orders WHERE stripe_session_id = $1
  `, [stripeSessionId]);

  if (!order) return null;

  const { rows: items } = await pool.query(`
    SELECT oi.*, p.name AS product_name, p.slug AS product_slug,
           (SELECT pi.path FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.sort_order LIMIT 1) AS image
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `, [order.id]);

  return { ...order, items };
}

export async function getOrderItemsWithNames(orderId) {
  const { rows } = await pool.query(`
    SELECT oi.product_id, oi.size, oi.color, oi.quantity, oi.unit_price,
           p.name AS product_name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `, [orderId]);
  return rows;
}

export async function listAllOrders() {
  const { rows } = await pool.query(`
    SELECT o.id, o.status, o.subtotal, o.shipping_cost, o.total,
           o.shipping_address, o.created_at,
           u.email AS customer_email, u.first_name, u.last_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `);
  return rows;
}
