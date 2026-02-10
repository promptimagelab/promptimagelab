# Remove inline styles from all HTML pages

$htmlFiles = Get-ChildItem -Path "c:\Users\Dhanush\Desktop\promptimagelab" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Remove everything between <style> and </style> tags  
    $content = $content -replace '(?s)<style>.*?</style>', ''
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    
    Write-Host "Processed: $($file.Name)"
}

Write-Host "`nAll inline styles removed successfully!"
