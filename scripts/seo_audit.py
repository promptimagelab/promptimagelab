#!/usr/bin/env python3
"""Simple SEO audit for local static site HTML files.
Scans for title, meta description, meta robots, canonical, H1, and image alts.
Writes a markdown report to seo_report.md in the workspace root.
"""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_GLOB = "*.html"

files = sorted(ROOT.glob("*.html"))

def extract(regex, text):
    m = re.search(regex, text, re.I | re.S)
    return m.group(1).strip() if m else None

def count_imgs_missing_alts(text):
    imgs = re.findall(r"<img\b[^>]*>", text, re.I)
    missing = 0
    for tag in imgs:
        if re.search(r"\balt\s*=\s*\".*?\"", tag):
            alt = re.search(r"\balt\s*=\s*\"(.*?)\"", tag, re.I)
            if alt and alt.group(1).strip() == "":
                missing += 1
        elif re.search(r"\balt\s*=\s*'.*?'", tag):
            alt = re.search(r"\balt\s*=\s*'(.*?)'", tag, re.I)
            if alt and alt.group(1).strip() == "":
                missing += 1
        else:
            missing += 1
    return len(imgs), missing

report_lines = ["# SEO Audit Report\n"]
summary = {"pages": 0, "missing_description": 0, "missing_h1": 0, "pages_noindex": 0}

for f in files:
    summary['pages'] += 1
    text = f.read_text(encoding='utf-8')
    title = extract(r"<title>(.*?)</title>", text)
    desc = extract(r"<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']", text)
    robots = extract(r"<meta\s+name=[\"']robots[\"']\s+content=[\"'](.*?)[\"']", text)
    canonical = extract(r"<link\s+rel=[\"']canonical[\"']\s+href=[\"'](.*?)[\"']", text)
    h1 = extract(r"<h1\b[^>]*>(.*?)</h1>", text)
    imgs_total, imgs_missing = count_imgs_missing_alts(text)

    if not desc:
        summary['missing_description'] += 1
    if not h1:
        summary['missing_h1'] += 1
    if robots and 'noindex' in robots.lower():
        summary['pages_noindex'] += 1

    report_lines.append(f"## {f.name}\n")
    report_lines.append(f"- Title: {title or 'MISSING'}\n")
    report_lines.append(f"- Meta description: {('PRESENT' if desc else 'MISSING')}\n")
    if desc:
        report_lines.append(f"  - length: {len(desc)} chars\n")
    report_lines.append(f"- Meta robots: {robots or 'MISSING'}\n")
    report_lines.append(f"- Canonical: {canonical or 'MISSING'}\n")
    report_lines.append(f"- H1: {('PRESENT' if h1 else 'MISSING')}\n")
    report_lines.append(f"- Images: {imgs_total} total, {imgs_missing} missing/empty alt\n\n")

report_lines.append("---\n")
report_lines.append(f"Pages scanned: {summary['pages']}\n")
report_lines.append(f"Pages missing meta description: {summary['missing_description']}\n")
report_lines.append(f"Pages missing H1: {summary['missing_h1']}\n")
report_lines.append(f"Pages with meta robots noindex: {summary['pages_noindex']}\n")

out_md = ROOT / 'seo_report.md'
out_md.write_text('\n'.join(report_lines), encoding='utf-8')
print(f"Wrote report to: {out_md}")
