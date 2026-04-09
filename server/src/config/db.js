import pg from 'pg';
import { env } from './env.js';

const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ...(env.isProd && {
    ssl: { rejectUnauthorized: false },
  }),
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

export default pool;
