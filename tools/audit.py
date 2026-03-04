#!/usr/bin/env python3
"""SEO audit: check every HTML page for common issues."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
htmls = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))

issues = []

for fname in htmls:
    fpath = os.path.join(ROOT, fname)
    with open(fpath, encoding='utf-8', errors='replace') as f:
        html = f.read()

    row = []

    # 1. Canonical count
    cans = re.findall(r'<link\s[^>]*rel=["\']canonical["\'][^>]*>', html, re.I)
    if len(cans) != 1:
        row.append(f'CANONICAL={len(cans)}')

    # 2. Canonical must NOT contain .html
    for c in cans:
        if '.html' in c:
            row.append('CANONICAL_HAS_HTML')

    # 3. JSON-LD blocks
    ld_blocks = re.findall(r'<script\s+type=["\']application/ld\+json["\']', html, re.I)
    if len(ld_blocks) > 1:
        row.append(f'JSON-LD_BLOCKS={len(ld_blocks)}')

    # 4. Title count
    titles = re.findall(r'<title>.*?</title>', html, re.DOTALL | re.I)
    if len(titles) != 1:
        row.append(f'TITLE_COUNT={len(titles)}')

    # 5. Internal .html hrefs (excluding external)
    all_hrefs = re.findall(r'href="([^"]*)"', html)
    html_hrefs = [h for h in all_hrefs
                  if h.endswith('.html') and not h.startswith('http')]
    if html_hrefs:
        row.append(f'INTERNAL_HTML_HREFS={len(html_hrefs)}:{html_hrefs[:2]}')

    # 6. Duplicate og:image
    og_imgs = re.findall(r'<meta\s[^>]*property=["\']og:image["\'][^>]*>', html, re.I)
    if len(og_imgs) > 1:
        row.append(f'DUP_OG_IMAGE={len(og_imgs)}')

    # 7. Missing meta description
    descs = re.findall(r'<meta\s[^>]*name=["\']description["\'][^>]*>', html, re.I)
    if len(descs) == 0:
        row.append('NO_META_DESC')
    elif len(descs) > 1:
        row.append(f'DUP_META_DESC={len(descs)}')

    # 8. Related prompts section present?
    has_related = 'related-prompts' in html or 'Related AI Prompt' in html
    if not has_related:
        row.append('NO_RELATED_SECTION')

    # 9. robots meta
    robots = re.findall(r'<meta\s[^>]*name=["\']robots["\'][^>]*>', html, re.I)
    if len(robots) == 0:
        row.append('NO_ROBOTS_META')

    if row:
        issues.append((fname, row))

if issues:
    print(f"\nISSUES FOUND in {len(issues)}/{len(htmls)} pages:\n")
    for fname, row in issues:
        print(f"  {fname}:")
        for r in row:
            print(f"    - {r}")
else:
    print(f"\nALL CLEAN — {len(htmls)} pages audited, 0 issues\n")

print(f"\nTotal pages audited: {len(htmls)}")
