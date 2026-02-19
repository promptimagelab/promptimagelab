# fix_double_schema.ps1  — Remove duplicate @graph blocks
# When seo_full_fix2.ps1 is run a second time it injects a second schema block.
# This script removes all BUT the last @graph script block on each content page.

$base = 'c:\Users\Dhanush\Desktop\site\promptimagelab'

# Files that were processed by our fix script
$targets = Get-ChildItem $base -Filter '*.html' | Where-Object { $_.Name -ne 'about.original.html' }

$fixed = 0
foreach ($f in $targets) {
    $raw = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    # Find all <script type="application/ld+json"> ... </script> blocks that contain @graph
    $pattern = '(?s)<script type="application/ld\+json">[\s\S]*?"@graph"[\s\S]*?</script>'
    $matches = [regex]::Matches($raw, $pattern)
    
    if ($matches.Count -gt 1) {
        Write-Host "  DEDUP ($($matches.Count) @graph blocks): $($f.Name)" -ForegroundColor Yellow
        # Keep only the LAST @graph block, remove all earlier ones
        for ($i = 0; $i -lt ($matches.Count - 1); $i++) {
            $raw = $raw.Replace($matches[$i].Value, '')
        }
        [System.IO.File]::WriteAllText($f.FullName, $raw, [System.Text.Encoding]::UTF8)
        $fixed++
    }
}

Write-Host "`nDeduplicated: $fixed pages" -ForegroundColor Cyan

# Final check
Write-Host "`n[Multiple @graph blocks remaining]:" -ForegroundColor White
$multi = $targets | Where-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    ([regex]::Matches($raw, '"@graph"')).Count -gt 1
}
if ($multi) { $multi | ForEach-Object { Write-Host "  STILL MULTI: $($_.Name)" -ForegroundColor Red } }
else { Write-Host "  0 (CLEAN)" -ForegroundColor Green }
