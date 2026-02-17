import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'promptimagelab'
html_files = list(root.glob('*.html'))
changed = []

script_re = re.compile(r'(<script[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)', re.DOTALL | re.IGNORECASE)

for fp in html_files:
    text = fp.read_text(encoding='utf-8')
    orig = text

    def repl(m):
        open_tag, content, close_tag = m.group(1), m.group(2), m.group(3)
        c = content.strip()
        # If this script contains a simple Organization object (not an @graph), remove it.
        # Heuristic: contains '"@type"' and '"Organization"' and does NOT contain '"@graph"'.
        if '"@type"' in c and '"Organization"' in c and '"@graph"' not in c:
            return ''
        return m.group(0)

    text = script_re.sub(repl, text)

    if text != orig:
        fp.write_text(text, encoding='utf-8')
        changed.append(fp.name)

print(f"Removed standalone Organization scripts in {len(changed)} files:\n" + "\n".join(changed))
