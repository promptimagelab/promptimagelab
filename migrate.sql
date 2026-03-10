-- Add new columns to existing prompts table (safe, won't fail if already exists)
ALTER TABLE prompts ADD COLUMN excerpt       TEXT;
ALTER TABLE prompts ADD COLUMN tags          TEXT;
ALTER TABLE prompts ADD COLUMN meta_title    TEXT;
ALTER TABLE prompts ADD COLUMN focus_keyword TEXT;
ALTER TABLE prompts ADD COLUMN canonical_url TEXT;
ALTER TABLE prompts ADD COLUMN og_image      TEXT;
ALTER TABLE prompts ADD COLUMN schema_type   TEXT DEFAULT 'Article';
ALTER TABLE prompts ADD COLUMN reading_time  INTEGER DEFAULT 5;
ALTER TABLE prompts ADD COLUMN word_count    INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN views         INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN featured      INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN status        TEXT DEFAULT 'published';
ALTER TABLE prompts ADD COLUMN author        TEXT DEFAULT 'PromptImageLab';

-- Create sessions table if not exists
CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);

-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_prompts_slug     ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_status   ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(featured);
CREATE INDEX IF NOT EXISTS idx_prompts_created  ON prompts(created_at DESC);

-- Set all existing posts as published
UPDATE prompts SET status='published' WHERE status IS NULL;

-- Update word counts for existing posts
UPDATE prompts SET reading_time=5 WHERE reading_time IS NULL OR reading_time=0;

-- Insert site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
('site_name',    'PromptImageLab'),
('ga_id',        'G-MGTDGLQPSH'),
('adsense_id',   'ca-pub-6771008610152378');

-- Update existing prompts with excerpts and meta_desc if missing
UPDATE prompts SET excerpt = meta_desc WHERE excerpt IS NULL AND meta_desc IS NOT NULL;
UPDATE prompts SET featured = 1 WHERE slug IN (
  'instagram-dp-ai-prompts',
  'anime-avatars',
  'ceo-style-portrait-prompts',
  'ai-profile-picture-dp-prompts'
);