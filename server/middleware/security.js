// =========================================
// EternalVow — Security Middleware
// =========================================

/**
 * Sets standard HTTP security headers.
 * Lightweight alternative to 'helmet' with zero dependencies.
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS filter (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Don't leak referrer info to external sites
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Prevent caching of API responses with auth data
  if (req.headers.authorization) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
  }

  // Content Security Policy for API responses
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

  // Strict Transport Security (only useful behind HTTPS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
}

/**
 * Sanitizes string input — strips HTML tags and trims whitespace.
 * Prevents stored XSS when data is rendered on the frontend.
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/&lt;/g, '<')            // Decode common entities for stripping
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')          // Strip again after decode
    .trim();
}

/**
 * Middleware that sanitizes all string fields in req.body.
 */
export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  next();
}

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      // Don't sanitize password fields
      if (key === 'password' || key === 'password_hash') continue;
      obj[key] = sanitizeString(obj[key]);
    } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      sanitizeObject(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item, i) => {
        if (typeof item === 'string') {
          obj[key][i] = sanitizeString(item);
        } else if (item && typeof item === 'object') {
          sanitizeObject(item);
        }
      });
    }
  }
}

/**
 * Validates email format.
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates that a string doesn't exceed a max length.
 */
export function isValidLength(str, max = 1000) {
  return typeof str === 'string' && str.length <= max;
}
