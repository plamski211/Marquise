-- Migration 004: Product pieces (bundle items)
-- Allows a product/look to contain multiple individual pieces,
-- each with its own name and price.

CREATE TABLE product_pieces (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_pieces_product ON product_pieces (product_id, sort_order);
