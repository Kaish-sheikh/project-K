// =========================================
// EternalVow — Guest / RSVP Routes
// =========================================

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { run, getOne, getAll } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';
import { rsvpLimiter } from '../middleware/rateLimiter.js';
import { isValidEmail, isValidLength } from '../middleware/security.js';
import { honeypotCheck, spamDetection } from '../middleware/botProtection.js';

const router = Router();

// ------------------------------------------
// POST /api/weddings/:weddingId/rsvp — Submit RSVP (public, protected)
// Middleware chain: rate limit → honeypot → spam detection → handler
// ------------------------------------------
router.post('/weddings/:weddingId/rsvp', rsvpLimiter, honeypotCheck('website'), spamDetection, (req, res) => {
  try {
    const { weddingId } = req.params;

    // Verify wedding exists
    const wedding = getOne('SELECT id FROM weddings WHERE id = ?', [weddingId]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    const { name, email, attending, guests, meal, dietary, message, songRequest } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Validate inputs
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!isValidLength(name, 100)) {
      return res.status(400).json({ error: 'Name must be 100 characters or less' });
    }
    if (message && !isValidLength(message, 2000)) {
      return res.status(400).json({ error: 'Message must be 2000 characters or less' });
    }
    if (meal && !isValidLength(meal, 200)) {
      return res.status(400).json({ error: 'Meal selection is too long' });
    }
    if (dietary && !isValidLength(dietary, 500)) {
      return res.status(400).json({ error: 'Dietary notes must be 500 characters or less' });
    }
    if (songRequest && !isValidLength(songRequest, 300)) {
      return res.status(400).json({ error: 'Song request must be 300 characters or less' });
    }

    // Sanitize guest count
    const guestCount = Math.min(Math.max(Number(guests) || 1, 1), 10);

    // Check for duplicate RSVP by email
    const existingRsvp = getOne('SELECT id FROM guests WHERE wedding_id = ? AND email = ?', [weddingId, email.toLowerCase()]);

    if (existingRsvp) {
      // Update existing RSVP
      run(
        `UPDATE guests
         SET name = ?, rsvp = ?, attending = ?, guests_count = ?, meal = ?, dietary = ?, message = ?, song_request = ?, submitted_at = datetime('now')
         WHERE id = ?`,
        [
          name,
          attending ? 'attending' : 'declined',
          attending ? 1 : 0,
          guestCount,
          meal || null,
          dietary || null,
          message || '',
          songRequest || null,
          existingRsvp.id,
        ]
      );

      return res.json({ message: 'RSVP updated successfully', id: existingRsvp.id });
    }

    // Create new RSVP
    const guestId = uuidv4();

    run(
      `INSERT INTO guests (id, wedding_id, name, email, rsvp, attending, guests_count, meal, dietary, message, song_request)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guestId,
        weddingId,
        name,
        email.toLowerCase(),
        attending ? 'attending' : 'declined',
        attending ? 1 : 0,
        guestCount,
        meal || null,
        dietary || null,
        message || '',
        songRequest || null,
      ]
    );

    res.status(201).json({ message: 'RSVP submitted successfully', id: guestId });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

// ------------------------------------------
// GET /api/weddings/:weddingId/guests — List all guests (auth required)
// ------------------------------------------
router.get('/weddings/:weddingId/guests', requireAuth, (req, res) => {
  try {
    const { weddingId } = req.params;

    // Verify ownership
    const wedding = getOne('SELECT id FROM weddings WHERE id = ? AND user_id = ?', [weddingId, req.user.id]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found or access denied' });
    }

    const guests = getAll(
      'SELECT * FROM guests WHERE wedding_id = ? ORDER BY submitted_at DESC',
      [weddingId]
    );

    // Map to frontend-friendly format
    const formatted = guests.map(g => ({
      id: g.id,
      name: g.name,
      email: g.email,
      rsvp: g.rsvp,
      attending: g.attending === 1,
      guests: g.guests_count,
      meal: g.meal,
      dietary: g.dietary,
      message: g.message,
      songRequest: g.song_request,
      submittedAt: g.submitted_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get guests error:', err);
    res.status(500).json({ error: 'Failed to fetch guest list' });
  }
});

// ------------------------------------------
// GET /api/weddings/:weddingId/stats — RSVP statistics (auth required)
// ------------------------------------------
router.get('/weddings/:weddingId/stats', requireAuth, (req, res) => {
  try {
    const { weddingId } = req.params;

    // Verify ownership
    const wedding = getOne('SELECT id FROM weddings WHERE id = ? AND user_id = ?', [weddingId, req.user.id]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found or access denied' });
    }

    const guests = getAll('SELECT * FROM guests WHERE wedding_id = ?', [weddingId]);

    const total = guests.length;
    const attending = guests.filter(g => g.rsvp === 'attending');
    const declined = guests.filter(g => g.rsvp === 'declined');
    const pending = guests.filter(g => g.rsvp === 'pending');
    const totalGuests = attending.reduce((sum, g) => sum + g.guests_count, 0);

    // Meal breakdown
    const meals = {};
    attending.forEach(g => {
      if (g.meal) {
        const mealKey = g.meal.toLowerCase();
        meals[mealKey] = (meals[mealKey] || 0) + 1;
      }
    });

    const totalSongs = guests.filter(g => g.song_request).length;

    res.json({
      total,
      attending: attending.length,
      declined: declined.length,
      pending: pending.length,
      totalGuests,
      meals,
      totalSongs,
      attendingPercent: total > 0 ? Math.round((attending.length / total) * 100) : 0,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

// ------------------------------------------
// PUT /api/guests/:guestId — Update guest (auth required)
// ------------------------------------------
router.put('/guests/:guestId', requireAuth, (req, res) => {
  try {
    const { guestId } = req.params;

    // Get guest and verify ownership through wedding
    const guest = getOne(
      'SELECT g.*, w.user_id FROM guests g JOIN weddings w ON g.wedding_id = w.id WHERE g.id = ?',
      [guestId]
    );

    if (!guest || guest.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Guest not found or access denied' });
    }

    const { name, email, rsvp, meal, dietary, guests, message, songRequest } = req.body;

    run(
      `UPDATE guests
       SET name = COALESCE(?, name),
           email = COALESCE(?, email),
           rsvp = COALESCE(?, rsvp),
           meal = COALESCE(?, meal),
           dietary = COALESCE(?, dietary),
           guests_count = COALESCE(?, guests_count),
           message = COALESCE(?, message),
           song_request = COALESCE(?, song_request)
       WHERE id = ?`,
      [name, email, rsvp, meal, dietary, guests, message, songRequest, guestId]
    );

    res.json({ message: 'Guest updated' });
  } catch (err) {
    console.error('Update guest error:', err);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// ------------------------------------------
// DELETE /api/guests/:guestId — Delete guest (auth required)
// ------------------------------------------
router.delete('/guests/:guestId', requireAuth, (req, res) => {
  try {
    const { guestId } = req.params;

    // Verify ownership
    const guest = getOne(
      'SELECT g.*, w.user_id FROM guests g JOIN weddings w ON g.wedding_id = w.id WHERE g.id = ?',
      [guestId]
    );

    if (!guest || guest.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Guest not found or access denied' });
    }

    run('DELETE FROM guests WHERE id = ?', [guestId]);

    res.json({ message: 'Guest removed' });
  } catch (err) {
    console.error('Delete guest error:', err);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// ------------------------------------------
// GET /api/weddings/:weddingId/songs — Get all song requests (auth required)
// ------------------------------------------
router.get('/weddings/:weddingId/songs', requireAuth, (req, res) => {
  try {
    const { weddingId } = req.params;

    // Verify ownership
    const wedding = getOne('SELECT id FROM weddings WHERE id = ? AND user_id = ?', [weddingId, req.user.id]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found or access denied' });
    }

    const songs = getAll(
      `SELECT name, song_request, submitted_at
       FROM guests
       WHERE wedding_id = ? AND song_request IS NOT NULL AND song_request != ''
       ORDER BY submitted_at DESC`,
      [weddingId]
    );

    const formatted = songs.map(s => ({
      guestName: s.name,
      songRequest: s.song_request,
      submittedAt: s.submitted_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get songs error:', err);
    res.status(500).json({ error: 'Failed to fetch song requests' });
  }
});

export default router;
