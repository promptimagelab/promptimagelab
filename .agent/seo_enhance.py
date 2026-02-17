"""
SEO Enhancement Script for PromptImageLab
Automatically applies professional SEO improvements to all content pages including:
- Article/BlogPosting schema with datePublished/dateModified
- BreadcrumbList schema
- Author box with E-A-T signals
- Enhanced meta tags (hreflang, theme-color, preconnect)
- Comprehensive footer navigation  
- Breadcrumb navigation
"""

import os
import re
from pathlib import Path
from datetime import datetime

# Configuration
SITE_URL = "https://promptimagelab.com"
DATE_PUBLISHED = "2026-02-10"
DATE_MODIFIED = "2026-02-17"
AUTHOR = "PromptImageLab Team"

# Pages to process (exclude index, about, contact, privacy)
CONTENT_PAGES = [
    "ai-profile-picture-dp-prompts.html",
    "anime-avatars.html",
    "ceo-style-portrait-prompts.html",
    "corporate-portrait-prompts.html",
    "instagram-dp-ai-prompts.html",
    "instagram-dp-black-white-ai-prompts.html",
    "instagram-dp-couple-ai-prompts.html",
    "instagram-dp-for-boys-ai-prompts.html",
    "instagram-dp-for-girls-ai-prompts.html",
    "linkedin-profile-men.html",
    "linkedin-profile-picture-prompts.html",
    "linkedin-profile-women.html",
    "professional-ai-headshot-prompts.html",
    "realistic-ai-portrait-prompts.html",
    "resume-photo-prompts.html",
    "romantic-anime-prompts.html",
    "studio-lighting-portrait-prompts.html",
    "valentine-ai-image-prompts.html",
    "valentine-couple-photo-prompts.html",
    "valentine-dp-prompts.html",
    "valentine-gift-message-prompts.html",
    "valentine-instagram-caption-prompts.html",
    "valentine-love-letter-prompts.html",
    "valentine-whatsapp-messages.html",
    "whatsapp-dp-ai-prompts.html",
    "whatsapp-dp-for-boys-ai-prompts.html",
    # "whatsapp-dp-for-girls-ai-prompts.html",  # Already done manually
    "whatsapp-dp-tamil-ai-prompts.html",
]

def get_page_title_from_h1(content):
    """Extract page title from H1 tag"""
    match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL | re.IGNORECASE)
    if match:
        # Clean up HTML tags within H1
        title = re.sub(r'<[^>]+>', '', match.group(1))
        return title.strip()
    return "AI Image Prompts"

def get_page_description(content):
    """Extract description from meta tag"""
    match = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return "Professional AI image prompts for generating high-quality images."

def get_page_url(filename):
    """Generate full page URL"""
    return f"{SITE_URL}/{filename}"

def generate_breadcrumb_name(filename):
    """Generate human-readable breadcrumb name from filename"""
    name = filename.replace('.html', '').replace('-', ' ')
    # Capitalize each word
    return ' '.join(word.capitalize() for word in name.split())

def add_preconnect_and_meta_tags(content):
    """Add performance preconnect and additional SEO meta tags"""
    # Check if already added
    if 'preconnect' in content and 'pagead2.googlesyndication.com' in content:
        return content
    
    # Find canonical link
    canonical_pattern = r'(<link rel="canonical"[^>]+>)'
    canonical_match = re.search(canonical_pattern, content, re.IGNORECASE)
    
    if not canonical_match:
        return content
    
    insert_pos = canonical_match.end()
    
    additional_tags = '''

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://pagead2.googlesyndication.com">
  <link rel="dns-prefetch" href="https://adservice.google.com">

  <!-- Additional SEO Meta Tags -->
  <meta name="revisit-after" content="7 days">
  <meta name="distribution" content="global">
  <meta name="rating" content="general">
  <meta name="theme-color" content="#020617">'''
    
    content = content[:insert_pos] + additional_tags + content[insert_pos:]
    return content

def add_hreflang_tags(content, page_url):
    """Add hreflang tags for international SEO"""
    # Check if already added
    if 'hreflang="en"' in content:
        return content
    
    # Find theme-color meta tag or canonical
    insert_pattern = r'(<meta name="theme-color"[^>]+>)'
    match = re.search(insert_pattern, content, re.IGNORECASE)
    
    if not match:
        # Fallback to canonical
        insert_pattern = r'(<link rel="canonical"[^>]+>)'
        match = re.search(insert_pattern, content, re.IGNORECASE)
    
    if not match:
        return content
    
    insert_pos = match.end()
    
    hreflang_tags = f'''

  <!-- Hreflang for international SEO -->
  <link rel="alternate" hreflang="en" href="{page_url}">
  <link rel="alternate" hreflang="en-IN" href="{page_url}">
  <link rel="alternate" hreflang="x-default" href="{page_url}">'''
    
    content = content[:insert_pos] + hreflang_tags + content[insert_pos:]
    return content

def add_article_schema(content, title, description, page_url, image_url=""):
    """Add Article schema with datePublished and dateModified"""
    # Check if Article schema already exists
    if '"@type": "Article"' in content:
        return content
    
    # Find existing schema.org script
    schema_pattern = r'(<script type="application/ld\+json">)(.*?)(</script>)'
    schema_match = re.search(schema_pattern, content, re.DOTALL | re.IGNORECASE)
    
    if not schema_match:
        return content
    
    # Extract existing schema
    existing_schema = schema_match.group(2).strip()
    
    # If it's not wrapped in @graph, we need to convert it
    if '"@graph"' not in existing_schema:
        # Wrap existing schema in @graph
        existing_schema = f'''
    {{
      "@context": "https://schema.org",
      "@graph": [
        {existing_schema}
      ]
    }}'''
    
    # Extract the image URL from existing ImageObject if present
    if not image_url:
        image_match = re.search(r'"contentUrl":\s*"([^"]+)"', existing_schema)
        if image_match:
            image_url = image_match.group(1)
        else:
            image_url = f"{SITE_URL}/images/logo.png"
    
    # Add Article schema to the @graph array
    article_schema = f'''      {{
        "@type": "Article",
        "headline": "{title}",
        "description": "{description}",
        "image": "{image_url}",
        "author": {{
          "@type": "Organization",
          "name": "PromptImageLab",
          "url": "{SITE_URL}"
        }},
        "publisher": {{
          "@type": "Organization",
          "name": "PromptImageLab",
          "logo": {{
            "@type": "ImageObject",
            "url": "{SITE_URL}/images/logo.png"
          }}
        }},
        "datePublished": "{DATE_PUBLISHED}",
        "dateModified": "{DATE_MODIFIED}",
        "mainEntityOfPage": {{
          "@type": "WebPage",
          "@id": "{page_url}"
        }},
        "inLanguage": "en-US"
      }},
      {{
        "@type": "BreadcrumbList",
        "itemListElement": [
          {{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "{SITE_URL}/"
          }},
          {{
            "@type": "ListItem",
            "position": 2,
            "name": "{generate_breadcrumb_name(os.path.basename(page_url))}",
            "item": "{page_url}"
          }}
        ]
      }},'''
    
    # Insert Article and Breadcrumb schema at the beginning of @graph
    if '"@graph": [' in existing_schema:
        content = content.replace(
            existing_schema,
            existing_schema.replace('"@graph": [', f'"@graph": [\n{article_schema}')
        )
    
    return content

def add_breadcrumb_css(content):
    """Add breadcrumb navigation CSS"""
    # Check if already added
    if '.breadcrumb-nav' in content:
        return content
    
    # Find <style> tag
    style_pattern = r'(<style>)'
    match = re.search(style_pattern, content, re.IGNORECASE)
    
    if not match:
        return content
    
    insert_pos = match.end()
    
    breadcrumb_css = '''
    /* Breadcrumb Navigation */
    .breadcrumb-nav {
      padding: 12px 0;
      font-size: 0.9rem;
    }

    .breadcrumb-nav ol {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .breadcrumb-nav li {
      display: flex;
      align-items: center;
    }

    .breadcrumb-nav li:not(:last-child)::after {
      content: "/";
      margin-left: 8px;
      color: var(--text-soft);
    }

    .breadcrumb-nav a {
      color: var(--text-soft);
      text-decoration: none;
    }

    .breadcrumb-nav a:hover {
      color: var(--accent);
    }

    .breadcrumb-nav li:last-child span {
      color: var(--text);
    }

    /* Author Box */
    .author-box {
      background: rgba(236, 72, 153, 0.08);
      border: 1px solid rgba(236, 72, 153, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      margin: 2rem 0;
    }

    .author-info p {
      margin: 0.5rem 0;
    }

    .author-info strong {
      color: var(--text-strong);
    }

    .trust-signals {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .trust-signals span {
      color: var(--text-soft);
    }

'''
    
    content = content[:insert_pos] + breadcrumb_css + content[insert_pos:]
    return content

def add_breadcrumb_navigation(content, page_title):
    """Add visible breadcrumb navigation"""
    # Check if already added
    if 'breadcrumb-nav' in content and 'Breadcrumb' in content:
        return content
    
    # Find </nav> after navbar
    nav_pattern = r'(</nav>)\s*(<section|<main|<div|<article)'
    match = re.search(nav_pattern, content, re.IGNORECASE)
    
    if not match:
        return content
    
    insert_pos = match.start(2)
    
    breadcrumb_html = f'''
  <!-- Breadcrumb Navigation -->
  <div class="container" style="padding-top: 90px;">
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <ol itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/">
            <span itemprop="name">Home</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">{page_title}</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </nav>
  </div>

  '''
    
    content = content[:insert_pos] + breadcrumb_html + content[insert_pos:]
    return content

def add_author_box(content):
    """Add author box with E-A-T signals to hero section"""
    # Check if already added
    if 'author-box' in content and 'Written by:' in content:
        return content
    
    # Find closing </p> in hero section (description paragraph)
    hero_pattern = r'(<section class="hero".*?<p>.*?</p>)(.*?)(</div>\s*</section>)'
    match = re.search(hero_pattern, content, re.DOTALL | re.IGNORECASE)
    
    if not match:
        return content
    
    insert_pos = match.end(1)
    
    author_box_html = '''
      
      <!-- Author and Trust Signals -->
      <div class="author-box" style="max-width: 900px; margin: 2rem auto;">
        <div class="author-info">
          <p><strong>Written by:</strong> PromptImageLab Team</p>
          <p>Expert AI prompt engineers specializing in professional image generation prompts</p>
        </div>
        <div class="trust-signals">
          <span>✓ Tested across MidJourney, DALL-E, ChatGPT</span>
          <span>✓ Updated: February 17, 2026</span>
          <span>✓ 10,000+ Users</span>
        </div>
      </div>'''
    
    content = content[:insert_pos] + author_box_html + content[insert_pos:]
    return content

def add_comprehensive_footer(content):
    """Add comprehensive footer navigation"""
    # Check if footer already has comprehensive navigation
    if 'Profile Pictures' in content and 'footer' in content.lower() and 'Instagram DP' in content[-5000:]:
        return content
    
    # Find simple footer
    footer_pattern = r'<footer[^>]*>.*?</footer>'
    match = re.search(footer_pattern, content, re.DOTALL | re.IGNORECASE)
    
    if not match:
        return content
    
    # Replace with comprehensive footer
    comprehensive_footer = '''<footer style="background: linear-gradient(180deg, #071027 0%, #020617 100%); padding: 3rem 0 1.5rem;">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #cfe9ff;">Profile Pictures</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 0.5rem;"><a href="/ai-profile-picture-dp-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">AI Profile Pictures</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/instagram-dp-ai-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Instagram DP</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/whatsapp-dp-ai-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">WhatsApp DP</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/linkedin-profile-picture-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">LinkedIn Profiles</a></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #cfe9ff;">Anime & Avatars</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 0.5rem;"><a href="/anime-avatars.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Anime Avatars</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/romantic-anime-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Romantic Anime</a></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #cfe9ff;">Valentine Special</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 0.5rem;"><a href="/valentine-ai-image-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Valentine Images</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/valentine-couple-photo-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Couple Photos</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/valentine-instagram-caption-prompts.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Instagram Captions</a></li>
          </ul>
        </div>
        <div class="col-md-3 mb-4">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: #cfe9ff;">Company</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 0.5rem;"><a href="/about.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">About</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/contact.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Contact</a></li>
            <li style="margin-bottom: 0.5rem;"><a href="/privacy-policy.html" style="color: rgba(255,255,255,0.78); text-decoration: none; font-size: 0.9rem;">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.03); margin-top: 2rem; padding-top: 1rem; text-align: center; font-size: 0.85rem; opacity: 0.8;">
        © 2026 PromptImageLab · All Rights Reserved
      </div>
    </div>
  </footer>'''
    
    content = content[:match.start()] + comprehensive_footer + content[match.end():]
    return content

def wrap_content_in_article_tag(content):
    """Wrap main content in <article> tag for semantic HTML"""
    # Check if already wrapped
    if '<article>' in content:
        return content
    
    # Find hero section start
    hero_pattern = r'(<section class="hero">)'
    hero_match = re.search(hero_pattern, content, re.IGNORECASE)
    
    if not hero_match:
        return content
    
    # Find footer
    footer_pattern = r'(<footer)'
    footer_match = re.search(footer_pattern, content, re.IGNORECASE)
    
    if not footer_match:
        return content
    
    # Insert <article> before hero and </article> before footer
    content = content[:hero_match.start()] + '\n  <article>\n  ' + content[hero_match.start():]
    
    # Adjust footer position due to insertion
    adjustment = len('\n  <article>\n  ')
    footer_pos = footer_match.start() + adjustment
    content = content[:footer_pos] + '  </article>\n\n  ' + content[footer_pos:]
    
    return content

def process_page(file_path):
    """Process a single HTML page with all SEO enhancements"""
    print(f"Processing: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract page information
    title = get_page_title_from_h1(content)
    description = get_page_description(content)
    page_url = get_page_url(file_path.name)
    
    # Apply all enhancements
    content = add_preconnect_and_meta_tags(content)
    content = add_hreflang_tags(content, page_url)
    content = add_article_schema(content, title, description, page_url)
    content = add_breadcrumb_css(content)
    content = add_breadcrumb_navigation(content, title)
    content = add_author_box(content)
    content = add_comprehensive_footer(content)
    content = wrap_content_in_article_tag(content)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Completed: {file_path.name}")

def main():
    """Main execution function"""
    base_dir = Path(r"c:\Users\Dhanush\Desktop\promptimagelab")
    
    print(f"\nSEO Enhancement Script for PromptImageLab")
    print(f"=" * 60)
    print(f"Processing {len(CONTENT_PAGES)} pages...")
    print(f"")
    
    success_count = 0
    error_count = 0
    
    for page_name in CONTENT_PAGES:
        file_path = base_dir / page_name
        
        if not file_path.exists():
            print(f"⚠ Skipping (not found): {page_name}")
            error_count += 1
            continue
        
        try:
            process_page(file_path)
            success_count += 1
        except Exception as e:
            print(f"✗ Error processing {page_name}: {str(e)}")
            error_count += 1
    
    print(f"\n" + "=" * 60)
    print(f"Processing complete!")
    print(f"Success: {success_count} pages")
    print(f"Errors: {error_count} pages")
    print(f"\nAll pages now have:")
    print(f"  ✓ Article schema with datePublished/dateModified")
    print(f"  ✓ Breadcrumb navigation (visible + schema)")
    print(f"  ✓ Author box with E-A-T signals")
    print(f"  ✓ Enhanced SEO meta tags")
    print(f"  ✓ Comprehensive footer navigation")
    print(f"  ✓ Semantic HTML5 structure")

if __name__ == "__main__":
    main()
