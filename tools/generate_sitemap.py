#!/usr/bin/env python3
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
CANON_RE = re.compile(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', re.I)

def find_canonical(file_path: Path):
    text = file_path.read_text(encoding='utf-8')
    matches = CANON_RE.findall(text)
    return matches

def infer_url(file_path: Path):
    if file_path.name == 'index.html':
        return 'https://promptimagelab.com/'
    return f'https://promptimagelab.com/{file_path.stem}'

def main():
    html_files = sorted(ROOT.glob('*.html'))
    url_list = []
    issues = []
    for f in html_files:
        # skip files that look like backups or non-canonical variants (have extra dots)
        if f.name.count('.') > 1:
            # record as skipped
            issues.append(f'{f.name}: skipped (filename contains extra dot)')
            continue
        matches = find_canonical(f)
        if not matches:
            inferred = infer_url(f)
            issues.append(f'{f.name}: missing canonical, inferred {inferred}')
            url = inferred
        elif len(matches) > 1:
            issues.append(f'{f.name}: multiple canonicals: {matches}')
            url = matches[0]
        else:
            url = matches[0]
        url_list.append((f.name, url))

    # unique preserve order
    seen = set()
    unique_urls = []
    for _, u in url_list:
        if u not in seen:
            unique_urls.append(u)
            seen.add(u)

    # Build sitemap.xml content
    now = datetime.utcnow().date().isoformat()
    sitemap_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for u in unique_urls:
        sitemap_lines.append('  <url>')
        sitemap_lines.append(f'    <loc>{u}</loc>')
        sitemap_lines.append(f'    <lastmod>{now}</lastmod>')
        sitemap_lines.append('  </url>')
    sitemap_lines.append('</urlset>')
    sitemap_content = '\n'.join(sitemap_lines) + '\n'

    sitemap_path = ROOT / 'sitemap.xml'
    # backup existing sitemap
    if sitemap_path.exists():
        sitemap_path.with_suffix('.xml.bak').write_text(sitemap_path.read_text(encoding='utf-8'), encoding='utf-8')
    sitemap_path.write_text(sitemap_content, encoding='utf-8')

    # Print brief report
    print('Sitemap written to', sitemap_path)
    print(f'URLs in sitemap: {len(unique_urls)}')
    if issues:
        print('\nSafety checks found issues:')
        for it in issues:
            print('-', it)
    else:
        print('\nSafety checks: no issues detected for canonical tags')

if __name__ == '__main__':
    main()
