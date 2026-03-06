/**
 * Sneakr.lab - SQLite database
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'sneakrlab.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    subscription TEXT NOT NULL DEFAULT 'free' CHECK (subscription IN ('free', 'premium')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS designs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    design TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
  CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);
`;

schema.split(';').forEach(stmt => {
  if (stmt.trim()) {
    db.exec(stmt);
  }
});

export default db;
