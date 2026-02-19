<#
  fix_search_action.ps1
  Removes the bogus "potentialAction" / SearchAction block from the WebSite
  JSON-LD that is embedded inside the shared <script> block on every content page.

  The block to remove (exactly as it appears in every content page):
      ,
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://promptimagelab.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
  
  We use a regex that is non-greedy and handles both LF / CRLF.
#>

$root = "C:\Users\Dhanush\Desktop\site\promptimagelab"

# Skip index.html (homepage - already fixed) and about.original.html (dev artifact)
$pages = Get-ChildItem "$root\*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.Name -ne "about.original.html"
}

$pattern = ',\s*"potentialAction"\s*:\s*\{[^}]+\}'

$fixed = 0
$skipped = 0

foreach ($file in $pages) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    if ($content -match 'potentialAction') {
        # Remove the potentialAction block
        $newContent = [regex]::Replace($content, $pattern, '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "FIXED: $($file.Name)" -ForegroundColor Green
        $fixed++
    }
    else {
        Write-Host "SKIP (clean): $($file.Name)" -ForegroundColor Gray
        $skipped++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixed: $fixed pages" -ForegroundColor Green
Write-Host "Already clean: $skipped pages" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan

# Verify - make sure no more potentialAction exists in content pages
Write-Host ""
Write-Host "=== VERIFICATION ===" -ForegroundColor Yellow
$remaining = Select-String -Path "$root\*.html" -Pattern "potentialAction|SearchAction"
if ($remaining) {
    Write-Host "WARNING - still found in:" -ForegroundColor Red
    $remaining | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber)" }
}
else {
    Write-Host "CLEAN - No potentialAction/SearchAction found anywhere." -ForegroundColor Green
}
