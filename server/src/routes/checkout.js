import { Router } from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import * as orderQueries from '../db/queries/orders.js';

const stripe = new Stripe(env.stripeSecretKey);
const router = Router();

// POST /api/checkout — create Stripe Checkout Session from cart
router.post('/', async (req, res, next) => {
  try {
    // Create order in DB (captures prices, clears cart)
    const order = await orderQueries.createOrder(req);

    // Get order items with product names for Stripe line items
    const items = await orderQueries.getOrderItemsWithNames(order.id);

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          ...(item.size || item.color ? {
            description: [item.size, item.color].filter(Boolean).join(' / '),
          } : {}),
        },
        unit_amount: Math.round(parseFloat(item.unit_price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'BG'],
      },
      metadata: { order_id: order.id },
      success_url: `${env.corsOrigin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.corsOrigin}/shop`,
    });

    // Store Stripe session ID on the order
    await orderQueries.updateOrderStripe(order.id, session.id, null);

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// Stripe webhook handler — called with raw body (mounted separately in app.js)
async function webhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.stripeWebhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.order_id;

    if (orderId) {
      try {
        await orderQueries.confirmOrder(orderId, {
          paymentIntentId: session.payment_intent,
          shippingAddress: session.shipping_details || null,
          billingAddress: session.customer_details || null,
        });
        console.log(`Order ${orderId} confirmed via Stripe webhook`);
      } catch (err) {
        console.error(`Failed to confirm order ${orderId}:`, err.message);
        return res.status(500).json({ message: 'Order update failed' });
      }
    }
  }

  res.json({ received: true });
}

export { router, webhookHandler };
