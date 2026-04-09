-- Migration 001: Initial Schema
-- All tables for MARQUISE e-commerce platform

-- Track applied migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Categories
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_categories_sort ON categories (sort_order);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Products
CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    description TEXT,
    featured    BOOLEAN NOT NULL DEFAULT false,
    is_new      BOOLEAN NOT NULL DEFAULT false,
    gradient    VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_featured ON products (featured) WHERE featured = true;
CREATE INDEX idx_products_is_new ON products (is_new) WHERE is_new = true;
CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_created ON products (created_at DESC);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Product Images
CREATE TABLE product_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    filename    VARCHAR(255) NOT NULL,
    path        VARCHAR(500) NOT NULL,
    mime_type   VARCHAR(50) NOT NULL,
    size_bytes  INTEGER NOT NULL CHECK (size_bytes > 0),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_images_product ON product_images (product_id, sort_order);

-- Sizes lookup
CREATE TABLE sizes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(20) NOT NULL UNIQUE,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Product-Sizes join
CREATE TABLE product_sizes (
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id     UUID NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, size_id)
);
CREATE INDEX idx_product_sizes_product ON product_sizes (product_id);

-- Colors lookup
CREATE TABLE colors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE
);

-- Product-Colors join
CREATE TABLE product_colors (
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color_id    UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, color_id)
);
CREATE INDEX idx_product_colors_product ON product_colors (product_id);

-- Users
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    role            VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_users_email ON users (LOWER(email));
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sessions (connect-pg-simple)
CREATE TABLE session (
    sid     VARCHAR NOT NULL COLLATE "default",
    sess    JSON NOT NULL,
    expire  TIMESTAMPTZ(6) NOT NULL,
    PRIMARY KEY (sid)
);
CREATE INDEX idx_session_expire ON session (expire);

-- Orders
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      VARCHAR(255),
    status          VARCHAR(30) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal        NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost   NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    total           NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    shipping_address JSONB,
    billing_address  JSONB,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created ON orders (created_at DESC);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Order Items
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    size        VARCHAR(20),
    color       VARCHAR(50),
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order ON order_items (order_id);

-- Cart Items (session-based, upgradeable to user-based)
CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  VARCHAR(255),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size        VARCHAR(20),
    color       VARCHAR(50),
    quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT cart_items_owner_check CHECK (
        (session_id IS NOT NULL) OR (user_id IS NOT NULL)
    )
);
CREATE INDEX idx_cart_items_session ON cart_items (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_cart_items_user ON cart_items (user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_cart_items_unique ON cart_items (
    COALESCE(session_id, ''),
    COALESCE(user_id::text, ''),
    product_id,
    COALESCE(size, ''),
    COALESCE(color, '')
);
CREATE TRIGGER trg_cart_items_updated BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
