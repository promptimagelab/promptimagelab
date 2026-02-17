import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html_files = list(root.glob('*.html'))
changed = []

# Patterns handle both single and double quotes
patterns = [
    # href="/#anchor" -> href="index.html#anchor"
    (re.compile(r'href=(?P<q>["\"])#?(?P<path>[^"\']*)?(?P=q)', re.IGNORECASE), None),
]

# We'll apply a specific ordered set of replacements
for fp in html_files:
    text = fp.read_text(encoding='utf-8')
    orig = text

    # 1. href="/#anchor" or href='/#anchor' -> href="index.html#anchor"
    text = re.sub(r'href=(?P<q>["\"])#(?P<anchor>[^"\']*)(?P=q)', r'href="index.html#\g<anchor>"', text)
    text = re.sub(r"href=(?P<q>[\"'])/\#(?P<anchor>[^\"']*)(?P=q)", r'href=\g<q>index.html#\g<anchor>\g<q>', text)

    # 2. exact href="/" -> href="index.html"
    text = re.sub(r'href=(?P<q>["\"])\/(?P=q)', r'href=\g<q>index.html\g<q>', text)

    # 3. href="/some-page.html" -> href="some-page.html" (exclude /assets and /images and leading slashes to assets)
    text = re.sub(r'href=(?P<q>["\"])\/(?!assets|images)(?P<path>[^"\']*)(?P=q)', r'href=\g<q>\g<path>\g<q>', text)

    # 4. Also handle plain anchor forms that start with /# (if any left)
    text = re.sub(r'href=(?P<q>["\"])\/#(?P<anchor>[^"\']*)(?P=q)', r'href=\g<q>index.html#\g<anchor>\g<q>', text)

    if text != orig:
        fp.write_text(text, encoding='utf-8')
        changed.append(fp.name)

print(f"Updated {len(changed)} files:\n" + "\n".join(changed))
