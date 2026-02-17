import re
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'promptimagelab'
html_files = [p for p in root.glob('*.html') if p.name != 'index.html']

script_re = re.compile(r'(<script[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)', re.DOTALL | re.IGNORECASE)

def extract_meta(text, name):
    # Find a meta tag with name or property matching `name`, then extract its content attribute.
    m = re.search(r'<meta[^>]*\b(?:name|property)=["\']' + re.escape(name) + r'["\'][^>]*>', text, re.IGNORECASE)
    if m:
        tag = m.group(0)
        m2 = re.search(r'content=["\']([^"\']+)["\']', tag, re.IGNORECASE)
        if m2:
            return m2.group(1).strip()
    return None


def replace_org(node):
    """Recursively replace any Organization object with a reference to the canonical org @id.
    Returns (new_node, changed_flag).
    """
    changed = False
    if isinstance(node, dict):
        t = node.get('@type')
        types = []
        if isinstance(t, list):
            types = t
        elif isinstance(t, str):
            types = [t]
        if 'Organization' in types:
            return ({'@id': 'https://promptimagelab.com/#organization'}, True)
        new = {}
        for k, v in node.items():
            rv, ch = replace_org(v)
            if ch:
                changed = True
            new[k] = rv
        return (new, changed)
    elif isinstance(node, list):
        new_list = []
        for item in node:
            rv, ch = replace_org(item)
            if ch:
                changed = True
            new_list.append(rv)
        return (new_list, changed)
    else:
        return (node, False)


changed = []
for fp in html_files:
    text = fp.read_text(encoding='utf-8')
    orig = text

    # get canonical (robust extraction without complex quote patterns)
    m_can = re.search(r'<link[^>]*\brel=[^>]*canonical[^>]*>', text, re.IGNORECASE)
    canonical = None
    if m_can:
        tag = m_can.group(0)
        m_href = re.search(r'href=["\']([^"\']+)["\']', tag)
        if m_href:
            canonical = m_href.group(1).strip()
    if not canonical:
        canonical = f"https://promptimagelab.com/{fp.name}"
    title = None
    m_title = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
    if m_title:
        title = m_title.group(1).strip()
    if not title:
        title = extract_meta(text, 'og:title') or extract_meta(text, 'twitter:title') or fp.stem.replace('-', ' ').title()
    og_image = extract_meta(text, 'og:image') or extract_meta(text, 'twitter:image')

    # collect existing JSON-LD content
    graphs = []
    scripts = []
    any_replaced = False
    for m in script_re.finditer(text):
        scripts.append((m.start(), m.end(), m.group(0), m.group(2)))
        raw = m.group(2).strip()
        try:
            data = json.loads(raw)
        except Exception:
            # skip unparseable blocks
            continue

        # replace nested Organization objects in parsed JSON
        data_replaced, ch = replace_org(data)
        if ch:
            any_replaced = True

        data = data_replaced

        if isinstance(data, dict):
            if '@graph' in data and isinstance(data['@graph'], list):
                graphs.extend(data['@graph'])
            else:
                graphs.append(data)
        elif isinstance(data, list):
            graphs.extend(data)

    # After replacement, ensure there are no Organization objects remaining at top-level
    filtered = []
    for obj in graphs:
        if isinstance(obj, dict):
            t = obj.get('@type')
            types = []
            if isinstance(t, list):
                types = t
            elif isinstance(t, str):
                types = [t]
            if 'Organization' in types:
                # drop explicit Organization objects (we'll reference by @id)
                any_replaced = True
                continue
        filtered.append(obj)

    # ensure a WebPage object exists and references site @id
    webpage_id = (canonical.rstrip('/') + '#webpage') if not canonical.endswith('/') else (canonical + '#webpage')
    has_webpage = False
    for obj in filtered:
        if isinstance(obj, dict) and obj.get('@type') == 'WebPage':
            obj['url'] = canonical
            obj['@id'] = webpage_id
            obj.setdefault('isPartOf', {'@id': 'https://promptimagelab.com/#website'})
            has_webpage = True
    if not has_webpage:
        wp = {
            '@type': 'WebPage',
            '@id': webpage_id,
            'url': canonical,
            'name': title,
            'isPartOf': {'@id': 'https://promptimagelab.com/#website'}
        }
        if og_image:
            wp['image'] = og_image
        filtered.insert(0, wp)

    # Build final @graph: pages reference Organization/WebSite by @id only
    final = {'@context': 'https://schema.org', '@graph': filtered}
    final_json = json.dumps(final, indent=2, ensure_ascii=False)

    # If we changed anything or there were existing schema scripts, replace them with consolidated one
    if any_replaced or scripts:
        new_text = script_re.sub('', text)
        new_text = re.sub(r'(</head>)', f'<script type="application/ld+json">\n{final_json}\n</script>\n\1', new_text, flags=re.IGNORECASE)
        text = new_text
        if text != orig:
            fp.write_text(text, encoding='utf-8')
            changed.append(fp.name)

print(f"Normalized schema in {len(changed)} files:\n" + "\n".join(changed))
