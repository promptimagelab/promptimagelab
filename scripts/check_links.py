import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html_files = list(root.glob('*.html'))
all_files = {p.name for p in html_files}

href_pattern = re.compile(r'href=(?P<q>["\'])(?P<url>.*?\.html)(?P=q)', re.IGNORECASE)

referenced = set()
for fp in html_files:
    text = fp.read_text(encoding='utf-8')
    for m in href_pattern.finditer(text):
        url = m.group('url')
        # strip fragments
        url = url.split('#')[0]
        # ignore absolute URLs
        if url.startswith('http://') or url.startswith('https://'):
            continue
        # normalize
        referenced.add(url)

missing = sorted([r for r in referenced if r not in all_files])

print(f"Found {len(referenced)} referenced .html targets.")
if missing:
    print(f"Missing ({len(missing)}):")
    for m in missing:
        print(m)
else:
    print("No missing .html files found.")
