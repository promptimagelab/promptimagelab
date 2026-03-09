# PromptImageLab — Complete Production Project
## Cloudflare Pages · AdSense · Analytics · SEO

---

## 🗂 Project Structure

```
promptimagelab/
├── functions/                    ← Cloudflare Functions (serverless JS)
│   ├── _data.js                  ← Database layer (replaces MySQL)
│   ├── _layout.js                ← HTML layout with SEO + AdSense
│   ├── index.js                  ← Homepage
│   ├── prompts.js                ← Prompt library page
│   └── [[slug]].js               ← All dynamic pages
├── public/                       ← Static files served directly
│   ├── assets/
│   │   ├── css/theme.css         ← Production CSS
│   │   ├── js/image-handler.js
│   │   └── images/logo.png
│   ├── admin/index.html          ← Admin panel (password protected)
│   ├── _headers                  ← Security + cache headers
│   ├── _redirects                ← Old PHP URL redirects
│   ├── ads.txt                   ← AdSense verification
│   ├── robots.txt                ← SEO robots
│   └── sitemap.xml               ← XML sitemap (18 pages)
├── data.json                     ← All content (17 pages, 132 prompts, 71 FAQs)
├── package.json
└── README.md
```

---

## 🚀 Deploy to Cloudflare Pages (5 minutes)

### Step 1 — Upload to GitHub
1. Go to **github.com** → New repository → name: `promptimagelab`
2. Click **uploading an existing file**
3. Drag ALL extracted files → **Commit changes**

### Step 2 — Connect Cloudflare Pages
1. **dash.cloudflare.com** → Workers & Pages → Create → Pages
2. Click **Connect to Git** → select `promptimagelab`
3. Build settings:
   - Build command: *(leave empty)*
   - Build output directory: `public`
4. Click **Save and Deploy**

### Step 3 — Add Custom Domain
1. Pages project → **Custom domains** → Add `promptimagelab.com`
2. Cloudflare auto-configures DNS ✅

### Step 4 — Done!
- Live at: `https://promptimagelab.com`
- Admin at: `https://promptimagelab.com/admin` (password: `admin123`)

---

## ✅ Google AdSense Checklist

For AdSense approval you need:
- [x] `ads.txt` with publisher ID at `/ads.txt`
- [x] Privacy Policy page at `/privacy-policy`
- [x] Terms of Service page at `/terms-of-service`
- [x] Contact page at `/contact`
- [x] About page at `/about`
- [x] Real content (132 prompts, 17 pages)
- [x] No copyright violations
- [x] Mobile responsive design
- [x] Fast loading (no server-side PHP)
- [ ] Apply at: https://www.google.com/adsense/start/

Your AdSense publisher ID is already in the layout:
`ca-pub-6771008610152378`

---

## ✅ Google Analytics Checklist

Your GA4 tracking ID `G-MGTDGLQPSH` is already in every page.
- [x] GA4 script on every page
- [x] Page path tracking
- [x] No PII collected
- [ ] Verify at: https://analytics.google.com

---

## 📊 SEO Features Included

| Feature | Status |
|---|---|
| Meta title + description | ✅ All pages |
| Open Graph tags | ✅ All pages |
| Twitter Card | ✅ All pages |
| Canonical URL | ✅ All pages |
| XML Sitemap | ✅ 18 URLs |
| robots.txt | ✅ |
| Structured Data (JSON-LD) | ✅ Organization, WebSite, Article, FAQ, BreadcrumbList, ItemList |
| Breadcrumb navigation | ✅ All pages |
| Table of Contents | ✅ Prompt pages |
| Semantic HTML | ✅ (article, nav, main, aside, section) |
| ARIA labels | ✅ |
| Mobile responsive | ✅ |
| Fast loading | ✅ (no DB, no PHP) |
| Security headers | ✅ |

---

## 🛠 Admin Panel

Access at: `https://promptimagelab.com/admin`
Default password: `admin123` (change in admin/index.html)

Features:
- ✅ Add/Edit/Delete pages
- ✅ Add/Edit/Delete prompts
- ✅ Add/Edit/Delete FAQs
- ✅ SQL Import (paste phpMyAdmin dump)
- ✅ Export updated data.json

### Workflow to add content:
1. Open admin panel → make changes
2. Go to Export tab → Download data.json
3. Replace data.json in GitHub
4. Cloudflare auto-deploys in ~30 seconds ✅

---

## 🔧 Change AdSense/Analytics IDs

In `functions/_layout.js`, change these two lines:
```js
const ADSENSE_ID = 'ca-pub-6771008610152378';
const GA_ID = 'G-MGTDGLQPSH';
```

Also update `public/ads.txt`:
```
google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
