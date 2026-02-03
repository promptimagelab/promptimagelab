#!/usr/bin/env python3
"""
Simple SEO injector for static HTML files in this workspace.
It will:
 - add a canonical link if missing
 - add a meta description if missing (uses a generic fallback)
 - insert JSON-LD Organization and WebSite objects
 - add basic Open Graph & Twitter tags if missing
 - mark files it updated to avoid duplicate runs

Use with caution; it edits files in-place.
"""
import re
import os
from pathlib import Path

BASE_URL = "https://promptimagelab.com"
DEFAULT_IMAGE = "https://promptimagelab.com/images/logo.png"
DEFAULT_DESCRIPTION = "PromptImageLab provides proven AI image prompts for profile pictures, anime avatars, Instagram DP, WhatsApp DP, and professional photo‑based AI image generation."
MARKER = "<!-- PIL-SEO-SNIPPET -->"

html_files = list(Path('.').glob('*.html'))
changed = []

for p in html_files:
    text = p.read_text(encoding='utf-8')
    if MARKER in text:
        continue

    head_close = re.search(r'</head>', text, flags=re.IGNORECASE)
    if not head_close:
        print(f"Skipping {p}: no </head> found")
        continue

    # extract title
    title_m = re.search(r'<title>(.*?)</title>', text, flags=re.IGNORECASE | re.DOTALL)
    title = title_m.group(1).strip() if title_m else 'PromptImageLab'

    # extract description
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', text, flags=re.IGNORECASE)
    description = desc_m.group(1).strip() if desc_m else DEFAULT_DESCRIPTION

    # canonical
    canonical_present = re.search(r'rel=["\']canonical["\']', text, flags=re.IGNORECASE) is not None
    filename = p.name
    if filename.lower() in ('index.html', 'home.html'):
        canonical_href = BASE_URL + '/'
    else:
        canonical_href = f"{BASE_URL}/{filename}"

    snippet_lines = []
    snippet_lines.append(MARKER)
    # canonical if missing
    if not canonical_present:
        snippet_lines.append(f'<link rel="canonical" href="{canonical_href}">')

    # basic meta tags
    snippet_lines.append(f'<meta property="og:site_name" content="PromptImageLab">')
    snippet_lines.append(f'<meta property="og:title" content="{title}">')
    snippet_lines.append(f'<meta property="og:description" content="{description}">')
    snippet_lines.append(f'<meta property="og:url" content="{canonical_href}">')
    snippet_lines.append(f'<meta property="og:image" content="{DEFAULT_IMAGE}">')
    snippet_lines.append(f'<meta name="twitter:card" content="summary_large_image">')
    snippet_lines.append(f'<meta name="twitter:title" content="{title}">')
    snippet_lines.append(f'<meta name="twitter:description" content="{description}">')
    snippet_lines.append(f'<meta name="twitter:image" content="{DEFAULT_IMAGE}">')

    # JSON-LD (Organization + WebSite + WebPage)
    page_url = canonical_href
    jsonld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "PromptImageLab",
                "url": BASE_URL,
                "logo": DEFAULT_IMAGE
            },
            {
                "@type": "WebSite",
                "name": "PromptImageLab",
                "url": BASE_URL,
                "description": "Reusable, predictable AI image prompt frameworks for avatars, anime, and portrait generation.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": f"{BASE_URL}/?s={{search_term_string}}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "WebPage",
                "url": page_url,
                "name": title,
                "description": description,
                "inLanguage": "en-US"
            }
        ]
    }

    import json
    jsonld_str = json.dumps(jsonld, ensure_ascii=False, indent=2)
    snippet_lines.append('<script type="application/ld+json">')
    snippet_lines.append(jsonld_str)
    snippet_lines.append('</script>')
    snippet_lines.append('<!-- End PIL-SEO-SNIPPET -->')

    snippet = '\n'.join(snippet_lines) + '\n'

    # Inject before </head>
    new_text = text[:head_close.start()] + snippet + text[head_close.start():]
    p.write_text(new_text, encoding='utf-8')
    changed.append(p.name)

if changed:
    print('Updated files:')
    for c in changed:
        print(' -', c)
else:
    print('No files updated (all pages already contain the marker).')
