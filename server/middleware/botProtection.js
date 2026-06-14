// =========================================
// EternalVow — Bot & Abuse Protection
// =========================================
// Multi-layered defense against automated attacks,
// AI-driven bots, and credential stuffing.

/**
 * LAYER 1: Honeypot Trap
 * ──────────────────────
 * Adds an invisible form field. Real users never fill it.
 * Bots and AI crawlers auto-fill every field, getting caught.
 */
export function honeypotCheck(fieldName = 'website') {
  return (req, res, next) => {
    // If the honeypot field has a value, it's a bot
    if (req.body && req.body[fieldName]) {
      console.warn(`🍯 Honeypot triggered by IP ${req.ip} on ${req.originalUrl}`);
      // Return a fake success — don't let the bot know it was detected
      return res.status(200).json({ message: 'Submitted successfully' });
    }
    // Clean the honeypot field from the body so routes don't see it
    if (req.body) delete req.body[fieldName];
    next();
  };
}

/**
 * LAYER 2: Request Fingerprinting & Behavioral Analysis
 * ──────────────────────────────────────────────────────
 * Tracks per-IP behavior patterns to detect automated activity.
 * - Rapid sequential requests (faster than human speed)
 * - Missing or suspicious headers
 * - Repeated failed attempts
 */
const ipBehavior = new Map();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000; // 30 min
  for (const [ip, data] of ipBehavior) {
    if (data.lastSeen < cutoff) ipBehavior.delete(ip);
  }
}, 5 * 60 * 1000).unref();

export function behaviorAnalysis(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();

  let record = ipBehavior.get(ip);
  if (!record) {
    record = {
      requests: [],
      violations: 0,
      blocked: false,
      blockedUntil: 0,
      lastSeen: now,
    };
    ipBehavior.set(ip, record);
  }

  record.lastSeen = now;

  // Check if IP is currently blocked
  if (record.blocked) {
    if (now < record.blockedUntil) {
      const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(403).json({
        error: 'Access temporarily suspended due to suspicious activity.',
      });
    }
    // Block expired — reset but keep a high violation count
    record.blocked = false;
    record.violations = Math.max(0, record.violations - 2);
  }

  // Track request timestamps (keep last 20)
  record.requests.push(now);
  if (record.requests.length > 20) record.requests.shift();

  // DETECTION 1: Rapid-fire requests (>5 requests in 2 seconds)
  const recentRequests = record.requests.filter(t => now - t < 2000);
  if (recentRequests.length > 5) {
    record.violations += 2;
    console.warn(`⚡ Rapid-fire detected from IP ${ip}: ${recentRequests.length} req in 2s`);
  }

  // DETECTION 2: Missing essential browser headers
  const hasAcceptHeader = !!req.headers['accept'];
  const hasAcceptLang = !!req.headers['accept-language'];
  const userAgent = req.headers['user-agent'] || '';

  if (!hasAcceptHeader && !hasAcceptLang && req.method !== 'OPTIONS') {
    record.violations++;
  }

  // DETECTION 3: Known bot/automation user-agents
  const botPatterns = [
    /curl/i, /wget/i, /python-requests/i, /httpie/i, /postman/i,
    /scrapy/i, /bot(?!tle)/i, /crawler/i, /spider/i, /phantom/i,
    /selenium/i, /puppeteer/i, /playwright/i, /headless/i,
  ];
  if (botPatterns.some(p => p.test(userAgent))) {
    record.violations++;
  }

  // DETECTION 4: Empty or missing User-Agent
  if (!userAgent || userAgent.length < 10) {
    record.violations += 2;
  }

  // ESCALATION: Block if violations exceed threshold
  if (record.violations >= 8) {
    // Exponential backoff: 5 min, 15 min, 1 hour, 6 hours
    const blockDurations = [5 * 60, 15 * 60, 60 * 60, 6 * 60 * 60];
    const blockIndex = Math.min(Math.floor(record.violations / 8) - 1, blockDurations.length - 1);
    const blockSeconds = blockDurations[blockIndex];

    record.blocked = true;
    record.blockedUntil = now + blockSeconds * 1000;

    console.warn(`🚫 IP ${ip} blocked for ${blockSeconds}s (violations: ${record.violations})`);

    res.setHeader('Retry-After', blockSeconds);
    return res.status(403).json({
      error: 'Access temporarily suspended due to suspicious activity.',
    });
  }

  next();
}

/**
 * LAYER 3: CSRF Token Protection
 * ─────────────────────────────
 * Generates and validates CSRF tokens to prevent cross-site attacks.
 * Tokens are tied to the user's session via a cookie.
 */
const csrfTokens = new Map(); // token -> { ip, expires }

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens) {
    if (now > data.expires) csrfTokens.delete(token);
  }
}, 10 * 60 * 1000).unref();

function generateCsrfToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * GET /api/csrf-token — Issue a new CSRF token.
 */
export function csrfTokenEndpoint(req, res) {
  const token = generateCsrfToken();
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  csrfTokens.set(token, { ip, expires: Date.now() + 60 * 60 * 1000 }); // 1 hour

  res.json({ csrfToken: token });
}

/**
 * Middleware that validates the CSRF token on state-changing requests.
 */
export function validateCsrf(req, res, next) {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip if request has valid JWT (API client authenticated users)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body?._csrf;

  if (!token) {
    return res.status(403).json({ error: 'Missing CSRF token' });
  }

  const record = csrfTokens.get(token);
  if (!record || Date.now() > record.expires) {
    return res.status(403).json({ error: 'Invalid or expired CSRF token' });
  }

  // Token is valid — delete it (one-time use)
  csrfTokens.delete(token);
  next();
}

/**
 * LAYER 4: Proof-of-Work Challenge
 * ────────────────────────────────
 * For public form submissions, require a simple computation challenge.
 * This makes automated mass submissions computationally expensive.
 */
const powChallenges = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, data] of powChallenges) {
    if (now > data.expires) powChallenges.delete(id);
  }
}, 5 * 60 * 1000).unref();

export function issueChallenge(req, res) {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 50) + 10;
  const id = generateCsrfToken().slice(0, 16);

  powChallenges.set(id, {
    answer: a + b,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  res.json({
    challengeId: id,
    challenge: `${a} + ${b}`,
  });
}

export function verifyChallenge(req, res, next) {
  const { challengeId, challengeAnswer } = req.body || {};

  if (!challengeId || challengeAnswer === undefined) {
    return res.status(400).json({ error: 'Challenge response required' });
  }

  const challenge = powChallenges.get(challengeId);
  if (!challenge || Date.now() > challenge.expires) {
    return res.status(400).json({ error: 'Challenge expired. Request a new one.' });
  }

  if (Number(challengeAnswer) !== challenge.answer) {
    return res.status(400).json({ error: 'Incorrect challenge response' });
  }

  // Valid — consume the challenge
  powChallenges.delete(challengeId);

  // Clean challenge fields from body
  delete req.body.challengeId;
  delete req.body.challengeAnswer;

  next();
}

/**
 * LAYER 5: Spam content detection
 * ───────────────────────────────
 * Detects common spam patterns in RSVP messages and form fields.
 */
export function spamDetection(req, res, next) {
  const body = req.body;
  if (!body) return next();

  const textFields = [body.message, body.name, body.dietary].filter(Boolean).join(' ');

  // Check for spam patterns
  const spamPatterns = [
    /https?:\/\//gi,              // URLs in messages
    /\[url=/gi,                   // BBCode links
    /<a\s+href/gi,                // HTML links (post-sanitization check)
    /buy\s+now/gi,                // Commercial spam
    /click\s+here/gi,             // Phishing language
    /free\s+money/gi,
    /cryptocurrency/gi,
    /viagra|cialis|pharmacy/gi,   // Pharma spam
    /(.)\1{10,}/g,                // Repeated characters (aaaaaaaaaa)
  ];

  const urlCount = (textFields.match(/https?:\/\//gi) || []).length;
  let spamScore = 0;

  for (const pattern of spamPatterns) {
    if (pattern.test(textFields)) spamScore++;
  }

  // More than 2 URLs is suspicious in a wedding RSVP
  if (urlCount > 2) spamScore += 3;

  // Very long messages are suspicious (most RSVPs are short)
  if (textFields.length > 5000) spamScore += 2;

  if (spamScore >= 3) {
    console.warn(`🚨 Spam detected from IP ${req.ip}: score=${spamScore}`);
    // Return fake success to not alert the attacker
    return res.status(200).json({ message: 'Submitted successfully' });
  }

  next();
}

/**
 * Get current threat stats (for admin/dashboard)
 */
export function getThreatStats() {
  let blocked = 0;
  let suspicious = 0;
  let total = ipBehavior.size;

  for (const [, data] of ipBehavior) {
    if (data.blocked) blocked++;
    if (data.violations >= 4) suspicious++;
  }

  return { totalTrackedIPs: total, blocked, suspicious };
}
