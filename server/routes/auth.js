// =========================================
// EternalVow — Auth Routes
// =========================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { run, getOne } from '../db/database.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { isValidEmail, isValidLength } from '../middleware/security.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// ------------------------------------------
// POST /api/auth/register
// ------------------------------------------
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate name length (prevent abuse)
    if (!isValidLength(name, 100)) {
      return res.status(400).json({ error: 'Name must be 100 characters or less' });
    }

    // Password strength requirements
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (password.length > 128) {
      return res.status(400).json({ error: 'Password must be 128 characters or less' });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and a number' });
    }

    // Check if user already exists
    const existing = getOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      // Don't reveal whether the email exists (return same message)
      return res.status(409).json({ error: 'Unable to create account. Please try a different email.' });
    }

    // Hash password with strong cost factor
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    run(
      'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [userId, email.toLowerCase(), passwordHash, name]
    );

    // Create a default wedding for the user
    const weddingId = uuidv4();
    const defaultCouple = JSON.stringify({
      partner1: { firstName: '', lastName: '', photo: null, bio: '' },
      partner2: { firstName: '', lastName: '', photo: null, bio: '' },
      hashtag: '',
      story: [],
    });
    const defaultWedding = JSON.stringify({
      date: '',
      venue: {
        ceremony: { name: '', address: '', time: '', description: '', mapUrl: '' },
        reception: { name: '', address: '', time: '', description: '', mapUrl: '' },
      },
      dressCode: '',
    });

    run(
      'INSERT INTO weddings (id, user_id, template, couple_data, wedding_details) VALUES (?, ?, ?, ?, ?)',
      [weddingId, userId, 'serenity', defaultCouple, defaultWedding]
    );

    const token = signToken({ id: userId, email: email.toLowerCase(), name });

    res.status(201).json({
      token,
      user: { id: userId, email: email.toLowerCase(), name },
      weddingId,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ------------------------------------------
// POST /api/auth/login
// ------------------------------------------
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (!user) {
      // Timing-safe: still do a bcrypt comparison to prevent timing attacks
      await bcrypt.hash('dummy-password', 12);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get user's wedding
    const wedding = getOne('SELECT id FROM weddings WHERE user_id = ?', [user.id]);

    const token = signToken({ id: user.id, email: user.email, name: user.name });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
      weddingId: wedding?.id || null,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ------------------------------------------
// GET /api/auth/me
// ------------------------------------------
router.get('/me', requireAuth, (req, res) => {
  // Only select specific columns — never return password_hash
  const user = getOne('SELECT id, email, name, created_at FROM users WHERE id = ?', [req.user.id]);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const wedding = getOne('SELECT id FROM weddings WHERE user_id = ?', [user.id]);

  res.json({
    user,
    weddingId: wedding?.id || null,
  });
});

export default router;
