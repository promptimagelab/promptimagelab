#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Match href="file.html" or href='file.html' but skip absolute or hash/mailto links
pattern = re.compile(r'href=(?P<q>["\'])(?!https?:|/|#|mailto:)(?P<path>[^"\']+?)\.html(?P=q)')

def replace_in_file(path: Path):
    text = path.read_text(encoding='utf-8')
    def repl(m):
        q = m.group('q')
        p = m.group('path')
        return f'href={q}/{p}{q}'
    new = pattern.sub(repl, text)
    if new != text:
        backup = path.with_suffix(path.suffix + '.bak')
        backup.write_text(text, encoding='utf-8')
        path.write_text(new, encoding='utf-8')
        return True
    return False

def main():
    html_files = list(ROOT.glob('*.html'))
    modified = []
    for f in html_files:
        if replace_in_file(f):
            modified.append(str(f.relative_to(ROOT)))
    if modified:
        print('Modified files:')
        for m in modified:
            print(m)
    else:
        print('No changes made')

if __name__ == '__main__':
    main()
