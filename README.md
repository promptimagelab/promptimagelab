# PromptImageLab — Cloudflare Pages Deployment Guide

## What was converted

| PHP (Old) | JavaScript (New) |
|---|---|
| `index.php` | `functions/index.js` |
| `prompts.php` | `functions/prompts.js` |
| `includes/db.php` | `functions/_data.js` (no DB needed) |
| MySQL database | `data.json` (embedded) |
| All slug pages | `functions/[[slug]].js` |
| PHP header/footer | `functions/_layout.js` |

---

## Deploy to Cloudflare Pages (Step by step)

### Step 1 — Create GitHub repository
1. Go to github.com → New repository
2. Name it: `promptimagelab`
3. Upload ALL files from this zip

### Step 2 — Connect to Cloudflare Pages
1. Go to dash.cloudflare.com
2. Click **Workers & Pages** → **Create**
3. Click **Pages** → **Connect to Git**
4. Select your GitHub repo
5. Set these build settings:
   - **Build command**: (leave empty)
   - **Build output directory**: `public`
   - **Root directory**: (leave empty)
6. Click **Save and Deploy**

### Step 3 — Add custom domain
1. After deploy, go to your Pages project
2. Click **Custom domains** → **Set up a custom domain**
3. Enter: `promptimagelab.com`
4. Cloudflare will auto-configure DNS ✅

### Step 4 — Done!
Your site will be live at:
- https://promptimagelab.com
- https://promptimagelab.pages.dev (free backup URL)

---

## Project structure

```
promptimagelab/
├── public/                    ← static files served directly
│   ├── assets/
│   │   ├── css/theme.css
│   │   └── js/image-handler.js
│   ├── images/logo.png
│   ├── robots.txt
│   ├── ads.txt
│   └── sitemap.xml
├── functions/                 ← Cloudflare Functions (replaces PHP)
│   ├── _data.js               ← database layer (replaces db.php)
│   ├── _layout.js             ← HTML layout (replaces PHP includes)
│   ├── index.js               ← homepage
│   ├── prompts.js             ← prompts listing page
│   └── [[slug]].js            ← all other pages (about, contact, etc.)
├── data.json                  ← all your MySQL data as JSON
├── package.json
└── _redirects
```

---

## No more 520 errors
- No PHP server needed
- No MySQL server needed
- Runs 100% on Cloudflare's global network
- Free forever on Cloudflare Pages free plan
