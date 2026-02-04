import re
import os

# List of files to update
files_to_update = [
    "ai-profile-picture-dp-prompts.html",
    "instagram-dp-ai-prompts.html",
    "instagram-dp-for-girls-ai-prompts.html",
    "instagram-dp-for-boys-ai-prompts.html",
    "instagram-dp-couple-ai-prompts.html",
    "instagram-dp-black-white-ai-prompts.html",
    "linkedin-profile-men.html",
    "linkedin-profile-women.html",
    "whatsapp-dp-ai-prompts.html",
    "whatsapp-dp-for-boys-ai-prompts.html",
    "whatsapp-dp-for-girls-ai-prompts.html",
    "whatsapp-dp-tamil-ai-prompts.html",
    "anime-avatars.html"
]

for filename in files_to_update:
    try:
        if not os.path.exists(filename):
            print(f"Skipping {filename} - not found")
            continue
            
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace style.css with style.css?v=1
        # Use a regex to flexible match potentially existing query params or just the filename
        # We want to replace href="/style.css" or href="style.css" with href="/style.css?v=2" (using 2 to be sure)
        
        pattern = r'href=["\']/?style\.css(?:\?v=\d+)?["\']'
        replacement = 'href="/style.css?v=2"'
        
        new_content = re.sub(pattern, replacement, content)
        
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ Updated {filename}")
        else:
            print(f"- No changes needed for {filename}")
            
    except Exception as e:
        print(f"✗ Error processing {filename}: {e}")

print("\nDone! Cache busting applied.")
