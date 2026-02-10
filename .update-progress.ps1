# Navigation and SEO Enhancement Script
# This script helps update multiple HTML pages with standardized navigation and SEO improvements

Write-Host "Navigation Structure Update Helper" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Define pages that need updates (minimal navigation pages)
$pages = @(
    @{File="valentine-whatsapp-messages.html"; Title="Valentine WhatsApp Messages"; Category="Valentine"},
    @{File="valentine-instagram-caption-prompts.html"; Title="Valentine Instagram Caption Prompts"; Category="Valentine"},
    @{File="valentine-love-letter-prompts.html"; Title="Valentine Love Letter Prompts"; Category="Valentine"},
    @{File="valentine-couple-photo-prompts.html"; Title="Valentine Couple Photo Prompts"; Category="Valentine"},
    @{File="valentine-ai-image-prompts.html"; Title="Valentine AI Image Prompts"; Category="Valentine"},
    @{File="romantic-anime-prompts.html"; Title="Romantic Anime Prompts"; Category="Anime"},
    @{File="whatsapp-dp-ai-prompts.html"; Title="WhatsApp DP AI Prompts"; Category="WhatsApp DP"},
    @{File="whatsapp-dp-for-boys-ai-prompts.html"; Title="WhatsApp DP for Boys"; Category="WhatsApp DP"},
    @{File="whatsapp-dp-for-girls-ai-prompts.html"; Title="WhatsApp DP for Girls"; Category="WhatsApp DP"},
    @{File="whatsapp-dp-tamil-ai-prompts.html"; Title="WhatsApp DP Tamil"; Category="WhatsApp DP"}
)

$baseDir = "c:\Users\Dhanush\Desktop\promptimagelab"

Write-Host "Pages to update: $($pages.Count)`n" -ForegroundColor Yellow

# List all pages
foreach ($page in $pages) {
    $filePath = Join-Path $baseDir $page.File
    if (Test-Path $filePath) {
        Write-Host "[✓] Found: $($page.File)" -ForegroundColor Green
    } else {
        Write-Host "[✗] Missing: $($page.File)" -ForegroundColor Red
    }
}

Write-Host "`n`nPages will need manual updates via multi_replace_file_content tool." -ForegroundColor Cyan
Write-Host "This script serves as a reference for tracking progress.`n" -ForegroundColor Cyan

Write-Host "Progress Tracker:" -ForegroundColor Magenta
Write-Host "  [✓] valentine-dp-prompts.html" -ForegroundColor Green
Write-Host "  [✓] valentine-gift-message-prompts.html" -ForegroundColor Green
Write-Host "  [ ] valentine-whatsapp-messages.html"  -ForegroundColor Gray
Write-Host "  [ ] valentine-instagram-caption-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] valentine-love-letter-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] valentine-couple-photo-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] valentine-ai-image-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] romantic-anime-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] whatsapp-dp-ai-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] whatsapp-dp-for-boys-ai-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] whatsapp-dp-for-girls-ai-prompts.html" -ForegroundColor Gray
Write-Host "  [ ] whatsapp-dp-tamil-ai-prompts.html" -ForegroundColor Gray
