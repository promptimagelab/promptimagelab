$base = 'c:\Users\Dhanush\Desktop\site\promptimagelab'

Write-Host "=== COMPREHENSIVE SEO VERIFICATION ===" -ForegroundColor Cyan

Write-Host "`n[1] PIL-SEO-SNIPPET remaining:" -ForegroundColor White
$r = Get-ChildItem $base -Filter '*.html' | Select-String 'PIL-SEO-SNIPPET' -List
if ($r) { $r | ForEach-Object { Write-Host "  !! $($_.Filename)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[2] Pages with clean @graph schema:" -ForegroundColor White
$g = Get-ChildItem $base -Filter '*.html' | Select-String '"@graph"' -List
Write-Host "  $($g.Count) pages" -ForegroundColor Green

Write-Host "`n[3] Pages with multiple @graph blocks:" -ForegroundColor White
$multi = Get-ChildItem $base -Filter '*.html' | Where-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    ([regex]::Matches($raw, '"@graph"')).Count -gt 1
}
if ($multi) { $multi | ForEach-Object { Write-Host "  MULTI @graph: $($_.Name)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[4] Pages with breadcrumb-nav HTML:" -ForegroundColor White
$b = Get-ChildItem $base -Filter '*.html' | Select-String 'breadcrumb-nav' -List
Write-Host "  $($b.Count) pages" -ForegroundColor Green

Write-Host "`n[5] Pages with 3-level breadcrumb in schema:" -ForegroundColor White
$bc3 = Get-ChildItem $base -Filter '*.html' | Select-String '"position":3' -List
Write-Host "  $($bc3.Count) pages" -ForegroundColor Green

Write-Host "`n[6] Pages with related-prompts-section:" -ForegroundColor White
$rs = Get-ChildItem $base -Filter '*.html' | Select-String 'related-prompts-section' -List
Write-Host "  $($rs.Count) pages" -ForegroundColor Green

Write-Host "`n[7] SearchAction / potentialAction remaining:" -ForegroundColor White
$sa = Get-ChildItem $base -Filter '*.html' | Select-String 'SearchAction|potentialAction' -List
if ($sa) { $sa | ForEach-Object { Write-Host "  !! $($_.Filename)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[8] href=index.html remaining:" -ForegroundColor White
$h = Get-ChildItem $base -Filter '*.html' | Select-String 'href="index.html"' -List
if ($h) { $h | ForEach-Object { Write-Host "  !! $($_.Filename)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }

Write-Host "`n[9] Pages with og:url:" -ForegroundColor White
$og = Get-ChildItem $base -Filter '*.html' | Select-String 'og:url' -List
Write-Host "  $($og.Count) pages" -ForegroundColor Green

Write-Host "`n[10] Spot-check instagram-dp-ai-prompts.html schema:" -ForegroundColor White
$sample = Get-Content (Join-Path $base 'instagram-dp-ai-prompts.html') -Raw
$graphCount = ([regex]::Matches($sample, '"@graph"')).Count
$hasBc = $sample -match 'breadcrumb-nav'
$hasRelated = $sample -match 'related-prompts-section'
$hasBc3 = $sample -match '"position":3'
Write-Host "  @graph blocks: $graphCount (should be 1)" -ForegroundColor $(if ($graphCount -eq 1) { 'Green' }else { 'Red' })
Write-Host "  breadcrumb-nav: $hasBc" -ForegroundColor $(if ($hasBc) { 'Green' }else { 'Yellow' })
Write-Host "  related-prompts-section: $hasRelated" -ForegroundColor $(if ($hasRelated) { 'Green' }else { 'Red' })

Write-Host "`n=== ALL CHECKS COMPLETE ===" -ForegroundColor Cyan
