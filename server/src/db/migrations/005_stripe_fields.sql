-- Add Stripe payment tracking fields to orders
ALTER TABLE orders
  ADD COLUMN stripe_session_id VARCHAR(255),
  ADD COLUMN stripe_payment_intent_id VARCHAR(255);

CREATE INDEX idx_orders_stripe_session
  ON orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
