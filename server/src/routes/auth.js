import { Router } from 'express';
import bcrypt from 'bcrypt';
import { requireAuth } from '../middleware/auth.js';
import { validateLogin, validateRegister } from '../middleware/validate.js';
import { findUserByEmail, findUserById, createUser } from '../db/queries/auth.js';
import { mergeAnonymousCart } from '../db/queries/cart.js';

const BCRYPT_ROUNDS = 12;
const router = Router();

// POST /api/auth/register
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await createUser({
      email,
      passwordHash,
      firstName: first_name,
      lastName: last_name,
      role: 'customer',
    });

    // Set session
    req.session.userId = user.id;
    req.session.role = user.role;

    // Merge any anonymous cart
    await mergeAnonymousCart(req.sessionID, user.id);

    res.status(201).json({
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const oldSessionId = req.sessionID;

    // Regenerate session to prevent session fixation
    req.session.regenerate(async (err) => {
      if (err) return next(err);

      req.session.userId = user.id;
      req.session.role = user.role;

      // Merge anonymous cart
      await mergeAnonymousCart(oldSessionId, user.id);

      res.json({
        user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
      });
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('marquise.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.json({ user: null });
    }

    const user = await findUserById(req.session.userId);
    if (!user || !user.is_active) {
      return res.json({ user: null });
    }

    res.json({
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
