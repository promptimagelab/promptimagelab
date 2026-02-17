# Simple PowerShell verification script for redirects
# Usage: .\verify_redirects.ps1 -BaseUrl "https://promptimagelab.com"

param(
  [string]$BaseUrl = "https://promptimagelab.com"
)

$pages = @(
  "/",
  "/index.html",
  "/about",
  "/about.html",
  "/ai-profile-picture-dp-prompts",
  "/ai-profile-picture-dp-prompts.html",
  "/anime-avatars",
  "/anime-avatars.html",
  "/ceo-style-portrait-prompts",
  "/ceo-style-portrait-prompts.html",
  "/corporate-portrait-prompts",
  "/corporate-portrait-prompts.html",
  "/contact",
  "/contact.html",
  "/instagram-dp-ai-prompts",
  "/instagram-dp-ai-prompts.html",
  "/instagram-dp-for-girls-ai-prompts",
  "/instagram-dp-for-girls-ai-prompts.html",
  "/instagram-dp-for-boys-ai-prompts",
  "/instagram-dp-for-boys-ai-prompts.html",
  "/instagram-dp-black-white-ai-prompts",
  "/instagram-dp-black-white-ai-prompts.html",
  "/instagram-dp-couple-ai-prompts",
  "/instagram-dp-couple-ai-prompts.html",
  "/linkedin-profile-picture-prompts",
  "/linkedin-profile-picture-prompts.html",
  "/linkedin-profile-men",
  "/linkedin-profile-men.html",
  "/linkedin-profile-women",
  "/linkedin-profile-women.html",
  "/professional-ai-headshot-prompts",
  "/professional-ai-headshot-prompts.html",
  "/resume-photo-prompts",
  "/resume-photo-prompts.html",
  "/realistic-ai-portrait-prompts",
  "/realistic-ai-portrait-prompts.html",
  "/studio-lighting-portrait-prompts",
  "/studio-lighting-portrait-prompts.html",
  "/whatsapp-dp-ai-prompts",
  "/whatsapp-dp-ai-prompts.html",
  "/whatsapp-dp-for-boys-ai-prompts",
  "/whatsapp-dp-for-boys-ai-prompts.html",
  "/whatsapp-dp-for-girls-ai-prompts",
  "/whatsapp-dp-for-girls-ai-prompts.html",
  "/whatsapp-dp-tamil-ai-prompts",
  "/whatsapp-dp-tamil-ai-prompts.html",
  "/romantic-anime-prompts",
  "/romantic-anime-prompts.html",
  "/valentine-ai-image-prompts",
  "/valentine-ai-image-prompts.html",
  "/valentine-couple-photo-prompts",
  "/valentine-couple-photo-prompts.html",
  "/valentine-instagram-caption-prompts",
  "/valentine-instagram-caption-prompts.html",
  "/valentine-love-letter-prompts",
  "/valentine-love-letter-prompts.html",
  "/valentine-whatsapp-messages",
  "/valentine-whatsapp-messages.html",
  "/valentine-dp-prompts",
  "/valentine-dp-prompts.html",
  "/valentine-gift-message-prompts",
  "/valentine-gift-message-prompts.html",
  "/privacy-policy",
  "/privacy-policy.html"
)

Write-Host "Verifying redirects against $BaseUrl`n"

foreach ($p in $pages) {
  $url = $BaseUrl.TrimEnd('/') + $p
  try {
    $req = [System.Net.WebRequest]::Create($url)
    $req.Method = 'HEAD'
    $req.Timeout = 10000
    $resp = $req.GetResponse()
    $status = [int]$resp.StatusCode
    $loc = $resp.Headers['Location']
    if ($status -ge 200 -and $status -lt 300) {
      Write-Host "$url -> $status" -ForegroundColor Green
    } elseif ($status -ge 300 -and $status -lt 400) {
      Write-Host "$url -> $status" -ForegroundColor Yellow
    } else {
      Write-Host "$url -> $status" -ForegroundColor Red
    }
    if ($loc) { Write-Host "  Location: $loc" }
    $resp.Close()
  } catch [System.Net.WebException] {
    $we = $_.Exception
    if ($we.Response -ne $null) {
      $res = $we.Response
      $status = [int]$res.StatusCode
      $loc = $res.Headers['Location']
      Write-Host "$url -> $status" -ForegroundColor Yellow
      if ($loc) { Write-Host "  Location: $loc" }
      $res.Close()
    } else {
      Write-Host "$url -> ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}

Write-Host "\nDone. Review outputs for 200 / 301 behavior." -ForegroundColor Cyan
