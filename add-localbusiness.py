"""
Add LocalBusiness Schema to about.html
"""

import re

FILE_PATH = r"c:\Users\Dhanush\Desktop\promptimagelab\about.html"

LOCALBUSINESS_SCHEMA = '''
  <!-- LocalBusiness/ProfessionalService Schema for Geographic Targeting -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "PromptImageLab",
  "url": "https://promptimagelab.com",
  "logo": "https://promptimagelab.com/images/logo.png",
  "email": "promptimagelab@gmail.com",
  "description": "Professional AI image prompt frameworks for avatars, anime, portraits, and stylized image generation",
  "areaServed": [
    {
      "@type": "Country",
      "name": "India"
    },
    {
      "@type": "Country",
      "name": "United States"
    },
    {
      "@type": "Country",
      "name": "United Kingdom"
    },
    {
      "@type": "GeoShape",
      "name": "Worldwide"
    }
  ],
  "knowsAbout": [
    "AI Image Generation",
    "Prompt Engineering",
    "AI Avatars",
    "Professional Headshots",
    "Anime Art Generation",
    "Profile Pictures"
  ],
  "sameAs": [
    "https://promptimagelab.com"
  ]
}
</script>
'''

def add_schema():
    """Add LocalBusiness schema to about.html"""
    with open(FILE_PATH, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Check if already exists
    if 'ProfessionalService' in content or 'LocalBusiness' in content:
        print("✅ LocalBusiness/ProfessionalService schema already exists")
        return False
    
    # Find position to insert (after last </script> in head, before <title>)
    # Look for BreadcrumbList closing and insert after
    pattern = r'("BreadcrumbList".*?</script>)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        insert_position = match.end()
        new_content = content[:insert_position] + LOCALBUSINESS_SCHEMA + content[insert_position:]
        
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Successfully added LocalBusiness schema to about.html")
        return True
    else:
        print("❌ Could not find insertion point")
        return False

if __name__ == "__main__":
    print("Adding LocalBusiness Schema to about.html...")
    add_schema()
