// =========================================
// EternalVow — Database Initialization (sql.js)
// =========================================

import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'eternalvow.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

let db = null;

/**
 * Initialize the database. Must be called once at startup (async).
 */
export async function initDb() {
  const SQL = await initSqlJs();

  // Load existing DB file or create new
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Run schema
  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  db.run(schema);
  saveDb();

  console.log('✓ Database initialized at', DB_PATH);
  return db;
}

/**
 * Persist the in-memory database to disk.
 */
export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  }
}

/**
 * Get the database instance (must call initDb first).
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

/**
 * Close the database.
 */
export function closeDb() {
  if (db) {
    saveDb();
    db.close();
    db = null;
  }
}

// ------------------------------------------
// Helper functions to bridge sql.js API
// ------------------------------------------

/**
 * Run a query that doesn't return results (INSERT, UPDATE, DELETE).
 */
export function run(sql, params = []) {
  const database = getDb();
  database.run(sql, params);
  saveDb();
}

/**
 * Get a single row from a query.
 */
export function getOne(sql, params = []) {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    result = {};
    columns.forEach((col, i) => {
      result[col] = values[i];
    });
  }
  stmt.free();
  return result;
}

/**
 * Get all rows from a query.
 */
export function getAll(sql, params = []) {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    results.push(row);
  }
  stmt.free();
  return results;
}
