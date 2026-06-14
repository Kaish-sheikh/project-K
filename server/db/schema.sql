-- =========================================
-- EternalVow — Database Schema
-- =========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Weddings table (one per user)
CREATE TABLE IF NOT EXISTS weddings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'serenity',
  couple_data TEXT NOT NULL DEFAULT '{}',       -- JSON: partner1, partner2, hashtag, story
  wedding_details TEXT NOT NULL DEFAULT '{}',   -- JSON: date, venue, dressCode
  color_palette INTEGER NOT NULL DEFAULT 0,
  font_pairing INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Guests / RSVP submissions
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rsvp TEXT NOT NULL DEFAULT 'pending',         -- 'attending', 'declined', 'pending'
  attending INTEGER DEFAULT 0,                  -- boolean: 1 = yes, 0 = no
  guests_count INTEGER NOT NULL DEFAULT 1,
  meal TEXT,
  dietary TEXT,
  message TEXT DEFAULT '',
  song_request TEXT DEFAULT NULL,
  submitted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- Wedding events (ceremony, reception, brunch, etc.)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL,
  name TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT,
  address TEXT,
  description TEXT,
  icon TEXT DEFAULT 'calendar',
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weddings_user_id ON weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_events_wedding_id ON events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
