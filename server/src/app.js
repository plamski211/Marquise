import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { sessionConfig } from './config/session.js';
import { errorHandler } from './middleware/errorHandler.js';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import imagesRouter from './routes/images.js';
import cartRouter from './routes/cart.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import { router as checkoutRouter, webhookHandler } from './routes/checkout.js';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// Request logging
app.use(morgan(env.isProd ? 'combined' : 'dev'));

// Stripe webhook — MUST be before express.json() (needs raw body for signature verification)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), webhookHandler);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Sessions
app.use(session(sessionConfig));

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
}));

// Stricter rate limit on auth routes
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later' },
}));

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api', imagesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/checkout', checkoutRouter);

// 404 for unmatched API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
