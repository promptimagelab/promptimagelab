"""
SEO Schema Enhancement Script
Automatically adds breadcrumb and enhanced article schemas to all content pages
"""

import os
import re
from datetime import datetime
from pathlib import Path

# Configuration
WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"
BASE_URL = "https://promptimagelab.com"
TODAY = "2026-02-17"

# Content pages that need schema updates
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
    "whatsapp-dp-for-girls-ai-prompts.html",
    "whatsapp-dp-tamil-ai-prompts.html",
]

def extract_page_title(html_content):
    """Extract the page title from HTML content"""
    title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
    if title_match:
        return title_match.group(1).strip()
    return "Page Title"

def extract_h1(html_content):
    """Extract the H1 heading from HTML content"""
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.IGNORECASE | re.DOTALL)
    if h1_match:
        # Remove HTML tags from h1 content
        h1_text = re.sub(r'<[^>]+>', '', h1_match.group(1))
        return h1_text.strip()
    return "Content"

def extract_image_url(html_content, filename):
    """Try to extract a representative image URL from the page"""
    # Look for og:image meta tag first
    og_image = re.search(r'<meta property="og:image" content="([^"]+)"', html_content)
    if og_image:
        return og_image.group(1)
    
    # Fallback to looking for first img in content
    img_match = re.search(r'src="(/images/[^"]+)"', html_content)
    if img_match:
        return BASE_URL + img_match.group(1)
    
    # Default fallback
    return f"{BASE_URL}/images/logo.png"

def create_breadcrumb_schema(page_filename, page_title):
    """Generate breadcrumb schema JSON-LD"""
    page_url = f"{BASE_URL}/{page_filename}"
    
    schema = f'''
  <!-- Breadcrumb Schema -->
  <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{BASE_URL}/"
    }},
    {{
      "@type": "ListItem",
      "position": 2,
      "name": "{page_title}",
      "item": "{page_url}"
    }}
  ]
}}
</script>'''
    return schema

def enhance_article_schema(html_content, page_filename):
    """Find and enhance existing Article schema with dates and image"""
    image_url = extract_image_url(html_content, page_filename)
    
    # Look for existing Article schema
    article_schema_pattern = r'(<script type="application/ld\+json">\s*\{[^}]*"@type"\s*:\s*"Article".*?</script>)'
    match = re.search(article_schema_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    if match:
        original_schema = match.group(1)
        
        # Parse the schema to add missing fields
        # Check if datePublished exists
        if '"datePublished"' not in original_schema:
            # Add dates before the closing brace
            enhanced = re.sub(
                r'("publisher":\s*\{[^}]+\}\s*)',
                f'\\1,\n"datePublished": "{TODAY}",\n"dateModified": "{TODAY}",\n"image": "{image_url}"',
                original_schema
            )
            return original_schema, enhanced
        else:
            # Already has dates, just update them
            enhanced = re.sub(r'"datePublished":\s*"[^"]+"', f'"datePublished": "{TODAY}"', original_schema)
            enhanced = re.sub(r'"dateModified":\s*"[^"]+"', f'"dateModified": "{TODAY}"', enhanced)
            
            # Add image if missing
            if '"image"' not in enhanced:
                enhanced = re.sub(
                    r'("publisher":\s*\{[^}]+\}\s*)',
                    f'\\1,\n"image": "{image_url}"',
                    enhanced
                )
            
            return original_schema, enhanced
    
    return None, None

def check_existing_breadcrumb(html_content):
    """Check if page already has breadcrumb schema"""
    return '"@type": "BreadcrumbList"' in html_content or '"@type":"BreadcrumbList"' in html_content

def process_html_file(filepath):
    """Process a single HTML file to add/update schemas"""
    print(f"\nProcessing: {os.path.basename(filepath)}")
    
    try:
        # Read file with UTF-8 encoding
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        modified = False
        original_content = content
        
        # Extract page information
        page_title = extract_page_title(content)
        filename = os.path.basename(filepath)
        
        # 1. Add breadcrumb schema if missing
        if not check_existing_breadcrumb(content):
            breadcrumb_schema = create_breadcrumb_schema(filename, page_title)
            
            # Insert before </head>
            content = content.replace('</head>', f'{breadcrumb_schema}\n</head>')
            modified = True
            print(f"  ✅ Added breadcrumb schema")
        else:
            print(f"  ⏭️  Breadcrumb schema already exists")
        
        # 2. Enhance article schema
        original_article, enhanced_article = enhance_article_schema(content, filename)
        if original_article and enhanced_article and original_article != enhanced_article:
            content = content.replace(original_article, enhanced_article)
            modified = True
            print(f"  ✅ Enhanced article schema with dates")
        elif original_article:
            print(f"  ⏭️  Article schema already up to date")
        else:
            print(f"  ⚠️  No article schema found (may not be a content page)")
        
        # Write back if modified
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  💾 File updated successfully")
            return True
        else:
            print(f"  ℹ️  No changes needed")
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing {filepath}: {str(e)}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("SEO Schema Enhancement Script")
    print("=" * 60)
    print(f"Website root: {WEBSITE_ROOT}")
    print(f"Total pages to process: {len(CONTENT_PAGES)}")
    print(f"Update date: {TODAY}")
    print("=" * 60)
    
    updated_count = 0
    skipped_count = 0
    
    for page in CONTENT_PAGES:
        filepath = os.path.join(WEBSITE_ROOT, page)
        
        if not os.path.exists(filepath):
            print(f"\n⚠️  File not found: {page}")
            skipped_count += 1
            continue
        
        if process_html_file(filepath):
            updated_count += 1
        else:
            skipped_count += 1
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✅ Updated: {updated_count} files")
    print(f"⏭️  Skipped: {skipped_count} files")
    print(f"📊 Total: {len(CONTENT_PAGES)} files")
    print("=" * 60)
    print("\n✨ Schema enhancement complete!")
    print("\nNext steps:")
    print("1. Validate schemas at https://search.google.com/test/rich-results")
    print("2. Submit updated sitemap to Google Search Console")
    print("3. Monitor Search Console for breadcrumb appearances")

if __name__ == "__main__":
    main()
