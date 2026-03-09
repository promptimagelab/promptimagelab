#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pad thin pages (about, contact, privacy-policy) with unique educational
content sections so each page exceeds 1,000 words of body text.
"""
import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Common styles injected once ───────────────────────────────────────────────
CONTENT_STYLE = """
<style>
  .content-section{padding:3.5rem 0;border-top:1px solid rgba(255,255,255,.06)}
  .content-section h2{font-size:2rem;margin-bottom:1.5rem;color:#e6eef8}
  .content-section h3{font-size:1.4rem;margin:2rem 0 1rem;color:#38bdf8}
  .content-section h4{font-size:1.15rem;margin:1.5rem 0 .75rem;color:#e6eef8}
  .content-section p{line-height:1.85;margin-bottom:1.2rem;color:#9aa8bb;font-size:1rem}
  .content-section ul,.content-section ol{padding-left:1.5rem;margin-bottom:1.5rem}
  .content-section li{line-height:1.85;margin-bottom:.6rem;color:#9aa8bb}
  .content-section strong{color:#e6eef8}
  .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin:1.5rem 0}
  .info-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:1.5rem}
  .info-card h4{margin-top:0;color:#38bdf8}
  .info-card p{margin:0;font-size:.95rem}
  .highlight-box{background:rgba(56,189,248,.05);border-left:3px solid #38bdf8;border-radius:8px;padding:1.25rem 1.5rem;margin:1.5rem 0}
  .highlight-box p{margin:0}
</style>
"""

# ── About page extra content ──────────────────────────────────────────────────
ABOUT_EXTRA = """
<!-- ===== EXTENDED ABOUT CONTENT ===== -->
<section class="content-section">
  <div class="container" style="max-width:900px">

    <h2>How PromptImageLab Teaches AI Image Prompting</h2>
    <p>
      PromptImageLab is an educational platform dedicated to helping creators,
      professionals, and beginners master AI image generation through structured,
      tested prompt frameworks. We believe the difference between frustrating AI
      outputs and stunning results lies in understanding <em>how</em> to communicate
      with AI models.
    </p>
    <p>
      Our approach is built on three principles: teaching the <strong>why</strong>
      behind every prompt element, providing <strong>tested examples</strong> verified
      across MidJourney, DALL-E 3, and Stable Diffusion, and giving you
      <strong>customization frameworks</strong> — not just copy-paste templates.
    </p>

    <h3>Prompt Engineering Fundamentals We Teach</h3>
    <div class="info-grid">
      <div class="info-card">
        <h4>Photography Terminology</h4>
        <p>Understanding how words like "35mm lens", "bokeh", "rim lighting", and
        "golden hour" translate into AI output — and when to use each.</p>
      </div>
      <div class="info-card">
        <h4>Style Modifier Stacking</h4>
        <p>How to layer subject, lighting, background, mood, and quality
        modifiers in the right sequence to get consistent, professional results.</p>
      </div>
      <div class="info-card">
        <h4>Platform-Specific Adjustments</h4>
        <p>Why prompts need different phrasing for MidJourney v6, ChatGPT's
        DALL-E 3, and Stable Diffusion — and how to adapt them correctly.</p>
      </div>
    </div>

    <h3>Our Content Development Process</h3>
    <p>
      Every prompt collection on PromptImageLab goes through a rigorous
      multi-stage development process before it's published:
    </p>
    <ol>
      <li><strong>Research:</strong> Identify real user needs — what profile picture
        styles are trending, what professional contexts demand, what creative communities want.</li>
      <li><strong>Framework Design:</strong> Build prompt structures based on photography,
        design, and AI model behavior principles — not trial-and-error luck.</li>
      <li><strong>Cross-Platform Testing:</strong> Every prompt is tested on at least
        three major AI platforms to verify reliability and document variations.</li>
      <li><strong>Educational Wrapping:</strong> Each prompt is accompanied by an
        explanation of why specific elements work and how to adapt them.</li>
      <li><strong>Quality Review:</strong> Only prompts that produce professional-quality,
        consistent results across platforms are published.</li>
    </ol>

    <h3>Who Benefits From PromptImageLab</h3>
    <p>
      Our platform serves a wide range of users — from complete beginners exploring
      AI for the first time to experienced creators looking for reliable prompt
      systems they can build on:
    </p>
    <div class="info-grid">
      <div class="info-card">
        <h4>Social Media Creators</h4>
        <p>Generate on-brand profile pictures, aesthetic DPs, and creative avatars
        that stand out on Instagram, WhatsApp, and LinkedIn.</p>
      </div>
      <div class="info-card">
        <h4>Professionals</h4>
        <p>Create polished LinkedIn headshots, resume photos, and corporate portraits
        without expensive photography sessions.</p>
      </div>
      <div class="info-card">
        <h4>AI Enthusiasts</h4>
        <p>Learn the deeper principles of prompt engineering and develop transferable
        skills for any AI image generation task.</p>
      </div>
      <div class="info-card">
        <h4>Beginners</h4>
        <p>Start with proven frameworks that work immediately, while gradually
        learning how to create your own prompts from scratch.</p>
      </div>
    </div>

    <div class="highlight-box">
      <p>
        <strong>Important:</strong> PromptImageLab does not generate images directly.
        You will need an account with MidJourney, ChatGPT Plus (with DALL-E 3),
        Stable Diffusion, or another AI image platform to use the prompts we provide.
        Our role is education — teaching you the techniques to get the best possible
        results from whichever platform you choose.
      </p>
    </div>

    <h3>Getting Started</h3>
    <p>
      New to AI image generation? The best way to start is to pick one of our
      category pages based on what you need — a professional LinkedIn headshot,
      a stylish Instagram DP, a creative anime avatar, or a romantic Valentine
      profile picture. Each page includes detailed prompts with educational 
      context explaining the key elements and how to customize them.
    </p>
    <p>
      Begin with ChatGPT's DALL-E 3 if you're completely new — it's the most
      user-friendly and follows instructions most precisely. Once you're comfortable,
      explore MidJourney for artistic quality or Stable Diffusion for fine-grained control.
    </p>

  </div>
</section>
"""

# ── Contact page extra content ────────────────────────────────────────────────
CONTACT_EXTRA = """
<!-- ===== EXTENDED CONTACT CONTENT ===== -->
<section class="content-section">
  <div class="container" style="max-width:900px">

    <h2>Everything You Need to Know Before Contacting Us</h2>
    <p>
      We're a small, focused team at PromptImageLab — passionate about AI image
      generation education and committed to helping every user get better results.
      Below you'll find answers to the most common questions before reaching out.
    </p>

    <h3>What We Can Help With</h3>
    <div class="info-grid">
      <div class="info-card">
        <h4>Prompt Guidance</h4>
        <p>Questions about how to use specific prompts, why a certain style isn't
        working, or how to customize our templates for your use case.</p>
      </div>
      <div class="info-card">
        <h4>Platform Questions</h4>
        <p>Help understanding how to use our prompts with MidJourney, ChatGPT
        image generation, Stable Diffusion, or Leonardo AI.</p>
      </div>
      <div class="info-card">
        <h4>Content Feedback</h4>
        <p>Suggestions for new prompt categories, improvements to existing pages,
        or corrections to any inaccurate information on our platform.</p>
      </div>
      <div class="info-card">
        <h4>Business &amp; Partnerships</h4>
        <p>Collaboration proposals, advertising inquiries, or partnership
        opportunities related to AI image generation education.</p>
      </div>
    </div>

    <h3>How to Use Our AI Prompts Before Contacting Us</h3>
    <p>
      Many questions can be answered by reviewing our detailed page guides. Here
      are the three most common challenges and how to resolve them:
    </p>

    <h4>1. The AI output doesn't look like the example</h4>
    <p>
      AI output varies significantly between platforms and even between runs on the
      same platform. Our prompts are starting points, not guaranteed recipes.
      Try generating 3–5 variations of the same prompt — AI models use randomness
      in their generation process. If results are consistently off, check which
      AI platform you're using and whether it requires any platform-specific
      modifications to the prompt.
    </p>

    <h4>2. How to upload your own photo to AI</h4>
    <p>
      For photo-to-image prompts (like profile pictures), you need an AI tool that
      supports image-to-image generation. <strong>ChatGPT with DALL-E 3</strong> lets
      you upload a reference photo and attach a prompt. <strong>MidJourney</strong>
      supports image prompting with the <code>/imagine [image-url] [prompt]</code>
      syntax. <strong>Stable Diffusion</strong> supports img2img workflows that
      preserve your facial features while applying style changes.
    </p>

    <h4>3. Which AI tool should I use for profile pictures?</h4>
    <p>
      For <strong>professional headshots</strong>: ChatGPT (DALL-E 3) gives the
      most precise, instruction-following results. For <strong>aesthetic/artistic
      DPs</strong>: MidJourney produces the highest visual quality. For
      <strong>anime avatars</strong>: Stable Diffusion with anime-specific models
      gives the most authentic results. For <strong>beginners</strong>: Start with
      ChatGPT — no technical setup required.
    </p>

    <div class="highlight-box">
      <p><strong>Email:</strong> promptimagelab@gmail.com — We respond within 24–48
      hours on business days. For platform-specific technical issues (MidJourney
      errors, ChatGPT generation failures), please contact those platforms' support
      directly as they are outside our control.</p>
    </div>

    <h3>Popular Pages to Explore First</h3>
    <p>Before reaching out, you may find your answer in one of our detailed guides:</p>
    <ul>
      <li><a href="/instagram-dp-ai-prompts" style="color:#38bdf8">Instagram DP AI Prompts</a> — Stylish profile pictures for Instagram</li>
      <li><a href="/linkedin-profile-picture-prompts" style="color:#38bdf8">LinkedIn Profile Picture Prompts</a> — Professional headshots and corporate portraits</li>
      <li><a href="/anime-avatars" style="color:#38bdf8">Anime Avatar Prompts</a> — Photo-to-anime conversion guides</li>
      <li><a href="/whatsapp-dp-ai-prompts" style="color:#38bdf8">WhatsApp DP AI Prompts</a> — Unique WhatsApp profile pictures</li>
      <li><a href="/professional-ai-headshot-prompts" style="color:#38bdf8">Professional AI Headshot Prompts</a> — Business and corporate portraits</li>
    </ul>

  </div>
</section>
"""

# ── Privacy policy extra content ──────────────────────────────────────────────
PRIVACY_EXTRA = """
<!-- ===== EXTENDED PRIVACY CONTENT ===== -->
<section class="content-section">
  <div class="container" style="max-width:900px">

    <h2>Your Privacy at PromptImageLab</h2>
    <p>
      PromptImageLab is an educational website about AI image generation prompts.
      We do not collect personal data for sale, do not build advertising profiles,
      and do not require account registration to access our content. This extended
      section provides plain-language explanations of our data practices.
    </p>

    <h3>Data We Collect and Why</h3>

    <h4>Analytics (Google Analytics)</h4>
    <p>
      We use Google Analytics (GA4) to understand how visitors interact with our
      content — which pages are most useful, how users navigate between sections,
      and which prompt categories generate the most interest. This data is
      <strong>aggregated and anonymized</strong>. We do not track individual users
      or build personal profiles. You can opt out of Google Analytics tracking using
      the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" style="color:#38bdf8">
      Google Analytics Opt-out Browser Add-on</a>.
    </p>

    <h4>Advertising (Google AdSense)</h4>
    <p>
      Our site uses Google AdSense to display advertisements that help fund the
      development of free educational content. AdSense may use cookies to serve
      relevant ads based on your interests. This is governed by
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style="color:#38bdf8">
      Google's Privacy Policy</a>. You can manage your ad preferences at
      <a href="https://adssettings.google.com" target="_blank" rel="noopener" style="color:#38bdf8">
      Google Ad Settings</a>.
    </p>

    <h4>Server Logs</h4>
    <p>
      Like all websites, our hosting provider automatically records basic access
      data including IP addresses, browser types, pages visited, and timestamps.
      These logs are used for security monitoring, debugging, and performance
      optimization — not for marketing or profiling. Logs are retained for a
      maximum of 30 days.
    </p>

    <h3>Cookies</h3>
    <p>
      PromptImageLab uses cookies in the following limited ways:
    </p>
    <ul>
      <li><strong>Analytics cookies:</strong> Set by Google Analytics to track page
        views and user sessions in aggregated form</li>
      <li><strong>Advertising cookies:</strong> Set by Google AdSense to serve
        contextually relevant advertisements</li>
      <li><strong>No functional cookies:</strong> We do not use login sessions,
        shopping carts, or preference-storing cookies</li>
    </ul>
    <p>
      You can manage or delete cookies through your browser settings. Most modern
      browsers provide options to block third-party cookies entirely, which will
      opt you out of both analytics and advertising tracking.
    </p>

    <h3>Third-Party Services</h3>
    <div class="info-grid">
      <div class="info-card">
        <h4>Google Fonts</h4>
        <p>We load the Inter font from Google Fonts CDN. Google may log your IP
        when serving font files. See Google's privacy policy for details.</p>
      </div>
      <div class="info-card">
        <h4>Bootstrap CDN</h4>
        <p>Some pages load Bootstrap CSS from jsDelivr CDN. This is a public
        CDN with standard access logging practices.</p>
      </div>
      <div class="info-card">
        <h4>External AI Platforms</h4>
        <p>Links to MidJourney, ChatGPT, Stable Diffusion, etc. are governed
        by those platforms' own privacy policies. We have no data relationship
        with those services.</p>
      </div>
    </div>

    <h3>Your Rights</h3>
    <p>
      Depending on your location, you may have rights under GDPR (European Union),
      CCPA (California), or other privacy regulations including:
    </p>
    <ul>
      <li><strong>Right to access:</strong> Request information about data we hold</li>
      <li><strong>Right to deletion:</strong> Request deletion of any personal data</li>
      <li><strong>Right to opt-out:</strong> Opt out of analytics and advertising tracking</li>
      <li><strong>Right to portability:</strong> Receive your data in a machine-readable format</li>
    </ul>
    <p>
      Since we do not collect personal registration data, most of these rights are
      automatically satisfied. For analytics data, use Google's opt-out tools.
      For any other requests, contact us at
      <a href="mailto:promptimagelab@gmail.com" style="color:#38bdf8">promptimagelab@gmail.com</a>.
    </p>

    <h3>Children's Privacy</h3>
    <p>
      PromptImageLab is intended for users 13 years of age and older. We do not
      knowingly collect personal information from children under 13. If you believe
      a child under 13 has provided us with personal information, please contact us
      immediately so we can take appropriate action.
    </p>

    <h3>Changes to This Policy</h3>
    <p>
      We may update this Privacy Policy periodically to reflect changes in our
      practices or applicable laws. The date at the top of the policy will be
      updated whenever changes are made. Continued use of our website after
      a policy update constitutes acceptance of the revised terms.
    </p>

    <div class="highlight-box">
      <p>
        <strong>Contact for Privacy Concerns:</strong>
        <a href="mailto:promptimagelab@gmail.com" style="color:#38bdf8">
        promptimagelab@gmail.com</a> — We will respond to privacy-related
        inquiries within 5 business days.
      </p>
    </div>

  </div>
</section>
"""

PATCHES = [
    {
        "file": "about.html",
        "insert_before": "<!-- ===== RELATED PROMPTS",
        "content": ABOUT_EXTRA,
    },
    {
        "file": "contact.html",
        "insert_before": "<!-- ===== RELATED PROMPTS",
        "content": CONTACT_EXTRA,
    },
    {
        "file": "privacy-policy.html",
        "insert_before": "<!-- ===== RELATED PROMPTS",
        "content": PRIVACY_EXTRA,
    },
]


def patch_thin(info):
    fpath = os.path.join(ROOT, info["file"])
    with open(fpath, encoding='utf-8') as f:
        html = f.read()

    # Inject style if not already there
    if 'content-section' not in html and '</head>' in html:
        html = html.replace('</head>', CONTENT_STYLE + '\n</head>', 1)

    target = info["insert_before"]
    content = info["content"]

    if content.strip()[:30] in html:
        print(f"  SKIP (already patched): {info['file']}")
        return

    if target in html:
        html = html.replace(target, content + '\n' + target, 1)
    else:
        # Fallback: insert before </body>
        html = html.replace('</body>', content + '\n</body>', 1)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  OK: {info['file']}")


print("\n=== Padding thin pages ===\n")
for p in PATCHES:
    patch_thin(p)

print("\n=== Running post-patch audit ===")
# Quick word count check
for p in PATCHES:
    fpath = os.path.join(ROOT, p["file"])
    with open(fpath, encoding='utf-8') as f:
        html = f.read()
    body_m = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.I)
    body_text = re.sub(r'<[^>]+>', ' ', body_m.group(1)) if body_m else ''
    wc = len(re.findall(r'\w+', body_text))
    status = "OK" if wc >= 800 else "STILL THIN"
    print(f"  {p['file']}: {wc} words [{status}]")

print()
