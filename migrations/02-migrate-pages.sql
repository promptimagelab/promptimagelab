-- Run this migration to add Pages management to PromptImageLab
-- Command: npx wrangler d1 execute promptimagelab-db --remote --file=migrate-pages.sql

CREATE TABLE IF NOT EXISTS pages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key     TEXT UNIQUE NOT NULL,        -- 'home' | 'about' | 'contact' | 'privacy'
  meta_title   TEXT,                         -- <title> and og:title
  meta_desc    TEXT,                         -- <meta name="description">
  meta_keywords TEXT,                        -- <meta name="keywords">
  og_title     TEXT,                         -- Open Graph title override
  og_desc      TEXT,                         -- Open Graph description override
  og_image     TEXT,                         -- og:image URL (1200x630)
  schema_type  TEXT DEFAULT 'WebPage',       -- JSON-LD @type
  sections_json TEXT,                        -- JSON blob: all editable section content
  updated_at   TEXT DEFAULT (datetime('now'))
);
