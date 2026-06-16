// =========================================
// EternalVow — Wedding Routes
// =========================================

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { run, getOne, getAll } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ------------------------------------------
// GET /api/weddings/mine — Get current user's wedding
// ------------------------------------------
router.get('/mine', requireAuth, (req, res) => {
  try {
    const wedding = getOne('SELECT * FROM weddings WHERE user_id = ?', [req.user.id]);

    if (!wedding) {
      return res.status(404).json({ error: 'No wedding found. Create one first.' });
    }

    res.json({
      id: wedding.id,
      template: wedding.template,
      coupleData: JSON.parse(wedding.couple_data),
      weddingDetails: JSON.parse(wedding.wedding_details),
      colorPalette: wedding.color_palette,
      fontPairing: wedding.font_pairing,
      avatars: wedding.avatars ? JSON.parse(wedding.avatars) : null,
      createdAt: wedding.created_at,
      updatedAt: wedding.updated_at,
    });
  } catch (err) {
    console.error('Get wedding error:', err);
    res.status(500).json({ error: 'Failed to fetch wedding data' });
  }
});

// ------------------------------------------
// POST /api/weddings — Create a wedding
// ------------------------------------------
router.post('/', requireAuth, (req, res) => {
  try {
    // Check if user already has a wedding
    const existing = getOne('SELECT id FROM weddings WHERE user_id = ?', [req.user.id]);
    if (existing) {
      return res.status(409).json({ error: 'You already have a wedding. Use PUT to update it.', weddingId: existing.id });
    }

    const { template, coupleData, weddingDetails, colorPalette, fontPairing } = req.body;

    const weddingId = uuidv4();

    run(
      `INSERT INTO weddings (id, user_id, template, couple_data, wedding_details, color_palette, font_pairing)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        weddingId,
        req.user.id,
        template || 'serenity',
        JSON.stringify(coupleData || {}),
        JSON.stringify(weddingDetails || {}),
        colorPalette || 0,
        fontPairing || 0,
      ]
    );

    res.status(201).json({ id: weddingId, message: 'Wedding created' });
  } catch (err) {
    console.error('Create wedding error:', err);
    res.status(500).json({ error: 'Failed to create wedding' });
  }
});

// ------------------------------------------
// PUT /api/weddings/:id — Update wedding
// ------------------------------------------
router.put('/:id', requireAuth, (req, res) => {
  try {
    // Verify ownership
    const wedding = getOne('SELECT * FROM weddings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found or access denied' });
    }

    const { template, coupleData, weddingDetails, colorPalette, fontPairing, avatars } = req.body;

    run(
      `UPDATE weddings
       SET template = ?,
           couple_data = ?,
           wedding_details = ?,
           color_palette = ?,
           font_pairing = ?,
           avatars = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
      [
        template ?? wedding.template,
        coupleData ? JSON.stringify(coupleData) : wedding.couple_data,
        weddingDetails ? JSON.stringify(weddingDetails) : wedding.wedding_details,
        colorPalette ?? wedding.color_palette,
        fontPairing ?? wedding.font_pairing,
        avatars ? JSON.stringify(avatars) : (wedding.avatars || '{}'),
        req.params.id,
      ]
    );

    res.json({ message: 'Wedding updated successfully' });
  } catch (err) {
    console.error('Update wedding error:', err);
    res.status(500).json({ error: 'Failed to update wedding' });
  }
});

// ------------------------------------------
// GET /api/weddings/:id/public — Public access (for guests)
// ------------------------------------------
router.get('/:id/public', (req, res) => {
  try {
    const wedding = getOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]);

    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Get events for this wedding
    const events = getAll('SELECT * FROM events WHERE wedding_id = ? ORDER BY sort_order', [req.params.id]);

    res.json({
      id: wedding.id,
      template: wedding.template,
      coupleData: JSON.parse(wedding.couple_data),
      weddingDetails: JSON.parse(wedding.wedding_details),
      colorPalette: wedding.color_palette,
      fontPairing: wedding.font_pairing,
      avatars: wedding.avatars ? JSON.parse(wedding.avatars) : null,
      events,
    });
  } catch (err) {
    console.error('Public wedding error:', err);
    res.status(500).json({ error: 'Failed to fetch wedding' });
  }
});

export default router;
