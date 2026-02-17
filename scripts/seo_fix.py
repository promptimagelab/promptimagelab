#!/usr/bin/env python3
"""Fixer for meta descriptions and Open Graph images in local HTML files.
- Trims meta description content to 155 characters (adds ellipsis if trimmed)
- Ensures a `meta property="og:image"` exists (defaults to site logo)
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OG = "https://promptimagelab.com/images/logo.png"

def fix_file(path: Path):
    text = path.read_text(encoding='utf-8')
    orig = text

    # Fix meta description length
    def repl_desc(m):
        prefix = m.group(1)
        content = m.group(2)
        suffix = m.group(3)
        if len(content) > 155:
            new = content[:152].rstrip() + '...'
            return f"{prefix}{new}{suffix}"
        return m.group(0)

    # Match meta tags where name="description" and capture the content value
    text = re.sub(r'''(<meta\s+[^>]*name=["']description["'][^>]*content=["'])(.*?)(["'][^>]*>)''', repl_desc, text, flags=re.I|re.S)

    # Ensure og:image present
    if not re.search(r'''<meta\s+property=["']og:image["']''', text, flags=re.I):
        # try to place after existing meta description, otherwise in head
        insert_tag = f'  <meta property="og:image" content="{DEFAULT_OG}">\n'
        if '</title>' in text:
            text = text.replace('</title>', '</title>\n' + insert_tag)
        elif '<head>' in text:
            text = text.replace('<head>', '<head>\n' + insert_tag)
        else:
            text = insert_tag + text

    if text != orig:
        path.write_text(text, encoding='utf-8')
        return True
    return False

def main():
    changed = []
    for f in sorted(ROOT.glob('*.html')):
        if f.name.endswith('.xml'):
            continue
        if fix_file(f):
            changed.append(f.name)
    if changed:
        print('Updated files:')
        for c in changed:
            print(' -', c)
    else:
        print('No changes needed.')

if __name__ == '__main__':
    main()
