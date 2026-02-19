$dir = "c:\Users\Dhanush\Desktop\site\promptimagelab"
$files = Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne 'index.html' -and $_.Name -ne 'about.original.html' }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $newContent = $content -replace 'href="index\.html"', 'href="/"'
    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
    } else {
        Write-Host "No change: $($file.Name)"
    }
}
Write-Host "Done."
