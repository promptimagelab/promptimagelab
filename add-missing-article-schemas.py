"""
Add Missing Article Schemas to Pages
Adds Article schema with dates to pages that are missing them
"""

import os
import re
from datetime import datetime

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"
BASE_URL = "https://promptimagelab.com"
TODAY = "2026-02-17"

# Pages that need Article schema added
PAGES_TO_UPDATE = {
    "instagram-dp-for-girls-ai-prompts.html": {
        "headline": "Instagram DP for Girls – Cute & Stylish AI Profile Picture Prompts",
        "description": "Instagram DP for girls using AI. Copy cute, stylish, aesthetic and classy Instagram profile picture prompts for girls.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "instagram-dp-for-boys-ai-prompts.html": {
        "headline": "Instagram DP for Boys – Cool & Stylish AI Profile Picture Prompts",
        "description": "Create cool and stylish Instagram DP for boys using AI prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "instagram-dp-couple-ai-prompts.html": {
        "headline": "Instagram DP for Couples – Romantic AI Profile Picture Prompts",
        "description": "Create romantic couple Instagram DP using AI prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "instagram-dp-black-white-ai-prompts.html": {
        "headline": "Black & White Instagram DP – Classic AI Profile Picture Prompts",
        "description": "Create elegant black and white Instagram DP using AI prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "linkedin-profile-men.html": {
        "headline": "LinkedIn Profile Pictures for Men – Professional AI Headshot Prompts",
        "description": "Create professional LinkedIn profile pictures for men using AI.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "linkedin-profile-women.html": {
        "headline": "LinkedIn Profile Pictures for Women – Professional AI Headshot Prompts",
        "description": "Create professional LinkedIn profile pictures for women using AI.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "ai-profile-picture-dp-prompts.html": {
        "headline": "AI Profile Picture Prompts – Create Perfect DP with AI",
        "description": "Generate stunning AI profile pictures using professional prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "anime-avatars.html": {
        "headline": "Anime Avatar Prompts – Create Beautiful Anime Profile Pictures",
        "description": "Transform your photos into stunning anime avatars using AI prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "valentine-dp-prompts.html": {
        "headline": "Valentine's Day DP Prompts – Romantic AI Profile Pictures",
        "description": "Create romantic Valentine's Day profile pictures using AI.",
        "image": "https://promptimagelab.com/images/logo.png"
    },
    "valentine-gift-message-prompts.html": {
        "headline": "Valentine's Gift Message Prompts – Heartfelt AI-Generated Messages",
        "description": "Create heartfelt Valentine's gift messages using AI prompts.",
        "image": "https://promptimagelab.com/images/logo.png"
    }
}

def create_article_schema(filename, data):
    """Generate Article schema JSON-LD"""
    page_url = f"{BASE_URL}/{filename}"
    
    schema = f'''
  <!-- Article Schema -->
  <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{data['headline']}",
  "description": "{data['description']}",
  "image": "{data['image']}",
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
      "url": "{BASE_URL}/images/logo.png"
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

def add_article_schema(filepath, filename):
    """Add Article schema to a page"""
    print(f"\nProcessing: {filename}")
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Check if Article schema already exists
        if '"@type": "Article"' in content or '"@type":"Article"' in content:
            # Check if it has dates
            if '"datePublished"' in content:
                print(f"  ✅ Article schema with dates already exists")
                return False
            else:
                print(f"  ⚠️  Article schema exists but missing dates - needs manual update")
                return False
        
        # Get page data
        if filename not in PAGES_TO_UPDATE:
            print(f"  ⏭️  Not in update list")
            return False
        
        page_data = PAGES_TO_UPDATE[filename]
        article_schema = create_article_schema(filename, page_data)
        
        # Find where to insert (after Organization/Breadcrumb schema, before </head>)
        # Look for existing schema blocks
        schema_pattern = r'(</script>\s*\n)'
        matches = list(re.finditer(schema_pattern, content))
        
        if matches:
            # Insert after the last schema block before </head>
            head_end = content.find('</head>')
            last_schema_before_head = None
            
            for match in matches:
                if match.end() < head_end:
                    last_schema_before_head = match
            
            if last_schema_before_head:
                insert_pos = last_schema_before_head.end()
                new_content = content[:insert_pos] + article_schema + '\n' + content[insert_pos:]
                
                # Write back
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                print(f"  ✅ Added Article schema successfully")
                return True
        
        print(f"  ❌ Could not find insertion point")
        return False
        
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def main():
    """Main execution"""
    print("=" * 60)
    print("Adding Missing Article Schemas")
    print("=" * 60)
    print(f"Date: {TODAY}")
    print(f"Pages to update: {len(PAGES_TO_UPDATE)}")
    print("=" * 60)
    
    updated = 0
    skipped = 0
    
    for filename in PAGES_TO_UPDATE.keys():
        filepath = os.path.join(WEBSITE_ROOT, filename)
        
        if not os.path.exists(filepath):
            print(f"\n⚠️  File not found: {filename}")
            skipped += 1
            continue
        
        if add_article_schema(filepath, filename):
            updated += 1
        else:
            skipped += 1
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✅ Updated: {updated} files")
    print(f"⏭️  Skipped: {skipped} files")
    print(f"📊 Total: {len(PAGES_TO_UPDATE)} files")
    print("=" * 60)
    print("\n✨ Article schema addition complete!")

if __name__ == "__main__":
    main()
