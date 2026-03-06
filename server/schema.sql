-- Sneakr.lab - PostgreSQL schema for designs and users
-- Run once: psql $DATABASE_URL -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  subscription  TEXT NOT NULL DEFAULT 'free' CHECK (subscription IN ('free', 'premium')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS designs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  design     JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs (user_id);
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs (created_at DESC);
