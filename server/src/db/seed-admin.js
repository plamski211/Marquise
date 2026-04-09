import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { env } from '../config/env.js';

async function seedAdmin() {
  const email = env.adminEmail;
  const password = env.adminInitialPassword;

  if (!password) {
    console.error('ADMIN_INITIAL_PASSWORD not set in .env');
    process.exit(1);
  }

  const { rows } = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );

  if (rows.length > 0) {
    console.log(`Admin user ${email} already exists. Skipping.`);
  } else {
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, 'Admin', 'Marquise', 'admin')`,
      [email, hash]
    );
    console.log(`Admin user created: ${email}`);
  }

  await pool.end();
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err.message);
  process.exit(1);
});
