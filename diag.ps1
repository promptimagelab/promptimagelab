$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"

Write-Host "=== Remaining index.html# links ===" -ForegroundColor Yellow
$results = Select-String -Path "$dir\*.html" -Pattern 'index\.html#'
foreach ($r in $results) {
    if ($r.Filename -ne 'about.original.html') {
        Write-Host "$($r.Filename):$($r.LineNumber): $($r.Line.Trim())"
    }
}

Write-Host "`n=== PIL-SEO-SNIPPET pages ===" -ForegroundColor Yellow
$snippets = Select-String -Path "$dir\*.html" -Pattern 'PIL-SEO-SNIPPET'
foreach ($s in $snippets) {
    Write-Host "$($s.Filename):$($s.LineNumber)"
}
