"""
SEO Boost Script - Add Missing Article Schemas
Adds Article schema with dates to pages that are missing them
"""

import os
import re
from datetime import datetime

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"
BASE_URL = "https://promptimagelab.com"
TODAY = "2026-02-17"

# Pages that need Article schema added
PAGES_NEEDING_ARTICLE_SCHEMA = [
    "instagram-dp-for-girls-ai-prompts.html",
    "instagram-dp-for-boys-ai-prompts.html",
    "instagram-dp-couple-ai-prompts.html",
    "instagram-dp-black-white-ai-prompts.html",
    "linkedin-profile-men.html",
    "linkedin-profile-women.html",
    "ai-profile-picture-dp-prompts.html",
    "anime-avatars.html",
    "valentine-dp-prompts.html",
    "valentine-gift-message-prompts.html",
]

def extract_title(html_content):
    """Extract page title"""
    match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
    return match.group(1).strip() if match else "Page Title"

def extract_description(html_content):
    """Extract meta description"""
    match = re.search(r'<meta name="description"\s+content="([^"]+)"', html_content, re.IGNORECASE)
    return match.group(1).strip() if match else "AI image prompt guide"

def create_article_schema(page_filename, title, description):
    """Generate Article schema JSON-LD"""
    page_url = f"{BASE_URL}/{page_filename}"
    image_url = f"{BASE_URL}/images/logo.png"  # Default, can be customized
    
    schema = f'''
  <!-- Article Schema for SEO -->
  <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "image": "{image_url}",
  "author": {{
    "@type": "Organization",
    "name": "PromptImageLab",
    "url": "{BASE_URL}"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "PromptImageLab",
    "logo": {{
      "@type": "ImageObject",
      "url": "{image_url}"
    }}
  }},
  "datePublished": "{TODAY}",
  "dateModified": "{TODAY}",
  "mainEntityOfPage": {{
    "@type": "WebPage",
    "@id": "{page_url}"
  }},
  "inLanguage": "en-US"
}}
</script>'''
    return schema

def check_has_article_schema(html_content):
    """Check if page already has Article schema"""
    return '"@type": "Article"' in html_content or '"@type":"Article"' in html_content

def add_article_schema(filepath):
    """Add Article schema to a page"""
    filename = os.path.basename(filepath)
    print(f"\n📄 Processing: {filename}")
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Check if already has Article schema
        if check_has_article_schema(content):
            print(f"  ⏭️  Already has Article schema")
            return False
        
        # Extract page info
        title = extract_title(content)
        description = extract_description(content)
        
        # Create schema
        article_schema = create_article_schema(filename, title, description)
        
        # Find insertion point (before </head>)
        # Try to insert after existing schemas or before </head>
        if 'BreadcrumbList' in content:
            # Insert after BreadcrumbList schema
            pattern = r'(</script>\s*\n)(\s*<title)'
            replacement = f'\\1{article_schema}\\n\\2'
            new_content = re.sub(pattern, replacement, content, count=1)
        else:
            # Insert before </head>
            new_content = content.replace('</head>', f'{article_schema}\n</head>')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  ✅ Added Article schema")
            print(f"     Title: {title[:50]}...")
            return True
        else:
            print(f"  ⚠️  Could not find insertion point")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def main():
    """Main execution"""
    print("=" * 70)
    print("SEO BOOST: Adding Article Schemas")
    print("=" * 70)
    print(f"Target pages: {len(PAGES_NEEDING_ARTICLE_SCHEMA)}")
    print(f"Publication date: {TODAY}")
    print("=" * 70)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for page in PAGES_NEEDING_ARTICLE_SCHEMA:
        filepath = os.path.join(WEBSITE_ROOT, page)
        
        if not os.path.exists(filepath):
            print(f"\n⚠️  Not found: {page}")
            error_count += 1
            continue
        
        result = add_article_schema(filepath)
        if result:
            success_count += 1
        else:
            skip_count += 1
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"✅ Added schemas: {success_count}")
    print(f"⏭️  Skipped: {skip_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📊 Total processed: {len(PAGES_NEEDING_ARTICLE_SCHEMA)}")
    print("=" * 70)
    
    if success_count > 0:
        print("\n✨ Article schemas successfully added!")
        print("\nNext steps:")
        print("1. Validate at https://search.google.com/test/rich-results")
        print("2. Monitor Google Search Console for indexing")
        print("3. Expected: Better SERP appearance within 2-4 weeks")

if __name__ == "__main__":
    main()
