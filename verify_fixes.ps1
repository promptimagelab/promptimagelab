# Verification script for all SEO fixes
$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"

Write-Host "=== CHECK 1: Remaining href='index.html' (should be 0 in all pages except about.original.html) ===" -ForegroundColor Cyan
$remaining = Select-String -Path "$dir\*.html" -Pattern 'href="index\.html"' | Where-Object { $_.Filename -ne 'about.original.html' }
if ($remaining.Count -eq 0) {
    Write-Host "PASS: No href='index.html' found in any content page" -ForegroundColor Green
}
else {
    Write-Host "FAIL: Found $($remaining.Count) remaining occurrences:" -ForegroundColor Red
    $remaining | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) $($_.Line.Trim())" }
}

Write-Host ""
Write-Host "=== CHECK 2: Pages with wrong number of og:url tags ===" -ForegroundColor Cyan
$ogIssues = 0
Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne 'about.original.html' } | ForEach-Object {
    $count = (Select-String -Path $_.FullName -Pattern 'og:url').Count
    if ($count -ne 1) {
        Write-Host "ISSUE: $($_.Name) has $count og:url tags" -ForegroundColor Red
        $ogIssues++
    }
}
if ($ogIssues -eq 0) {
    Write-Host "PASS: All pages have exactly 1 og:url" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== CHECK 3: Sitemap has ceo-style and corporate-portrait ===" -ForegroundColor Cyan
$ceo = Select-String -Path "$dir\sitemap.xml" -Pattern "ceo-style-portrait-prompts"
$corp = Select-String -Path "$dir\sitemap.xml" -Pattern "corporate-portrait-prompts"
if ($ceo) { Write-Host "PASS: ceo-style-portrait-prompts.html in sitemap" -ForegroundColor Green }
else { Write-Host "FAIL: ceo-style-portrait-prompts.html NOT in sitemap" -ForegroundColor Red }
if ($corp) { Write-Host "PASS: corporate-portrait-prompts.html in sitemap" -ForegroundColor Green }
else { Write-Host "FAIL: corporate-portrait-prompts.html NOT in sitemap" -ForegroundColor Red }

Write-Host ""
Write-Host "=== CHECK 4: robots.txt disallows about.original.html ===" -ForegroundColor Cyan
$disallow = Select-String -Path "$dir\robots.txt" -Pattern "Disallow.*about\.original\.html"
if ($disallow) { Write-Host "PASS: robots.txt blocks about.original.html" -ForegroundColor Green }
else { Write-Host "FAIL: robots.txt does NOT block about.original.html" -ForegroundColor Red }

Write-Host ""
Write-Host "=== CHECK 5: SearchAction removed from index.html ===" -ForegroundColor Cyan
$searchAction = Select-String -Path "$dir\index.html" -Pattern "SearchAction|potentialAction"
if (-not $searchAction) { Write-Host "PASS: SearchAction/potentialAction removed from index.html" -ForegroundColor Green }
else { Write-Host "FAIL: SearchAction still present in index.html" -ForegroundColor Red }

Write-Host ""
Write-Host "=== CHECK 6: Duplicate og:url blocks in index.html (should be 1) ===" -ForegroundColor Cyan
$indexOg = (Select-String -Path "$dir\index.html" -Pattern 'og:url').Count
if ($indexOg -eq 1) { Write-Host "PASS: index.html has exactly 1 og:url" -ForegroundColor Green }
else { Write-Host "FAIL: index.html has $indexOg og:url tags" -ForegroundColor Red }

Write-Host ""
Write-Host "=== All checks complete ===" -ForegroundColor Cyan
