-- Migration 003: Seed admin user
-- Password will be set by the seed script, not in SQL
-- This migration creates a placeholder that the seed script updates

-- The admin user is created via the server seed script (npm run seed-admin)
-- This migration is intentionally empty as a marker.
-- Admin creation requires bcrypt hashing which must be done in JS.
SELECT 1;
