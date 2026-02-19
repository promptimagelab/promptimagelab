$base = 'c:\Users\Dhanush\Desktop\site\promptimagelab'
$pilRx = '(?s)<!--\s*PIL-SEO-SNIPPET\s*-->.*?<!--\s*End PIL-SEO-SNIPPET\s*-->'
$orgRx = '(?s)<script type="application/ld\+json">\s*\{\s*"@context"\s*:\s*"https://schema\.org"\s*,\s*"@type"\s*:\s*"Organization".*?</script>'
$bcRx = '(?s)<script type="application/ld\+json">\s*\{\s*"@context"\s*:\s*"https://schema\.org"\s*,\s*"@type"\s*:\s*"BreadcrumbList".*?</script>'

foreach ($fn in @('about.html', 'contact.html', 'privacy-policy.html')) {
    $path = Join-Path $base $fn
    if (-not (Test-Path $path)) { Write-Host "MISSING: $fn"; continue }
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $c = [regex]::Replace($c, $pilRx, '', 'Singleline')
    $c = [regex]::Replace($c, $orgRx, '', 'Singleline')
    $c = [regex]::Replace($c, $bcRx, '', 'Singleline')
    [System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
    Write-Host "CLEANED: $fn" -ForegroundColor Green
}

Write-Host "`n=== FINAL CHECKS ===" -ForegroundColor Cyan

Write-Host "`n[PIL-SEO-SNIPPET remaining]:" -ForegroundColor White
$r = Get-ChildItem $base -Filter '*.html' | Select-String 'PIL-SEO-SNIPPET' -List
if ($r) { $r | ForEach-Object { Write-Host "  !! $($_.Filename)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[Pages with breadcrumb-nav]:" -ForegroundColor White
$b = Get-ChildItem $base -Filter '*.html' | Select-String 'breadcrumb-nav' -List
Write-Host "  $($b.Count) pages" -ForegroundColor Green

Write-Host "`n[Pages with related-prompts-section]:" -ForegroundColor White
$rs = Get-ChildItem $base -Filter '*.html' | Select-String 'related-prompts-section' -List
Write-Host "  $($rs.Count) pages" -ForegroundColor Green

Write-Host "`n[Pages with 3-level breadcrumb schema]:" -ForegroundColor White
$bc3 = Get-ChildItem $base -Filter '*.html' | Select-String '"position":3' -List
Write-Host "  $($bc3.Count) pages" -ForegroundColor Green

Write-Host "`n[Multiple @graph blocks on same page]:" -ForegroundColor White
$multi = Get-ChildItem $base -Filter '*.html' | Where-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    ([regex]::Matches($raw, '"@graph"')).Count -gt 1
}
if ($multi) { $multi | ForEach-Object { Write-Host "  MULTI @graph: $($_.Name)" -ForegroundColor Yellow } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }
