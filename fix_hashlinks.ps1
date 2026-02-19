$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"

# Fix index.html#categories and index.html#anything links (hash-based ones missed by initial script)
$files = Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne 'index.html' -and $_.Name -ne 'about.original.html' }

$totalFixed = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    # Replace index.html#section with /#section
    $newContent = $content -replace 'href="index\.html#([^"]+)"', 'href="/#$1"'
    # Also catch any remaining index.html without hash (safety net)
    $newContent = $newContent -replace 'href="index\.html"', 'href="/"'
    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed hash links: $($file.Name)"
        $totalFixed++
    }
}
Write-Host "Total files updated: $totalFixed"
Write-Host "Done."
