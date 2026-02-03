#!/usr/bin/env python3
"""
Simple HTML semantic validator for the workspace HTML files.
- Reports per-file issues: missing lang, title, description, canonical, robots, JSON-LD, og:image, <main>, <h1>, skip-link, images without alt
- Auto-fixes missing `lang` on the <html> tag by inserting `lang="en"` when absent
- Writes report to tools/seo_report.txt
"""
import re
from pathlib import Path

html_files = list(Path('.').glob('*.html'))
report_lines = []
updated = []

img_re = re.compile(r'<img\b[^>]*>', re.IGNORECASE)
html_tag_re = re.compile(r'<html\b([^>]*)>', re.IGNORECASE)

for p in html_files:
    text = p.read_text(encoding='utf-8')
    issues = []
    modified = False

    # html lang
    m = html_tag_re.search(text)
    if m:
        attrs = m.group(1)
        if 'lang=' not in attrs.lower():
            # insert lang="en" after <html
            def repl(mo):
                return '<html lang="en"' + mo.group(1) + '>'
            text_new = html_tag_re.sub(repl, text, count=1)
            text = text_new
            modified = True
            updated.append(p.name)
            issues.append('Added lang="en" to <html>')
    else:
        issues.append('No <html> tag found')

    # title
    if not re.search(r'<title>.*?</title>', text, re.IGNORECASE | re.DOTALL):
        issues.append('Missing <title>')

    # meta description
    if not re.search(r'<meta\s+name=["\']description["\']', text, re.IGNORECASE):
        issues.append('Missing meta description')

    # canonical
    if not re.search(r'<link\s+rel=["\']canonical["\']', text, re.IGNORECASE):
        issues.append('Missing canonical link')

    # meta robots
    if not re.search(r'<meta\s+name=["\']robots["\']', text, re.IGNORECASE):
        issues.append('Missing meta robots')

    # JSON-LD
    if 'application/ld+json' not in text:
        issues.append('Missing JSON-LD script')

    # og:image
    if not re.search(r'og:image', text, re.IGNORECASE):
        issues.append('Missing Open Graph image')

    # main element
    if not re.search(r'<main\b', text, re.IGNORECASE):
        issues.append('Missing <main> element')

    # h1
    if not re.search(r'<h1\b', text, re.IGNORECASE):
        issues.append('Missing <h1>')

    # skip-link
    if 'skip-link' not in text:
        issues.append('Missing skip-link for accessibility')

    # images without alt
    imgs = img_re.findall(text)
    imgs_missing_alt = 0
    for img_tag in imgs:
        if not re.search(r'\balt\s*=\s*["\']', img_tag, re.IGNORECASE):
            imgs_missing_alt += 1
    if imgs_missing_alt:
        issues.append(f'{imgs_missing_alt} <img> without alt')

    # write updated file if modified
    if modified:
        p.write_text(text, encoding='utf-8')

    # summarize
    report_lines.append(f'File: {p.name}')
    if issues:
        for it in issues:
            report_lines.append(' - ' + it)
    else:
        report_lines.append(' - OK')
    report_lines.append('')

# Write report
report_file = Path('tools/seo_report.txt')
report_file.parent.mkdir(parents=True, exist_ok=True)
report_header = ['SEO Validation Report', '====================', '']
if updated:
    report_header.append('Auto-fixed files (lang added):')
    for u in updated:
        report_header.append(' - ' + u)
    report_header.append('')

report = '\n'.join(report_header + report_lines)
report_file.write_text(report, encoding='utf-8')
print('Report written to', report_file)
