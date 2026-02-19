<#
  seo_complete_fix.ps1
  Completes all remaining SEO structural fixes for promptimagelab.com
  Objectives:
    1. Remove PIL-SEO-SNIPPET completely from all content pages
    2. Strip ALL old JSON-LD script blocks, replace with ONE clean @graph per page
    3. Add visible HTML breadcrumb nav inside <main>
    4. Add "Related Prompts" sections to sub-category pages
    5. Add child links to all hub pages
    6. Add "Last updated" freshness signal to all content pages
#>

$root = "C:\Users\Dhanush\Desktop\site\promptimagelab"
$BASE = "https://promptimagelab.com"

# ─────────────────────────────────────────────────────────────
# PAGE DATA TABLE
# type: hub | sub | seasonal | utility
# parent: parent hub page filename (empty for hubs)
# parentLabel: human-readable parent name
# breadLabel: label for this page in breadcrumb
# children: array of [filename, label] for hub child links
# siblings: array of [filename, label] for related prompts
# mainImage: primary hero image for Article schema
# ─────────────────────────────────────────────────────────────
$pages = @(

    # ── UTILITY ──
    @{
        file        = "about.html"
        type        = "utility"
        title       = "About PromptImageLab"
        desc        = "Learn about PromptImageLab — a resource for reusable, predictable AI image prompt frameworks for avatars, anime, and portrait generation."
        breadLabel  = "About"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @()
        mainImage   = "images/logo.png"
    }
    @{
        file        = "contact.html"
        type        = "utility"
        title       = "Contact PromptImageLab"
        desc        = "Get in touch with the PromptImageLab team. We welcome feedback, collaboration requests, and questions about AI image prompts."
        breadLabel  = "Contact"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @()
        mainImage   = "images/logo.png"
    }
    @{
        file        = "privacy-policy.html"
        type        = "utility"
        title       = "Privacy Policy | PromptImageLab"
        desc        = "Read the PromptImageLab privacy policy. We explain how we collect, use, and protect your data when you visit our website."
        breadLabel  = "Privacy Policy"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @()
        mainImage   = "images/logo.png"
    }

    # ── AI PROFILE PICTURE HUB ──
    @{
        file        = "ai-profile-picture-dp-prompts.html"
        type        = "hub"
        title       = "AI Profile Picture and DP Prompts | PromptImageLab"
        desc        = "Explore the best AI profile picture and DP prompts for Instagram, WhatsApp, LinkedIn, and more. Copy proven prompts and generate stunning AI profile photos."
        breadLabel  = "AI Profile Picture Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("instagram-dp-ai-prompts.html", "Instagram DP AI Prompts")
            @("whatsapp-dp-ai-prompts.html", "WhatsApp DP AI Prompts")
        )
        mainImage   = "images/instagram-dp/instagram-dp-studio.webp"
    }

    # ── INSTAGRAM HUB ──
    @{
        file        = "instagram-dp-ai-prompts.html"
        type        = "hub"
        title       = "Instagram DP AI Prompts – Create Stunning Profile Pictures with AI"
        desc        = "Copy the best Instagram DP AI prompts to convert your photo into stylish, aesthetic, and viral Instagram profile pictures using AI."
        breadLabel  = "Instagram DP AI Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("instagram-dp-for-girls-ai-prompts.html", "Instagram DP for Girls")
            @("instagram-dp-for-boys-ai-prompts.html", "Instagram DP for Boys")
            @("instagram-dp-couple-ai-prompts.html", "Couple Instagram DP Prompts")
            @("instagram-dp-black-white-ai-prompts.html", "Black and White Instagram DP")
        )
        mainImage   = "images/instagram-dp/instagram-dp-studio.webp"
    }

    # ── INSTAGRAM SUB-PAGES ──
    @{
        file        = "instagram-dp-for-girls-ai-prompts.html"
        type        = "sub"
        title       = "Instagram DP for Girls AI Prompts – Aesthetic & Cute Profile Pictures"
        desc        = "Discover the best Instagram DP AI prompts for girls. Copy proven prompts to create cute, aesthetic, and stylish AI profile pictures for Instagram."
        breadLabel  = "Instagram DP for Girls"
        parent      = "instagram-dp-ai-prompts.html"
        parentLabel = "Instagram DP AI Prompts"
        siblings    = @(
            @("instagram-dp-for-boys-ai-prompts.html", "Instagram DP for Boys")
            @("instagram-dp-couple-ai-prompts.html", "Couple Instagram DP")
            @("instagram-dp-black-white-ai-prompts.html", "Black and White Instagram DP")
        )
        children    = @()
        mainImage   = "images/instagram-dp/instagram-dp-for-girls.webp"
    }
    @{
        file        = "instagram-dp-for-boys-ai-prompts.html"
        type        = "sub"
        title       = "Instagram DP for Boys AI Prompts – Cool & Stylish Profile Pictures"
        desc        = "Copy the best Instagram DP AI prompts for boys. Create cool, stylish, and masculine AI profile pictures for Instagram."
        breadLabel  = "Instagram DP for Boys"
        parent      = "instagram-dp-ai-prompts.html"
        parentLabel = "Instagram DP AI Prompts"
        siblings    = @(
            @("instagram-dp-for-girls-ai-prompts.html", "Instagram DP for Girls")
            @("instagram-dp-couple-ai-prompts.html", "Couple Instagram DP")
            @("instagram-dp-black-white-ai-prompts.html", "Black and White Instagram DP")
        )
        children    = @()
        mainImage   = "images/instagram-dp/instagram-dp-studio.webp"
    }
    @{
        file        = "instagram-dp-couple-ai-prompts.html"
        type        = "sub"
        title       = "Couple Instagram DP AI Prompts – Romantic AI Profile Pictures"
        desc        = "Explore couple Instagram DP AI prompts to create romantic, aesthetic couple profile pictures for Instagram using AI tools."
        breadLabel  = "Couple Instagram DP"
        parent      = "instagram-dp-ai-prompts.html"
        parentLabel = "Instagram DP AI Prompts"
        siblings    = @(
            @("instagram-dp-for-girls-ai-prompts.html", "Instagram DP for Girls")
            @("instagram-dp-for-boys-ai-prompts.html", "Instagram DP for Boys")
            @("instagram-dp-black-white-ai-prompts.html", "Black and White Instagram DP")
        )
        children    = @()
        mainImage   = "images/instagram-dp/aesthetic-instagram-dp.webp"
    }
    @{
        file        = "instagram-dp-black-white-ai-prompts.html"
        type        = "sub"
        title       = "Black and White Instagram DP AI Prompts – Timeless Monochrome Profile Pics"
        desc        = "Create bold, classic black and white Instagram DP profile pictures using these tested AI prompts. Timeless monochrome aesthetics for any style."
        breadLabel  = "Black and White Instagram DP"
        parent      = "instagram-dp-ai-prompts.html"
        parentLabel = "Instagram DP AI Prompts"
        siblings    = @(
            @("instagram-dp-for-girls-ai-prompts.html", "Instagram DP for Girls")
            @("instagram-dp-for-boys-ai-prompts.html", "Instagram DP for Boys")
            @("instagram-dp-couple-ai-prompts.html", "Couple Instagram DP")
        )
        children    = @()
        mainImage   = "images/instagram-dp/black-white-instagram-dp.webp"
    }

    # ── WHATSAPP HUB ──
    @{
        file        = "whatsapp-dp-ai-prompts.html"
        type        = "hub"
        title       = "WhatsApp DP AI Prompts – Create Perfect Profile Pictures with AI"
        desc        = "Use the best WhatsApp DP AI prompts to convert your photo into clean, stylish, and attractive WhatsApp profile pictures using AI."
        breadLabel  = "WhatsApp DP AI Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("whatsapp-dp-for-girls-ai-prompts.html", "WhatsApp DP for Girls")
            @("whatsapp-dp-for-boys-ai-prompts.html", "WhatsApp DP for Boys")
            @("whatsapp-dp-tamil-ai-prompts.html", "Tamil WhatsApp DP Prompts")
        )
        mainImage   = "images/whatsapp-dp/whatsapp-dp-clean.webp"
    }

    # ── WHATSAPP SUB-PAGES ──
    @{
        file        = "whatsapp-dp-for-girls-ai-prompts.html"
        type        = "sub"
        title       = "WhatsApp DP for Girls AI Prompts – Cute & Aesthetic Profile Pictures"
        desc        = "Find the best WhatsApp DP AI prompts for girls. Create cute, soft, and aesthetic WhatsApp profile pictures with AI tools."
        breadLabel  = "WhatsApp DP for Girls"
        parent      = "whatsapp-dp-ai-prompts.html"
        parentLabel = "WhatsApp DP AI Prompts"
        siblings    = @(
            @("whatsapp-dp-for-boys-ai-prompts.html", "WhatsApp DP for Boys")
            @("whatsapp-dp-tamil-ai-prompts.html", "Tamil WhatsApp DP")
        )
        children    = @()
        mainImage   = "images/whatsapp-dp/whatsapp-dp-soft.webp"
    }
    @{
        file        = "whatsapp-dp-for-boys-ai-prompts.html"
        type        = "sub"
        title       = "WhatsApp DP for Boys AI Prompts – Cool & Stylish Profile Pictures"
        desc        = "Create cool, stylish, and confident WhatsApp profile pictures for boys using these tested AI prompts. Works with MidJourney, DALL-E, and ChatGPT."
        breadLabel  = "WhatsApp DP for Boys"
        parent      = "whatsapp-dp-ai-prompts.html"
        parentLabel = "WhatsApp DP AI Prompts"
        siblings    = @(
            @("whatsapp-dp-for-girls-ai-prompts.html", "WhatsApp DP for Girls")
            @("whatsapp-dp-tamil-ai-prompts.html", "Tamil WhatsApp DP")
        )
        children    = @()
        mainImage   = "images/whatsapp-dp/whatsapp-dp-professional.webp"
    }
    @{
        file        = "whatsapp-dp-tamil-ai-prompts.html"
        type        = "sub"
        title       = "Tamil WhatsApp DP AI Prompts – Stylish Profile Pictures"
        desc        = "Explore Tamil-style WhatsApp DP AI prompts for creating vibrant, expressive profile pictures. Tested prompts for traditional and modern Tamil looks."
        breadLabel  = "Tamil WhatsApp DP"
        parent      = "whatsapp-dp-ai-prompts.html"
        parentLabel = "WhatsApp DP AI Prompts"
        siblings    = @(
            @("whatsapp-dp-for-girls-ai-prompts.html", "WhatsApp DP for Girls")
            @("whatsapp-dp-for-boys-ai-prompts.html", "WhatsApp DP for Boys")
        )
        children    = @()
        mainImage   = "images/whatsapp-dp/whatsapp-dp-clean.webp"
    }

    # ── ANIME HUB ──
    @{
        file        = "anime-avatars.html"
        type        = "hub"
        title       = "Anime AI Image Prompts – Turn Your Photo Into Anime Avatars"
        desc        = "Anime AI image prompts using your own photo. Copy proven prompts to create anime avatars, manga portraits and cartoon characters with AI."
        breadLabel  = "Anime AI Image Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("romantic-anime-prompts.html", "Romantic Anime Prompts")
        )
        mainImage   = "images/anime-avatars/anime-girl-studio-portrait.webp"
    }

    # ── ANIME SUB ──
    @{
        file        = "romantic-anime-prompts.html"
        type        = "sub"
        title       = "Romantic Anime Prompts – AI Love Scene & Couple Anime Art"
        desc        = "Create beautiful romantic anime scenes and couple portraits with these tested AI prompts. Perfect for love-themed anime avatars and couple profiles."
        breadLabel  = "Romantic Anime Prompts"
        parent      = "anime-avatars.html"
        parentLabel = "Anime AI Image Prompts"
        siblings    = @(
            @("anime-avatars.html", "All Anime AI Prompts")
        )
        children    = @()
        mainImage   = "images/anime-avatars/anime-girl-studio-portrait.webp"
    }

    # ── PROFESSIONAL HEADSHOT HUB ──
    @{
        file        = "professional-ai-headshot-prompts.html"
        type        = "hub"
        title       = "Professional AI Headshot Prompts – LinkedIn, Corporate & Resume Photos"
        desc        = "Discover the best professional AI headshot prompts for LinkedIn profiles, corporate portraits, and resume photos. Tested prompts for polished AI headshots."
        breadLabel  = "Professional AI Headshot Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("linkedin-profile-picture-prompts.html", "LinkedIn Profile Picture Prompts")
            @("ceo-style-portrait-prompts.html", "CEO Style Portrait Prompts")
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
            @("studio-lighting-portrait-prompts.html", "Studio Lighting Portrait Prompts")
            @("resume-photo-prompts.html", "Resume Photo AI Prompts")
            @("realistic-ai-portrait-prompts.html", "Realistic AI Portrait Prompts")
        )
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }

    # ── LINKEDIN HUB ──
    @{
        file        = "linkedin-profile-picture-prompts.html"
        type        = "hub"
        title       = "LinkedIn Profile Picture AI Prompts – Professional Headshots with AI"
        desc        = "Create polished, professional LinkedIn profile pictures using these tested AI prompts. Perfect for corporate headshots and career-ready photos."
        breadLabel  = "LinkedIn Profile Picture Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("linkedin-profile-men.html", "LinkedIn Profile Prompts for Men")
            @("linkedin-profile-women.html", "LinkedIn Profile Prompts for Women")
        )
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }

    # ── LINKEDIN SUBS ──
    @{
        file        = "linkedin-profile-men.html"
        type        = "sub"
        title       = "LinkedIn Profile Picture Prompts for Men – Professional AI Headshots"
        desc        = "AI prompts for professional LinkedIn profile pictures for men. Create confident, corporate-ready headshots with MidJourney, DALL-E, and ChatGPT."
        breadLabel  = "LinkedIn Profile for Men"
        parent      = "linkedin-profile-picture-prompts.html"
        parentLabel = "LinkedIn Profile Picture Prompts"
        siblings    = @(
            @("linkedin-profile-women.html", "LinkedIn Profile Prompts for Women")
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }
    @{
        file        = "linkedin-profile-women.html"
        type        = "sub"
        title       = "LinkedIn Profile Picture Prompts for Women – Professional AI Headshots"
        desc        = "AI prompts for professional LinkedIn profile pictures for women. Create polished, confident headshots for career profiles with AI tools."
        breadLabel  = "LinkedIn Profile for Women"
        parent      = "linkedin-profile-picture-prompts.html"
        parentLabel = "LinkedIn Profile Picture Prompts"
        siblings    = @(
            @("linkedin-profile-men.html", "LinkedIn Profile Prompts for Men")
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }

    # ── PROFESSIONAL SUBS ──
    @{
        file        = "ceo-style-portrait-prompts.html"
        type        = "sub"
        title       = "CEO Style Portrait AI Prompts – Executive Headshots with AI"
        desc        = "Create authoritative, polished CEO-style portrait photos with these tested AI prompts. Perfect for executive profiles, speaker bios, and board presentations."
        breadLabel  = "CEO Style Portrait Prompts"
        parent      = "professional-ai-headshot-prompts.html"
        parentLabel = "Professional AI Headshot Prompts"
        siblings    = @(
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
            @("linkedin-profile-picture-prompts.html", "LinkedIn Profile Picture Prompts")
            @("studio-lighting-portrait-prompts.html", "Studio Lighting Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }
    @{
        file        = "corporate-portrait-prompts.html"
        type        = "sub"
        title       = "Corporate Portrait AI Prompts – Professional Business Headshots"
        desc        = "Use these tested corporate portrait AI prompts to generate professional business headshots. Works with MidJourney, DALL-E, and ChatGPT."
        breadLabel  = "Corporate Portrait Prompts"
        parent      = "professional-ai-headshot-prompts.html"
        parentLabel = "Professional AI Headshot Prompts"
        siblings    = @(
            @("ceo-style-portrait-prompts.html", "CEO Style Portrait Prompts")
            @("linkedin-profile-picture-prompts.html", "LinkedIn Profile Picture Prompts")
            @("studio-lighting-portrait-prompts.html", "Studio Lighting Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }
    @{
        file        = "studio-lighting-portrait-prompts.html"
        type        = "sub"
        title       = "Studio Lighting Portrait AI Prompts – Professional Photo Lighting"
        desc        = "Create studio-quality portrait photos with professional lighting using these AI prompts. Perfect for headshots, profile pictures, and professional photography."
        breadLabel  = "Studio Lighting Portrait Prompts"
        parent      = "professional-ai-headshot-prompts.html"
        parentLabel = "Professional AI Headshot Prompts"
        siblings    = @(
            @("ceo-style-portrait-prompts.html", "CEO Style Portrait Prompts")
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
            @("realistic-ai-portrait-prompts.html", "Realistic AI Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }
    @{
        file        = "resume-photo-prompts.html"
        type        = "sub"
        title       = "Resume Photo AI Prompts – Professional Headshots for CV & Portfolio"
        desc        = "Generate clean, professional resume and CV photo headshots using these tested AI prompts. Works with MidJourney, DALL-E, and ChatGPT."
        breadLabel  = "Resume Photo AI Prompts"
        parent      = "professional-ai-headshot-prompts.html"
        parentLabel = "Professional AI Headshot Prompts"
        siblings    = @(
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
            @("linkedin-profile-picture-prompts.html", "LinkedIn Profile Picture Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }
    @{
        file        = "realistic-ai-portrait-prompts.html"
        type        = "sub"
        title       = "Realistic AI Portrait Prompts – Photorealistic Headshots with AI"
        desc        = "Create photorealistic AI portrait photos that look like professional photography using these tested prompts. Works with MidJourney, DALL-E, and Stable Diffusion."
        breadLabel  = "Realistic AI Portrait Prompts"
        parent      = "professional-ai-headshot-prompts.html"
        parentLabel = "Professional AI Headshot Prompts"
        siblings    = @(
            @("studio-lighting-portrait-prompts.html", "Studio Lighting Portrait Prompts")
            @("corporate-portrait-prompts.html", "Corporate Portrait Prompts")
        )
        children    = @()
        mainImage   = "images/linkedin-profile/professional-linkedin-portrait.webp"
    }

    # ── VALENTINE HUB ──
    @{
        file        = "valentine-ai-image-prompts.html"
        type        = "seasonal"
        title       = "Valentine AI Image Prompts – Romantic AI Photos & Couple Art"
        desc        = "Explore Valentine's Day AI image prompts for romantic couple photos, love letters, DPs, and messages. Copy proven prompts for heartfelt AI-generated images."
        breadLabel  = "Valentine AI Image Prompts"
        parent      = ""
        parentLabel = ""
        siblings    = @()
        children    = @(
            @("valentine-couple-photo-prompts.html", "Valentine Couple Photo Prompts")
            @("valentine-dp-prompts.html", "Valentine DP Prompts")
            @("valentine-gift-message-prompts.html", "Valentine Gift Message Prompts")
            @("valentine-instagram-caption-prompts.html", "Valentine Instagram Caption Prompts")
            @("valentine-love-letter-prompts.html", "Valentine Love Letter Prompts")
            @("valentine-whatsapp-messages.html", "Valentine WhatsApp Message Prompts")
        )
        mainImage   = "images/valentine/valentine-couple.webp"
    }

    # ── VALENTINE SUBS ──
    @{
        file        = "valentine-couple-photo-prompts.html"
        type        = "seasonal"
        title       = "Valentine Couple Photo AI Prompts – Romantic Couple Portraits"
        desc        = "Create beautiful Valentine's Day couple photo portraits with these tested AI prompts. Romantic lighting, heartfelt poses, and dreamy backgrounds."
        breadLabel  = "Valentine Couple Photo Prompts"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-dp-prompts.html", "Valentine DP Prompts")
            @("valentine-instagram-caption-prompts.html", "Valentine Instagram Captions")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
    @{
        file        = "valentine-dp-prompts.html"
        type        = "seasonal"
        title       = "Valentine DP AI Prompts – Romantic Profile Pictures for Valentine's Day"
        desc        = "Create romantic Valentine's Day profile pictures with these tested AI prompts. Perfect for Instagram and WhatsApp DPs during Valentine's season."
        breadLabel  = "Valentine DP Prompts"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-couple-photo-prompts.html", "Valentine Couple Photos")
            @("valentine-instagram-caption-prompts.html", "Valentine Instagram Captions")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
    @{
        file        = "valentine-gift-message-prompts.html"
        type        = "seasonal"
        title       = "Valentine Gift Message AI Prompts – Heartfelt Messages with AI"
        desc        = "Generate heartfelt Valentine's Day gift messages and love notes using these AI prompts. Perfect for cards, tags, and surprise notes."
        breadLabel  = "Valentine Gift Message Prompts"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-love-letter-prompts.html", "Valentine Love Letter Prompts")
            @("valentine-whatsapp-messages.html", "Valentine WhatsApp Messages")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
    @{
        file        = "valentine-instagram-caption-prompts.html"
        type        = "seasonal"
        title       = "Valentine Instagram Caption AI Prompts – Romantic Captions for Posts"
        desc        = "Copy the best Valentine's Day Instagram caption AI prompts. Romantic, witty, and heartfelt captions for Valentine's Day social media posts."
        breadLabel  = "Valentine Instagram Captions"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-dp-prompts.html", "Valentine DP Prompts")
            @("valentine-whatsapp-messages.html", "Valentine WhatsApp Messages")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
    @{
        file        = "valentine-love-letter-prompts.html"
        type        = "seasonal"
        title       = "Valentine Love Letter AI Prompts – Romantic Letters with AI"
        desc        = "Write beautiful Valentine's Day love letters using these tested AI prompts. Heartfelt, romantic, and personal love letter templates for any relationship."
        breadLabel  = "Valentine Love Letter Prompts"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-gift-message-prompts.html", "Valentine Gift Messages")
            @("valentine-whatsapp-messages.html", "Valentine WhatsApp Messages")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
    @{
        file        = "valentine-whatsapp-messages.html"
        type        = "seasonal"
        title       = "Valentine WhatsApp Message AI Prompts – Romantic Messages for Valentine's Day"
        desc        = "Generate sweet and romantic Valentine's Day WhatsApp messages using tested AI prompts. Perfect for couples, friends, and family."
        breadLabel  = "Valentine WhatsApp Messages"
        parent      = "valentine-ai-image-prompts.html"
        parentLabel = "Valentine AI Image Prompts"
        siblings    = @(
            @("valentine-love-letter-prompts.html", "Valentine Love Letter Prompts")
            @("valentine-gift-message-prompts.html", "Valentine Gift Messages")
        )
        children    = @()
        mainImage   = "images/valentine/valentine-couple.webp"
    }
)

# ─────────────────────────────────────────────────────────────
# HELPER: Build clean JSON-LD @graph block
# ─────────────────────────────────────────────────────────────
function Get-SchemaBlock {
    param($p)

    $url = "$BASE/$($p.file)"
    $title = $p.title
    $desc = $p.desc -replace '"', '\"'
    $img = "$BASE/$($p.mainImage)"

    # BreadcrumbList items
    $bcItems = @()
    $bcItems += @"
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "$BASE/"
        }
"@

    if ($p.type -eq "sub" -or ($p.type -eq "seasonal" -and $p.parent -ne "")) {
        $parentUrl = "$BASE/$($p.parent)"
        $bcItems += @"
        {
          "@type": "ListItem",
          "position": 2,
          "name": "$($p.parentLabel)",
          "item": "$parentUrl"
        }
"@
        $bcItems += @"
        {
          "@type": "ListItem",
          "position": 3,
          "name": "$($p.breadLabel)",
          "item": "$url"
        }
"@
    }
    else {
        $bcItems += @"
        {
          "@type": "ListItem",
          "position": 2,
          "name": "$($p.breadLabel)",
          "item": "$url"
        }
"@
    }

    $bcList = $bcItems -join ",`n"

    if ($p.type -eq "utility") {
        # Utility: WebPage + BreadcrumbList only
        return @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "$url#webpage",
      "url": "$url",
      "name": "$title",
      "description": "$desc",
      "inLanguage": "en-US",
      "isPartOf": { "@id": "$BASE/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
$bcList
      ]
    }
  ]
}
</script>
"@
    }
    else {
        # Hub / Sub / Seasonal: WebPage + BreadcrumbList + Article
        return @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "$url#webpage",
      "url": "$url",
      "name": "$title",
      "description": "$desc",
      "inLanguage": "en-US",
      "isPartOf": { "@id": "$BASE/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
$bcList
      ]
    },
    {
      "@type": "Article",
      "headline": "$title",
      "description": "$desc",
      "image": "$img",
      "author": {
        "@type": "Organization",
        "@id": "$BASE/#organization"
      },
      "publisher": {
        "@id": "$BASE/#organization"
      },
      "datePublished": "2026-02-17",
      "dateModified": "2026-02-19",
      "mainEntityOfPage": { "@id": "$url#webpage" },
      "inLanguage": "en-US"
    }
  ]
}
</script>
"@
    }
}

# ─────────────────────────────────────────────────────────────
# HELPER: Build HTML breadcrumb nav
# ─────────────────────────────────────────────────────────────
function Get-BreadcrumbHtml {
    param($p)

    if ($p.type -eq "sub" -or ($p.type -eq "seasonal" -and $p.parent -ne "")) {
        return @"
  <nav class="breadcrumb-nav container py-2" aria-label="breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="$($p.parent)">$($p.parentLabel)</a></li>
      <li><span>$($p.breadLabel)</span></li>
    </ol>
  </nav>
"@
    }
    else {
        return @"
  <nav class="breadcrumb-nav container py-2" aria-label="breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><span>$($p.breadLabel)</span></li>
    </ol>
  </nav>
"@
    }
}

# ─────────────────────────────────────────────────────────────
# HELPER: Build "Related Prompts" section for sub-pages
# ─────────────────────────────────────────────────────────────
function Get-RelatedSection {
    param($p)

    if ($p.siblings.Count -eq 0) { return "" }

    $cat = switch -Wildcard ($p.file) {
        "instagram-*" { "Instagram DP" }
        "whatsapp-*" { "WhatsApp DP" }
        "linkedin-*" { "LinkedIn Profile" }
        "ceo-*" { "Professional Headshot" }
        "corporate-*" { "Professional Headshot" }
        "studio-*" { "Professional Headshot" }
        "resume-*" { "Professional Headshot" }
        "realistic-*" { "Professional Headshot" }
        "romantic-*" { "Anime" }
        "valentine-*" { "Valentine" }
        default { "Prompt" }
    }

    $links = ""
    if ($p.parent -ne "") {
        $links += "      <li><a href=`"$($p.parent)`">← All $cat Prompts</a></li>`n"
    }
    foreach ($sib in $p.siblings) {
        $links += "      <li><a href=`"$($sib[0])`">$($sib[1])</a></li>`n"
    }

    return @"

  <!-- Related Prompts -->
  <section class="related-prompts container py-4" aria-label="Related Prompts">
    <h2 style="font-size:1.25rem;margin-bottom:0.75rem;color:var(--text-strong);">More $cat Prompts</h2>
    <ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:0.75rem;">
$($links.TrimEnd())`n    </ul>
  </section>
"@
}

# ─────────────────────────────────────────────────────────────
# HELPER: Build child links section for hub pages
# ─────────────────────────────────────────────────────────────
function Get-ChildLinksSection {
    param($p)

    if ($p.children.Count -eq 0) { return "" }

    $cat = $p.breadLabel

    $items = ""
    foreach ($child in $p.children) {
        $items += @"
      <li style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.75rem 1.25rem;">
        <a href="$($child[0])" style="color:var(--accent2);text-decoration:none;font-weight:600;">$($child[1])</a>
      </li>
"@
    }

    return @"

  <!-- Sub-Category Navigation -->
  <section class="container py-4" aria-label="Browse $cat">
    <h2 style="font-size:1.25rem;margin-bottom:0.75rem;color:var(--text-strong);">Browse $cat by Category</h2>
    <ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:0.75rem;">
$($items.TrimEnd())
    </ul>
  </section>
"@
}

# ─────────────────────────────────────────────────────────────
# MAIN: Process each page
# ─────────────────────────────────────────────────────────────
$fixed = 0
$warnings = @()

foreach ($p in $pages) {
    $filepath = Join-Path $root $p.file

    if (-not (Test-Path $filepath)) {
        $warnings += "NOT FOUND: $($p.file)"
        continue
    }

    $c = [System.IO.File]::ReadAllText($filepath)

    # ── STEP 1: Remove PIL-SEO-SNIPPET block ──
    if ($c -match "(?s)<!-- PIL-SEO-SNIPPET -->.*?<!-- End PIL-SEO-SNIPPET -->") {
        $c = [regex]::Replace($c, "(?s)\r?\n?\s*<!-- PIL-SEO-SNIPPET -->.*?<!-- End PIL-SEO-SNIPPET -->\r?\n?", "`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    }

    # ── STEP 2: Remove ALL existing JSON-LD script blocks ──
    # This removes every <script type="application/ld+json">...</script> block
    $c = [regex]::Replace($c, "(?s)\r?\n?\s*<script type=""application/ld\+json"">.*?</script>\r?\n?", "`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)

    # ── STEP 3: Insert ONE clean @graph block right before </head> ──
    $schema = Get-SchemaBlock -p $p
    $c = $c -replace "</head>", "$schema`n</head>"

    # ── STEP 4: Remove any existing breadcrumb nav (to avoid duplicates) ──
    $c = [regex]::Replace($c, "(?s)\r?\n?\s*<nav[^>]*aria-label=""breadcrumb""[^>]*>.*?</nav>\r?\n?", "`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)

    # ── STEP 5: Insert breadcrumb at the start of <main> ──
    # If no <main>, insert after <body> opening. Most pages have <main id="main"...> or just <main>
    $breadNav = Get-BreadcrumbHtml -p $p
    if ($c -match "<main[^>]*>") {
        $c = [regex]::Replace($c, "(<main[^>]*>)", "`$1`n$breadNav", [System.Text.RegularExpressions.RegexOptions]::Singleline)
    }
    elseif ($c -match "<article>") {
        # Some pages use <article> directly without <main>
        $c = [regex]::Replace($c, "(<article>)", "$breadNav`n`$1", [System.Text.RegularExpressions.RegexOptions]::None)
    }

    # ── STEP 6: Remove existing related-prompts section if any ──
    $c = [regex]::Replace($c, "(?s)\r?\n?\s*<!-- Related Prompts -->.*?</section>\r?\n?", "`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)

    # ── STEP 7: Remove existing child-links section if any ──
    $c = [regex]::Replace($c, "(?s)\r?\n?\s*<!-- Sub-Category Navigation -->.*?</section>\r?\n?", "`n", [System.Text.RegularExpressions.RegexOptions]::Singleline)

    # ── STEP 8: Add Related Prompts (sub pages) or Child Links (hub pages) before </footer> or </body> ──
    $extraSection = ""
    if ($p.type -eq "sub" -or ($p.type -eq "seasonal" -and $p.parent -ne "" -and $p.siblings.Count -gt 0)) {
        $extraSection = Get-RelatedSection -p $p
    }
    elseif ($p.children.Count -gt 0) {
        $extraSection = Get-ChildLinksSection -p $p
    }

    if ($extraSection -ne "") {
        # Insert before </footer> if exists, else before </body>
        if ($c -match "</footer>") {
            $c = $c -replace "</footer>", "$extraSection`n</footer>"
        }
        else {
            $c = $c -replace "</body>", "$extraSection`n</body>"
        }
    }

    # ── STEP 9: Add/Update Last Updated signal ──
    # Ensure "Last updated: February 19, 2026" is on page.
    # If trust-signals already has "Updated: February 17, 2026", update it to 19.
    # If not present, update any date in trust-signals to 19 and add freshness <p> near footer.
    $c = $c -replace "Updated: February 17, 2026", "Updated: February 19, 2026"
    $c = $c -replace "Updated: February 18, 2026", "Updated: February 19, 2026"

    # If no "Updated:" freshness text exists, add one before </footer> or just before </body>
    if ($c -notmatch "Updated: February 19, 2026" -and $c -notmatch "Last updated") {
        $freshness = "`n  <p style=""text-align:center;font-size:0.85rem;color:rgba(255,255,255,0.5);padding:8px 0;"">Last updated: February 19, 2026</p>"
        if ($c -match "</footer>") {
            $c = $c -replace "</footer>", "$freshness`n</footer>"
        }
        else {
            $c = $c -replace "</body>", "$freshness`n</body>"
        }
    }

    [System.IO.File]::WriteAllText($filepath, $c, [System.Text.Encoding]::UTF8)
    Write-Host "DONE: $($p.file)" -ForegroundColor Green
    $fixed++
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Processed: $fixed pages" -ForegroundColor Green
if ($warnings.Count -gt 0) {
    Write-Host "Warnings:" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
Write-Host "================================================" -ForegroundColor Cyan
