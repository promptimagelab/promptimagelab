/* ============================================================
   PromptImageLab — Production Schema
   Cloudflare D1 / SQLite
   ============================================================ */


/* ---- Main pages table --------------------------------------- */

CREATE TABLE IF NOT EXISTS pages (
  id          INTEGER  PRIMARY KEY AUTOINCREMENT,
  slug        TEXT     UNIQUE NOT NULL,
  title       TEXT     NOT NULL,
  description TEXT,
  canonical   TEXT,
  category    TEXT,
  tags        TEXT,                       -- JSON array e.g. '["anime","avatar"]'
  content     TEXT,                       -- Base64-encoded HTML body fragment
  word_count  INTEGER  DEFAULT 0,
  status      TEXT     DEFAULT 'published'
                       CHECK (status IN ('draft', 'published', 'archived')),
  related     TEXT,                       -- JSON array of related slugs (pre-computed)
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);


/* ---- Indexes for common query patterns --------------------- */

CREATE INDEX IF NOT EXISTS idx_pages_slug     ON pages (slug);
CREATE INDEX IF NOT EXISTS idx_pages_status   ON pages (status);
CREATE INDEX IF NOT EXISTS idx_pages_category ON pages (category);
CREATE INDEX IF NOT EXISTS idx_pages_updated  ON pages (updated_at DESC);


/* ---- Prompts table (decomposed from HTML blobs) ------------ */

CREATE TABLE IF NOT EXISTS prompts (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id  INTEGER NOT NULL REFERENCES pages (id) ON DELETE CASCADE,
  title    TEXT,
  body     TEXT    NOT NULL,
  tags     TEXT,                          -- JSON array
  position INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prompts_page ON prompts (page_id);


/* ---- Categories table -------------------------------------- */

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    UNIQUE NOT NULL,
  name        TEXT    NOT NULL,
  description TEXT,
  position    INTEGER DEFAULT 0
);


/* ---- Trigger: auto-update updated_at ----------------------- */

CREATE TRIGGER IF NOT EXISTS pages_updated_at
  AFTER UPDATE ON pages
  FOR EACH ROW
BEGIN
  UPDATE pages SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
