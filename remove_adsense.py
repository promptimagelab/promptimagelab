import os
import re

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

def remove_adsense_code(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Remove AdSense Script in Head
        # Matches: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=... " crossorigin="anonymous"></script>
        adsense_script_pattern = r'<script async src="https://pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client=[^"]+"\s+crossorigin="anonymous"></script>\s*'
        content = re.sub(adsense_script_pattern, '', content)

        # 2. Remove Ad Units (ins tags)
        # Matches: <ins class="adsbygoogle" ... ></ins>
        ad_unit_pattern = r'<ins class="adsbygoogle"[\s\S]*?</ins>\s*'
        content = re.sub(ad_unit_pattern, '', content)

        # 3. Remove Ad Push Scripts
        # Matches: <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>
        push_script_pattern = r'<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);\s*</script>\s*'
        content = re.sub(push_script_pattern, '', content)
        
        # 4. Remove Preconnect/DNS-prefetch links
        # <link rel="preconnect" href="https://pagead2.googlesyndication.com">
        preconnect_pattern = r'<link rel="preconnect" href="https://pagead2\.googlesyndication\.com">\s*'
        content = re.sub(preconnect_pattern, '', content)
        
        # <link rel="dns-prefetch" href="https://adservice.google.com">
        dns_prefetch_pattern = r'<link rel="dns-prefetch" href="https://adservice\.google\.com">\s*'
        content = re.sub(dns_prefetch_pattern, '', content)
        
        # Catch-all for any other googlesyndication links
        # regex to find any script/link with googlesyndication
        # <script ... googlesyndication ... ></script>
        generic_script_pattern = r'<script[^>]*googlesyndication[^>]*>.*?</script>\s*'
        content = re.sub(generic_script_pattern, '', content, flags=re.DOTALL)
        
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned: {os.path.basename(filepath)}")
            return True
        else:
            return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    print("Starting AdSense Removal (Round 2)...")
    count = 0
    for root, dirs, files in os.walk(WEBSITE_ROOT):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                if remove_adsense_code(filepath):
                    count += 1
    
    print(f"Finished. Modified {count} files.")

    # Remove ads.txt
    ads_txt_path = os.path.join(WEBSITE_ROOT, "ads.txt")
    if os.path.exists(ads_txt_path):
        os.remove(ads_txt_path)
        print("Removed ads.txt")
    else:
        print("ads.txt not found (already removed).")

if __name__ == "__main__":
    main()
