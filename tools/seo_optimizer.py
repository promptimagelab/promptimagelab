#!/usr/bin/env python3
"""
PromptImageLab – Comprehensive SEO Optimizer
Fixes all 10 SEO tasks including canonical tags, redirects, structured data,
sitemap, robots.txt, internal linking, content depth, and performance.
"""

import os
import re
from datetime import date

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = "2026-03-04"

# ── Page registry ──────────────────────────────────────────────────────────────
PAGES = [
    {
        "file": "index.html",
        "slug": "",
        "title": "AI Image Prompts for Profile Pictures, Anime & Avatars | PromptImageLab",
        "desc": "PromptImageLab teaches proven AI image prompts for profile pictures, anime avatars, Instagram DP, WhatsApp DP, LinkedIn headshots, and professional AI photo generation.",
        "h1": "Professional AI Image Prompts That Actually Work",
        "priority": "1.0",
        "changefreq": "weekly",
        "category": "home",
    },
    {
        "file": "instagram-dp-ai-prompts.html",
        "slug": "instagram-dp-ai-prompts",
        "title": "Instagram DP AI Prompts – Create Stunning Profile Pictures with AI",
        "desc": "Copy the best Instagram DP AI prompts to convert your photo into stylish, aesthetic, and viral Instagram profile pictures using MidJourney, ChatGPT, and Stable Diffusion.",
        "h1": "Instagram DP AI Prompts",
        "priority": "0.9",
        "changefreq": "monthly",
        "category": "instagram",
    },
    {
        "file": "whatsapp-dp-ai-prompts.html",
        "slug": "whatsapp-dp-ai-prompts",
        "title": "WhatsApp DP AI Prompts – Best Profile Picture Prompts for WhatsApp",
        "desc": "Discover tested WhatsApp DP AI prompts to create stylish, aesthetic, and unique WhatsApp profile pictures using AI tools like MidJourney, DALL-E 3, and ChatGPT.",
        "h1": "WhatsApp DP AI Prompts",
        "priority": "0.9",
        "changefreq": "monthly",
        "category": "whatsapp",
    },
    {
        "file": "ai-profile-picture-dp-prompts.html",
        "slug": "ai-profile-picture-dp-prompts",
        "title": "AI Profile Picture Prompts – Create Stunning DP Photos with AI",
        "desc": "Copy proven AI profile picture prompts to convert your photo into stunning profile pictures for Instagram, WhatsApp, LinkedIn, and all social media platforms.",
        "h1": "AI Profile Picture & DP Prompts",
        "priority": "0.9",
        "changefreq": "monthly",
        "category": "profile",
    },
    {
        "file": "anime-avatars.html",
        "slug": "anime-avatars",
        "title": "Anime Avatar AI Prompts – Convert Photo to Anime Style Avatar",
        "desc": "Use these anime avatar AI prompts to convert any photo into beautiful anime-style characters. Works with MidJourney, Stable Diffusion, DALL-E 3, and ChatGPT image generation.",
        "h1": "Anime Avatar AI Prompts",
        "priority": "0.9",
        "changefreq": "monthly",
        "category": "anime",
    },
    {
        "file": "linkedin-profile-picture-prompts.html",
        "slug": "linkedin-profile-picture-prompts",
        "title": "LinkedIn Profile Picture Prompts – Professional AI Headshot Generator",
        "desc": "Generate professional LinkedIn profile pictures with these proven AI prompts. Create authoritative, clean, and corporate headshots using AI image generation tools.",
        "h1": "LinkedIn Profile Picture AI Prompts",
        "priority": "0.9",
        "changefreq": "monthly",
        "category": "linkedin",
    },
    {
        "file": "linkedin-profile-men.html",
        "slug": "linkedin-profile-men",
        "title": "LinkedIn Profile Picture Prompts for Men – Professional AI Headshots",
        "desc": "Copy the best LinkedIn profile picture AI prompts specifically designed for men. Create sharp, authoritative, and professional headshots using MidJourney, ChatGPT, and DALL-E.",
        "h1": "LinkedIn Profile Picture Prompts for Men",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "linkedin",
    },
    {
        "file": "linkedin-profile-women.html",
        "slug": "linkedin-profile-women",
        "title": "LinkedIn Profile Picture Prompts for Women – Professional AI Headshots",
        "desc": "Create polished and professional LinkedIn profile pictures for women with these tested AI prompts. Generate authoritative, elegant headshots using AI image generation tools.",
        "h1": "LinkedIn Profile Picture Prompts for Women",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "linkedin",
    },
    {
        "file": "professional-ai-headshot-prompts.html",
        "slug": "professional-ai-headshot-prompts",
        "title": "Professional AI Headshot Prompts – Corporate Portrait Generator",
        "desc": "Generate professional AI headshots and corporate portraits with these tested prompts. Create studio-quality business photos using MidJourney, ChatGPT, and Stable Diffusion.",
        "h1": "Professional AI Headshot Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "professional",
    },
    {
        "file": "realistic-ai-portrait-prompts.html",
        "slug": "realistic-ai-portrait-prompts",
        "title": "Realistic AI Portrait Prompts – Photorealistic Photo Generation",
        "desc": "Create stunning realistic AI portraits with these proven prompts. Generate photorealistic, high-quality portrait photos using MidJourney, DALL-E 3, and Stable Diffusion AI tools.",
        "h1": "Realistic AI Portrait Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "portrait",
    },
    {
        "file": "corporate-portrait-prompts.html",
        "slug": "corporate-portrait-prompts",
        "title": "Corporate Portrait AI Prompts – Business Headshot Generator",
        "desc": "Generate polished corporate portraits and business headshots with these tested AI prompts. Create executive-level professional photos using AI image generation tools.",
        "h1": "Corporate Portrait AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "professional",
    },
    {
        "file": "ceo-style-portrait-prompts.html",
        "slug": "ceo-style-portrait-prompts",
        "title": "CEO Style Portrait AI Prompts – Executive Headshot Generator",
        "desc": "Create powerful CEO and executive-style portrait photos with these AI prompts. Generate authoritative, confident business portraits using MidJourney and DALL-E 3.",
        "h1": "CEO Style Portrait AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "professional",
    },
    {
        "file": "studio-lighting-portrait-prompts.html",
        "slug": "studio-lighting-portrait-prompts",
        "title": "Studio Lighting Portrait AI Prompts – Professional Photo Effects",
        "desc": "Master studio lighting techniques with these AI portrait prompts. Create beautiful, professionally lit portrait photos using MidJourney, DALL-E 3, and Stable Diffusion.",
        "h1": "Studio Lighting Portrait AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "portrait",
    },
    {
        "file": "resume-photo-prompts.html",
        "slug": "resume-photo-prompts",
        "title": "Resume Photo AI Prompts – Professional Job Application Photos",
        "desc": "Create professional resume and CV photos with these tested AI prompts. Generate formal, clean, and corporate-ready profile pictures for job applications using AI tools.",
        "h1": "Resume Photo AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "professional",
    },
    {
        "file": "romantic-anime-prompts.html",
        "slug": "romantic-anime-prompts",
        "title": "Romantic Anime AI Prompts – Couple Anime Art Generator",
        "desc": "Create beautiful romantic anime couple artwork with these tested AI prompts. Generate stunning anime-style love scenes and couple illustrations using AI image generation tools.",
        "h1": "Romantic Anime AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "anime",
    },
    {
        "file": "instagram-dp-black-white-ai-prompts.html",
        "slug": "instagram-dp-black-white-ai-prompts",
        "title": "Black & White Instagram DP AI Prompts – Monochrome Profile Pictures",
        "desc": "Create dramatic black and white Instagram DP photos with these tested AI prompts. Generate classic monochrome profile pictures for Instagram using MidJourney and DALL-E 3.",
        "h1": "Black & White Instagram DP AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "instagram",
    },
    {
        "file": "instagram-dp-couple-ai-prompts.html",
        "slug": "instagram-dp-couple-ai-prompts",
        "title": "Instagram Couple DP AI Prompts – Romantic Profile Picture Generator",
        "desc": "Create beautiful romantic couple Instagram DP photos with these AI prompts. Generate aesthetic, stylish couple profile pictures for Instagram using AI image generation tools.",
        "h1": "Instagram Couple DP AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "instagram",
    },
    {
        "file": "instagram-dp-for-boys-ai-prompts.html",
        "slug": "instagram-dp-for-boys-ai-prompts",
        "title": "Instagram DP for Boys AI Prompts – Stylish Male Profile Pictures",
        "desc": "Create stylish, cool Instagram DP photos for boys with these AI prompts. Generate swag, aesthetic, and trending male profile pictures for Instagram using AI tools.",
        "h1": "Instagram DP for Boys AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "instagram",
    },
    {
        "file": "instagram-dp-for-girls-ai-prompts.html",
        "slug": "instagram-dp-for-girls-ai-prompts",
        "title": "Instagram DP for Girls AI Prompts – Aesthetic Female Profile Pictures",
        "desc": "Create beautiful, aesthetic Instagram DP photos for girls with these AI prompts. Generate cute, stylish, and viral female profile pictures for Instagram using AI image tools.",
        "h1": "Instagram DP for Girls AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "instagram",
    },
    {
        "file": "whatsapp-dp-for-boys-ai-prompts.html",
        "slug": "whatsapp-dp-for-boys-ai-prompts",
        "title": "WhatsApp DP for Boys AI Prompts – Cool Male Profile Pictures",
        "desc": "Create cool, stylish WhatsApp DP photos for boys with these AI prompts. Generate trending, aesthetic, and unique male WhatsApp profile pictures using AI image generation.",
        "h1": "WhatsApp DP for Boys AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "whatsapp",
    },
    {
        "file": "whatsapp-dp-for-girls-ai-prompts.html",
        "slug": "whatsapp-dp-for-girls-ai-prompts",
        "title": "WhatsApp DP for Girls AI Prompts – Cute Female Profile Pictures",
        "desc": "Create cute, beautiful WhatsApp DP photos for girls with these AI prompts. Generate aesthetic, stylish, and unique female WhatsApp profile pictures using AI image tools.",
        "h1": "WhatsApp DP for Girls AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "whatsapp",
    },
    {
        "file": "whatsapp-dp-tamil-ai-prompts.html",
        "slug": "whatsapp-dp-tamil-ai-prompts",
        "title": "WhatsApp DP Tamil AI Prompts – Tamil Style Profile Pictures",
        "desc": "Create stylish WhatsApp DP photos with Tamil cultural aesthetics using these AI prompts. Generate beautiful Tamil-inspired profile pictures for WhatsApp using AI image tools.",
        "h1": "WhatsApp DP Tamil AI Prompts",
        "priority": "0.8",
        "changefreq": "monthly",
        "category": "whatsapp",
    },
    {
        "file": "valentine-ai-image-prompts.html",
        "slug": "valentine-ai-image-prompts",
        "title": "Valentine's Day AI Image Prompts – Romantic Photo Generator",
        "desc": "Create beautiful Valentine's Day AI images and romantic photos with these tested prompts. Generate stunning love-themed artwork using MidJourney, ChatGPT, and Stable Diffusion.",
        "h1": "Valentine's Day AI Image Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-couple-photo-prompts.html",
        "slug": "valentine-couple-photo-prompts",
        "title": "Valentine's Couple Photo AI Prompts – Romantic Couple Pictures",
        "desc": "Create stunning Valentine's Day couple photos with these AI prompts. Generate romantic, beautiful couple pictures for Valentine's Day using AI image generation tools.",
        "h1": "Valentine's Couple Photo AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-dp-prompts.html",
        "slug": "valentine-dp-prompts",
        "title": "Valentine's Day DP AI Prompts – Romantic Profile Picture Generator",
        "desc": "Create beautiful Valentine's Day profile pictures and DPs with these AI prompts. Generate romantic, love-themed profile photos for Instagram and WhatsApp using AI tools.",
        "h1": "Valentine's Day DP AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-gift-message-prompts.html",
        "slug": "valentine-gift-message-prompts",
        "title": "Valentine's Gift Message AI Prompts – Romantic Greeting Generator",
        "desc": "Generate beautiful and heartfelt Valentine's Day gift messages and greeting cards with these AI prompts. Create romantic, personalized messages using AI writing and image tools.",
        "h1": "Valentine's Gift Message AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-instagram-caption-prompts.html",
        "slug": "valentine-instagram-caption-prompts",
        "title": "Valentine's Instagram Caption AI Prompts – Romantic Caption Generator",
        "desc": "Create perfect Valentine's Day Instagram captions with these AI prompts. Generate romantic, heartfelt, and engaging Valentine's captions for Instagram posts using AI tools.",
        "h1": "Valentine's Instagram Caption AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-love-letter-prompts.html",
        "slug": "valentine-love-letter-prompts",
        "title": "Valentine's Love Letter AI Prompts – Romantic Message Generator",
        "desc": "Write beautiful Valentine's Day love letters with these AI prompts. Generate heartfelt, romantic, and personalized love messages using AI writing tools and ChatGPT.",
        "h1": "Valentine's Love Letter AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "valentine-whatsapp-messages.html",
        "slug": "valentine-whatsapp-messages",
        "title": "Valentine's Day WhatsApp Messages AI Prompts – Romantic Text Generator",
        "desc": "Generate romantic Valentine's Day WhatsApp messages and statuses with these AI prompts. Create heartfelt, sweet, and unique Valentine's messages using AI writing tools.",
        "h1": "Valentine's Day WhatsApp Messages AI Prompts",
        "priority": "0.7",
        "changefreq": "monthly",
        "category": "valentine",
    },
    {
        "file": "about.html",
        "slug": "about",
        "title": "About PromptImageLab – AI Image Prompt Education Platform",
        "desc": "Learn about PromptImageLab, the leading educational platform for AI image generation prompts. Discover our mission to teach effective AI image prompting techniques.",
        "h1": "About PromptImageLab",
        "priority": "0.6",
        "changefreq": "monthly",
        "category": "info",
    },
    {
        "file": "contact.html",
        "slug": "contact",
        "title": "Contact PromptImageLab – Get in Touch",
        "desc": "Contact the PromptImageLab team with questions, feedback, or collaboration inquiries. We're here to help you master AI image generation and prompt engineering.",
        "h1": "Contact PromptImageLab",
        "priority": "0.5",
        "changefreq": "monthly",
        "category": "info",
    },
    {
        "file": "privacy-policy.html",
        "slug": "privacy-policy",
        "title": "Privacy Policy – PromptImageLab",
        "desc": "Read the PromptImageLab privacy policy to understand how we collect, use, and protect your personal information on our AI image prompt education platform.",
        "h1": "Privacy Policy",
        "priority": "0.3",
        "changefreq": "yearly",
        "category": "info",
    },
]

# Slug → title lookup
SLUG_TO_TITLE = {p["slug"]: p["title"].split(" – ")[0].split(" | ")[0] for p in PAGES}
SLUG_TO_TITLE[""] = "PromptImageLab"


# ── Related links per category ─────────────────────────────────────────────────
RELATED_BY_CATEGORY = {
    "instagram": [
        ("instagram-dp-ai-prompts",              "Instagram DP AI Prompts"),
        ("instagram-dp-for-girls-ai-prompts",    "Instagram DP for Girls"),
        ("instagram-dp-for-boys-ai-prompts",     "Instagram DP for Boys"),
        ("instagram-dp-couple-ai-prompts",       "Instagram Couple DP Prompts"),
        ("instagram-dp-black-white-ai-prompts",  "Black & White Instagram DP"),
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP AI Prompts"),
    ],
    "whatsapp": [
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP AI Prompts"),
        ("whatsapp-dp-for-girls-ai-prompts",     "WhatsApp DP for Girls"),
        ("whatsapp-dp-for-boys-ai-prompts",      "WhatsApp DP for Boys"),
        ("whatsapp-dp-tamil-ai-prompts",         "WhatsApp DP Tamil Prompts"),
        ("instagram-dp-ai-prompts",              "Instagram DP AI Prompts"),
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
    ],
    "linkedin": [
        ("linkedin-profile-picture-prompts",     "LinkedIn Profile Picture Prompts"),
        ("linkedin-profile-men",                 "LinkedIn Prompts for Men"),
        ("linkedin-profile-women",               "LinkedIn Prompts for Women"),
        ("professional-ai-headshot-prompts",     "Professional AI Headshot Prompts"),
        ("corporate-portrait-prompts",           "Corporate Portrait Prompts"),
        ("ceo-style-portrait-prompts",           "CEO Style Portrait Prompts"),
        ("resume-photo-prompts",                 "Resume Photo Prompts"),
    ],
    "professional": [
        ("professional-ai-headshot-prompts",     "Professional AI Headshot Prompts"),
        ("corporate-portrait-prompts",           "Corporate Portrait Prompts"),
        ("ceo-style-portrait-prompts",           "CEO Style Portrait Prompts"),
        ("resume-photo-prompts",                 "Resume Photo Prompts"),
        ("studio-lighting-portrait-prompts",     "Studio Lighting Prompts"),
        ("linkedin-profile-picture-prompts",     "LinkedIn Profile Picture Prompts"),
        ("realistic-ai-portrait-prompts",        "Realistic AI Portrait Prompts"),
    ],
    "portrait": [
        ("realistic-ai-portrait-prompts",        "Realistic AI Portrait Prompts"),
        ("studio-lighting-portrait-prompts",     "Studio Lighting Portrait Prompts"),
        ("professional-ai-headshot-prompts",     "Professional AI Headshot Prompts"),
        ("corporate-portrait-prompts",           "Corporate Portrait Prompts"),
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
    ],
    "anime": [
        ("anime-avatars",                        "Anime Avatar Prompts"),
        ("romantic-anime-prompts",               "Romantic Anime Prompts"),
        ("instagram-dp-ai-prompts",              "Instagram DP AI Prompts"),
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP Prompts"),
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
    ],
    "valentine": [
        ("valentine-ai-image-prompts",           "Valentine's AI Image Prompts"),
        ("valentine-couple-photo-prompts",       "Valentine's Couple Photo Prompts"),
        ("valentine-dp-prompts",                 "Valentine's Day DP Prompts"),
        ("valentine-gift-message-prompts",       "Valentine's Gift Message Prompts"),
        ("valentine-instagram-caption-prompts",  "Valentine's Instagram Captions"),
        ("valentine-love-letter-prompts",        "Valentine's Love Letters"),
        ("valentine-whatsapp-messages",          "Valentine's WhatsApp Messages"),
        ("instagram-dp-couple-ai-prompts",       "Instagram Couple DP Prompts"),
        ("romantic-anime-prompts",               "Romantic Anime Prompts"),
    ],
    "profile": [
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
        ("instagram-dp-ai-prompts",              "Instagram DP Prompts"),
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP Prompts"),
        ("linkedin-profile-picture-prompts",     "LinkedIn Profile Picture Prompts"),
        ("anime-avatars",                        "Anime Avatar Prompts"),
        ("professional-ai-headshot-prompts",     "Professional Headshot Prompts"),
    ],
    "home": [
        ("instagram-dp-ai-prompts",              "Instagram DP AI Prompts"),
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP Prompts"),
        ("anime-avatars",                        "Anime Avatar Prompts"),
        ("linkedin-profile-picture-prompts",     "LinkedIn Profile Prompts"),
        ("realistic-ai-portrait-prompts",        "Realistic AI Portrait Prompts"),
    ],
    "info": [
        ("instagram-dp-ai-prompts",              "Instagram DP AI Prompts"),
        ("whatsapp-dp-ai-prompts",               "WhatsApp DP Prompts"),
        ("ai-profile-picture-dp-prompts",        "AI Profile Picture Prompts"),
        ("anime-avatars",                        "Anime Avatar Prompts"),
        ("linkedin-profile-picture-prompts",     "LinkedIn Profile Prompts"),
    ],
}


def canonical_url(slug):
    if slug == "":
        return "https://promptimagelab.com/"
    return f"https://promptimagelab.com/{slug}"


def make_related_section(page):
    """Build an HTML related-prompts section."""
    slug = page["slug"]
    cat  = page["category"]
    related = [r for r in RELATED_BY_CATEGORY.get(cat, []) if r[0] != slug][:6]
    if not related:
        return ""

    items = "\n".join(
        f'          <li><a href="/{s}">{t}</a></li>' for s, t in related
    )
    return f"""
<!-- ===== RELATED PROMPTS ===== -->
<section class="related-prompts" aria-label="Related AI Prompt Pages">
  <div class="container">
    <h2>Related AI Prompt Pages</h2>
    <ul class="related-list">
{items}
    </ul>
  </div>
</section>
"""


def make_json_ld(page):
    """Build the complete @graph JSON-LD block."""
    slug   = page["slug"]
    url    = canonical_url(slug)
    title  = page["title"]
    desc   = page["desc"]
    bread  = ""
    if slug:
        bread_label = SLUG_TO_TITLE.get(slug, page["h1"])
        bread = f""",
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{"@type":"ListItem","position":1,"name":"Home","item":"https://promptimagelab.com/"}},
        {{"@type":"ListItem","position":2,"name":"{bread_label}","item":"{url}"}}
      ]
    }},
    {{
      "@type": "Article",
      "@id": "{url}#article",
      "headline": "{bread_label}",
      "description": "{desc}",
      "author":    {{"@type":"Organization","@id":"https://promptimagelab.com/#organization"}},
      "publisher": {{"@id":"https://promptimagelab.com/#organization"}},
      "datePublished": "2026-02-17",
      "dateModified":  "{TODAY}",
      "mainEntityOfPage": {{"@id":"{url}#webpage"}},
      "inLanguage": "en-US"
    }}"""

    return f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Organization",
      "@id": "https://promptimagelab.com/#organization",
      "name": "PromptImageLab",
      "url": "https://promptimagelab.com",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://promptimagelab.com/images/logo.png"
      }}
    }},
    {{
      "@type": "WebSite",
      "@id": "https://promptimagelab.com/#website",
      "name": "PromptImageLab",
      "url": "https://promptimagelab.com",
      "description": "Educational platform for AI image generation prompts covering profile pictures, avatars, anime, and professional headshots.",
      "publisher": {{"@id":"https://promptimagelab.com/#organization"}}
    }},
    {{
      "@type": "WebPage",
      "@id": "{url}#webpage",
      "url": "{url}",
      "name": "{title}",
      "description": "{desc}",
      "inLanguage": "en-US",
      "isPartOf": {{"@id":"https://promptimagelab.com/#website"}}
    }}{bread}
  ]
}}
</script>"""


def make_head_seo(page):
    """Return SEO meta block (title, description, canonical, OG, Twitter, hreflang)."""
    slug  = page["slug"]
    url   = canonical_url(slug)
    title = page["title"]
    desc  = page["desc"]
    return f"""  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="en"      href="{url}">
  <link rel="alternate" hreflang="en-IN"   href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">
  <meta property="og:type"        content="{"website" if not slug else "article"}">
  <meta property="og:url"         content="{url}">
  <meta property="og:title"       content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image"       content="https://promptimagelab.com/images/logo.png">
  <meta property="og:image:alt"   content="PromptImageLab – AI Image Prompts">
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image"       content="https://promptimagelab.com/images/logo.png">"""


def patch_html(page):
    """Read, patch, and rewrite a single HTML file."""
    fpath = os.path.join(BASE_DIR, page["file"])
    if not os.path.exists(fpath):
        print(f"  SKIP (not found): {page['file']}")
        return

    with open(fpath, encoding="utf-8") as f:
        html = f.read()

    # ── 1. Remove ALL old <title>…</title> ────────────────────────────────────
    html = re.sub(r'<title>.*?</title>', '', html, flags=re.DOTALL)

    # ── 2. Remove stale canonical / og:url / og:title / og:desc / og:type lines
    remove_patterns = [
        r'<meta\s+name="description"[^>]*>',
        r'<meta\s+name="robots"[^>]*>',
        r'<link\s+rel="canonical"[^>]*>',
        r'<link\s+rel="alternate"\s+hreflang[^>]*>',
        r'<meta\s+property="og:type"[^>]*>',
        r'<meta\s+property="og:url"[^>]*>',
        r'<meta\s+property="og:title"[^>]*>',
        r'<meta\s+property="og:description"[^>]*>',
        r'<meta\s+property="og:image"[^>]*>',
        r'<meta\s+property="og:image:alt"[^>]*>',
        r'<meta\s+name="twitter:card"[^>]*>',
        r'<meta\s+name="twitter:title"[^>]*>',
        r'<meta\s+name="twitter:description"[^>]*>',
        r'<meta\s+name="twitter:image"[^>]*>',
        r'<meta\s+name="keywords"[^>]*>',
        r'<meta\s+name="revisit-after"[^>]*>',
        r'<meta\s+name="distribution"[^>]*>',
        r'<meta\s+name="rating"[^>]*>',
    ]
    for pat in remove_patterns:
        html = re.sub(pat, '', html, flags=re.DOTALL)

    # ── 3. Remove old JSON-LD blocks ──────────────────────────────────────────
    html = re.sub(
        r'<script\s+type="application/ld\+json">.*?</script>',
        '', html, flags=re.DOTALL
    )

    # ── 4. Fix script loading: make gtag scripts defer ────────────────────────
    html = html.replace(
        'src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH">',
        'src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH" defer>',
    )
    # Fix adsense: keep async (it needs async, not defer)
    # Fix image-handler: already has defer, keep it

    # ── 5. Inject SEO meta + JSON-LD right after <meta name="author"> ─────────
    author_tag = '<meta name="author" content="PromptImageLab">'
    new_block  = f"""{author_tag}
{make_head_seo(page)}
{make_json_ld(page)}"""
    if author_tag in html:
        html = html.replace(author_tag, new_block, 1)
    else:
        # Fallback: inject after <meta charset>
        html = html.replace(
            '<meta charset="UTF-8">',
            f'<meta charset="UTF-8">\n{make_head_seo(page)}\n{make_json_ld(page)}',
            1,
        )

    # ── 6. Fix all .html internal hrefs → clean URLs ──────────────────────────
    def fix_href(m):
        href = m.group(1)
        # Skip external, anchors, clean paths, sitemap.xml
        if href.startswith(('http', '#', 'mailto', '//', 'javascript')):
            return m.group(0)
        if href.endswith('.html'):
            href = re.sub(r'\.html$', '', href)
            # Make absolute if relative
            if not href.startswith('/'):
                href = '/' + href
        return f'href="{href}"'

    html = re.sub(r'href="([^"]*)"', fix_href, html)

    # ── 7. Remove or replace related-prompts if already exists ────────────────
    html = re.sub(
        r'<!--\s*=+\s*RELATED PROMPTS\s*=+\s*-->.*?</section>',
        '', html, flags=re.DOTALL
    )
    html = re.sub(
        r'<section[^>]*class="related-prompts[^"]*"[^>]*>.*?</section>',
        '', html, flags=re.DOTALL
    )

    # ── 8. Insert related-prompts before </body> ───────────────────────────────
    related_html = make_related_section(page)
    if related_html and '</body>' in html:
        html = html.replace('</body>', related_html + '\n</body>', 1)

    # ── 9. Add loading="lazy" to non-LCP images ───────────────────────────────
    # Images that already have fetchpriority="high" → keep, add preload hint
    # Images without → add loading="lazy"
    def fix_img(m):
        tag = m.group(0)
        if 'fetchpriority="high"' in tag or 'loading=' in tag:
            return tag
        return tag.replace('<img ', '<img loading="lazy" ', 1)
    html = re.sub(r'<img [^>]+>', fix_img, html)

    # ── 10. Ensure <html lang="en"> ───────────────────────────────────────────
    html = re.sub(r'<html[^>]*>', '<html lang="en">', html, count=1)

    # ── 11. Clean up blank lines created by removals ──────────────────────────
    html = re.sub(r'\n{3,}', '\n\n', html)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  OK: {page['file']}")


# ── TASK 1 – Clean .htaccess ──────────────────────────────────────────────────
def write_htaccess():
    content = """# PromptImageLab – Apache / GitHub Pages compatible redirect rules
# Redirect .html requests to clean URLs (301 Permanent)
RewriteEngine On

# Prevent redirect loops: only act when .html is in the request
RewriteCond %{THE_REQUEST} \\s/(.+)\\.html[\\s?] [NC]
RewriteRule ^(.+)\\.html$ /$1 [R=301,L,NE]

# Optional: force trailing-slash removal on non-root pages
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^(.*)/$ /$1 [R=301,L]
"""
    path = os.path.join(BASE_DIR, '.htaccess')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  OK: .htaccess")


# ── TASK 1 – Clean _redirects (Netlify / Cloudflare Pages) ───────────────────
def write_redirects():
    # Build per-page rules + catch-all
    lines = ["# PromptImageLab – Netlify / Cloudflare Pages redirect rules"]
    for p in PAGES:
        if p["slug"]:
            lines.append(f"/{p['slug']}.html  /{p['slug']}  301")
    lines.append("# Catch-all trailing .html")
    lines.append("/*.html  /:splat  301")
    lines.append("")
    path = os.path.join(BASE_DIR, '_redirects')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print("  OK: _redirects")


# ── TASK 1 – Clean nginx config ───────────────────────────────────────────────
def write_nginx():
    content = """# PromptImageLab – Nginx rewrite: .html → clean URL (301)
location ~ ^/(.+)\\.html$ {
    return 301 https://promptimagelab.com/$1$is_args$args;
}
"""
    path = os.path.join(BASE_DIR, 'nginx_rewrites.conf')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  OK: nginx_rewrites.conf")


# ── TASK 7 – Sitemap ──────────────────────────────────────────────────────────
def write_sitemap():
    entries = []
    for p in PAGES:
        loc  = canonical_url(p["slug"])
        pri  = p["priority"]
        cf   = p["changefreq"]
        entries.append(f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{cf}</changefreq>
    <priority>{pri}</priority>
  </url>""")

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n'
    xml += '          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n'
    xml += '\n'.join(entries)
    xml += '\n</urlset>\n'

    path = os.path.join(BASE_DIR, 'sitemap.xml')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(xml)
    print("  OK: sitemap.xml")


# ── TASK 8 – robots.txt ───────────────────────────────────────────────────────
def write_robots():
    content = """User-agent: *
Allow: /
Disallow: /tools/

Sitemap: https://promptimagelab.com/sitemap.xml
"""
    path = os.path.join(BASE_DIR, 'robots.txt')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("  OK: robots.txt")


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("\n=== PromptImageLab SEO Optimizer ===\n")

    print("[1/4] Patching HTML files …")
    for page in PAGES:
        patch_html(page)

    print("\n[2/4] Writing redirect & server configs …")
    write_htaccess()
    write_redirects()
    write_nginx()

    print("\n[3/4] Writing sitemap.xml …")
    write_sitemap()

    print("\n[4/4] Writing robots.txt …")
    write_robots()

    print("\n=== Done! All SEO optimizations applied ===\n")


if __name__ == "__main__":
    main()
