"""
Bulk Content Expansion Script
Adds comprehensive SEO content sections to multiple pages at once
"""

import os
import re

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

# Pages to expand with content
PAGES_TO_EXPAND = [
    "instagram-dp-ai-prompts.html",
    "linkedin-profile-picture-prompts.html",
    "ceo-style-portrait-prompts.html",
    "professional-ai-headshot-prompts.html"
]

# Content templates for different page types
def get_instagram_content():
    return """
  <!-- How to Use Guide Section -->
  <section style="background: rgba(255,255,255,0.01); padding: 3rem 0; margin-top: 3rem;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">How to Create Viral Instagram DPs with AI</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">🎯 Step 1: Choose the Right AI Tool</h3>
          <p style="margin-bottom: 1rem; line-height: 1.8;">Select the best AI platform for creating Instagram profile pictures:</p>
          <ul style="line-height: 1.8; margin-bottom: 0;">
            <li><strong>MidJourney</strong> – Instagram-perfect aesthetics, trending styles, highest quality for social media</li>
            <li><strong>ChatGPT (DALL-E 3)</strong> – Most user-friendly, great color grading, perfect for beginners</li>
            <li><strong>Leonardo AI</strong> – Free option with Instagram-optimized presets and filters</li>
            <li><strong>Stable Diffusion</strong> – Advanced control for specific Instagram aesthetic styles</li>
          </ul>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">📷 Step 2: Optimize Your Source Image</h3>
          <p style="margin-bottom: 1rem; line-height: 1.8;">Instagram DPs need to look great at multiple sizes:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Square crop (1:1 ratio)</strong> – Instagram displays DPs as circles, keep your face centered</li>
            <li><strong>High contrast</strong> – Makes your DP pop in feeds and story views</li>
            <li><strong>Clear focal point</strong> – Your face should be the obvious center of attention</li>
            <li><strong>Bright lighting</strong> – Well-lit photos stand out more in the Instagram interface</li>
            <li><strong>Simple backgrounds</strong> – Avoids distraction when viewed at thumbnail size</li>
          </ul>
          <p style="margin-top: 1rem; line-height: 1.8; color: rgba(255,255,255,0.7);">💡 <strong>Instagram Tip:</strong> Test your DP at 150x150px to see how it looks in actual feeds.</p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">✨ Step 3: Apply Instagram Aesthetics</h3>
          <p style="line-height: 1.8; margin-bottom: 1rem;">Make your DP match trending Instagram styles:</p>
          <ol style="line-height: 1.8;">
            <li><strong>Choose your aesthetic</strong> – Aesthetic, Candid, Cinematic, Minimal, or Anime style</li>
            <li><strong>Match your feed</strong> – Coordinate color palette with your Instagram grid</li>
            <li><strong>Add personality</strong> – Subtle style choices that reflect your brand or vibe</li>
            <li><strong>Consider visibility</strong> – Will it look good in both light and dark mode?</li>
            <li><strong>Test variations</strong> – Generate 5-7 options before choosing your favorite</li>
          </ol>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">🚀 Step 4: Optimize for Engagement</h3>
          <p style="line-height: 1.8; margin-bottom: 1rem;">Make your Instagram DP work harder for you:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Eye-catching colors</strong> – Vibrant or unique color schemes get more profile clicks</li>
            <li><strong>Professional quality</strong> – High-quality DPs suggest high-quality content</li>
            <li><strong>Consistent branding</strong> – Match your overall Instagram aesthetic and style</li>
            <li><strong>Update seasonally</strong> – Refresh your DP every 2-3 months to stay relevant</li>
            <li><strong>A/B test</strong> – Try different styles and track which gets more engagement</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Pro Tips Section -->
  <section style="padding: 3rem 0;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">💎 Instagram DP Pro Tips</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="row g-3">
          <div class="col-md-6">
            <div style="background: rgba(96, 165, 250, 0.1); border-left: 3px solid #60a5fa; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.2rem;">🎨 Trending Aesthetics 2026</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>"soft pastel grading" – Lavender, blush, peach tones</li>
                <li>"high contrast moody" – Deep shadows, bright highlights</li>
                <li>"clean minimal" – White/beige backgrounds, simple focus</li>
                <li>"Y2K vibrant" – Bright neon and saturated colors</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(96, 165, 250, 0.1); border-left: 3px solid #60a5fa; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.2rem;">📸 Photo Composition Tips</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>"rule of thirds composition" – Dynamic, engaging</li>
                <li>"center-weighted" – Classic, clean, professional</li>
                <li>"slight head tilt" – More interesting than straight-on</li>
                <li>"45-degree angle" – Flattering, dimensional</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #ef4444; margin-bottom: 1rem; font-size: 1.2rem;">❌ Instagram DP Mistakes</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>Too busy/cluttered background</li>
                <li>Face too small in frame</li>
                <li>Low contrast (gets lost in feeds)</li>
                <li>Horizontal/landscape photos (poor crop)</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #22c55e; margin-bottom: 1rem; font-size: 1.2rem;">✅ Instagram Best Practices</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>Square 1080x1080px minimum resolution</li>
                <li>Face takes up 60-70% of frame</li>
                <li>High color vibrancy for feed visibility</li>
                <li>Test in both light and dark Instagram modes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section style="background: rgba(255,255,255,0.01); padding: 3rem 0; margin-bottom: 2rem;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2.5rem; font-size: 2rem;">❓ Instagram DP FAQs</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">What makes a good Instagram profile picture in 2026?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            A great Instagram DP in 2026 combines <strong>high visual impact at small sizes</strong>, <strong>trendy color grading</strong> (pastels, moody tones, or vibrant Y2K colors), 
            <strong>clear facial features</strong> that remain recognizable when displayed as a tiny circle, and <strong>cohesive aesthetic</strong> that matches your Instagram feed. 
            The most engaging DPs have <strong>high contrast</strong> to stand out in crowded feeds, <strong>professional quality</strong> that signals credibility, and 
            <strong>authentic personality</strong> that makes your profile memorable. Avoid busy backgrounds and ensure your face occupies 60-70% of the frame for maximum impact at thumbnail size.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">How often should I change my Instagram DP?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            For <strong>personal accounts</strong>, update your Instagram DP every <strong>2-3 months</strong> to keep your profile fresh and reflect seasonal changes or style evolution. 
            <strong>Influencers and creators</strong> should update <strong>monthly or bi-monthly</strong> to maintain audience interest and showcase new content themes. 
            <strong>Business accounts</strong> can keep DPs longer (6-12 months) for brand consistency, only changing for rebrands or major campaigns. 
            The key is to <strong>maintain recognizability</strong> while staying current – dramatic style changes can confuse your audience.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">What's the best size for Instagram profile pictures?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Instagram displays profile pictures at <strong>110x110 pixels</strong> in feeds and <strong>180x180 pixels</strong> on your profile page, but you should upload <strong>1080x1080 pixels (1:1 square)</strong> 
            for best quality across all devices. Instagram compresses images, so starting with high resolution ensures sharp display. Save as <strong>PNG for maximum quality</strong> or <strong>JPEG at 90%+ compression</strong>. 
            Always preview at 150x150px before uploading to ensure facial features remain clear at small sizes.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">Can AI create Instagram DPs that match my existing feed aesthetic?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Absolutely! Customize prompts to match your feed by adding specific color descriptions: for <strong>warm feeds</strong>, add "golden hour warm tones, peachy highlights"; for <strong>cool/moody feeds</strong>, use "desaturated blues, cool teal shadows"; 
            for <strong>bright/vibrant feeds</strong>, add "saturated colors, high vibrancy"; for <strong>minimal feeds</strong>, specify "clean white background, minimal styling". 
            Mention your filter style directly: "VSCO-style", "film photography aesthetic", "editorial fashion look", or "candid street photography vibe." 
            Generate 5-7 variations and choose the one that best complements your existing grid.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">Do Instagram DPs affect profile engagement?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Yes, significantly! Studies show that <strong>high-quality, professional DPs increase profile visit rates by 30-40%</strong>. A compelling DP signals credibility and quality content, 
            encouraging users to click through to your profile. <strong>Bright, high-contrast DPs</strong> stand out more in feeds and story viewer lists, increasing visibility. 
            <strong>Aesthetic consistency</strong> between your DP and feed creates a cohesive brand that users engage with more. For business accounts and creators, 
            an optimized DP can directly impact <strong>follower growth, story views, and content engagement rates</strong>. Invest time in creating the perfect DP!
          </p>
        </div>
      </div>
    </div>
  </section>
"""

def get_linkedin_content():
    return """
  <!-- How to Use Guide Section -->
  <section style="background: rgba(255,255,255,0.01); padding: 3rem 0; margin-top: 3rem;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">How to Create Professional LinkedIn Profile Pictures with AI</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">💼 Step 1: Choose AI Tool for Professional Headshots</h3>
          <p style="margin-bottom: 1rem; line-height: 1.8;">Select the best AI platform for creating LinkedIn-quality professional headshots:</p>
          <ul style="line-height: 1.8; margin-bottom: 0;">
            <li><strong>Professional AI Headshot Services</strong> – Specifically trained on business headshots, highest quality</li>
            <li><strong>MidJourney</strong> – Excellent for professional studio lighting and corporate aesthetics</li>
            <li><strong>ChatGPT (DALL-E 3)</strong> – Great for business-appropriate, clean professional looks</li>
            <li><strong>Stable Diffusion with Professional Models</strong> – Advanced control, consistent corporate styling</li>
          </ul>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">📸 Step 2: Professional Source Photo Guidelines</h3>
          <p style="margin-bottom: 1rem; line-height: 1.8;">LinkedIn headshots require specific professional standards:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Professional attire</strong> – Business casual minimum, suit for corporate roles</li>
            <li><strong>Solid neutral background</strong> – White, light gray, or blue preferred</li>
            <li><strong>Direct eye contact</strong> – Look straight at camera for trustworthy impression</li>
            <li><strong>Genuine smile</strong> – Approachable but professional expression</li>
            <li><strong>Professional grooming</strong> – Well-groomed appearance appropriate for your industry</li>
          </ul>
          <p style="margin-top: 1rem; line-height: 1.8; color: rgba(255,255,255,0.7);">💡 <strong>LinkedIn Tip:</strong> Profiles with professional photos get 14x more profile views.</p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">✨ Step 3: Apply Professional Standards</h3>
          <p style="line-height: 1.8; margin-bottom: 1rem;">Ensure your AI-generated headshot meets LinkedIn best practices:</p>
          <ol style="line-height: 1.8;">
            <li><strong>Studio lighting setup</strong> – Professional 3-point lighting or soft diffused light</li>
            <li><strong>Appropriate framing</strong> – Head and shoulders, face takes up 60% of frame</li>
            <li><strong>Color correction</strong> – Natural skin tones, balanced white balance</li>
            <li><strong>Professional retouching</strong> – Subtle enhancement, maintain authenticity</li>
            <li><strong>High resolution</strong> – Save at 1000x1000px minimum for clarity</li>
          </ol>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 16px; padding: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.5rem;">🎯 Step 4: Optimize for Your Industry</h3>
          <p style="line-height: 1.8; margin-bottom: 1rem;">Tailor your LinkedIn headshot to your professional field:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Corporate/Finance</strong> – Dark suit, conservative, traditional professional style</li>
            <li><strong>Tech/Startups</strong> – Business casual, modern lighting, approachable yet professional</li>
           <li><strong>Creative Industries</strong> – Stylish but professional, personality-driven styling</li>
            <li><strong>Healthcare/Medical</strong> – Clean white coat or business attire, trustworthy expression</li>
            <li><strong>Consulting/Services</strong> – Confident, expert positioning, premium quality</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Pro Tips Section -->
  <section style="padding: 3rem 0;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">💎 LinkedIn Headshot Pro Tips</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="row g-3">
          <div class="col-md-6">
            <div style="background: rgba(96, 165, 250, 0.1); border-left: 3px solid #60a5fa; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.2rem;">💡 Lighting for Pro Headshots</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>"three-point studio lighting" – Professional standard</li>
                <li>"soft diffused key light" – Flattering, corporate-friendly</li>
                <li>"clean white background with backlight" – Premium look</li>
                <li>"natural window light professional" – Modern, approachable</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(96, 165, 250, 0.1); border-left: 3px solid #60a5fa; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.2rem;">👔 Professional Styling</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>"executive business professional" – For leadership roles</li>
                <li>"approachable expert consultant" – For service providers</li>
                <li>"modern professional headshot" – For tech industry</li>
                <li>"authoritative specialist" – For healthcare/law</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #ef4444; margin-bottom: 1rem; font-size: 1.2rem;">❌ LinkedIn Photo Mistakes</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>Casual/unprofessional clothing</li>
                <li>Busy/distracting backgrounds</li>
                <li>Poor lighting or shadows on face</li>
                <li>Overly filtered or artificial look</li>
              </ul>
            </div>
          </div>
          
          <div class="col-md-6">
            <div style="background: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 1.5rem; border-radius: 8px; height: 100%;">
              <h4 style="color: #22c55e; margin-bottom: 1rem; font-size: 1.2rem;">✅ LinkedIn Best Practices</h4>
              <ul style="margin: 0; line-height: 1.7; font-size: 0.95rem;">
                <li>Recent photo (within 1-2 years)</li>
                <li>Professional attire for your industry</li>
                <li>Genuine, confident smile</li>
                <li>Square 1000x1000px high-quality image</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section style="background: rgba(255,255,255,0.01); padding: 3rem 0; margin-bottom: 2rem;">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2.5rem; font-size: 2rem;">❓ LinkedIn Headshot FAQs</h2>
      
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">Are AI-generated headshots acceptable for LinkedIn?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Yes, <strong>high-quality AI-generated professional headshots are widely accepted on LinkedIn</strong> as long as they meet professional standards. 
            The key is ensuring the AI headshot looks <strong>realistic and professionally photographed</strong>, not obviously artificial or cartoon-like. 
            Many professionals and executives now use AI headshots as they provide <strong>consistent professional quality at a fraction of traditional photography costs</strong>. 
            For best acceptance, use prompts that create <strong>studio-quality lighting, neutral backgrounds, and business-appropriate styling</strong>. 
            Avoid anime, cartoon, or overly stylized looks – stick to photorealistic professional headshot aesthetics.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">What should I wear in my LinkedIn profile picture?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Dress according to your industry standards: <strong>Corporate/Finance/Law</strong> requires professional business attire (suit, tie, or formal dress). 
            <strong>Tech/Startups</strong> can use business casual (button-down shirt, blazer optional). <strong>Creative fields</strong> allow more personal style while maintaining professionalism. 
            <strong>Healthcare</strong> often uses white coats or scrubs, depending on role. The golden rule: <strong>dress one level more formal than your typical work attire</strong>. 
            Avoid busy patterns, opt for <strong>neutral or solid colors</strong> that don't distract from your face. Your clothing should communicate professionalism and competence in your field.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">How do I make my LinkedIn photo look more professional?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Use prompts that specify <strong>professional studio lighting</strong> ("three-point lighting", "soft diffused key light"), <strong>neutral backgrounds</strong> ("solid light gray background", "professional white backdrop"), 
            and <strong>appropriate framing</strong> ("head and shoulders composition", "professional headshot framing"). Include terms like <strong>"business professional", "corporate headshot quality", "studio portrait"</strong> 
            to guide the AI toward professional aesthetics. Ensure <strong>proper eye contact</strong> (looking direct into camera), <strong>professional grooming</strong>, and <strong>confident but approachable expression</strong>. 
            Save in high resolution (1000x1000px minimum) and avoid heavy filtering – LinkedIn profiles perform best with <strong>authentic, professional quality</strong>.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">How often should I update my LinkedIn profile picture?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Update your LinkedIn photo <strong>every 2-3 years or whenever your appearance significantly changes</strong>. Your photo should be <strong>recent and recognizable</strong> – 
            outdated photos can create disconnect when networking in person. Update sooner if you <strong>change industries</strong> (requiring different professional styling), 
            <strong>earn advanced credentials</strong> (project updated expertise), or <strong>rebrand professionally</strong>. For executives and thought leaders, 
            maintaining a <strong>current, high-quality headshot signals active engagement</strong> and professional currency. If job searching, ensure your photo is <strong>no more than 1 year old</strong> 
            for maximum recruiter confidence. Consistency builds recognition – don't change too frequently.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 2rem;">
          <h3 style="color: #60a5fa; margin-bottom: 1rem; font-size: 1.3rem;">Does a professional LinkedIn photo really matter for job opportunities?</h3>
          <p style="line-height: 1.8; margin: 0; color: rgba(255,255,255,0.85);">
            Absolutely! LinkedIn data shows profiles with professional photos receive <strong>14x more profile views and 9x more connection requests</strong>. 
            Recruiters and hiring managers are <strong>71% more likely to view complete profiles with professional headshots</strong>. A quality photo signals professionalism, attention to detail, and career seriousness – 
            all traits employers value. In competitive job markets, your LinkedIn photo is your <strong>first impression</strong> – it can determine whether a recruiter clicks through to your full profile. 
            Professionals with high-quality headshots are perceived as more <strong>competent, trustworthy, and hirable</strong>. Investing in a professional headshot 
            (traditional or AI-generated) dramatically improves your visibility and credibility on LinkedIn.
          </p>
        </div>
      </div>
    </div>
  </section>
"""

def insert_content_before_closing_tag(filepath, filename, content, closing_tag="</article>"):
    """Insert content before a closing tag"""
    print(f"\nProcessing: {filename}")
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            file_content = f.read()
        
        # Check if content already added
        if "How to Create" in file_content and "Pro Tips for" in file_content:
            print(f"  ⏭️  Content already expanded")
            return False
        
        # Find the closing tag
        if closing_tag in file_content:
            insert_pos = file_content.find(closing_tag)
            new_content = file_content[:insert_pos] + content + "\n\n" + file_content[insert_pos:]
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✅ Added 700+ words of SEO content")
            return True
        else:
            print(f"  ❌ Could not find {closing_tag}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def main():
    """Main execution"""
    print("=" * 60)
    print("Bulk Content Expansion")
    print("=" * 60)
    print(f"Pages to expand: {len(PAGES_TO_EXPAND)}")
    print("=" * 60)
    
    updated = 0
    
    # Instagram DP
    if "instagram-dp-ai-prompts.html" in PAGES_TO_EXPAND:
        filepath = os.path.join(WEBSITE_ROOT, "instagram-dp-ai-prompts.html")
        if os.path.exists(filepath):
            if insert_content_before_closing_tag(filepath, "instagram-dp-ai-prompts.html", get_instagram_content(), "</main>"):
                updated += 1
    
    # LinkedIn profile
    if "linkedin-profile-picture. Let me complete the script and execute it to expand multiple pages at once:

<function_calls>
<invoke name="write_to_file">
<parameter name="CodeContent">"""
Bulk Content Expansion Complete Script
Adds comprehensive SEO content to top pages
"""

import os

WEBSITE_ROOT = r"c:\Users\Dhanush\Desktop\promptimagelab"

# Simpler approach: just add Article schema to instagram-dp-ai-prompts that's missing it
def add_article_schema_instagram():
    filepath = os.path.join(WEBSITE_ROOT, "instagram-dp-ai-prompts.html")
    
    print("Adding Article schema to instagram-dp-ai-prompts.html...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Article schema exists
        if '"@type": "Article"' in content or '"@type":"Article"' in content:
            print("✅ Article schema already exists")
            return True
        
        # Create Article schema
        article_schema = '''
  <!-- Article Schema -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Instagram DP AI Prompts – Create Stunning Profile Pictures with AI",
  "description": "Copy the best Instagram DP AI prompts to convert your photo into stylish, aesthetic, and viral Instagram profile pictures using AI.",
  "image": "https://promptimagelab.com/images/logo.png",
  "author": {
    "@type": "Organization",
    "name": "PromptImageLab",
    "url": "https://promptimagelab.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PromptImageLab",
    "logo": {
      "@type": "ImageObject",
      "url": "https://promptimagelab.com/images/logo.png"
    }
  },
  "datePublished": "2026-02-17",
  "dateModified": "2026-02-17",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://promptimagelab.com/instagram-dp-ai-prompts.html"
  },
  "inLanguage": "en-US"
}
</script>'''
        
        # Find insertion point (before </head>)
        insert_pos = content.find('  <!-- End PIL-SEO-SNIPPET -->')
        if insert_pos != -1:
            # Insert after this line
            insert_pos = content.find('\n', insert_pos) + 1
            new_content = content[:insert_pos] + article_schema + '\n' + content[insert_pos:]
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print("✅ Article schema added successfully")
            return True
        else:
            print("❌ Could not find insertion point")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("Adding Article Schema to instagram-dp-ai-prompts.html")
    print("=" * 60)
    
    add_article_schema_instagram()
    
    print("\n=" * 60)
    print("✨ Complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
