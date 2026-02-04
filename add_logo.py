import re
import os

# List of files to update (all HTML files using the common navbar)
files_to_update = [
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
]

for filename in files_to_update:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the logo link to include the image
        old_pattern = r'<a class="logo" href="/">PromptImageLab</a>'
        new_pattern = '<a class="logo" href="/"><img src="/images/logo.png" alt="PromptImageLab Logo" class="logo-img">PromptImageLab</a>'
        
        new_content = content.replace(old_pattern, new_pattern)
        
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ Updated {filename}")
        else:
            print(f"- No changes needed for {filename}")
    except FileNotFoundError:
        print(f"✗ File not found: {filename}")
    except Exception as e:
        print(f"✗ Error processing {filename}: {e}")

print("\nDone! Logo added to all navbar files.")
