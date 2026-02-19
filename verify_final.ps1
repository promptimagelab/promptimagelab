$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"
$passed = 0; $failed = 0

function Check($label, $condition) {
    if ($condition) { Write-Host "PASS: $label" -ForegroundColor Green; $global:passed++ }
    else { Write-Host "FAIL: $label" -ForegroundColor Red; $global:failed++ }
}

Write-Host "=== FINAL SEO VERIFICATION ===" -ForegroundColor Cyan

# Check 1: No href="index.html" bare links anywhere
$bare = Select-String -Path "$dir\*.html" -Pattern 'href="index\.html"' | Where-Object { $_.Filename -ne 'about.original.html' }
Check "No bare href='index.html' in any content page ($($bare.Count) found)" ($bare.Count -eq 0)

# Check 2: No href="index.html#xxx" hash links anywhere
$hash = Select-String -Path "$dir\*.html" -Pattern 'href="index\.html#' | Where-Object { $_.Filename -ne 'about.original.html' }
Check "No href='index.html#section' links in any content page ($($hash.Count) found)" ($hash.Count -eq 0)

# Check 3: Every content page has exactly 1 og:url
Write-Host "`n--- og:url check per page ---" -ForegroundColor Yellow
$ogIssues = 0
Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne 'about.original.html' } | ForEach-Object {
    $c = (Select-String -Path $_.FullName -Pattern 'og:url').Count
    if ($c -ne 1) { Write-Host "  ISSUE: $($_.Name) has $c og:url" -ForegroundColor Red; $ogIssues++ }
}
Check "All pages have exactly 1 og:url ($ogIssues issues)" ($ogIssues -eq 0)

# Check 4: Sitemap completeness
$sitemapPages = @("ceo-style-portrait-prompts.html", "corporate-portrait-prompts.html")
foreach ($p in $sitemapPages) {
    $found = Select-String -Path "$dir\sitemap.xml" -Pattern $p
    Check "sitemap.xml contains $p" ($null -ne $found)
}

# Check 5: robots.txt blocks about.original.html
$disallow = Select-String -Path "$dir\robots.txt" -Pattern "Disallow.*about\.original\.html"
Check "robots.txt disallows about.original.html" ($null -ne $disallow)

# Check 6: index.html has no SearchAction
$search = Select-String -Path "$dir\index.html" -Pattern "SearchAction|potentialAction"
Check "index.html has no SearchAction/potentialAction" ($null -eq $search)

# Check 7: index.html has exactly 1 og:url
$indexOg = (Select-String -Path "$dir\index.html" -Pattern 'og:url').Count
Check "index.html has exactly 1 og:url ($indexOg found)" ($indexOg -eq 1)

# Check 8: No PIL-SEO-SNIPPET left with og:url
$snippets = Select-String -Path "$dir\*.html" -Pattern '<!-- PIL-SEO-SNIPPET -->'
Check "No pages have duplicate PIL-SEO-SNIPPET blocks ($($snippets.Count) found)" ($snippets.Count -eq 0)

Write-Host "`n=== RESULTS: $passed passed, $failed failed ===" -ForegroundColor Cyan
