// =========================================
// EternalVow — Utility Helpers
// =========================================

/**
 * Calculate countdown to wedding date
 */
export function getCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  };
}

/**
 * Format a date string nicely
 */
export function formatDate(dateStr, style = 'long') {
  const date = new Date(dateStr);
  const options = {
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    monthDay: { month: 'long', day: 'numeric' },
  };
  return date.toLocaleDateString('en-US', options[style] || options.long);
}

/**
 * Generate initials from names
 */
export function getInitials(name1, name2) {
  return `${name1.charAt(0)}${name2 ? ' & ' + name2.charAt(0) : ''}`;
}

/**
 * Smooth scroll to element
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Generate a gradient string from colors
 */
export function createGradient(color1, color2, angle = 135) {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

/**
 * Debounce function for scroll events
 */
export function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * RSVP stats from guest list
 */
export function getRSVPStats(guests) {
  const total = guests.length;
  const attending = guests.filter(g => g.rsvp === 'attending');
  const declined = guests.filter(g => g.rsvp === 'declined');
  const pending = guests.filter(g => g.rsvp === 'pending');
  const totalGuests = attending.reduce((sum, g) => sum + g.guests, 0);

  const meals = {};
  attending.forEach(g => {
    if (g.meal) {
      meals[g.meal] = (meals[g.meal] || 0) + 1;
    }
  });

  return {
    total,
    attending: attending.length,
    declined: declined.length,
    pending: pending.length,
    totalGuests,
    meals,
    attendingPercent: total > 0 ? Math.round((attending.length / total) * 100) : 0,
  };
}
