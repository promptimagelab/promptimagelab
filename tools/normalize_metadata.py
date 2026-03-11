#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Patterns to adjust:
# 1) <link rel="canonical" href="https://promptimagelab.com/page.html"> -> remove .html
# 2) <link rel="alternate" hreflang=.. href="https://promptimagelab.com/page.html"> -> remove .html
# 3) <meta property="og:url" content="https://promptimagelab.com/page.html"> -> remove .html
# 4) JSON-LD occurrences of "https://promptimagelab.com/page.html" or "/page.html" -> remove .html

ABS_HTML = re.compile(r'(https?://promptimagelab\.com/)([^"\/#\s>\?]+?)\.html(?=["\'\/#\s>\?])', re.I)
ROOT_HTML = re.compile(r'href=(?P<q>["\'])(/[^"\']+?)\.html(?P=q)')
OG_HTML = re.compile(r'(<meta[^>]+property=["\']og:url["\'][^>]+content=["\'])(https?://promptimagelab\.com/[^"\']+?)\.html(["\'])', re.I)
CANON_HTML = re.compile(r'(<link[^>]+rel=["\']canonical["\'][^>]+href=["\'])(https?://promptimagelab\.com/[^"\']+?)\.html(["\'])', re.I)
ALT_HTML = re.compile(r'(<link[^>]+rel=["\']alternate["\'][^>]+href=["\'])(https?://promptimagelab\.com/[^"\']+?)\.html(["\'])', re.I)

def replace_file(path: Path):
    text = path.read_text(encoding='utf-8')
    orig = text

    # Canonical links
    text = CANON_HTML.sub(lambda m: f"{m.group(1)}{m.group(2)}{m.group(3)}", text)
    # Alternate hreflang absolute URLs
    text = ALT_HTML.sub(lambda m: f"{m.group(1)}{m.group(2)}{m.group(3)}", text)
    # og:url
    text = OG_HTML.sub(lambda m: f"{m.group(1)}{m.group(2)}{m.group(3)}", text)
    # Any absolute promptimagelab .html in JSON-LD or elsewhere
    text = ABS_HTML.sub(lambda m: f"{m.group(1)}{m.group(2)}", text)
    # root-relative href="/page.html" -> "/page"
    text = ROOT_HTML.sub(lambda m: f'href={m.group("q")}{m.group(2)}{m.group("q")}', text)

    if text != orig:
        backup = path.with_suffix(path.suffix + '.meta.bak')
        backup.write_text(orig, encoding='utf-8')
        path.write_text(text, encoding='utf-8')
        return True
    return False

def main():
    html_files = sorted(ROOT.glob('*.html'))
    modified = []
    for f in html_files:
        # skip backup-like or variant files
        if f.name.count('.') > 1 and not f.name.endswith('.original.html'):
            continue
        if replace_file(f):
            modified.append(str(f.name))

    if modified:
        print('Modified metadata in:')
        for m in modified:
            print('-', m)
    else:
        print('No metadata changes needed')

if __name__ == '__main__':
    main()
