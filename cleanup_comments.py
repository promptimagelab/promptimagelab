import os
import re

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

def cleanup_comments(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        
        # Replace double comment closures "-->\n-->" or "-->\s*-->"
        # We want to keep one "-->"
        
        # Pattern: --> followed by whitespace/newlines followed by -->
        pattern = r'-->\s*-->'
        
        def replace(match):
            return "-->"
            
        new_content = re.sub(pattern, replace, content)

        if new_content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned: {os.path.basename(filepath)}")
            return True
        else:
            return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    print("Cleaning up comments...")
    count = 0
    for root, dirs, files in os.walk(WEBSITE_ROOT):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                if cleanup_comments(filepath):
                    count += 1
    
    print(f"Finished. Modified {count} files.")

if __name__ == "__main__":
    main()
