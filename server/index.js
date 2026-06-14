// =========================================
// EternalVow — Express Server Entry Point
// =========================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { initDb, closeDb } from './db/database.js';
import { securityHeaders, sanitizeBody } from './middleware/security.js';
import { apiLimiter, authLimiter, rsvpLimiter } from './middleware/rateLimiter.js';
import {
  behaviorAnalysis,
  csrfTokenEndpoint,
  issueChallenge,
  getThreatStats,
} from './middleware/botProtection.js';
import authRoutes from './routes/auth.js';
import weddingRoutes from './routes/weddings.js';
import guestRoutes from './routes/guests.js';
import eventRoutes from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------------------------------
// Security Middleware (applied first)
// ------------------------------------------
app.disable('x-powered-by'); // Don't reveal server technology
app.use(securityHeaders);

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsing with size limit to prevent large payload attacks
app.use(express.json({ limit: '1mb' }));

// Sanitize all string inputs to prevent stored XSS
app.use(sanitizeBody);

// Behavioral analysis — detects bots, rapid-fire, missing headers
app.use(behaviorAnalysis);

// Global API rate limit
app.use('/api', apiLimiter);

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// ------------------------------------------
// Security Endpoints
// ------------------------------------------
app.get('/api/csrf-token', csrfTokenEndpoint);
app.get('/api/challenge', issueChallenge);

// Threat stats (protected — only for authenticated admins)
app.get('/api/admin/threats', (req, res) => {
  // In production, add admin auth check here
  res.json(getThreatStats());
});

// ------------------------------------------
// Routes (with per-route rate limiting)
// ------------------------------------------

// Auth routes — stricter rate limits (10 req/15 min)
app.use('/api/auth', authLimiter, authRoutes);

// Wedding routes — standard API limits
app.use('/api/weddings', weddingRoutes);

// Guest routes — RSVP endpoint has its own limiter + bot protection
app.use('/api', guestRoutes);

// Event routes
app.use('/api', eventRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback for API routes
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler — prevent stack traces from leaking
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ------------------------------------------
// Initialize & Start
// ------------------------------------------
async function start() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`
  ╔══════════════════════════════════════╗
  ║    EternalVow API Server             ║
  ║    Running on http://localhost:${PORT}  ║
  ║    Bot Protection: ACTIVE ✓          ║
  ╚══════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});
