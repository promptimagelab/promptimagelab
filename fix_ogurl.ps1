$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"

# Pages that are MISSING og:url entirely — need to add it after canonical tag
$missingOgUrl = @(
    "whatsapp-dp-tamil-ai-prompts.html",
    "whatsapp-dp-for-girls-ai-prompts.html",
    "whatsapp-dp-for-boys-ai-prompts.html",
    "whatsapp-dp-ai-prompts.html",
    "valentine-whatsapp-messages.html",
    "valentine-love-letter-prompts.html",
    "valentine-instagram-caption-prompts.html",
    "valentine-gift-message-prompts.html",
    "valentine-dp-prompts.html",
    "valentine-couple-photo-prompts.html",
    "valentine-ai-image-prompts.html",
    "studio-lighting-portrait-prompts.html",
    "romantic-anime-prompts.html",
    "resume-photo-prompts.html",
    "realistic-ai-portrait-prompts.html",
    "professional-ai-headshot-prompts.html",
    "linkedin-profile-picture-prompts.html"
)

foreach ($fileName in $missingOgUrl) {
    $filePath = Join-Path $dir $fileName
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # Extract filename without .html for URL construction
    $urlSlug = $fileName

    # Build the og:url line to insert
    $ogUrl = "  <meta property=`"og:url`" content=`"https://promptimagelab.com/$urlSlug`">"

    # Insert og:url right after the canonical link tag
    # Pattern: <link rel="canonical" href="..."> followed by newline
    $canonPattern = '(<link rel="canonical" href="[^"]+"[^>]*>)'
    $newContent = $content -replace $canonPattern, "`$1`n$ogUrl"

    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Added og:url to: $fileName"
    }
    else {
        Write-Host "WARNING - pattern not matched: $fileName"
    }
}

# Fix anime-avatars.html — remove duplicate og:url (there are 2, keep only the first)
$animeFile = Join-Path $dir "anime-avatars.html"
$animeContent = [System.IO.File]::ReadAllText($animeFile, [System.Text.Encoding]::UTF8)

# Count occurrences
$matches = [regex]::Matches($animeContent, '<meta property="og:url"[^>]+>')
Write-Host "anime-avatars.html has $($matches.Count) og:url tags"

if ($matches.Count -gt 1) {
    # Remove only the SECOND occurrence by replacing from second match position
    $firstPos = $matches[0].Index
    $secondMatch = $matches[1].Value
    $secondPos = $matches[1].Index

    # Remove the second og:url tag and its surrounding newline
    $animeNew = $animeContent.Remove($secondPos, $matches[1].Length)
    # Also remove trailing newline if present
    $animeNew = [regex]::Replace($animeNew, "(\r?\n)\s*$([regex]::Escape($secondMatch))", "")

    # Actually just do a targeted replace of the second occurrence
    # Re-read and do it differently: replace all-but-first
    $count = 0
    $animeNew = [regex]::Replace($animeContent, '<meta property="og:url"[^>]+>', {
            param($m)
            $count++
            if ($count -eq 1) { return $m.Value }
            else { return "" }
        })

    [System.IO.File]::WriteAllText($animeFile, $animeNew, [System.Text.Encoding]::UTF8)
    Write-Host "Removed duplicate og:url from anime-avatars.html"
}

Write-Host "All og:url fixes complete."
