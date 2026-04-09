import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from './db.js';
import { env } from './env.js';

const PgStore = connectPgSimple(session);

export const sessionConfig = {
  store: new PgStore({
    pool,
    tableName: 'session',
    createTableIfMissing: false,
  }),
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: 'marquise.sid',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
  },
};
