import { env } from './config/env.js';
import pool from './config/db.js';
import app from './app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    const { rows: applied } = await client.query('SELECT version FROM schema_migrations ORDER BY version');
    const appliedSet = new Set(applied.map(r => r.version));
    const migrationsDir = path.join(__dirname, 'db', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      if (appliedSet.has(file)) continue;
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`  Migration applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  Migration failed: ${file}`, err.message);
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

async function seedAdmin() {
  if (!env.adminInitialPassword) return;
  const { rows } = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [env.adminEmail]);
  if (rows.length === 0) {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.default.hash(env.adminInitialPassword, 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, 'Admin', 'Marquise', 'admin')`,
      [env.adminEmail, hash]
    );
    console.log(`Admin user created: ${env.adminEmail}`);
  }
}

async function start() {
  console.log('Running database migrations...');
  await runMigrations();
  console.log('Migrations complete.');
  await seedAdmin();

  const server = app.listen(env.port, () => {
    console.log(`\n  MARQUISE API server running on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  CORS origin: ${env.corsOrigin}\n`);
  });

  async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await pool.end();
      console.log('Database pool closed. Goodbye.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
