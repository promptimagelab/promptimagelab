# PromptImageLab — Full Project

## Folder Structure
```
public/          → Static HTML pages (deploy to Cloudflare Pages)
functions/api/   → Cloudflare Pages Functions (API endpoints)
migrations/      → D1 database SQL files (run in order 01→08)
wrangler.toml    → Cloudflare config
```

## Deploy Steps

### 1. Run DB migrations via Cloudflare D1 Console
Go to: dash.cloudflare.com → Storage & Databases → D1 → promptimagelab-db → Console
Paste each file in order and click Execute:
  01-schema.sql
  02-migrate-pages.sql
  03-restore-instagram-dp.sql
  04-restore-anime-avatars.sql
  05-restore-ceo-portraits.sql
  06-restore-corporate-portraits.sql
  07-restore-all-platform-dp.sql
  08-restore-bw-instagram-dp.sql

### 2. Deploy via CLI
  npx wrangler pages deploy public --project-name=promptimagelab

### 3. Verify DB
  SELECT slug, word_count, length(content) as chars FROM prompts WHERE status='published';
  Expected: chars = 21000-30000 per row

## Notes
- about.html and contact.html are SEO-enhanced versions
- Migrations 03-08 restore full content + new SEO sections to all prompt pages
