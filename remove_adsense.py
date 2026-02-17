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
        # We need to be careful to match the full tag content across lines
        ad_unit_pattern = r'<ins class="adsbygoogle"[\s\S]*?</ins>\s*'
        content = re.sub(ad_unit_pattern, '', content)

        # 3. Remove Ad Push Scripts
        # Matches: <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>
        # Allowing for some whitespace variations
        push_script_pattern = r'<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);\s*</script>\s*'
        content = re.sub(push_script_pattern, '', content)
        
        # 4. Remove any other Google Syndication links if they exist in script tags (catch-all for safety)
        # regex to find src="...googlesyndication..."
        # This is a bit risky if not precise, so rely on the specific patterns first.
        
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
    print("Starting AdSense Removal...")
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
        print("ads.txt not found.")

if __name__ == "__main__":
    main()
