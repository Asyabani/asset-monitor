// Skema SQLite Rilis 1. Idempoten (IF NOT EXISTS) — dijalankan saat koneksi dibuka.
// Pindah ke Postgres di Tahap 2 saat ada akun & cron (rilis-1-teknis.md §3).
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS check_batch (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT UNIQUE NOT NULL,
  mode         TEXT NOT NULL,                       -- 'single' | 'bulk'
  domain_count INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',     -- 'pending' | 'done'
  ip_hash      TEXT,                                -- hash+salt, BUKAN IP mentah (higiene PDP)
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS check_result (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id      INTEGER NOT NULL REFERENCES check_batch(id),
  input_raw     TEXT NOT NULL,
  checked_as    TEXT,
  domain_expiry TEXT,                               -- ISO 'YYYY-MM-DD'
  registrar     TEXT,
  ssl_expiry    TEXT,
  ssl_issuer    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',    -- 'pending' sampai worker selesai
  note          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_result_batch ON check_result(batch_id);

CREATE TABLE IF NOT EXISTS waitlist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL,
  batch_id   INTEGER REFERENCES check_batch(id),    -- domain yang dia tempel = data cold-start Tahap 2
  source     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS domain_cache (
  domain        TEXT PRIMARY KEY,                   -- registrable domain
  domain_expiry TEXT,
  registrar     TEXT,
  ssl_expiry    TEXT,
  ssl_issuer    TEXT,
  fetched_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,                         -- batch_created | batch_completed | result_viewed | share_clicked | waitlist_signup
  batch_id   INTEGER,
  props      TEXT,                                  -- JSON ringkas
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;
