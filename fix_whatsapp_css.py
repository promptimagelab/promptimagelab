import re

# List of files to fix (WhatsApp pages that are missing style.css)
files_to_update = [
    "whatsapp-dp-ai-prompts.html",
    "whatsapp-dp-for-girls-ai-prompts.html",
    "whatsapp-dp-for-boys-ai-prompts.html",
    "whatsapp-dp-tamil-ai-prompts.html"
]

for filename in files_to_update:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace theme.css with style.css?v=2
        # Pattern matches <link rel="stylesheet" href="/assets/css/theme.css">
        pattern = r'<link rel="stylesheet" href="/assets/css/theme\.css">'
        replacement = '<link rel="stylesheet" href="/style.css?v=2">'
        
        new_content = re.sub(pattern, replacement, content)
        
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ Fixed CSS link in {filename}")
        else:
            print(f"- No changes needed for {filename} (might already be updated or pattern mismatch)")
            
            # Debug: check if it has style.css
            if 'style.css' not in content:
                print(f"  WARNING: {filename} does not contain style.css link!")
            
    except Exception as e:
        print(f"✗ Error processing {filename}: {e}")

print("\nDone! WhatsApp pages updated to use common style.css.")
