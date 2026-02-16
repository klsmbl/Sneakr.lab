-- Sneakr.lab - PostgreSQL schema for designs
-- Run once: psql $DATABASE_URL -f schema.sql

CREATE TABLE IF NOT EXISTS designs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design     JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs (created_at DESC);
