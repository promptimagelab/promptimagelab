"""
Image Sitemap Generator for PromptImageLab
Scans all images and creates a comprehensive image sitemap
"""

import os
from pathlib import Path
from datetime import datetime

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"
BASE_URL = "https://promptimagelab.com"
IMAGES_DIR = "images"
OUTPUT_FILE = "images-sitemap.xml"

def scan_images():
    """Scan the images directory and collect all image files"""
    images_path = os.path.join(WEBSITE_ROOT, IMAGES_DIR)
    image_files = []
    
    # Supported image formats
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}
    
    for root, dirs, files in os.walk(images_path):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                # Get relative path from website root
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, WEBSITE_ROOT).replace('\\', '/')
                
                # Get file size
                try:
                    size = os.path.getsize(full_path)
                except:
                    size = 0
                
                image_files.append({
                    'path': rel_path,
                    'url': f"{BASE_URL}/{rel_path}",
                    'filename': file,
                    'size': size
                })
    
    return sorted(image_files, key=lambda x: x['path'])

def map_images_to_pages():
    """Map images to their corresponding HTML pages"""
    # Define page-to-image mappings based on directory structure
    page_mappings = {}
    
    # Scan HTML files for image references
    import re
    
    for file in os.listdir(WEBSITE_ROOT):
        if file.endswith('.html'):
            filepath = os.path.join(WEBSITE_ROOT, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Find all image src attributes
                img_pattern = r'src="(/images/[^"]+)"'
                images = re.findall(img_pattern, content)
                
                if images:
                    page_url = f"{BASE_URL}/{file}"
                    page_mappings[page_url] = [f"{BASE_URL}{img}" for img in images]
            except:
                pass
    
    return page_mappings

def generate_image_sitemap(images, page_mappings):
    """Generate XML sitemap for images"""
    
    xml_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
'''
    
    # Group images by page
    pages_with_images = {}
    
    for page_url, image_urls in page_mappings.items():
        if image_urls:
            pages_with_images[page_url] = image_urls
    
    # Add homepage with logo
    if f"{BASE_URL}/index.html" not in pages_with_images:
        pages_with_images[f"{BASE_URL}/"] = [f"{BASE_URL}/images/logo.png"]
    
    # Generate XML entries
    for page_url, image_urls in sorted(pages_with_images.items()):
        xml_content += f'\n  <url>\n'
        xml_content += f'    <loc>{page_url}</loc>\n'
        
        for img_url in image_urls[:10]:  # Limit to 10 images per page
            # Extract title from filename
            filename = os.path.basename(img_url)
            title = filename.replace('-', ' ').replace('_', ' ').rsplit('.', 1)[0].title()
            
            xml_content += f'    <image:image>\n'
            xml_content += f'      <image:loc>{img_url}</image:loc>\n'
            xml_content += f'      <image:title>{title}</image:title>\n'
            xml_content += f'    </image:image>\n'
        
        xml_content += f'  </url>\n'
    
    xml_content += '\n</urlset>'
    
    return xml_content

def main():
    """Main execution"""
    print("=" * 60)
    print("Image Sitemap Generator")
    print("=" * 60)
    print(f"Scanning: {os.path.join(WEBSITE_ROOT, IMAGES_DIR)}")
    
    # Scan images
    images = scan_images()
    print(f"\n✅ Found {len(images)} images")
    
    # Map to pages
    page_mappings = map_images_to_pages()
    print(f"✅ Mapped images to {len(page_mappings)} pages")
    
    # Generate sitemap
    sitemap_xml = generate_image_sitemap(images, page_mappings)
    
    # Write to file
    output_path = os.path.join(WEBSITE_ROOT, OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sitemap_xml)
    
    print(f"\n✅ Image sitemap created: {OUTPUT_FILE}")
    print(f"   Total image URLs: {sum(len(imgs) for imgs in page_mappings.values())}")
    print(f"   Pages with images: {len(page_mappings)}")
    
    print("\n" + "="  * 60)
    print("Next Steps:")
    print("=" * 60)
    print("1. Add reference to main sitemap.xml")
    print("2. Update robots.txt:")
    print(f"   Sitemap: {BASE_URL}/{OUTPUT_FILE}")
    print("3. Submit to Google Search Console")
    print("=" * 60)

if __name__ == "__main__":
    main()
