"""
PromptImageLab — Dynamic CMS Builder (Safe)
============================================
Reads static HTML files from ./html/, extracts content,
and bulk-inserts them into the D1 database via wrangler.

Changes vs original:
  - Uses parameterised-style SQL with proper escaping (no raw f-string injection)
  - DOES NOT overwrite worker.js
  - Schema matches production schema.sql (includes canonical, word_count, status)
  - Skips files that fail parsing; prints a summary
  - Safe to re-run; uses INSERT OR IGNORE
"""

import os
import re
import base64
import subprocess
import json
from bs4 import BeautifulSoup
from tqdm import tqdm
from datetime import datetime, timezone

HTML_DIR = "html"
DB_NAME  = "promptimagelab_db"
OUT_SQL  = "data.sql"

SITE_URL = "https://promptimagelab.com"


# ----------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------

def sql_escape(value: str) -> str:
    """Escape a string value for safe embedding in a SQL literal."""
    if value is None:
        return ""
    return str(value).replace("'", "''").replace("\x00", "")


def slug_to_category(slug: str) -> str:
    """Derive a rough category from the slug for filtering support."""
    if any(k in slug for k in ("instagram", "whatsapp", "linkedin", "facebook")):
        return "social-media"
    if any(k in slug for k in ("anime", "romantic", "chibi")):
        return "anime"
    if any(k in slug for k in ("ceo", "corporate", "professional", "headshot", "resume")):
        return "professional"
    if any(k in slug for k in ("valentine", "couple")):
        return "seasonal"
    return "general"


def count_words(text: str) -> int:
    """Return approximate word count from visible text."""
    return len(re.findall(r"\w+", text))


def encode_content(html_str: str) -> str:
    """Base64-encode HTML content for safe D1 storage."""
    return base64.b64encode(html_str.encode("utf-8")).decode("ascii")


# ----------------------------------------------------------------
# Ensure wrangler is available
# ----------------------------------------------------------------

print("\n🚀 PromptImageLab CMS Builder (Safe)\n")
subprocess.run("wrangler --version", shell=True, check=False)


# ----------------------------------------------------------------
# Step 1: Apply schema (additive — safe to re-run)
# ----------------------------------------------------------------

print("\n📐 Applying schema...\n")
subprocess.run(
    f"wrangler d1 execute {DB_NAME} --file=schema.sql --remote",
    shell=True,
    check=False
)


# ----------------------------------------------------------------
# Step 2: Collect HTML files
# ----------------------------------------------------------------

if not os.path.isdir(HTML_DIR):
    print(f"❌ Directory '{HTML_DIR}' not found. Create it and add .html files.")
    raise SystemExit(1)

files = sorted(f for f in os.listdir(HTML_DIR) if f.endswith(".html"))
print(f"\n📂 Found {len(files)} HTML files in ./{HTML_DIR}/\n")


# ----------------------------------------------------------------
# Step 3: Parse HTML and build SQL
# ----------------------------------------------------------------

sql_statements = []
skipped        = []
now_iso        = datetime.now(timezone.utc).isoformat(timespec="seconds")

for fname in tqdm(files, desc="Parsing"):

    path = os.path.join(HTML_DIR, fname)

    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            raw = fh.read()
    except Exception as e:
        skipped.append((fname, str(e)))
        continue

    try:
        soup = BeautifulSoup(raw, "html.parser")
    except Exception as e:
        skipped.append((fname, f"parse error: {e}"))
        continue

    slug = fname.removesuffix(".html")  # Python 3.9+

    # ---- Meta extraction --------------------------------------

    title = (soup.title.get_text(strip=True) if soup.title else slug.replace("-", " ").title())

    desc_tag = soup.find("meta", attrs={"name": "description"})
    description = desc_tag.get("content", "") if desc_tag else ""

    canonical_url = f"{SITE_URL}/{slug}"

    body_tag   = soup.find("body")
    body_html  = str(body_tag) if body_tag else str(soup)
    word_count = count_words(soup.get_text())
    category   = slug_to_category(slug)
    status     = "published"
    encoded    = encode_content(body_html)

    # ---- Build INSERT -----------------------------------------
    # All values are escaped with sql_escape() — no raw f-string injection

    stmt = (
        "INSERT OR IGNORE INTO pages "
        "(slug, title, description, canonical, category, content, word_count, status, created_at, updated_at) "
        "VALUES ("
        f"'{sql_escape(slug)}', "
        f"'{sql_escape(title)}', "
        f"'{sql_escape(description)}', "
        f"'{sql_escape(canonical_url)}', "
        f"'{sql_escape(category)}', "
        f"'{sql_escape(encoded)}', "
        f"{word_count}, "
        f"'{sql_escape(status)}', "
        f"'{sql_escape(now_iso)}', "
        f"'{sql_escape(now_iso)}'"
        ");"
    )

    sql_statements.append(stmt)


# ----------------------------------------------------------------
# Step 4: Write SQL file
# ----------------------------------------------------------------

with open(OUT_SQL, "w", encoding="utf-8") as fh:
    fh.write("\n".join(sql_statements))

print(f"\n✅ Wrote {len(sql_statements)} INSERT statements to {OUT_SQL}")

if skipped:
    print(f"\n⚠️  Skipped {len(skipped)} file(s):")
    for fname, reason in skipped:
        print(f"   - {fname}: {reason}")


# ----------------------------------------------------------------
# Step 5: Upload to D1
# ----------------------------------------------------------------

print(f"\n📦 Uploading {len(sql_statements)} pages to D1...\n")
result = subprocess.run(
    f"wrangler d1 execute {DB_NAME} --file={OUT_SQL} --remote",
    shell=True,
    check=False
)

if result.returncode == 0:
    print("\n🎉 Database import complete!")
else:
    print("\n❌ Upload failed — check wrangler output above.")
    raise SystemExit(result.returncode)


# ----------------------------------------------------------------
# NOTE: worker.js is NOT touched by this script.
# Deploy your worker separately with:  wrangler deploy
# ----------------------------------------------------------------

print("\n👉 To deploy your worker:  wrangler deploy\n")