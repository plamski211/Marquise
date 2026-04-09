import { env } from './config/env.js';
import pool from './config/db.js';
import app from './app.js';

const server = app.listen(env.port, () => {
  console.log(`\n  MARQUISE API server running on http://localhost:${env.port}`);
  console.log(`  Environment: ${env.nodeEnv}`);
  console.log(`  CORS origin: ${env.corsOrigin}\n`);
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await pool.end();
    console.log('Database pool closed. Goodbye.');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
