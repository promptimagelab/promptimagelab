"""
Bulk Page Transformer for AdSense Readiness
Adds Methodology, Enhanced FAQ, and Disclaimer sections to all pages
"""

import os
import re
from pathlib import Path

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

# Standard Methodology Section
METHODOLOGY_SECTION = """
  <!-- Methodology Section -->
  <section style="background: rgba(255,255,255,0.01); padding: 3rem 0; margin-top: 3rem;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">📚 How We Create These AI Prompt Examples</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2.5rem;">
          <p style="line-height: 1.8; margin-bottom: 1.5rem;">
            At PromptImageLab, our research team develops and tests AI prompt examples through a systematic 
            evaluation process to ensure quality and effectiveness across multiple AI platforms.
          </p>

          <h3 style="color: #60a5fa; margin: 2rem 0 1rem; font-size: 1.3rem;">Development Process</h3>
          <ul style="line-height: 1.9; margin-bottom: 2rem;">
            <li><strong>Multi-Platform Testing:</strong> Each prompt is tested across MidJourney, DALL-E 3, 
                and Stable Diffusion to ensure broad compatibility and consistent quality</li>
            <li><strong>Iterative Refinement:</strong> Prompts are refined based on output quality, consistency, 
                and ease of customization for different use cases</li>
            <li><strong>Real-World Application:</strong> Examples are informed by practical use cases, photography 
                principles, and current AI platform capabilities</li>
            <li><strong>Educational Focus:</strong> Each prompt includes educational context explaining why 
                specific elements work and how to adapt them</li>
          </ul>

          <h3 style="color: #60a5fa; margin: 2rem 0 1rem; font-size: 1.3rem;">Quality Standards</h3>
          <ul style="line-height: 1.9; margin-bottom: 2rem;">
            <li><strong>Consistency:</strong> Prompts must produce reliable, high-quality results across 
                different AI platforms and versions</li>
            <li><strong>Clarity:</strong> Examples use clear, descriptive language that's accessible to 
                beginners while offering depth for advanced users</li>
            <li><strong>Customizability:</strong> Prompts are structured as templates that users can easily 
                modify for their specific needs</li>
            <li><strong>Technical Accuracy:</strong> Photography and design terminology is used precisely 
                to guide AI output effectively</li>
          </ul>

          <h3 style="color: #60a5fa; margin: 2rem 0 1rem; font-size: 1.3rem;">Limitations & Transparency</h3>
          <p style="line-height: 1.8; margin-bottom: 1rem;">
            <strong>Platform Variability:</strong> AI outputs vary based on the specific platform, version, 
            model, and even the input image quality. These prompts serve as educational starting points 
            requiring user customization.
          </p>
          <p style="line-height: 1.8; margin-bottom: 1rem;">
            <strong>No Guarantees:</strong> Results depend on multiple factors including source image quality, 
            AI platform capabilities, and individual platform updates or changes.
          </p>
          <p style="line-height: 1.8;">
            <strong>Attribution:</strong> Content is developed by the PromptImageLab Research Team with input 
            from photography, design, and AI prompting best practices. We do not claim to be professional 
            photographers or AI engineers, but rather educators helping users learn effective prompting techniques.
          </p>
        </div>
      </div>
    </div>
  </section>
"""

# Standard Disclaimer Section
DISCLAIMER_SECTION = """
  <!-- Disclaimer Section -->
  <section style="padding: 3rem 0; margin-bottom: 2rem;">
    <div class="container">
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(239, 68, 68, 0.05); border-left: 4px solid #ef4444; border-radius: 12px; padding: 2rem;">
          <h2 style="color: #ef4444; margin-bottom: 1.5rem; font-size: 1.5rem;">⚠️ Educational Resource Disclaimer</h2>
          
          <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem; color: rgba(255,255,255,0.9);">Purpose of This Site</h3>
          <p style="line-height: 1.8; margin-bottom: 1.5rem;">
            <strong>PromptImageLab is an educational resource</strong> designed to help users understand and 
            effectively use AI image generation tools. Our mission is to teach prompting techniques, explain 
            how different AI platforms work, and provide learning resources for creative AI applications.
          </p>

          <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem; color: rgba(255,255,255,0.9);">What We Do NOT Do</h3>
          <ul style="line-height: 1.8; margin-bottom: 1.5rem;">
            <li><strong>We do not generate images:</strong> This site provides educational guidance only. 
                Users must use their own AI platform accounts (MidJourney, ChatGPT, etc.) to create images</li>
            <li><strong>We do not sell prompts:</strong> All content is provided for educational purposes. 
                We do not sell prompt packs, courses, or related products</li>
            <li><strong>We do not guarantee results:</strong> AI outputs vary significantly. We cannot 
                guarantee specific outcomes from any AI platform</li>
          </ul>

          <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem; color: rgba(255,255,255,0.9);">AI Limitations & Ethical Use</h3>
          <p style="line-height: 1.8; margin-bottom: 1.5rem;">
            <strong>Understand AI Limitations:</strong> AI-generated images can vary in quality, accuracy, 
            and appropriateness. Users should critically evaluate all AI outputs and understand that AI 
            tools have inherent biases and limitations.
          </p>
          <p style="line-height: 1.8; margin-bottom: 1.5rem;">
            <strong>Use AI Responsibly:</strong> Users are responsible for using AI tools ethically and 
            legally. This includes respecting copyright, avoiding harmful content generation, and complying 
            with the terms of service of whichever AI platform they choose to use.
          </p>

          <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem; color: rgba(255,255,255,0.9);">Intended Use</h3>
          <p style="line-height: 1.8; margin: 0;">
            This content is intended for <strong>educational and personal learning purposes</strong>. 
            If you plan to use AI-generated content commercially, ensure you comply with the specific 
            terms of service and licensing requirements of the AI platform you're using.
          </p>
        </div>
      </div>
    </div>
  </section>
"""

def add_sections_before_footer(filepath):
    """Add methodology and disclaimer sections before footer"""
    print(f"Processing: {os.path.basename(filepath)}")
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Skip if already has methodology
        if "How We Create These AI Prompt Examples" in content:
            print(f"  ⏭️  Already has methodology section")
            return False
        
        # Find footer or closing article tag
        footer_markers = [
            '  <!-- ===== FOOTER ===== -->',
            '  </article>',
            '<footer'
        ]
        
        insert_pos = -1
        for marker in footer_markers:
            pos = content.find(marker)
            if pos != -1:
                insert_pos = pos
                break
        
        if insert_pos == -1:
            print(f"  ❌ Could not find insertion point")
            return False
        
        # Insert sections
        new_content = (
            content[:insert_pos] + 
            "\n" + METHODOLOGY_SECTION + "\n" + 
            DISCLAIMER_SECTION + "\n\n" + 
            content[insert_pos:]
        )
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Added methodology + disclaimer sections")
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Add methodology and disclaimer to all content pages"""
    print("=" * 70)
    print("Adding Methodology & Disclaimer Sections to All Pages")
    print("=" * 70)
    
    # Pages that should NOT get these sections
    skip_pages = ['index.html', 'about.html', 'contact.html', 'privacy-policy.html']
    
    updated = 0
    skipped = 0
    
    html_files = Path(WEBSITE_ROOT).glob('*.html')
    
    for filepath in sorted(html_files):
        filename = filepath.name
        
        # Skip certain pages
        if filename in skip_pages or 'original' in filename.lower():
            print(f"⏭️  Skipping: {filename}")
            skipped += 1
            continue
        
        if add_sections_before_footer(str(filepath)):
            updated += 1
    
    print("\n" + "=" * 70)
    print(f"✅ Updated: {updated} pages")
    print(f"⏭️  Skipped: {skipped} pages")
    print("=" * 70)

if __name__ == "__main__":
    main()
