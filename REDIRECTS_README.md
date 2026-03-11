## Redirects & Testing (clean URLs)

This document explains how to configure server redirects so requests to `*.html` map to clean non-.html URLs, and how to test them.

1) Apache (.htaccess)

Place the following in your site root (or main Apache config):

```
RewriteEngine On
RewriteCond %{REQUEST_URI} \.html$ [NC]
RewriteRule ^(.*)\.html$ https://promptimagelab.com/$1 [R=301,L]
```

2) Nginx

Include this snippet in your server block (or a separate include file):

```
location ~ ^/(.+)\.html$ {
    return 301 https://promptimagelab.com/$1;
}
```

3) Netlify (`_redirects`)

Add to `_redirects` at the repo root (Netlify will pick it up on deploy):

```
/:splat.html  /:splat  301
```

4) robots.txt

Make sure `sitemap.xml` is referenced in `robots.txt` (already present). Remove or Disallow any backup files you don't want indexed.

5) How to test redirects (curl examples)

Run these commands from any shell (replace URL where needed):

```bash
curl -I https://promptimagelab.com/valentine-dp-prompts.html
curl -I https://promptimagelab.com/index.html
curl -I https://promptimagelab.com/ai-profile-picture-dp-prompts.html
```

Expected output: `HTTP/1.1 301 Moved Permanently` and a `Location: https://promptimagelab.com/valentine-dp-prompts` header (no `.html`).

6) Bulk test (PowerShell)

Example PowerShell one-liner to test all sitemap URLs ending with `.html` and show status:

```powershell
$urls = @(
  'https://promptimagelab.com/valentine-dp-prompts.html',
  'https://promptimagelab.com/ai-profile-picture-dp-prompts.html'
)
foreach ($u in $urls) { Write-Output "Testing $u" ; curl -I $u }
```

7) Notes & Troubleshooting
- Ensure your host respects `.htaccess` overrides (AllowOverride All) when using Apache.
- For Nginx, add the snippet inside the relevant `server { }` block and reload the config.
- Netlify `_redirects` file must be at site root during deploy.
- After deploying redirects, re-run the `curl -I` tests and verify `Location` headers point to non-.html URLs.

If you'd like, I can generate a small script to hit every `.html` URL found in the repository and report the expected redirect targets (useful to run against the live site). Want that? 
