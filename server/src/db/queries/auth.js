import pool from '../../config/db.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function createUser({ email, passwordHash, firstName, lastName, role }) {
  const { rows } = await pool.query(`
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, first_name, last_name, role
  `, [email, passwordHash, firstName || null, lastName || null, role || 'customer']);
  return rows[0];
}
