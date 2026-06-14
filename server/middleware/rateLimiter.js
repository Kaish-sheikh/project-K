// =========================================
// EternalVow — Rate Limiter Middleware
// =========================================
// Simple in-memory rate limiter. No external deps.

/**
 * Creates a rate limiting middleware.
 * @param {object} options
 * @param {number} options.windowMs — Time window in milliseconds
 * @param {number} options.max — Max requests per window per IP
 * @param {string} options.message — Error message when rate limited
 */
export function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) {
  const hits = new Map(); // IP -> { count, resetTime }

  // Clean up expired entries every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of hits) {
      if (now > value.resetTime) {
        hits.delete(key);
      }
    }
  }, 60_000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now > record.resetTime) {
      // New window
      hits.set(ip, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      return next();
    }

    record.count++;

    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({ error: message });
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - record.count);
    next();
  };
}

/**
 * Strict rate limiter for auth endpoints (login/register).
 * 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

/**
 * Moderate rate limiter for public RSVP submissions.
 * 20 submissions per 15 minutes per IP.
 */
export const rsvpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many RSVP submissions. Please try again later.',
});

/**
 * General API rate limiter.
 * 200 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
