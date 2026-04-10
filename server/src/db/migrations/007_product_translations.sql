-- Migration 007: Add Bulgarian translation fields to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_bg VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_bg TEXT;
