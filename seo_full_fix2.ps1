# seo_full_fix2.ps1  — Remaining SEO structural fixes
# Fixes: PIL-SEO-SNIPPET removal, clean schema, breadcrumbs, related sections

$base = "c:\Users\Dhanush\Desktop\site\promptimagelab"
$domain = "https://promptimagelab.com"
$orgId = "https://promptimagelab.com/#organization"
$webId = "https://promptimagelab.com/#website"

# ─── PAGE DATA ───────────────────────────────────────────────────────────────
# type = "hub" or "sub"
# Each page has: file, title, desc, type, hero
# hub: + children array of {file,label}
# sub: + parent, parentTitle, siblings array of {file,label}
$pages = @(
    [ordered]@{file = "instagram-dp-ai-prompts.html"; title = "Instagram DP AI Prompts"; desc = "Copy the best Instagram DP AI prompts to convert your photo into stylish, aesthetic, and viral Instagram profile pictures using AI."; type = "hub"; hero = "images/instagram-dp/instagram-dp-studio.webp"; children = @(@{file = "instagram-dp-for-girls-ai-prompts.html"; label = "Instagram DP for Girls" }, @{file = "instagram-dp-for-boys-ai-prompts.html"; label = "Instagram DP for Boys" }, @{file = "instagram-dp-couple-ai-prompts.html"; label = "Couple Instagram DP" }, @{file = "instagram-dp-black-white-ai-prompts.html"; label = "Black and White Instagram DP" }) },
    [ordered]@{file = "instagram-dp-for-girls-ai-prompts.html"; title = "Instagram DP for Girls"; desc = "Generate beautiful, aesthetic Instagram DP prompts for girls using AI. Soft, stylish, and on-trend profile picture ideas."; type = "sub"; hero = "images/instagram-dp-girls/girls-aesthetic.webp"; parent = "instagram-dp-ai-prompts.html"; parentTitle = "Instagram DP AI Prompts"; siblings = @(@{file = "instagram-dp-ai-prompts.html"; label = "All Instagram DP Prompts" }, @{file = "instagram-dp-for-boys-ai-prompts.html"; label = "Instagram DP for Boys" }, @{file = "instagram-dp-couple-ai-prompts.html"; label = "Couple Instagram DP" }) },
    [ordered]@{file = "instagram-dp-for-boys-ai-prompts.html"; title = "Instagram DP for Boys"; desc = "Create bold, stylish Instagram DPs for boys with AI prompts. Best profile picture ideas for attitude, aesthetic, and cool looks."; type = "sub"; hero = "images/instagram-dp-boys/boys-hero.webp"; parent = "instagram-dp-ai-prompts.html"; parentTitle = "Instagram DP AI Prompts"; siblings = @(@{file = "instagram-dp-ai-prompts.html"; label = "All Instagram DP Prompts" }, @{file = "instagram-dp-for-girls-ai-prompts.html"; label = "Instagram DP for Girls" }, @{file = "instagram-dp-black-white-ai-prompts.html"; label = "Black and White Instagram DP" }) },
    [ordered]@{file = "instagram-dp-black-white-ai-prompts.html"; title = "Instagram DP Black and White"; desc = "Create classy black and white Instagram DP using AI. Copy aesthetic monochrome Instagram profile picture prompts for boys and girls."; type = "sub"; hero = "images/instagram-dp-bw/instagram-dp-black-white.webp"; parent = "instagram-dp-ai-prompts.html"; parentTitle = "Instagram DP AI Prompts"; siblings = @(@{file = "instagram-dp-ai-prompts.html"; label = "All Instagram DP Prompts" }, @{file = "instagram-dp-for-boys-ai-prompts.html"; label = "Instagram DP for Boys" }, @{file = "instagram-dp-for-girls-ai-prompts.html"; label = "Instagram DP for Girls" }) },
    [ordered]@{file = "instagram-dp-couple-ai-prompts.html"; title = "Couple Instagram DP"; desc = "Create romantic and aesthetic couple Instagram DPs using AI prompts. Best matching and couple profile picture ideas for Instagram."; type = "sub"; hero = "images/instagram-dp-couple/couple-hero.webp"; parent = "instagram-dp-ai-prompts.html"; parentTitle = "Instagram DP AI Prompts"; siblings = @(@{file = "instagram-dp-ai-prompts.html"; label = "All Instagram DP Prompts" }, @{file = "instagram-dp-for-girls-ai-prompts.html"; label = "Instagram DP for Girls" }, @{file = "instagram-dp-for-boys-ai-prompts.html"; label = "Instagram DP for Boys" }) },

    [ordered]@{file = "whatsapp-dp-ai-prompts.html"; title = "WhatsApp DP AI Prompts"; desc = "Use the best WhatsApp DP AI prompts to create stylish, aesthetic WhatsApp profile pictures using AI image tools."; type = "hub"; hero = "images/whatsapp-dp/whatsapp-dp-girls.webp"; children = @(@{file = "whatsapp-dp-for-girls-ai-prompts.html"; label = "WhatsApp DP for Girls" }, @{file = "whatsapp-dp-for-boys-ai-prompts.html"; label = "WhatsApp DP for Boys" }, @{file = "whatsapp-dp-tamil-ai-prompts.html"; label = "Tamil WhatsApp DP" }) },
    [ordered]@{file = "whatsapp-dp-for-girls-ai-prompts.html"; title = "WhatsApp DP for Girls"; desc = "Create beautiful and stylish WhatsApp DP for girls with AI prompts. Aesthetic, cute, and trending profile picture ideas."; type = "sub"; hero = "images/whatsapp-dp/whatsapp-dp-girls.webp"; parent = "whatsapp-dp-ai-prompts.html"; parentTitle = "WhatsApp DP AI Prompts"; siblings = @(@{file = "whatsapp-dp-ai-prompts.html"; label = "All WhatsApp DP Prompts" }, @{file = "whatsapp-dp-for-boys-ai-prompts.html"; label = "WhatsApp DP for Boys" }, @{file = "whatsapp-dp-tamil-ai-prompts.html"; label = "Tamil WhatsApp DP" }) },
    [ordered]@{file = "whatsapp-dp-for-boys-ai-prompts.html"; title = "WhatsApp DP for Boys"; desc = "Create cool, stylish WhatsApp DP for boys with AI prompts. Attitude, aesthetic, and trending WhatsApp profile picture ideas for guys."; type = "sub"; hero = "images/whatsapp-dp/whatsapp-dp-boys.webp"; parent = "whatsapp-dp-ai-prompts.html"; parentTitle = "WhatsApp DP AI Prompts"; siblings = @(@{file = "whatsapp-dp-ai-prompts.html"; label = "All WhatsApp DP Prompts" }, @{file = "whatsapp-dp-for-girls-ai-prompts.html"; label = "WhatsApp DP for Girls" }, @{file = "whatsapp-dp-tamil-ai-prompts.html"; label = "Tamil WhatsApp DP" }) },
    [ordered]@{file = "whatsapp-dp-tamil-ai-prompts.html"; title = "Tamil WhatsApp DP"; desc = "Create aesthetic Tamil-style WhatsApp profile pictures using AI prompts. Cultural, traditional, and modern Tamil DP ideas."; type = "sub"; hero = "images/whatsapp-dp/whatsapp-dp-tamil.webp"; parent = "whatsapp-dp-ai-prompts.html"; parentTitle = "WhatsApp DP AI Prompts"; siblings = @(@{file = "whatsapp-dp-ai-prompts.html"; label = "All WhatsApp DP Prompts" }, @{file = "whatsapp-dp-for-girls-ai-prompts.html"; label = "WhatsApp DP for Girls" }, @{file = "whatsapp-dp-for-boys-ai-prompts.html"; label = "WhatsApp DP for Boys" }) },

    [ordered]@{file = "anime-avatars.html"; title = "Anime Avatar AI Prompts"; desc = "Copy the best anime avatar AI prompts to convert your photo into stunning anime-style profile pictures using AI tools."; type = "hub"; hero = "images/anime-avatars/anime-hero.webp"; children = @(@{file = "romantic-anime-prompts.html"; label = "Romantic Anime Prompts" }) },
    [ordered]@{file = "romantic-anime-prompts.html"; title = "Romantic Anime Prompts"; desc = "Create romantic, beautiful anime profile pictures using AI prompts. Aesthetic couple and solo romantic anime DP ideas."; type = "sub"; hero = "images/romantic-anime/romantic-hero.webp"; parent = "anime-avatars.html"; parentTitle = "Anime Avatar AI Prompts"; siblings = @(@{file = "anime-avatars.html"; label = "All Anime Avatar Prompts" }) },

    [ordered]@{file = "linkedin-profile-picture-prompts.html"; title = "LinkedIn Profile Picture Prompts"; desc = "Copy professional LinkedIn profile picture AI prompts to create a credible, polished, and standout LinkedIn photo using AI."; type = "hub"; hero = "images/linkedin/linkedin-hero.webp"; children = @(@{file = "linkedin-profile-men.html"; label = "LinkedIn Profile for Men" }, @{file = "linkedin-profile-women.html"; label = "LinkedIn Profile for Women" }) },
    [ordered]@{file = "linkedin-profile-men.html"; title = "LinkedIn Profile Picture for Men"; desc = "Create a professional LinkedIn profile picture for men using AI prompts. Executive, confident, and polished headshot ideas."; type = "sub"; hero = "images/linkedin/linkedin-men-hero.webp"; parent = "linkedin-profile-picture-prompts.html"; parentTitle = "LinkedIn Profile Picture Prompts"; siblings = @(@{file = "linkedin-profile-picture-prompts.html"; label = "All LinkedIn Profile Prompts" }, @{file = "linkedin-profile-women.html"; label = "LinkedIn Profile for Women" }) },
    [ordered]@{file = "linkedin-profile-women.html"; title = "LinkedIn Profile Picture for Women"; desc = "Create a confident, professional LinkedIn profile picture for women using AI prompts. Polished headshots for career success."; type = "sub"; hero = "images/linkedin/linkedin-women-hero.webp"; parent = "linkedin-profile-picture-prompts.html"; parentTitle = "LinkedIn Profile Picture Prompts"; siblings = @(@{file = "linkedin-profile-picture-prompts.html"; label = "All LinkedIn Profile Prompts" }, @{file = "linkedin-profile-men.html"; label = "LinkedIn Profile for Men" }) },

    [ordered]@{file = "professional-ai-headshot-prompts.html"; title = "Professional AI Headshot Prompts"; desc = "Copy the best professional AI headshot prompts to create executive portraits, LinkedIn photos, and corporate headshots with AI."; type = "hub"; hero = "images/headshots/headshot-hero.webp"; children = @(@{file = "linkedin-profile-picture-prompts.html"; label = "LinkedIn Profile Picture Prompts" }, @{file = "ceo-style-portrait-prompts.html"; label = "CEO Style Portrait Prompts" }, @{file = "corporate-portrait-prompts.html"; label = "Corporate Portrait Prompts" }, @{file = "studio-lighting-portrait-prompts.html"; label = "Studio Lighting Portrait Prompts" }, @{file = "resume-photo-prompts.html"; label = "Resume Photo Prompts" }) },
    [ordered]@{file = "ceo-style-portrait-prompts.html"; title = "CEO Style Portrait Prompts"; desc = "Create powerful CEO-style AI portrait prompts for executive headshots. Commanding, confident, and professional AI photo ideas."; type = "sub"; hero = "images/ceo/ceo-hero.webp"; parent = "professional-ai-headshot-prompts.html"; parentTitle = "Professional AI Headshot Prompts"; siblings = @(@{file = "professional-ai-headshot-prompts.html"; label = "All Professional Headshot Prompts" }, @{file = "corporate-portrait-prompts.html"; label = "Corporate Portrait Prompts" }, @{file = "linkedin-profile-picture-prompts.html"; label = "LinkedIn Profile Picture Prompts" }) },
    [ordered]@{file = "corporate-portrait-prompts.html"; title = "Corporate Portrait Prompts"; desc = "Create polished corporate portrait AI prompts for professional business headshots. Office and studio corporate photo ideas."; type = "sub"; hero = "images/corporate/corporate-hero.webp"; parent = "professional-ai-headshot-prompts.html"; parentTitle = "Professional AI Headshot Prompts"; siblings = @(@{file = "professional-ai-headshot-prompts.html"; label = "All Professional Headshot Prompts" }, @{file = "ceo-style-portrait-prompts.html"; label = "CEO Style Portrait Prompts" }, @{file = "studio-lighting-portrait-prompts.html"; label = "Studio Lighting Portrait Prompts" }) },
    [ordered]@{file = "studio-lighting-portrait-prompts.html"; title = "Studio Lighting Portrait Prompts"; desc = "Copy studio lighting portrait AI prompts to create professional, well-lit AI portrait photos. Best studio setup prompts for all styles."; type = "sub"; hero = "images/studio/studio-hero.webp"; parent = "professional-ai-headshot-prompts.html"; parentTitle = "Professional AI Headshot Prompts"; siblings = @(@{file = "professional-ai-headshot-prompts.html"; label = "All Professional Headshot Prompts" }, @{file = "corporate-portrait-prompts.html"; label = "Corporate Portrait Prompts" }, @{file = "resume-photo-prompts.html"; label = "Resume Photo Prompts" }) },
    [ordered]@{file = "resume-photo-prompts.html"; title = "Resume Photo Prompts"; desc = "Create the perfect resume or CV photo using AI prompts. Professional, clean, and confident portrait ideas for job applications."; type = "sub"; hero = "images/resume/resume-hero.webp"; parent = "professional-ai-headshot-prompts.html"; parentTitle = "Professional AI Headshot Prompts"; siblings = @(@{file = "professional-ai-headshot-prompts.html"; label = "All Professional Headshot Prompts" }, @{file = "studio-lighting-portrait-prompts.html"; label = "Studio Lighting Portrait Prompts" }, @{file = "linkedin-profile-picture-prompts.html"; label = "LinkedIn Profile Picture Prompts" }) },
    [ordered]@{file = "realistic-ai-portrait-prompts.html"; title = "Realistic AI Portrait Prompts"; desc = "Copy realistic AI portrait prompts to generate hyper-realistic, photographic portrait images using AI tools like MidJourney and DALL-E."; type = "sub"; hero = "images/realistic/realistic-hero.webp"; parent = "professional-ai-headshot-prompts.html"; parentTitle = "Professional AI Headshot Prompts"; siblings = @(@{file = "professional-ai-headshot-prompts.html"; label = "All Professional Headshot Prompts" }, @{file = "studio-lighting-portrait-prompts.html"; label = "Studio Lighting Portrait Prompts" }, @{file = "corporate-portrait-prompts.html"; label = "Corporate Portrait Prompts" }) },

    [ordered]@{file = "ai-profile-picture-dp-prompts.html"; title = "AI Profile Picture DP Prompts"; desc = "Find the best AI profile picture prompts for Instagram, WhatsApp, LinkedIn, and all social media platforms. Create stunning AI DPs today."; type = "hub"; hero = "images/profile-dp/ai-profile-dp-hero.webp"; children = @(@{file = "instagram-dp-ai-prompts.html"; label = "Instagram DP AI Prompts" }, @{file = "whatsapp-dp-ai-prompts.html"; label = "WhatsApp DP AI Prompts" }, @{file = "professional-ai-headshot-prompts.html"; label = "Professional AI Headshot Prompts" }) },

    [ordered]@{file = "valentine-ai-image-prompts.html"; title = "Valentine AI Image Prompts"; desc = "Create beautiful romantic Valentine's Day AI images with these prompts. Couple photos, love letter visuals, and more."; type = "hub"; hero = "images/valentine/valentine-hero.webp"; children = @(@{file = "valentine-couple-photo-prompts.html"; label = "Valentine Couple Photo Prompts" }, @{file = "valentine-dp-prompts.html"; label = "Valentine DP Prompts" }, @{file = "valentine-gift-message-prompts.html"; label = "Valentine Gift Message Prompts" }, @{file = "valentine-instagram-caption-prompts.html"; label = "Valentine Instagram Captions" }, @{file = "valentine-love-letter-prompts.html"; label = "Valentine Love Letter Prompts" }, @{file = "valentine-whatsapp-messages.html"; label = "Valentine WhatsApp Messages" }) },
    [ordered]@{file = "valentine-couple-photo-prompts.html"; title = "Valentine Couple Photo Prompts"; desc = "Create stunning Valentine's Day couple photos with AI prompts. Romantic, aesthetic, and heartfelt couple picture ideas."; type = "sub"; hero = "images/valentine/couple-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-dp-prompts.html"; label = "Valentine DP Prompts" }, @{file = "valentine-instagram-caption-prompts.html"; label = "Valentine Instagram Captions" }) },
    [ordered]@{file = "valentine-dp-prompts.html"; title = "Valentine DP Prompts"; desc = "Create beautiful Valentine's Day display pictures using AI prompts. Romantic DP ideas for Instagram, WhatsApp, and more."; type = "sub"; hero = "images/valentine/dp-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-couple-photo-prompts.html"; label = "Valentine Couple Photo Prompts" }, @{file = "valentine-love-letter-prompts.html"; label = "Valentine Love Letter Prompts" }) },
    [ordered]@{file = "valentine-gift-message-prompts.html"; title = "Valentine Gift Message Prompts"; desc = "Create heartfelt Valentine's Day gift messages and notes using AI prompts. Romantic, sweet, and personalized message ideas."; type = "sub"; hero = "images/valentine/gift-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-love-letter-prompts.html"; label = "Valentine Love Letter Prompts" }, @{file = "valentine-whatsapp-messages.html"; label = "Valentine WhatsApp Messages" }) },
    [ordered]@{file = "valentine-instagram-caption-prompts.html"; title = "Valentine Instagram Captions"; desc = "Create beautiful Valentine's Day Instagram captions using AI prompts. Romantic, cute, and heartfelt caption ideas."; type = "sub"; hero = "images/valentine/caption-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-couple-photo-prompts.html"; label = "Valentine Couple Photo Prompts" }, @{file = "valentine-dp-prompts.html"; label = "Valentine DP Prompts" }) },
    [ordered]@{file = "valentine-love-letter-prompts.html"; title = "Valentine Love Letter Prompts"; desc = "Create heartfelt Valentine's Day love letters using AI prompts. Romantic, sincere, and beautiful love letter ideas."; type = "sub"; hero = "images/valentine/letter-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-gift-message-prompts.html"; label = "Valentine Gift Message Prompts" }, @{file = "valentine-dp-prompts.html"; label = "Valentine DP Prompts" }) },
    [ordered]@{file = "valentine-whatsapp-messages.html"; title = "Valentine WhatsApp Messages"; desc = "Create romantic Valentine's Day WhatsApp messages using AI prompts. Sweet, heartfelt, and personalized message ideas."; type = "sub"; hero = "images/valentine/whatsapp-hero.webp"; parent = "valentine-ai-image-prompts.html"; parentTitle = "Valentine AI Image Prompts"; siblings = @(@{file = "valentine-ai-image-prompts.html"; label = "All Valentine AI Prompts" }, @{file = "valentine-gift-message-prompts.html"; label = "Valentine Gift Message Prompts" }, @{file = "valentine-love-letter-prompts.html"; label = "Valentine Love Letter Prompts" }) }
)

# ─── SCHEMA BUILDER ──────────────────────────────────────────────────────────
function Build-Schema {
    param($p)
    $url = "$domain/$($p.file)"
    $id = "$url#webpage"
    $tit = $p.title
    $dsc = $p.desc
    $img = "$domain/$($p.hero)"

    # BreadcrumbList JSON
    if ($p.type -eq "hub") {
        $bcJson = "        {`"@type`":`"ListItem`",`"position`":1,`"name`":`"Home`",`"item`":`"https://promptimagelab.com/`"},`n        {`"@type`":`"ListItem`",`"position`":2,`"name`":`"$tit`",`"item`":`"$url`"}"
    }
    else {
        $purl = "$domain/$($p.parent)"
        $ptit = $p.parentTitle
        $bcJson = "        {`"@type`":`"ListItem`",`"position`":1,`"name`":`"Home`",`"item`":`"https://promptimagelab.com/`"},`n        {`"@type`":`"ListItem`",`"position`":2,`"name`":`"$ptit`",`"item`":`"$purl`"},`n        {`"@type`":`"ListItem`",`"position`":3,`"name`":`"$tit`",`"item`":`"$url`"}"
    }

    $schema = "<script type=`"application/ld+json`">`n{`n"
    $schema += "  `"@context`": `"https://schema.org`",`n"
    $schema += "  `"@graph`": [`n"
    $schema += "    {`n"
    $schema += "      `"@type`": `"WebPage`",`n"
    $schema += "      `"@id`": `"$id`",`n"
    $schema += "      `"url`": `"$url`",`n"
    $schema += "      `"name`": `"$tit`",`n"
    $schema += "      `"description`": `"$dsc`",`n"
    $schema += "      `"inLanguage`": `"en-US`",`n"
    $schema += "      `"isPartOf`": { `"@id`": `"$webId`" }`n"
    $schema += "    },`n"
    $schema += "    {`n"
    $schema += "      `"@type`": `"BreadcrumbList`",`n"
    $schema += "      `"itemListElement`": [`n"
    $schema += $bcJson + "`n"
    $schema += "      ]`n"
    $schema += "    },`n"
    $schema += "    {`n"
    $schema += "      `"@type`": `"Article`",`n"
    $schema += "      `"headline`": `"$tit`",`n"
    $schema += "      `"description`": `"$dsc`",`n"
    $schema += "      `"image`": `"$img`",`n"
    $schema += "      `"author`":    { `"@type`": `"Organization`", `"@id`": `"$orgId`" },`n"
    $schema += "      `"publisher`": { `"@id`": `"$orgId`" },`n"
    $schema += "      `"datePublished`": `"2026-02-17`",`n"
    $schema += "      `"dateModified`":  `"2026-02-19`",`n"
    $schema += "      `"mainEntityOfPage`": { `"@id`": `"$id`" },`n"
    $schema += "      `"inLanguage`": `"en-US`"`n"
    $schema += "    }`n"
    $schema += "  ]`n"
    $schema += "}`n</script>"
    return $schema
}

# ─── BREADCRUMB HTML BUILDER ─────────────────────────────────────────────────
function Build-Breadcrumb {
    param($p)
    $tit = $p.title
    if ($p.type -eq "hub") {
        $items = "        <li><a href=`"/`">Home</a></li>`n        <li><span>$tit</span></li>"
    }
    else {
        $items = "        <li><a href=`"/`">Home</a></li>`n        <li><a href=`"$($p.parent)`">$($p.parentTitle)</a></li>`n        <li><span>$tit</span></li>"
    }
    $html = "  <nav class=`"breadcrumb-nav`" aria-label=`"breadcrumb`">`n"
    $html += "    <div class=`"container`">`n"
    $html += "      <ol>`n"
    $html += $items + "`n"
    $html += "      </ol>`n"
    $html += "    </div>`n"
    $html += "  </nav>"
    return $html
}

# ─── RELATED SECTION BUILDER ─────────────────────────────────────────────────
function Build-RelatedSection {
    param($p)
    if ($p.type -eq "hub") {
        $heading = "Explore More $($p.title)"
        $links = $p.children
    }
    else {
        $heading = "More $($p.parentTitle)"
        $links = $p.siblings
    }
    $items = ($links | ForEach-Object { "        <li><a href=`"$($_.file)`">$($_.label)</a></li>" }) -join "`n"
    $sec = "`n  <!-- Related Prompts -->`n"
    $sec += "  <section class=`"related-prompts-section`" aria-label=`"Related prompt pages`">`n"
    $sec += "    <div class=`"container`">`n"
    $sec += "      <h2>$heading</h2>`n"
    $sec += "      <ul class=`"related-list`">`n"
    $sec += $items + "`n"
    $sec += "      </ul>`n"
    $sec += "    </div>`n"
    $sec += "  </section>"
    return $sec
}

# ─── CSS BLOCK ───────────────────────────────────────────────────────────────
$cssBlock = "  <style>`n    /* Related Prompts */`n    .related-prompts-section{padding:2.5rem 0;background:rgba(255,255,255,0.02);margin-top:2rem;border-top:1px solid rgba(255,255,255,0.06)}`n    .related-prompts-section h2{font-size:1.5rem;margin-bottom:1.2rem;color:#f8fafc}`n    .related-list{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.75rem}`n    .related-list li a{display:inline-block;padding:.5rem 1.2rem;border-radius:30px;border:1px solid rgba(255,255,255,.15);color:#cbd5e1;text-decoration:none;font-size:.95rem;transition:border-color .2s,color .2s}`n    .related-list li a:hover{border-color:#60a5fa;color:#60a5fa}`n    /* Breadcrumb */`n    .breadcrumb-nav{padding:10px 0;font-size:.9rem}`n    .breadcrumb-nav ol{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:6px;color:#94a3b8}`n    .breadcrumb-nav li:not(:last-child)::after{content:`"/`";margin-left:6px;color:#475569}`n    .breadcrumb-nav a{color:#94a3b8;text-decoration:none}`n    .breadcrumb-nav a:hover{color:#60a5fa}`n    .breadcrumb-nav li:last-child span{color:#e2e8f0}`n  </style>"

# ─── REGEX PATTERNS ──────────────────────────────────────────────────────────
$pilRx = '(?s)<!--\s*PIL-SEO-SNIPPET\s*-->.*?<!--\s*End PIL-SEO-SNIPPET\s*-->'
$orgRx = '(?s)<script type="application/ld\+json">\s*\{\s*"@context"\s*:\s*"https://schema\.org"\s*,\s*"@type"\s*:\s*"Organization".*?</script>'
$bcRx = '(?s)<script type="application/ld\+json">\s*\{\s*"@context"\s*:\s*"https://schema\.org"\s*,\s*"@type"\s*:\s*"BreadcrumbList".*?</script>'
$bcCommentRx = '(?s)<!--\s*Breadcrumb Navigation\s*-->\s*'

Write-Host "`n============================" -ForegroundColor Cyan
Write-Host " SEO Full Fix 2 - Starting  " -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

$fixedCount = 0
$skippedCount = 0

foreach ($p in $pages) {
    $path = Join-Path $base $p.file
    if (-not (Test-Path $path)) {
        Write-Host "  SKIP (missing): $($p.file)" -ForegroundColor Yellow
        $skippedCount++
        continue
    }

    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Remove PIL-SEO-SNIPPET block
    $c = [regex]::Replace($c, $pilRx, '', 'Singleline')

    # 2. Remove stray stand-alone Organization JSON-LD
    $c = [regex]::Replace($c, $orgRx, '', 'Singleline')

    # 3. Remove old stub BreadcrumbList (position 1 only)
    $c = [regex]::Replace($c, $bcRx, '', 'Singleline')

    # 4. Inject CSS before </head> (if not present)
    if ($c -notmatch 'related-prompts-section') {
        $c = $c -replace '</head>', ($cssBlock + "`n</head>")
    }

    # 5. Inject clean schema block before </head>
    $schema = Build-Schema $p
    $c = $c -replace '</head>', ($schema + "`n</head>")

    # 6. Inject visible breadcrumb HTML
    $bc = Build-Breadcrumb $p
    if ($c -notmatch 'breadcrumb-nav') {
        # Insert after first </nav>
        $inserted = $false
        if ($c -match '</nav>') {
            $c = $c -replace '(</nav>)', ("`$1`n" + $bc)
            $inserted = $true
        }
        if (-not $inserted) {
            $c = $c -replace '(<body[^>]*>)', ("`$1`n" + $bc)
        }
    }
    elseif ($c -match $bcCommentRx) {
        # Replace placeholder comment with real breadcrumb
        $c = [regex]::Replace($c, $bcCommentRx, ($bc + "`n"), 'Singleline')
    }

    # 7. Add related/children section before </footer>
    if ($c -notmatch 'related-prompts-section') {
        $section = Build-RelatedSection $p
        $c = $c -replace '<footer', ($section + "`n<footer")
    }

    [System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
    Write-Host "  FIXED: $($p.file)" -ForegroundColor Green
    $fixedCount++
}

Write-Host "`n============================" -ForegroundColor Cyan
Write-Host " Done. Fixed: $fixedCount  Skipped: $skippedCount" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# ─── VERIFICATION ─────────────────────────────────────────────────────────────
Write-Host "`n-- Verification --" -ForegroundColor Yellow

Write-Host "`n[1] PIL-SEO-SNIPPET remaining:" -ForegroundColor White
$rem = Get-ChildItem $base -Filter "*.html" | Select-String "PIL-SEO-SNIPPET" -List
if ($rem) { $rem | ForEach-Object { Write-Host "  STILL PRESENT: $($_.Filename)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[2] Pages with related-prompts-section:" -ForegroundColor White
$rs = Get-ChildItem $base -Filter "*.html" | Select-String "related-prompts-section" -List
Write-Host "  $($rs.Count) pages" -ForegroundColor Green

Write-Host "`n[3] Pages with 3-level breadcrumb:" -ForegroundColor White
$bc3 = Get-ChildItem $base -Filter "*.html" | Select-String '"position":3' -List
Write-Host "  $($bc3.Count) pages" -ForegroundColor Green

Write-Host "`n[4] Standalone Organization schema remaining:" -ForegroundColor White
$orgR = Get-ChildItem $base -Filter "*.html" | Select-String '"@type": "Organization"' -List
if ($orgR) { $orgR | ForEach-Object { Write-Host "  $($_.Filename)" -ForegroundColor Yellow } }
else { Write-Host "  0" -ForegroundColor Green }
