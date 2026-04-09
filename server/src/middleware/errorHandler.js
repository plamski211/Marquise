import { env } from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}`, err.message);
  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({
    message: status === 500 && env.isProd
      ? 'Internal server error'
      : err.message,
    ...(err.errors && { errors: err.errors }),
  });
}
