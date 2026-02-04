#!/usr/bin/env python3
"""
Unify navbar, footer, and link the shared theme CSS across workspace HTML files.
This script updates all top-level .html files in the repo root.
"""
import re
from pathlib import Path

ROOT = Path('.')
HTML_FILES = list(ROOT.glob('*.html'))

NAV_HTML = '''<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner container">
    <a class="logo" href="/">PromptImageLab</a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/instagram-dp-ai-prompts.html">Instagram DP</a></li>
      <li><a href="/whatsapp-dp-ai-prompts.html">WhatsApp DP</a></li>
      <li><a href="/linkedin-profile-men.html">LinkedIn</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/contact.html">Contact</a></li>
    </ul>
  </div>
</nav>'''

FOOTER_HTML = '''<footer class="site-footer" role="contentinfo">
  <div class="footer-inner container">
    <div class="muted">© PromptImageLab — AI profile picture prompts</div>
    <div class="muted"><a href="/privacy-policy.html">Privacy</a> · <a href="/sitemap.xml">Sitemap</a></div>
  </div>
</footer>'''

def ensure_linked_theme(text: str) -> str:
    # Ensure there is an opening <head> tag if a </head> exists but no <head>
    if '</head>' in text.lower() and '<head' not in text.lower():
        # insert <head> after <html...>
        m = re.search(r'<html[^>]*>', text, flags=re.IGNORECASE)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + '\n<head>\n' + text[insert_at:]
    
    if 'assets/css/theme.css' not in text:
        # inject before </head>
        m = re.search(r'</head>', text, flags=re.IGNORECASE)
        link = '<link rel="stylesheet" href="/assets/css/theme.css">\n'
        if m:
            text = text[:m.start()] + link + text[m.start():]
    # ensure image handler script is linked
    if 'assets/js/image-handler.js' not in text:
        m = re.search(r'</head>', text, flags=re.IGNORECASE)
        script = '<script src="/assets/js/image-handler.js" defer></script>\n'
        if m:
            text = text[:m.start()] + script + text[m.start():]
    return text

def ensure_basic_meta(text: str, filename: str) -> str:
    # Ensure title
    if not re.search(r'<title>.*?</title>', text, flags=re.IGNORECASE | re.DOTALL):
        title = filename.replace('.html', '').replace('-', ' ').title()
        title_tag = f'<title>{title} | PromptImageLab</title>\n'
        # insert into head if present
        m = re.search(r'<head[^>]*>', text, flags=re.IGNORECASE)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + '\n' + title_tag + text[insert_at:]

    # meta description
    if not re.search(r'<meta\s+name=["\']description["\']', text, flags=re.IGNORECASE):
        desc = 'PromptImageLab provides proven AI image prompts for avatars, profile pictures and social DPs.'
        desc_tag = f'<meta name="description" content="{desc}">\n'
        m = re.search(r'<head[^>]*>', text, flags=re.IGNORECASE)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + desc_tag + text[insert_at:]

    # canonical
    if not re.search(r'rel=["\']canonical["\']', text, flags=re.IGNORECASE):
        href = 'https://promptimagelab.com/' + filename if filename.lower() != 'index.html' else 'https://promptimagelab.com/'
        can_tag = f'<link rel="canonical" href="{href}">\n'
        m = re.search(r'</head>', text, flags=re.IGNORECASE)
        if m:
            text = text[:m.start()] + can_tag + text[m.start():]

    # robots
    if not re.search(r'<meta\s+name=["\']robots["\']', text, flags=re.IGNORECASE):
        robot_tag = '<meta name="robots" content="index, follow">\n'
        m = re.search(r'</head>', text, flags=re.IGNORECASE)
        if m:
            text = text[:m.start()] + robot_tag + text[m.start():]

    return text

def replace_nav(text: str) -> str:
    nav_re = re.compile(r'<nav\b.*?</nav>', re.IGNORECASE | re.DOTALL)
    if nav_re.search(text):
        text = nav_re.sub(NAV_HTML, text, count=1)
    else:
        # if no nav, try to insert after <body>
        m = re.search(r'<body[^>]*>', text, flags=re.IGNORECASE)
        if m:
            insert_at = m.end()
            text = text[:insert_at] + '\n' + NAV_HTML + text[insert_at:]
    return text

def replace_footer(text: str) -> str:
    foot_re = re.compile(r'<footer\b.*?</footer>', re.IGNORECASE | re.DOTALL)
    if foot_re.search(text):
        text = foot_re.sub(FOOTER_HTML, text, count=1)
    else:
        # append before </body>
        m = re.search(r'</body>', text, flags=re.IGNORECASE)
        if m:
            text = text[:m.start()] + '\n' + FOOTER_HTML + '\n' + text[m.start():]
    return text

def ensure_skip_link(text: str) -> str:
    if 'class="skip-link"' not in text:
        m = re.search(r'<body[^>]*>', text, flags=re.IGNORECASE)
        skip = '\n<a class="skip-link" href="#main-content">Skip to content</a>\n'
        if m:
            insert_at = m.end()
            text = text[:insert_at] + skip + text[insert_at:]
    return text

def ensure_main_id(text: str) -> str:
    # Add id to first <main> if missing
    m = re.search(r'<main\b([^>]*)>', text, flags=re.IGNORECASE)
    if m:
        attrs = m.group(1)
        if 'id=' not in attrs.lower():
            new_tag = '<main id="main-content"' + attrs + '>'
            text = text[:m.start()] + new_tag + text[m.end():]
    return text

def run():
    changed = []
    for p in HTML_FILES:
        text = p.read_text(encoding='utf-8')
        orig = text
        text = ensure_basic_meta(text, p.name)
        text = ensure_linked_theme(text)
        text = replace_nav(text)
        text = replace_footer(text)
        text = ensure_skip_link(text)
        text = ensure_main_id(text)
        if text != orig:
            p.write_text(text, encoding='utf-8')
            changed.append(p.name)
    if changed:
        print('Updated:', ', '.join(changed))
    else:
        print('No changes made')

if __name__ == '__main__':
    run()
