#!/usr/bin/env python3
"""Add empty alt attributes to <img> tags missing alt in workspace HTML files."""
import re
from pathlib import Path

html_files = list(Path('.').glob('*.html'))
img_re = re.compile(r'(<img\b)([^>]*?)(/?>)', re.IGNORECASE | re.DOTALL)

def fix_one(text: str) -> (str, int):
    count = 0
    def repl(m):
        nonlocal count
        before = m.group(1)
        attrs = m.group(2)
        close = m.group(3)
        if re.search(r'\balt\s*=\s*"', attrs, re.IGNORECASE):
            return m.group(0)
        # add empty alt attribute
        count += 1
        new = before + attrs + ' alt=""' + close
        return new
    new_text = img_re.sub(repl, text)
    return new_text, count

changed_files = []
for p in html_files:
    txt = p.read_text(encoding='utf-8')
    new_txt, n = fix_one(txt)
    if n > 0:
        p.write_text(new_txt, encoding='utf-8')
        changed_files.append((p.name, n))

if changed_files:
    for name, n in changed_files:
        print(f'Updated {name}: added alt to {n} images')
else:
    print('No images updated')
