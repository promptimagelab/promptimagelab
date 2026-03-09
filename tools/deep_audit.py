#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deep content audit: word count, section presence, H1, unique title+desc per page.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import os, re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
htmls = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))

titles_seen   = {}
descs_seen    = {}
h1s_seen      = {}

thin_pages    = []
dup_titles    = []
dup_descs     = []

def strip_html(text):
    return re.sub(r'<[^>]+>', ' ', text)

def word_count(text):
    return len(re.findall(r'\w+', text))

def extract_between(tag, html):
    m = re.search(rf'<{tag}[^>]*>(.*?)</{tag}>', html, re.DOTALL | re.I)
    return m.group(1).strip() if m else ''

print(f"\n{'='*70}")
print(f"{'PAGE':<45} {'WORDS':>6}  {'H1':>4}  {'CANON':>5}  {'RLTD':>4}")
print(f"{'='*70}")

for fname in htmls:
    fpath = os.path.join(ROOT, fname)
    with open(fpath, encoding='utf-8', errors='replace') as f:
        html = f.read()

    # Word count (body text only)
    body_m = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.I)
    body_text = strip_html(body_m.group(1)) if body_m else strip_html(html)
    wc = word_count(body_text)

    # H1
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL | re.I)
    h1_text = strip_html(h1s[0]).strip() if h1s else 'MISSING'

    # Canonical
    canon_m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', html, re.I)
    canon = 'YES' if canon_m else 'NO'

    # Related
    has_related = 'YES' if ('Related AI Prompt' in html or 'related-prompts' in html) else 'NO'

    # Title
    title_m = re.search(r'<title>(.*?)</title>', html, re.DOTALL | re.I)
    title = title_m.group(1).strip() if title_m else 'MISSING'

    # Description
    desc_m = re.search(r'<meta\s[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']', html, re.I)
    desc = desc_m.group(1).strip() if desc_m else 'MISSING'

    # Duplicate checks
    if title in titles_seen:
        dup_titles.append((fname, titles_seen[title], title[:60]))
    else:
        titles_seen[title] = fname

    if desc in descs_seen:
        dup_descs.append((fname, descs_seen[desc], desc[:60]))
    else:
        descs_seen[desc] = fname

    if h1_text in h1s_seen:
        pass  # will report separately
    else:
        h1s_seen[h1_text] = fname

    if wc < 600:
        thin_pages.append((fname, wc))

    print(f"{fname:<45} {wc:>6}  {len(h1s):>4}  {canon:>5}  {has_related:>4}")

print(f"\n{'='*70}")

if thin_pages:
    print(f"\n⚠  THIN CONTENT ({len(thin_pages)} pages < 600 words):")
    for p, w in thin_pages:
        print(f"   {p}: {w} words")

if dup_titles:
    print(f"\n⚠  DUPLICATE TITLES ({len(dup_titles)}):")
    for a, b, t in dup_titles:
        print(f"   {a} == {b}: \"{t}\"")

if dup_descs:
    print(f"\n⚠  DUPLICATE DESCRIPTIONS ({len(dup_descs)}):")
    for a, b, d in dup_descs:
        print(f"   {a} == {b}: \"{d}\"")

if not thin_pages and not dup_titles and not dup_descs:
    print("\n✅  ALL GOOD: no thin content, no duplicate titles/descs")

print()
