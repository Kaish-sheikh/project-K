// =========================================
// EternalVow — Event Routes
// =========================================

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { run, getOne, getAll } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ------------------------------------------
// GET /api/weddings/:weddingId/events — List events
// ------------------------------------------
router.get('/weddings/:weddingId/events', (req, res) => {
  try {
    const events = getAll(
      'SELECT * FROM events WHERE wedding_id = ? ORDER BY sort_order, date, time',
      [req.params.weddingId]
    );

    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// ------------------------------------------
// POST /api/weddings/:weddingId/events — Add event (auth)
// ------------------------------------------
router.post('/weddings/:weddingId/events', requireAuth, (req, res) => {
  try {
    const { weddingId } = req.params;

    // Verify ownership
    const wedding = getOne('SELECT id FROM weddings WHERE id = ? AND user_id = ?', [weddingId, req.user.id]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found or access denied' });
    }

    const { name, date, time, location, address, description, icon, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    const eventId = uuidv4();

    run(
      `INSERT INTO events (id, wedding_id, name, date, time, location, address, description, icon, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [eventId, weddingId, name, date, time, location, address, description, icon || 'calendar', sortOrder || 0]
    );

    res.status(201).json({ id: eventId, message: 'Event created' });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// ------------------------------------------
// PUT /api/events/:eventId — Update event (auth)
// ------------------------------------------
router.put('/events/:eventId', requireAuth, (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify ownership through wedding
    const event = getOne(
      'SELECT e.*, w.user_id FROM events e JOIN weddings w ON e.wedding_id = w.id WHERE e.id = ?',
      [eventId]
    );

    if (!event || event.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    const { name, date, time, location, address, description, icon, sortOrder } = req.body;

    run(
      `UPDATE events
       SET name = COALESCE(?, name),
           date = COALESCE(?, date),
           time = COALESCE(?, time),
           location = COALESCE(?, location),
           address = COALESCE(?, address),
           description = COALESCE(?, description),
           icon = COALESCE(?, icon),
           sort_order = COALESCE(?, sort_order)
       WHERE id = ?`,
      [name, date, time, location, address, description, icon, sortOrder, eventId]
    );

    res.json({ message: 'Event updated' });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// ------------------------------------------
// DELETE /api/events/:eventId — Delete event (auth)
// ------------------------------------------
router.delete('/events/:eventId', requireAuth, (req, res) => {
  try {
    const { eventId } = req.params;

    const event = getOne(
      'SELECT e.*, w.user_id FROM events e JOIN weddings w ON e.wedding_id = w.id WHERE e.id = ?',
      [eventId]
    );

    if (!event || event.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    run('DELETE FROM events WHERE id = ?', [eventId]);

    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
