-- MathBits Supabase Schema
-- Run this in your Supabase SQL editor to create all required tables.

-- ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backgrounds (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  code        TEXT        NOT NULL,   -- self-contained HTML string
  tags        TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COLOR CHECKER ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS color_checker (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  code        TEXT        NOT NULL,
  tags        TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TEXT ANIMATIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS text_animations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  code        TEXT        NOT NULL,
  tags        TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ANIMATIONS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS animations (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  code        TEXT        NOT NULL,
  tags        TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY (public read) ────────────────────────────────────────
ALTER TABLE backgrounds     ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_checker   ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE animations      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read backgrounds"     ON backgrounds     FOR SELECT USING (true);
CREATE POLICY "Public read color_checker"   ON color_checker   FOR SELECT USING (true);
CREATE POLICY "Public read text_animations" ON text_animations FOR SELECT USING (true);
CREATE POLICY "Public read animations"      ON animations      FOR SELECT USING (true);
