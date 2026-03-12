var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-sG31MH/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/lib/helpers.js
function esc(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
__name(esc, "esc");
function isPrompt(slug) {
  const staticPages = /* @__PURE__ */ new Set(["index", "about", "contact", "privacy-policy", "search", ""]);
  return !staticPages.has(slug);
}
__name(isPrompt, "isPrompt");
function stripStoredChrome(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    html = mainMatch[1];
  }
  return html.replace(/<nav[\s\S]*?<\/nav>/gi, "").replace(/<header[\s\S]*?<\/header>/gi, "").replace(/<footer[\s\S]*?<\/footer>/gi, "").replace(/<\/?body[^>]*>/gi, "").replace(/<a[^>]+class="skip-link"[^>]*>[\s\S]*?<\/a>/gi, "");
}
__name(stripStoredChrome, "stripStoredChrome");
function buildLdJson(page, slug) {
  const url = `https://promptimagelab.com/${slug === "index" ? "" : slug}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://promptimagelab.com" },
          { "@type": "ListItem", position: 2, name: page.title, item: url }
        ]
      },
      {
        "@type": "WebPage",
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en",
        publisher: {
          "@type": "Organization",
          name: "PromptImageLab",
          url: "https://promptimagelab.com"
        }
      }
    ]
  };
  return JSON.stringify(data);
}
__name(buildLdJson, "buildLdJson");
function secureHeaders(extra = {}) {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none';",
    ...extra
  };
}
__name(secureHeaders, "secureHeaders");
function errorResponse(status, message) {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${status} Error</title></head><body style="font-family:sans-serif;text-align:center;padding:60px"><h1>${status}</h1><p>${esc(message)}</p><a href="/">Go home</a></body></html>`,
    { status, headers: secureHeaders({ "content-type": "text/html;charset=UTF-8" }) }
  );
}
__name(errorResponse, "errorResponse");

// src/lib/template.js
var NAV_HTML = (
  /* html */
  `
  <!-- Skip link for accessibility -->
  <a class="skip-link" href="#main">Skip to content</a>

  <!-- ===== NAVIGATION ===== -->
  <nav class="site-nav" aria-label="Main navigation" role="navigation">
    <div class="container nav-inner">

      <a href="/" class="logo" aria-label="PromptImageLab home">
        <img src="/images/logo.png" alt="PromptImageLab" width="40" height="40">
        <span>PromptImageLab</span>
      </a>

      <!-- Desktop links -->
      <ul class="nav-links" id="nav-links" role="list">
        <li><a href="/">Home</a></li>
        <li><a href="/prompts-hub">Prompts Hub</a></li>
        <li><a href="/search">Search</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy</a></li>
      </ul>

      <!-- Hamburger button (mobile) -->
      <button
        class="nav-toggle"
        id="nav-toggle"
        aria-controls="nav-links"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>

    </div>
  </nav>`
);
var FOOTER_HTML = (
  /* html */
  `
  <!-- ===== FOOTER ===== -->
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <p class="muted">&copy; 2026 PromptImageLab &bull; All Rights Reserved</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/">Home</a>
        <a href="/prompts-hub">Prompts Hub</a>
        <a href="/search">Search</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </footer>`
);
var GA_SNIPPET = (
  /* html */
  `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGTDGLQPSH');
  <\/script>`
);
var ADSENSE_SNIPPET = (
  /* html */
  `
  <!-- Google AdSense -->
  <!-- \u26A0\uFE0F  REPLACE ca-pub-XXXXXXXX with your real AdSense Publisher ID from:
       https://www.google.com/adsense \u2192 Account \u2192 Account information -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossorigin="anonymous"><\/script>`
);
var PROMPTS_HUB_CTA = (
  /* html */
  `
  <section style="padding:64px 0;" aria-label="Explore Prompts Hub">
    <div class="container">
      <div style="
        background: linear-gradient(135deg, rgba(56,189,248,.1) 0%, rgba(34,197,94,.07) 50%, rgba(56,189,248,.08) 100%);
        border: 1px solid rgba(56,189,248,.2);
        border-radius: 24px;
        padding: 56px 48px;
        text-align: center;
        position: relative;
        overflow: hidden;
      ">

        <!-- Decorative glow blobs -->
        <div style="
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 80% at 10% 50%, rgba(56,189,248,.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 90% 30%, rgba(34,197,94,.06) 0%, transparent 60%);
        "></div>

        <!-- Badge -->
        <div style="
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(56,189,248,.1); border: 1px solid rgba(56,189,248,.22);
          border-radius: 20px; padding: 5px 14px;
          font-size: 0.75rem; font-weight: 700; color: #38bdf8;
          text-transform: uppercase; letter-spacing: 0.9px;
          margin-bottom: 20px;
        ">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          New
        </div>

        <h2 style="
          font-size: 2.4rem; font-weight: 900; margin-bottom: 16px;
          background: linear-gradient(135deg, #e6eef8 20%, #38bdf8 80%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1.2;
        ">Explore the Prompts Hub</h2>

        <p style="
          color: #9aa8bb; font-size: 1.1rem; max-width: 600px; margin: 0 auto 36px;
          line-height: 1.7;
        ">
          Browse our entire library of curated AI image prompts in one place.
          Filter by category, search instantly, and find the perfect prompt for
          Midjourney, DALL-E, Stable Diffusion and more.
        </p>

        <!-- Stats row -->
        <div style="
          display: flex; gap: 32px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 36px;
        ">
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-weight:800;color:#38bdf8;line-height:1;">500+</div>
            <div style="font-size:0.82rem;color:#9aa8bb;margin-top:4px;font-weight:500;">Curated Prompts</div>
          </div>
          <div style="width:1px;background:rgba(255,255,255,.08);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-weight:800;color:#22c55e;line-height:1;">20+</div>
            <div style="font-size:0.82rem;color:#9aa8bb;margin-top:4px;font-weight:500;">Categories</div>
          </div>
          <div style="width:1px;background:rgba(255,255,255,.08);"></div>
          <div style="text-align:center;">
            <div style="font-size:1.8rem;font-weight:800;color:#38bdf8;line-height:1;">Free</div>
            <div style="font-size:0.82rem;color:#9aa8bb;margin-top:4px;font-weight:500;">Always Free</div>
          </div>
        </div>

        <!-- CTA buttons -->
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <a href="/prompts-hub"
             id="cta-prompts-hub"
             style="
               display: inline-flex; align-items: center; gap: 8px;
               padding: 15px 32px; border-radius: 14px; font-weight: 700;
               font-size: 1rem; text-decoration: none;
               background: linear-gradient(135deg, #38bdf8, #0ea5e9);
               color: #000; box-shadow: 0 6px 24px rgba(56,189,248,.35);
               transition: transform 0.25s ease, box-shadow 0.25s ease;
             "
             onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 32px rgba(56,189,248,.45)'"
             onmouseout="this.style.transform='';this.style.boxShadow='0 6px 24px rgba(56,189,248,.35)'"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0-4-4m4 4-4 4"/>
            </svg>
            Browse All Prompts
          </a>
          <a href="/search"
             style="
               display: inline-flex; align-items: center; gap: 8px;
               padding: 15px 28px; border-radius: 14px; font-weight: 600;
               font-size: 1rem; text-decoration: none;
               background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
               color: #e6eef8;
               transition: background 0.25s ease, border-color 0.25s ease;
             "
             onmouseover="this.style.background='rgba(56,189,248,.1)';this.style.borderColor='rgba(56,189,248,.3)'"
             onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.borderColor='rgba(255,255,255,.12)'"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"/>
            </svg>
            Quick Search
          </a>
        </div>

      </div>
    </div>
  </section>`
);
function buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile }) {
  const cleanSlug = slug.replace(/\.html$/, "");
  const canonicalUrl = `https://promptimagelab.com/${cleanSlug === "index" ? "" : cleanSlug}`;
  const ogImage = `https://promptimagelab.com/images/og-default.png`;
  return `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">

  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${esc(canonicalUrl)}">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${esc(canonicalUrl)}">
  <meta property="og:title"       content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:image"       content="${ogImage}">
  <meta property="og:site_name"   content="PromptImageLab">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image"       content="${ogImage}">

  <!-- Preload critical CSS -->
  <link rel="preload" href="${esc(cssFile)}" as="style">
  <link rel="stylesheet" href="${esc(cssFile)}">

  <!-- Structured Data -->
  <script type="application/ld+json">${ldJson}<\/script>

  ${GA_SNIPPET}

  ${ADSENSE_SNIPPET}

</head>

<body>

  ${NAV_HTML}


  <main id="main" role="main">

    ${bodyContent}

    ${slug === "index" ? PROMPTS_HUB_CTA : ""}

    <!-- Related Pages -->
    <section class="related-links container" aria-label="Related AI Prompt Pages">
      <h2>Related AI Prompt Pages</h2>
      <ul>${relatedHTML}</ul>
    </section>

  </main>

  ${FOOTER_HTML}


  <!-- ===== SCRIPTS ===== -->
  <script src="/script.js" defer><\/script>

</body>

</html>`;
}
__name(buildPageHTML, "buildPageHTML");
function build404HTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>404 \u2013 Page Not Found | PromptImageLab</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <nav class="site-nav" aria-label="Main navigation" role="navigation">
    <div class="container nav-inner">
      <a href="/" class="logo" aria-label="PromptImageLab home">
        <img src="/images/logo.png" alt="PromptImageLab" width="40" height="40">
        <span>PromptImageLab</span>
      </a>
      <ul class="nav-links" id="nav-links-404" role="list">
        <li><a href="/">Home</a></li>
        <li><a href="/#categories">Prompts</a></li>
        <li><a href="/search">Search</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy</a></li>
      </ul>
      <button
        class="nav-toggle"
        id="nav-toggle-404"
        aria-controls="nav-links-404"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
    </div>
  </nav>
  <main id="main" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
    <div class="container" style="text-align:center;padding:60px 24px;">
      <h1 style="font-size:6rem;margin:0;opacity:.15;">404</h1>
      <h2>Page Not Found</h2>
      <p class="muted" style="max-width:400px;margin:16px auto;">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">
        <a href="/" class="btn btn-primary">Go Back Home</a>
        <a href="/search" class="btn btn-primary" style="background:transparent;border:1px solid rgba(56,189,248,.4);color:var(--primary);">Search Prompts</a>
      </div>
    </div>
  </main>
  <script src="/script.js" defer><\/script>
</body>
</html>`;
}
__name(build404HTML, "build404HTML");

// src/handlers/sitemap.js
async function serveSitemap(request, env, ctx) {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;
  let pages = [];
  try {
    const result = await env.DB.prepare(
      "SELECT slug, updated_at, created_at FROM pages WHERE status IS NULL OR status = ?"
    ).bind("published").all();
    pages = result.results || [];
  } catch {
    try {
      const result = await env.DB.prepare("SELECT slug FROM pages").all();
      pages = result.results || [];
    } catch {
    }
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
  const urls2 = pages.map((p) => {
    const lastmod = (p.updated_at || p.created_at || "").substring(0, 10) || today;
    const priority = p.slug === "index" ? "1.0" : "0.8";
    const cleanSlug = p.slug.replace(/\.html$/, "");
    const loc = `https://promptimagelab.com/${cleanSlug === "index" ? "" : cleanSlug}`;
    return `
  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${esc(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://promptimagelab.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://promptimagelab.com/search</loc>
    <priority>0.6</priority>
    <changefreq>weekly</changefreq>
  </url>
${urls2}
</urlset>`;
  const response = new Response(xml, {
    headers: secureHeaders({
      "content-type": "application/xml;charset=UTF-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    })
  });
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}
__name(serveSitemap, "serveSitemap");

// src/handlers/related.js
async function getRelatedHTML(slug, request, env, ctx) {
  const cacheKey = new Request(`https://promptimagelab.com/__related__/${slug}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return await cached.text();
  }
  let related = [];
  try {
    const currentPage = await env.DB.prepare("SELECT related FROM pages WHERE slug = ?").bind(slug).first();
    const precomputed = currentPage?.related;
    if (precomputed) {
      let relatedSlugs = [];
      try {
        relatedSlugs = JSON.parse(precomputed);
      } catch {
      }
      if (relatedSlugs.length > 0) {
        const placeholders = relatedSlugs.map(() => "?").join(",");
        const res = await env.DB.prepare(`SELECT slug, title FROM pages WHERE slug IN (${placeholders}) LIMIT 6`).bind(...relatedSlugs).all();
        related = res.results || [];
      }
    }
    if (related.length === 0) {
      const result = await env.DB.prepare("SELECT slug, title FROM pages WHERE slug != ? ORDER BY RANDOM() LIMIT 6").bind(slug).all();
      related = result.results || [];
    }
  } catch {
    related = [];
  }
  const html = related.map(
    (p) => `
    <li>
      <a href="/${esc(p.slug)}">${esc(p.title)}</a>
    </li>`
  ).join("");
  ctx.waitUntil(
    cache.put(
      cacheKey,
      new Response(html, {
        headers: {
          "content-type": "text/html",
          "Cache-Control": "public, max-age=21600"
        }
      })
    )
  );
  return html;
}
__name(getRelatedHTML, "getRelatedHTML");

// src/handlers/search.js
async function serveSearchJson(request, env, ctx) {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;
  let pages = [];
  try {
    const result = await env.DB.prepare(
      `SELECT slug, title, description, category, word_count
         FROM pages
         WHERE status IS NULL OR status = 'published'
         ORDER BY updated_at DESC`
    ).all();
    pages = result.results || [];
  } catch {
    try {
      const result = await env.DB.prepare("SELECT slug, title, description FROM pages").all();
      pages = result.results || [];
    } catch {
    }
  }
  const index = pages.map((p) => ({
    slug: p.slug,
    title: p.title || "",
    description: p.description || "",
    category: p.category || "general",
    words: p.word_count || 0,
    url: `/${p.slug === "index" ? "" : p.slug}`
  }));
  const json2 = JSON.stringify(index);
  const response = new Response(json2, {
    headers: secureHeaders({
      "content-type": "application/json;charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=21600",
      "Access-Control-Allow-Origin": "*"
      /* public read-only index */
    })
  });
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}
__name(serveSearchJson, "serveSearchJson");
function serveSearchPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">

  <title>Search AI Image Prompts | PromptImageLab</title>
  <meta name="description" content="Search hundreds of AI image prompts for Midjourney, DALL-E, Stable Diffusion and more. Find the perfect prompt for portraits, anime, landscapes, and beyond.">
  <link rel="canonical" href="https://promptimagelab.com/search">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://promptimagelab.com/search">
  <meta property="og:title"       content="Search AI Image Prompts | PromptImageLab">
  <meta property="og:description" content="Find the perfect AI image prompt instantly.">
  <meta property="og:image"       content="https://promptimagelab.com/images/og-default.png">
  <meta property="og:site_name"   content="PromptImageLab">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Search AI Image Prompts | PromptImageLab">
  <meta name="twitter:description" content="Find the perfect AI image prompt instantly.">
  <meta name="twitter:image"       content="https://promptimagelab.com/images/og-default.png">

  <link rel="preload" href="/style.css" as="style">
  <link rel="stylesheet" href="/style.css">

  <style>
    /* ==== Search page extras ==================================== */

    .search-hero {
      padding: 60px 0 40px;
      text-align: center;
    }

    .search-hero h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--text), var(--primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
    }

    .search-hero p {
      color: var(--muted);
      font-size: 1.05rem;
      margin-bottom: 32px;
    }

    /* Search input row */
    .search-bar {
      display: flex;
      gap: 12px;
      max-width: 680px;
      margin: 0 auto 12px;
    }

    #search-input {
      flex: 1;
      padding: 14px 20px;
      border-radius: 14px;
      border: 1px solid rgba(56,189,248,.25);
      background: rgba(255,255,255,.05);
      color: var(--text);
      font-size: 1rem;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s;
      font-family: inherit;
    }

    #search-input::placeholder { color: var(--muted); }

    #search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(56,189,248,.15);
    }

    .search-stats {
      text-align: center;
      font-size: 0.88rem;
      color: var(--muted);
      min-height: 22px;
      margin-bottom: 32px;
    }

    /* Category filter pills */
    .category-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 36px;
    }

    .pill {
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      text-transform: capitalize;
    }

    .pill:hover,
    .pill.active {
      background: rgba(56,189,248,.12);
      border-color: rgba(56,189,248,.35);
      color: var(--text);
    }

    /* Results grid */
    #results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      padding-bottom: 60px;
    }

    .result-card {
      background: linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      text-decoration: none;
      display: block;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      animation: fadeIn 0.2s ease forwards;
    }

    .result-card:hover {
      transform: translateY(-5px);
      border-color: rgba(56,189,248,.3);
      box-shadow: 0 12px 32px rgba(0,0,0,.35);
      text-decoration: none;
    }

    .result-card-category {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--secondary);
      margin-bottom: 8px;
    }

    .result-card h3 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 8px;
      line-height: 1.35;
    }

    .result-card p {
      color: var(--muted);
      font-size: 0.88rem;
      line-height: 1.55;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    /* Highlighted match */
    mark {
      background: rgba(56,189,248,.25);
      color: var(--text);
      border-radius: 3px;
      padding: 1px 2px;
    }

    /* Empty state */
    #empty-state {
      display: none;
      text-align: center;
      padding: 60px 24px;
    }

    #empty-state svg {
      opacity: .3;
      margin-bottom: 16px;
    }

    #empty-state h3 {
      color: var(--muted);
      font-size: 1.1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,.04) 25%,
        rgba(255,255,255,.08) 50%,
        rgba(255,255,255,.04) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }

    .skel-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
    }

    .skel-line { height: 12px; margin-bottom: 10px; }
    .skel-title { width: 75%; }
    .skel-desc1 { width: 100%; }
    .skel-desc2 { width: 60%; }

    @media (max-width: 640px) {
      .search-hero h1 { font-size: 1.8rem; }
      #results-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>

<body>

  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="site-nav" aria-label="Main navigation" role="navigation">
    <div class="container nav-inner">
      <a href="/" class="logo" aria-label="PromptImageLab home">
        <img src="/images/logo.png" alt="PromptImageLab" width="40" height="40">
        <span>PromptImageLab</span>
      </a>
      <ul class="nav-links" id="nav-links" role="list">
        <li><a href="/">Home</a></li>
        <li><a href="/#categories">Prompts</a></li>
        <li><a href="/search" aria-current="page">Search</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy</a></li>
      </ul>
      <button class="nav-toggle" id="nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Toggle navigation">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
    </div>
  </nav>


  <main id="main" role="main">
    <div class="container">

      <!-- Hero -->
      <section class="search-hero">
        <h1>Find the Perfect AI Prompt</h1>
        <p>Search hundreds of curated prompts for Midjourney, DALL-E, Stable Diffusion &amp; more.</p>

        <!-- Search input -->
        <div class="search-bar" role="search">
          <label for="search-input" class="sr-only" style="position:absolute;clip:rect(0,0,0,0);">Search prompts</label>
          <input
            type="search"
            id="search-input"
            name="q"
            placeholder="e.g. anime avatar, professional headshot, landscape\u2026"
            autocomplete="off"
            spellcheck="false"
            autofocus
            aria-label="Search AI image prompts"
            aria-controls="results-grid"
            aria-describedby="search-stats"
          >
        </div>

        <!-- Stats line -->
        <p class="search-stats" id="search-stats" aria-live="polite">&nbsp;</p>

        <!-- Category pills -->
        <div class="category-pills" id="category-pills" role="group" aria-label="Filter by category"></div>
      </section>


      <!-- Skeleton loaders (shown while index loads) -->
      <div id="skeleton-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;padding-bottom:60px;">
        ${Array.from({ length: 8 }, () => `
        <div class="skel-card">
          <div class="skeleton skel-line" style="width:35%;margin-bottom:14px;"></div>
          <div class="skeleton skel-line skel-title"></div>
          <div class="skeleton skel-line skel-desc1"></div>
          <div class="skeleton skel-line skel-desc2"></div>
        </div>`).join("")}
      </div>

      <!-- Results -->
      <div id="results-grid" role="list" aria-label="Search results" style="display:none;"></div>

      <!-- Empty state -->
      <div id="empty-state" role="status" aria-live="polite">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z"/>
        </svg>
        <h3 id="empty-message">No prompts found</h3>
        <p class="muted" style="font-size:.9rem;">Try a different keyword or browse all categories.</p>
        <a href="/" class="btn btn-primary" style="margin-top:20px;display:inline-block;">Browse All Prompts</a>
      </div>

    </div>
  </main>


  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <p class="muted">&copy; 2026 PromptImageLab &bull; All Rights Reserved</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/">Home</a>
        <a href="/#categories">Prompts</a>
        <a href="/search">Search</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </footer>


  <script src="/script.js" defer><\/script>

  <script>
  /* ============================================================
     Search page logic
     - Fetches /search.json on first load
     - Instant fuzzy filtering (no external deps; pure substring)
     - Category filter pills
     - URL ?q= sync for shareable search URLs
     ============================================================ */
  (function () {
    'use strict';

    var ALL_PAGES  = [];
    var activeCategory = 'all';
    var searchInput    = document.getElementById('search-input');
    var resultsGrid    = document.getElementById('results-grid');
    var skeletonGrid   = document.getElementById('skeleton-grid');
    var emptyState     = document.getElementById('empty-state');
    var emptyMsg       = document.getElementById('empty-message');
    var statsEl        = document.getElementById('search-stats');
    var pillsEl        = document.getElementById('category-pills');

    /* ---- Load index from /search.json ------------------------- */

    function loadIndex() {
      fetch('/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          ALL_PAGES = data.filter(function (p) {
            // Exclude 'general' category items from search
            return (p.category || 'general') !== 'general';
          });
          skeletonGrid.style.display = 'none';
          resultsGrid.style.display  = 'grid';
          buildCategoryPills(ALL_PAGES);
          /* Apply ?q= from URL if present */
          var params = new URLSearchParams(window.location.search);
          var q = params.get('q') || '';
          if (q) searchInput.value = q;
          render(q, activeCategory);
        })
        .catch(function () {
          skeletonGrid.style.display = 'none';
          resultsGrid.style.display  = 'grid';
          statsEl.textContent        = 'Could not load search index. Please refresh.';
        });
    }

    /* ---- Build category pills --------------------------------- */

    function buildCategoryPills(pages) {
      var cats = { all: 0 };
      pages.forEach(function (p) {
        var c = p.category || 'general';
        cats[c] = (cats[c] || 0) + 1;
        cats.all++;
      });

      var order = ['all'].concat(
        Object.keys(cats).filter(function (k) { return k !== 'all'; }).sort()
      );

      pillsEl.innerHTML = order.map(function (c) {
        var label = c === 'all' ? 'All (' + cats.all + ')' : cap(c) + ' (' + cats[c] + ')';
        return '<button class="pill' + (c === 'all' ? ' active' : '') + '"' +
               ' data-cat="' + esc(c) + '"' +
               ' aria-pressed="' + (c === 'all') + '">' +
               esc(label) + '</button>';
      }).join('');

      /* Pill click handler */
      pillsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.pill');
        if (!btn) return;
        pillsEl.querySelectorAll('.pill').forEach(function (p) {
          p.classList.remove('active');
          p.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeCategory = btn.dataset.cat;
        render(searchInput.value, activeCategory);
      });
    }

    /* ---- Core render ------------------------------------------ */

    function render(query, category) {
      var q = (query || '').trim().toLowerCase();

      var filtered = ALL_PAGES.filter(function (p) {
        /* Category filter */
        var catMatch = category === 'all' || (p.category || 'general') === category;
        if (!catMatch) return false;
        /* Text match \u2014 title, description */
        if (!q) return true;
        return (p.title       || '').toLowerCase().indexOf(q) !== -1 ||
               (p.description || '').toLowerCase().indexOf(q) !== -1;
      });

      /* Update URL without reload */
      var url = q ? '/search?q=' + encodeURIComponent(q) : '/search';
      if (window.history.replaceState) window.history.replaceState(null, '', url);

      if (filtered.length === 0) {
        resultsGrid.style.display = 'none';
        emptyState.style.display  = 'block';
        emptyMsg.textContent = q
          ? 'No results for \u201C' + q + '\u201D'
          : 'No prompts in this category yet.';
        statsEl.textContent = '';
        return;
      }

      emptyState.style.display  = 'none';
      resultsGrid.style.display = 'grid';

      statsEl.textContent = filtered.length + ' prompt' + (filtered.length !== 1 ? 's' : '') +
        (q ? ' matching \u201C' + query + '\u201D' : ' total') +
        (category !== 'all' ? ' in \u201C' + cap(category) + '\u201D' : '');

      resultsGrid.innerHTML = filtered.map(function (p) {
        var title = q ? highlight(p.title, q)       : esc(p.title);
        var desc  = q ? highlight(p.description, q) : esc(p.description);
        return '<a class="result-card" href="' + esc(p.url) + '" role="listitem">' +
               '<span class="result-card-category">' + esc(p.category || 'general') + '</span>' +
               '<h3>' + title + '</h3>' +
               '<p>' + desc + '</p>' +
               '</a>';
      }).join('');
    }

    /* ---- Highlight matching substring ------------------------- */

    function highlight(text, query) {
      var safe = esc(text || '');
      if (!query) return safe;
      /* Case-insensitive replacement \u2014 only escape the query once */
      var re = new RegExp('(' + regEsc(query) + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    }

    /* ---- Helpers ---------------------------------------------- */

    function esc(s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function cap(s) {
      return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    }

    function regEsc(s) {
      return s.replace(/[-/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');
    }

    /* ---- Debounced input handler ------------------------------ */

    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        render(searchInput.value, activeCategory);
      }, 120);
    });

    /* ---- Boot ------------------------------------------------- */

    loadIndex();

  }());
  <\/script>

</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: secureHeaders({
      "content-type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    })
  });
}
__name(serveSearchPage, "serveSearchPage");

// src/handlers/prompts-hub.js
function servePromptsHub() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">

  <title>Prompts Hub \u2014 All AI Image Prompts | PromptImageLab</title>
  <meta name="description" content="Browse and search all AI image prompts for Midjourney, DALL-E, Stable Diffusion and more. Filter by category and find the perfect prompt instantly.">
  <link rel="canonical" href="https://promptimagelab.com/prompts-hub">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://promptimagelab.com/prompts-hub">
  <meta property="og:title"       content="Prompts Hub \u2014 All AI Image Prompts | PromptImageLab">
  <meta property="og:description" content="Browse all curated AI image prompts. Filter by category and search instantly.">
  <meta property="og:image"       content="https://promptimagelab.com/images/og-default.png">
  <meta property="og:site_name"   content="PromptImageLab">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Prompts Hub \u2014 All AI Image Prompts | PromptImageLab">
  <meta name="twitter:description" content="Browse all curated AI image prompts.">
  <meta name="twitter:image"       content="https://promptimagelab.com/images/og-default.png">

  <link rel="preload" href="/style.css" as="style">
  <link rel="stylesheet" href="/style.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGTDGLQPSH');
  <\/script>

  <style>
    /* ============================================================
       Prompts Hub \u2014 Page-specific styles
       ============================================================ */

    /* Hero */
    .hub-hero {
      padding: 72px 0 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hub-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(56,189,248,.12) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 80% 50%, rgba(34,197,94,.07) 0%, transparent 60%);
      pointer-events: none;
    }

    .hub-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(56,189,248,.1);
      border: 1px solid rgba(56,189,248,.2);
      border-radius: 20px;
      padding: 5px 14px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 20px;
    }

    .hub-hero h1 {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--text) 30%, var(--primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 14px;
      line-height: 1.15;
    }

    .hub-hero p {
      font-size: 1.1rem;
      color: var(--muted);
      max-width: 580px;
      margin: 0 auto 36px;
      line-height: 1.65;
    }

    /* Search bar */
    .hub-search-wrap {
      display: flex;
      gap: 10px;
      max-width: 680px;
      margin: 0 auto 10px;
    }

    #hub-search {
      flex: 1;
      padding: 15px 22px;
      border-radius: 14px;
      border: 1px solid rgba(56,189,248,.25);
      background: rgba(255,255,255,.05);
      color: var(--text);
      font-size: 1rem;
      outline: none;
      transition: border-color 0.25s, box-shadow 0.25s;
      font-family: inherit;
    }
    #hub-search::placeholder { color: var(--muted); }
    #hub-search:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(56,189,248,.12);
    }

    .hub-stats {
      text-align: center;
      font-size: 0.875rem;
      color: var(--muted);
      min-height: 22px;
      margin-bottom: 28px;
      transition: opacity 0.2s;
    }

    /* Category pills */
    .hub-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 40px;
    }

    .hub-pill {
      padding: 7px 18px;
      border-radius: 22px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .hub-pill:hover {
      background: rgba(56,189,248,.08);
      border-color: rgba(56,189,248,.25);
      color: var(--text);
    }
    .hub-pill.active {
      background: rgba(56,189,248,.15);
      border-color: rgba(56,189,248,.4);
      color: var(--primary);
    }

    /* Sort / view controls */
    .hub-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .hub-sort {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--muted);
    }

    #hub-sort-select {
      padding: 7px 12px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.05);
      color: var(--text);
      font-size: 0.85rem;
      font-family: inherit;
      cursor: pointer;
      outline: none;
    }
    #hub-sort-select:focus { border-color: var(--primary); }

    .hub-view-toggle {
      display: flex;
      gap: 6px;
    }
    .hub-view-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .hub-view-btn:hover,
    .hub-view-btn.active {
      background: rgba(56,189,248,.1);
      border-color: rgba(56,189,248,.3);
      color: var(--primary);
    }

    /* Results grid */
    #hub-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding-bottom: 32px;
      transition: opacity 0.2s;
    }

    #hub-grid.list-view {
      grid-template-columns: 1fr;
    }

    /* Prompt card */
    .hub-card {
      background: linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
      text-decoration: none;
      display: block;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
      animation: hubFadeIn 0.25s ease forwards;
      position: relative;
      overflow: hidden;
    }

    .hub-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      opacity: 0;
      transition: opacity 0.3s;
    }

    .hub-card:hover {
      transform: translateY(-5px);
      border-color: rgba(56,189,248,.3);
      box-shadow: 0 12px 36px rgba(0,0,0,.35);
      text-decoration: none;
    }

    .hub-card:hover::before { opacity: 0.5; }

    .hub-card-cat {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: var(--secondary);
      margin-bottom: 10px;
      padding: 3px 10px;
      background: rgba(34,197,94,.08);
      border-radius: 6px;
      border: 1px solid rgba(34,197,94,.12);
    }

    .hub-card h3 {
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 10px;
      line-height: 1.4;
    }

    .hub-card p {
      color: var(--muted);
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .hub-card-arrow {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--primary);
      margin-top: 14px;
      opacity: 0;
      transform: translateX(-6px);
      transition: opacity 0.2s, transform 0.2s;
    }
    .hub-card:hover .hub-card-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    /* List view card */
    #hub-grid.list-view .hub-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0 20px;
      padding: 18px 22px;
      align-items: start;
    }
    #hub-grid.list-view .hub-card-cat { margin-bottom: 0; }
    #hub-grid.list-view .hub-card h3 { font-size: 0.95rem; margin-bottom: 6px; }
    #hub-grid.list-view .hub-card-arrow { margin-top: 8px; }

    /* Highlighted match */
    mark {
      background: rgba(56,189,248,.22);
      color: var(--text);
      border-radius: 3px;
      padding: 1px 2px;
    }

    /* Empty / error state */
    #hub-empty {
      display: none;
      text-align: center;
      padding: 80px 24px;
    }
    #hub-empty svg { opacity: .25; margin-bottom: 20px; }
    #hub-empty h3 { color: var(--muted); font-size: 1.15rem; margin-bottom: 8px; }

    /* Pagination */
    .hub-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 32px 0 64px;
      flex-wrap: wrap;
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-btn:hover {
      background: rgba(56,189,248,.08);
      border-color: rgba(56,189,248,.25);
      color: var(--text);
    }
    .page-btn.active {
      background: rgba(56,189,248,.15);
      border-color: rgba(56,189,248,.4);
      color: var(--primary);
    }
    .page-btn:disabled {
      opacity: .35;
      cursor: not-allowed;
    }

    /* Skeleton */
    .hub-skeleton {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,.04) 25%,
        rgba(255,255,255,.08) 50%,
        rgba(255,255,255,.04) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 10px;
    }
    @keyframes shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }
    .skel-hub-card {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
    }
    .skel-line { height: 12px; margin-bottom: 10px; border-radius: 6px; }

    @keyframes hubFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .hub-hero h1 { font-size: 2.2rem; }
      .hub-controls { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 640px) {
      .hub-hero { padding: 52px 0 36px; }
      .hub-hero h1 { font-size: 1.85rem; }
      #hub-grid { grid-template-columns: 1fr; }
      .hub-search-wrap { flex-direction: column; }
    }
  </style>

</head>

<body>

  <a class="skip-link" href="#main">Skip to content</a>

  <!-- ===== NAVIGATION ===== -->
  <nav class="site-nav" aria-label="Main navigation" role="navigation">
    <div class="container nav-inner">
      <a href="/" class="logo" aria-label="PromptImageLab home">
        <img src="/images/logo.png" alt="PromptImageLab" width="40" height="40">
        <span>PromptImageLab</span>
      </a>
      <ul class="nav-links" id="nav-links" role="list">
        <li><a href="/">Home</a></li>
        <li><a href="/prompts-hub" aria-current="page">Prompts Hub</a></li>
        <li><a href="/search">Search</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy</a></li>
      </ul>
      <button class="nav-toggle" id="nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Toggle navigation">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
    </div>
  </nav>


  <!-- ===== MAIN ===== -->
  <main id="main" role="main">
    <div class="container">

      <!-- Hero -->
      <section class="hub-hero">
        <div class="hub-hero-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          All Prompts
        </div>
        <h1>Prompts Hub</h1>
        <p>Discover and explore our entire library of curated AI image prompts. Search, filter by category, and get inspired instantly.</p>

        <!-- Search -->
        <div class="hub-search-wrap" role="search">
          <label for="hub-search" style="position:absolute;clip:rect(0,0,0,0);">Search prompts</label>
          <input
            type="search"
            id="hub-search"
            name="q"
            placeholder="Search prompts \u2014 e.g. anime, portrait, cyberpunk\u2026"
            autocomplete="off"
            spellcheck="false"
            autofocus
            aria-label="Search prompts"
            aria-controls="hub-grid"
            aria-describedby="hub-stats"
          >
        </div>

        <p class="hub-stats" id="hub-stats" aria-live="polite">&nbsp;</p>

        <!-- Category pills -->
        <div class="hub-pills" id="hub-pills" role="group" aria-label="Filter by category"></div>
      </section>


      <!-- Controls row -->
      <div class="hub-controls">
        <div class="hub-sort">
          <label for="hub-sort-select" style="font-weight:600;">Sort:</label>
          <select id="hub-sort-select" aria-label="Sort prompts">
            <option value="default">Default</option>
            <option value="az">A \u2192 Z</option>
            <option value="za">Z \u2192 A</option>
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span id="hub-page-info" style="font-size:0.85rem;color:var(--muted);"></span>
          <div class="hub-view-toggle" role="group" aria-label="View mode">
            <button class="hub-view-btn active" id="btn-grid" title="Grid view" aria-pressed="true">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/>
                <rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>
              </svg>
            </button>
            <button class="hub-view-btn" id="btn-list" title="List view" aria-pressed="false">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/>
                <rect x="3" y="17" width="18" height="2" rx="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>


      <!-- Skeleton loaders -->
      <div id="hub-skeleton" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;padding-bottom:32px;">
        ${Array.from({ length: 9 }, () => `
        <div class="skel-hub-card">
          <div class="hub-skeleton skel-line" style="width:30%;margin-bottom:14px;"></div>
          <div class="hub-skeleton skel-line" style="width:85%;height:14px;margin-bottom:8px;"></div>
          <div class="hub-skeleton skel-line" style="width:100%;"></div>
          <div class="hub-skeleton skel-line" style="width:65%;"></div>
        </div>`).join("")}
      </div>


      <!-- Results grid -->
      <div id="hub-grid" role="list" aria-label="Prompt results" style="display:none;"></div>

      <!-- Empty state -->
      <div id="hub-empty" role="status" aria-live="polite">
        <svg width="72" height="72" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
            d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z"/>
        </svg>
        <h3 id="hub-empty-msg">No prompts found</h3>
        <p class="muted" style="font-size:.9rem;">Try a different keyword or browse all categories below.</p>
        <button onclick="resetFilters()" class="btn btn-primary" style="margin-top:20px;">Clear Filters</button>
      </div>

      <!-- Pagination -->
      <nav class="hub-pagination" id="hub-pagination" aria-label="Pagination"></nav>

    </div>
  </main>


  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div class="container footer-inner">
      <p class="muted">&copy; 2026 PromptImageLab &bull; All Rights Reserved</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/">Home</a>
        <a href="/prompts-hub">Prompts Hub</a>
        <a href="/search">Search</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </footer>


  <script src="/script.js" defer><\/script>

  <script>
  /* ============================================================
     Prompts Hub \u2014 client-side logic
     - Fetches /search.json for full page index
     - Instant search + category filter + sort + pagination
     - Grid / List view toggle
     - URL ?q= and ?cat= sync
     ============================================================ */
  (function () {
    'use strict';

    var PER_PAGE       = 24;
    var ALL_PAGES      = [];
    var filtered       = [];
    var currentPage    = 1;
    var activeCategory = 'all';
    var currentSort    = 'default';
    var currentView    = 'grid';

    var searchEl   = document.getElementById('hub-search');
    var statsEl    = document.getElementById('hub-stats');
    var pillsEl    = document.getElementById('hub-pills');
    var gridEl     = document.getElementById('hub-grid');
    var skelEl     = document.getElementById('hub-skeleton');
    var emptyEl    = document.getElementById('hub-empty');
    var emptyMsg   = document.getElementById('hub-empty-msg');
    var paginEl    = document.getElementById('hub-pagination');
    var pageInfo   = document.getElementById('hub-page-info');
    var sortSel    = document.getElementById('hub-sort-select');
    var btnGrid    = document.getElementById('btn-grid');
    var btnList    = document.getElementById('btn-list');

    /* ---- Load index ------------------------------------------- */

    function loadIndex() {
      fetch('/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          ALL_PAGES = data.filter(function (p) {
            // Exclude static pages from the hub
            var staticSlugs = ['', 'about', 'contact', 'privacy-policy'];
            var slug = (p.url || '').replace(/^/+/, '');
            if (staticSlugs.indexOf(slug) !== -1) return false;
            // Also exclude 'general' category items
            return (p.category || 'general') !== 'general';
          });
          skelEl.style.display = 'none';
          gridEl.style.display = 'grid';
          buildPills(ALL_PAGES);

          // Apply URL params
          var params = new URLSearchParams(window.location.search);
          var q   = params.get('q') || '';
          var cat = params.get('cat') || 'all';
          if (q) searchEl.value = q;
          if (cat !== 'all') {
            activeCategory = cat;
            updatePillActive(cat);
          }
          applyAndRender();
        })
        .catch(function () {
          skelEl.style.display = 'none';
          gridEl.style.display = 'grid';
          statsEl.textContent = 'Could not load prompts. Please refresh the page.';
        });
    }

    /* ---- Build category pills --------------------------------- */

    function buildPills(pages) {
      var cats = { all: 0 };
      pages.forEach(function (p) {
        var c = p.category || 'general';
        cats[c] = (cats[c] || 0) + 1;
        cats.all++;
      });

      // 'general' category is intentionally hidden from the filter pills
      var order = ['all'].concat(
        Object.keys(cats).filter(function (k) { return k !== 'all' && k !== 'general'; }).sort()
      );

      pillsEl.innerHTML = order.map(function (c) {
        var label = c === 'all' ? 'All (' + cats.all + ')' : cap(c) + ' (' + (cats[c] || 0) + ')';
        var isActive = c === activeCategory;
        return '<button class="hub-pill' + (isActive ? ' active' : '') + '"' +
               ' data-cat="' + esc(c) + '"' +
               ' aria-pressed="' + isActive + '">' +
               esc(label) + '</button>';
      }).join('');

      pillsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.hub-pill');
        if (!btn) return;
        activeCategory = btn.dataset.cat;
        updatePillActive(activeCategory);
        currentPage = 1;
        applyAndRender();
      });
    }

    function updatePillActive(cat) {
      pillsEl.querySelectorAll('.hub-pill').forEach(function (p) {
        var isActive = p.dataset.cat === cat;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-pressed', String(isActive));
      });
    }

    /* ---- Apply filters, sort, then render --------------------- */

    function applyAndRender() {
      var q = (searchEl.value || '').trim().toLowerCase();

      filtered = ALL_PAGES.filter(function (p) {
        var catMatch = activeCategory === 'all' || (p.category || 'general') === activeCategory;
        if (!catMatch) return false;
        if (!q) return true;
        return (p.title       || '').toLowerCase().indexOf(q) !== -1 ||
               (p.description || '').toLowerCase().indexOf(q) !== -1;
      });

      // Sort
      if (currentSort === 'az') {
        filtered.sort(function (a, b) { return (a.title || '').localeCompare(b.title || ''); });
      } else if (currentSort === 'za') {
        filtered.sort(function (a, b) { return (b.title || '').localeCompare(a.title || ''); });
      }

      // Update URL
      var params = new URLSearchParams();
      if (q) params.set('q', q);
      if (activeCategory !== 'all') params.set('cat', activeCategory);
      var qs = params.toString();
      var newUrl = '/prompts-hub' + (qs ? '?' + qs : '');
      if (window.history.replaceState) window.history.replaceState(null, '', newUrl);

      renderPage(currentPage);
    }

    /* ---- Render one page of results --------------------------- */

    function renderPage(page) {
      currentPage = page;
      var total = filtered.length;
      var totalPages = Math.ceil(total / PER_PAGE) || 1;
      currentPage = Math.min(currentPage, totalPages);

      var q = (searchEl.value || '').trim().toLowerCase();

      if (total === 0) {
        gridEl.style.display  = 'none';
        emptyEl.style.display = 'block';
        paginEl.innerHTML     = '';
        pageInfo.textContent  = '';
        statsEl.textContent   = '';
        emptyMsg.textContent  = q
          ? 'No prompts matching "' + q + '"'
          : 'No prompts in this category yet.';
        return;
      }

      emptyEl.style.display = 'none';
      gridEl.style.display  = currentView === 'list' ? 'grid' : 'grid';

      var start = (currentPage - 1) * PER_PAGE;
      var slice = filtered.slice(start, start + PER_PAGE);

      statsEl.textContent =
        total + ' prompt' + (total !== 1 ? 's' : '') +
        (q ? ' matching "' + searchEl.value.trim() + '"' : '') +
        (activeCategory !== 'all' ? ' in "' + cap(activeCategory) + '"' : '');

      pageInfo.textContent =
        'Page ' + currentPage + ' of ' + totalPages;

      gridEl.innerHTML = slice.map(function (p) {
        var title = q ? highlight(p.title, q)       : esc(p.title);
        var desc  = q ? highlight(p.description, q) : esc(p.description);
        var catName = p.category || 'general';
        var catHtml = catName !== 'general' ? '<span class="hub-card-cat">' + esc(catName) + '</span>' : '';
        return '<a class="hub-card" href="' + esc(p.url) + '" role="listitem">' +
               catHtml +
               '<h3>' + title + '</h3>' +
               '<p>' + desc + '</p>' +
               '<span class="hub-card-arrow">View Prompt &rarr;</span>' +
               '</a>';
      }).join('');

      renderPagination(totalPages);

      // Scroll to top of grid smoothly
      if (page > 1) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ---- Pagination ------------------------------------------- */

    function renderPagination(totalPages) {
      if (totalPages <= 1) { paginEl.innerHTML = ''; return; }

      var html = '';
      var prev = currentPage - 1;
      var next = currentPage + 1;

      html += '<button class="page-btn" onclick="goPage(' + prev + ')"' +
              (currentPage === 1 ? ' disabled' : '') + ' aria-label="Previous page">&laquo;</button>';

      // Show at most 7 page buttons, with ellipsis
      var pages = getPaginationRange(currentPage, totalPages);
      pages.forEach(function (p) {
        if (p === '\u2026') {
          html += '<span style="padding:0 4px;color:var(--muted);">\u2026</span>';
        } else {
          html += '<button class="page-btn' + (p === currentPage ? ' active' : '') + '"' +
                  ' onclick="goPage(' + p + ')" aria-label="Page ' + p + '"' +
                  (p === currentPage ? ' aria-current="page"' : '') + '>' + p + '</button>';
        }
      });

      html += '<button class="page-btn" onclick="goPage(' + next + ')"' +
              (currentPage === totalPages ? ' disabled' : '') + ' aria-label="Next page">&raquo;</button>';

      paginEl.innerHTML = html;
    }

    function getPaginationRange(cur, total) {
      if (total <= 7) {
        var arr = [];
        for (var i = 1; i <= total; i++) arr.push(i);
        return arr;
      }
      if (cur <= 4) return [1,2,3,4,5,'\u2026',total];
      if (cur >= total - 3) return [1,'\u2026',total-4,total-3,total-2,total-1,total];
      return [1,'\u2026',cur-1,cur,cur+1,'\u2026',total];
    }

    window.goPage = function (page) {
      if (page < 1) return;
      var total = Math.ceil(filtered.length / PER_PAGE) || 1;
      if (page > total) return;
      renderPage(page);
    };

    window.resetFilters = function () {
      searchEl.value = '';
      activeCategory = 'all';
      currentSort    = 'default';
      sortSel.value  = 'default';
      currentPage    = 1;
      updatePillActive('all');
      applyAndRender();
    };

    /* ---- Highlight -------------------------------------------- */

    function highlight(text, query) {
      var safe = esc(text || '');
      if (!query) return safe;
      var re = new RegExp('(' + regEsc(query) + ')', 'gi');
      return safe.replace(re, '<mark>$1</mark>');
    }

    /* ---- Helpers ---------------------------------------------- */

    function esc(s) {
      return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function cap(s) {
      return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    }

    function regEsc(s) {
      return s.replace(/[-/\\^$*+?.()|[]{}]/g, '\\$&');
    }

    /* ---- Sort handler ----------------------------------------- */

    sortSel.addEventListener('change', function () {
      currentSort = sortSel.value;
      currentPage = 1;
      applyAndRender();
    });

    /* ---- View toggle ------------------------------------------ */

    btnGrid.addEventListener('click', function () {
      currentView = 'grid';
      gridEl.classList.remove('list-view');
      btnGrid.classList.add('active'); btnGrid.setAttribute('aria-pressed','true');
      btnList.classList.remove('active'); btnList.setAttribute('aria-pressed','false');
    });

    btnList.addEventListener('click', function () {
      currentView = 'list';
      gridEl.classList.add('list-view');
      btnList.classList.add('active'); btnList.setAttribute('aria-pressed','true');
      btnGrid.classList.remove('active'); btnGrid.setAttribute('aria-pressed','false');
    });

    /* ---- Debounced search input ------------------------------ */

    var debounceTimer;
    searchEl.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        currentPage = 1;
        applyAndRender();
      }, 140);
    });

    /* ---- Boot ------------------------------------------------- */

    loadIndex();

  }());
  <\/script>

</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: secureHeaders({
      "content-type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    })
  });
}
__name(servePromptsHub, "servePromptsHub");

// src/handlers/admin.js
var ADMIN_USER = "admin";
var ADMIN_PASS = "promptimagelab";
var SESSION_COOKIE = "pil_admin_session";
var SESSION_TOKEN = "pil_admin_2026_secure_token";
async function verifyAdminSession(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match && match[1] === SESSION_TOKEN;
}
__name(verifyAdminSession, "verifyAdminSession");
async function handleAdmin(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  if (path === "/admin/login") {
    if (method === "POST") return handleLogin(request);
    return serveLoginPage();
  }
  if (path === "/admin/logout") return handleLogout();
  const authed = await verifyAdminSession(request);
  if (!authed) {
    return Response.redirect(new URL("/admin/login", request.url).href, 302);
  }
  return serveAdminPage();
}
__name(handleAdmin, "handleAdmin");
async function handleLogin(request) {
  let body;
  try {
    const text = await request.text();
    const params = new URLSearchParams(text);
    body = { user: params.get("user"), pass: params.get("pass") };
  } catch {
    return serveLoginPage("Invalid request");
  }
  if (body.user === ADMIN_USER && body.pass === ADMIN_PASS) {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/admin",
        "Set-Cookie": `${SESSION_COOKIE}=${SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
      }
    });
  }
  return serveLoginPage("Invalid credentials");
}
__name(handleLogin, "handleLogin");
function handleLogout() {
  return new Response(null, {
    status: 302,
    headers: {
      "Location": "/admin/login",
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`
    }
  });
}
__name(handleLogout, "handleLogout");
function serveLoginPage(error = "") {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Login \u2014 PromptImageLab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0f1e;--surface:#111827;--border:rgba(56,189,248,.15);--primary:#38bdf8;--text:#f1f5f9;--muted:#94a3b8;--error:#f87171}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.login-card{width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:40px;box-shadow:0 25px 60px rgba(0,0,0,.5)}
.logo{text-align:center;margin-bottom:32px}
.logo h1{font-size:1.5rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.logo p{color:var(--muted);font-size:.85rem;margin-top:6px}
label{display:block;font-size:.82rem;font-weight:600;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
input{width:100%;padding:12px 16px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:.95rem;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.15)}
.form-group{margin-bottom:20px}
.btn-login{width:100%;padding:13px;background:linear-gradient(135deg,#38bdf8,#818cf8);border:none;border-radius:10px;color:#0a0f1e;font-weight:700;font-size:1rem;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s;margin-top:8px}
.btn-login:hover{opacity:.9;transform:translateY(-1px)}
.error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);color:var(--error);padding:10px 14px;border-radius:8px;font-size:.85rem;margin-bottom:20px;text-align:center}
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">
    <h1>\u26A1 PromptImageLab</h1>
    <p>Admin Control Panel</p>
  </div>
  ${error ? `<div class="error">\u26A0\uFE0F ${error}</div>` : ""}
  <form method="POST" action="/admin/login">
    <div class="form-group">
      <label for="user">Username</label>
      <input type="text" id="user" name="user" required autocomplete="username" placeholder="admin">
    </div>
    <div class="form-group">
      <label for="pass">Password</label>
      <input type="password" id="pass" name="pass" required autocomplete="current-password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
    </div>
    <button type="submit" class="btn-login">Sign In \u2192</button>
  </form>
</div>
</body>
</html>`;
  return new Response(html, { status: 200, headers: { "content-type": "text/html;charset=UTF-8", "Cache-Control": "no-store" } });
}
__name(serveLoginPage, "serveLoginPage");
function serveAdminPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Dashboard \u2014 PromptImageLab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${ADMIN_CSS}
</style>
</head>
<body>
<div id="app">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h1>\u26A1 PIL Admin</h1>
    </div>
    <nav class="sidebar-nav">
      <button class="nav-btn active" data-tab="dashboard" onclick="showTab('dashboard')">
        <span>\u{1F4CA}</span> Dashboard
      </button>
      <button class="nav-btn" data-tab="pages" onclick="showTab('pages')">
        <span>\u{1F4C4}</span> Pages
      </button>
      <button class="nav-btn" data-tab="prompts" onclick="showTab('prompts')">
        <span>\u2728</span> Prompts
      </button>
      <button class="nav-btn" data-tab="sitemap" onclick="showTab('sitemap')">
        <span>\u{1F310}</span> Sitemap XML
      </button>
      <button class="nav-btn" data-tab="sql" onclick="showTab('sql')">
        <span>\u{1F5C4}\uFE0F</span> SQL Execute
      </button>
    </nav>
    <div class="sidebar-footer">
      <a href="/" target="_blank" class="view-site-btn">\u{1F310} View Site</a>
      <a href="/admin/logout" class="logout-btn">\u21A9 Logout</a>
    </div>
  </aside>

  <!-- Main -->
  <main class="main-content">
    <!-- Top bar -->
    <header class="topbar">
      <button class="menu-toggle" onclick="toggleSidebar()">\u2630</button>
      <span class="topbar-title" id="topbar-title">Dashboard</span>
      <div class="topbar-actions" id="topbar-actions"></div>
    </header>

    <!-- DASHBOARD TAB -->
    <section class="tab active" id="tab-dashboard">
      <div class="stats-grid" id="stats-grid">
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
      </div>
      <div class="card mt-24">
        <h3 class="card-title">Top Categories</h3>
        <div id="top-cats" class="cat-list">Loading\u2026</div>
      </div>
    </section>

    <!-- PAGES TAB -->
    <section class="tab" id="tab-pages">
      <div class="tab-toolbar">
        <input type="search" id="pages-search" class="search-input" placeholder="Search pages\u2026" oninput="debouncedPageSearch()">
        <select id="pages-status" class="select-input" onchange="loadPages()">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button class="btn btn-primary" onclick="openPageModal()">+ New Page</button>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="pages-table">
          <thead><tr>
            <th><input type="checkbox" id="pages-check-all" onchange="toggleAllPages()"></th>
            <th>Title</th><th>Slug</th><th>Category</th><th>Status</th><th>Words</th><th>Updated</th><th>Actions</th>
          </tr></thead>
          <tbody id="pages-tbody"><tr><td colspan="8" class="loading-row">Loading\u2026</td></tr></tbody>
        </table>
      </div>
      <div class="pagination" id="pages-pagination"></div>
      <div class="bulk-bar" id="pages-bulk-bar" style="display:none">
        <span id="bulk-count">0 selected</span>
        <button class="btn btn-danger" onclick="bulkDeletePages()">\u{1F5D1} Delete Selected</button>
      </div>
    </section>

    <!-- PROMPTS TAB -->
    <section class="tab" id="tab-prompts">
      <div class="tab-toolbar">
        <input type="search" id="prompts-search" class="search-input" placeholder="Search prompts\u2026" oninput="debouncedPromptSearch()">
        <select id="prompts-page-filter" class="select-input" onchange="loadPrompts()">
          <option value="">All Pages</option>
        </select>
        <button class="btn btn-primary" onclick="openPromptModal()">+ New Prompt</button>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="prompts-table">
          <thead><tr>
            <th>ID</th><th>Page</th><th>Title</th><th>Body (preview)</th><th>Tags</th><th>Position</th><th>Actions</th>
          </tr></thead>
          <tbody id="prompts-tbody"><tr><td colspan="7" class="loading-row">Loading\u2026</td></tr></tbody>
        </table>
      </div>
      <div class="pagination" id="prompts-pagination"></div>
    </section>

    <!-- SITEMAP TAB -->
    <section class="tab" id="tab-sitemap">
      <div class="card mt-24">
        <h3 class="card-title">Sitemap XML Viewer</h3>
        <p>
          <a href="/sitemap.xml" target="_blank" style="color:var(--primary);text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:8px;">
            https://promptimagelab.com/sitemap.xml 
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </p>
        <div style="margin-top:20px;">
          <button class="btn btn-secondary" onclick="loadSitemapXml()">\u21BB Refresh Sitemap content</button>
        </div>
        <div style="margin-top:16px;">
          <textarea id="sitemap-content" class="sql-editor" style="min-height:400px;max-height:600px;font-family:monospace;white-space:pre;" readonly placeholder="Loading sitemap.xml..."></textarea>
        </div>
      </div>
    </section>

    <!-- SQL EXECUTE TAB -->
    <section class="tab" id="tab-sql">
      <div class="sql-editor-wrap">
        <div class="sql-toolbar">
          <span class="sql-label">\u{1F5C4}\uFE0F SQL Console \u2014 Cloudflare D1</span>
          <div style="display:flex;gap:8px;align-items:center;">
            <select id="sql-preset" class="select-input" style="font-size:.82rem;" onchange="loadSqlPreset()">
              <option value="">\u2014 Quick Queries \u2014</option>
              <option value="SELECT * FROM pages ORDER BY updated_at DESC LIMIT 20;">List recent pages</option>
              <option value="SELECT * FROM categories ORDER BY position ASC;">List categories</option>
              <option value="SELECT * FROM prompts ORDER BY id DESC LIMIT 20;">List prompts</option>
              <option value="SELECT COUNT(*) AS pages, (SELECT COUNT(*) FROM categories) AS categories, (SELECT COUNT(*) FROM prompts) AS prompts FROM pages;">DB stats</option>
              <option value="SELECT p.id, p.slug, p.title, COUNT(pr.id) AS prompt_count FROM pages p LEFT JOIN prompts pr ON pr.page_id = p.id GROUP BY p.id ORDER BY prompt_count DESC LIMIT 15;">Pages by prompt count</option>
              <option value="PRAGMA table_list;">List tables</option>
              <option value="PRAGMA table_info(pages);">Schema: pages</option>
              <option value="PRAGMA table_info(prompts);">Schema: prompts</option>
              <option value="PRAGMA table_info(categories);">Schema: categories</option>
            </select>
            <button class="btn btn-primary" onclick="runSql()" id="run-sql-btn">\u25B6 Run</button>
            <button class="btn btn-secondary" onclick="clearSql()">\u2715 Clear</button>
          </div>
        </div>
        <div class="sql-editor-container">
          <textarea id="sql-editor" class="sql-editor" placeholder="Enter SQL query\u2026
Examples:
  SELECT * FROM pages LIMIT 10;
  INSERT INTO categories (slug, name) VALUES ('art', 'Art');
  UPDATE pages SET status='published' WHERE id=1;" spellcheck="false"></textarea>
        </div>
        <div id="sql-status-bar" class="sql-status-bar"></div>
        <div id="sql-results" class="sql-results">
          <div class="sql-welcome">
            <div class="sql-welcome-icon">\u{1F5C4}\uFE0F</div>
            <h3>SQL Console</h3>
            <p>Write any SQL query above and press <strong>\u25B6 Run</strong> to execute it against your Cloudflare D1 database.</p>
            <p style="margin-top:8px;font-size:.82rem;">Supports SELECT, INSERT, UPDATE, DELETE, PRAGMA statements, and more.</p>
          </div>
        </div>
        <div id="sql-history-wrap" class="sql-history-wrap">
          <div class="sql-history-header">
            <span>\u{1F4CB} Query History</span>
            <button class="btn btn-sm btn-secondary" onclick="clearSqlHistory()">Clear</button>
          </div>
          <div id="sql-history-list" class="sql-history-list"></div>
        </div>
      </div>
    </section>
  </main>
</div>

<!-- MODAL OVERLAY -->
<div class="modal-overlay" id="modal-overlay" onclick="closeModal(event)">
  <div class="modal" id="modal">
    <div class="modal-header">
      <h2 id="modal-title">Edit</h2>
      <button class="modal-close" onclick="closeModal()">\u2715</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>

<!-- CONFIRM DIALOG -->
<div class="modal-overlay" id="confirm-overlay" style="display:none">
  <div class="modal" style="max-width:400px">
    <div class="modal-header"><h2 id="confirm-title">Confirm</h2></div>
    <div class="modal-body">
      <p id="confirm-msg" style="margin-bottom:24px;color:var(--muted)"></p>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="confirmNo()">Cancel</button>
        <button class="btn btn-danger" id="confirm-yes-btn">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<script>
${ADMIN_JS}
<\/script>
</body>
</html>`;
  return new Response(html, { status: 200, headers: { "content-type": "text/html;charset=UTF-8", "Cache-Control": "no-store" } });
}
__name(serveAdminPage, "serveAdminPage");
var ADMIN_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070d1a;--surface:#0f1629;--surface2:#162035;
  --border:rgba(56,189,248,.12);--border2:rgba(56,189,248,.22);
  --primary:#38bdf8;--secondary:#818cf8;--success:#4ade80;
  --danger:#f87171;--warning:#fbbf24;
  --text:#f1f5f9;--muted:#64748b;--muted2:#94a3b8;
  --sidebar-w:240px
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
#app{display:flex;min-height:100vh}

/* Sidebar */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .3s}
.sidebar-header{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
.sidebar-header h1{font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
.nav-btn{width:100%;padding:10px 14px;background:transparent;border:none;border-radius:10px;color:var(--muted2);font-size:.9rem;font-weight:500;font-family:inherit;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;transition:all .2s}
.nav-btn:hover{background:rgba(56,189,248,.08);color:var(--text)}
.nav-btn.active{background:rgba(56,189,248,.12);color:var(--primary);font-weight:600}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px}
.view-site-btn,.logout-btn{padding:9px 14px;border-radius:8px;font-size:.85rem;font-weight:600;text-align:center;text-decoration:none;transition:all .2s}
.view-site-btn{background:rgba(56,189,248,.1);color:var(--primary);border:1px solid rgba(56,189,248,.2)}
.view-site-btn:hover{background:rgba(56,189,248,.2)}
.logout-btn{background:rgba(248,113,113,.08);color:var(--danger);border:1px solid rgba(248,113,113,.15)}
.logout-btn:hover{background:rgba(248,113,113,.15)}

/* Main */
.main-content{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{padding:0 24px;height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:50}
.menu-toggle{background:none;border:none;color:var(--muted2);font-size:1.2rem;cursor:pointer;padding:6px;border-radius:6px;display:none}
.menu-toggle:hover{color:var(--text)}
.topbar-title{font-weight:700;font-size:1rem;flex:1}
.topbar-actions{display:flex;gap:10px}

/* Tabs */
.tab{display:none;padding:24px;flex:1;animation:fadeIn .2s ease}
.tab.active{display:block}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
.stat-card .stat-val{font-size:2rem;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.stat-card .stat-label{color:var(--muted2);font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.stat-card .stat-sub{color:var(--muted);font-size:.78rem;margin-top:4px}

/* Card */
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
.card-title{font-size:1rem;font-weight:700;margin-bottom:16px}
.mt-24{margin-top:24px}
.cat-list{display:flex;flex-direction:column;gap:8px}
.cat-row{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--surface2);border-radius:8px}
.cat-row-name{font-weight:600;font-size:.9rem}
.cat-row-cnt{color:var(--muted2);font-size:.8rem}

/* Toolbar */
.tab-toolbar{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.search-input,.select-input{padding:9px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s}
.search-input{min-width:220px;flex:1}
.select-input{background:var(--surface)}
.search-input:focus,.select-input:focus{border-color:var(--primary)}

/* Buttons */
.btn{padding:9px 18px;border-radius:8px;border:none;font-weight:600;font-size:.88rem;font-family:inherit;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:linear-gradient(135deg,#38bdf8,#818cf8);color:#0a0f1e}
.btn-primary:hover{opacity:.9;transform:translateY(-1px)}
.btn-secondary{background:var(--surface2);border:1px solid var(--border2);color:var(--text)}
.btn-secondary:hover{border-color:var(--primary)}
.btn-danger{background:rgba(248,113,113,.15);border:1px solid rgba(248,113,113,.3);color:var(--danger)}
.btn-danger:hover{background:rgba(248,113,113,.25)}
.btn-sm{padding:6px 12px;font-size:.8rem}
.btn-icon{padding:6px 10px;font-size:.8rem}

/* Table */
.table-wrap{overflow-x:auto;overflow-y:auto;max-height:600px;border-radius:12px;border:1px solid var(--border);position:relative}
.data-table{width:100%;border-collapse:collapse;font-size:.88rem}
.data-table th{position:sticky;top:0;z-index:2;padding:12px 14px;text-align:left;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);background:var(--surface2);border-bottom:1px solid var(--border)}
.data-table td{padding:12px 14px;border-bottom:1px solid var(--border);vertical-align:middle}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:rgba(56,189,248,.03)}
.loading-row{text-align:center;color:var(--muted);padding:32px!important}

/* Badges */
.badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:.72rem;font-weight:700}
.badge-published{background:rgba(74,222,128,.1);color:var(--success);border:1px solid rgba(74,222,128,.2)}
.badge-draft{background:rgba(251,191,36,.1);color:var(--warning);border:1px solid rgba(251,191,36,.2)}
.badge-archived{background:rgba(100,116,139,.1);color:var(--muted2);border:1px solid rgba(100,116,139,.2)}

/* Pagination */
.pagination{display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap}
.page-btn{padding:7px 13px;border-radius:8px;border:1px solid var(--border2);background:var(--surface);color:var(--muted2);font-family:inherit;font-size:.85rem;cursor:pointer;transition:all .2s}
.page-btn:hover,.page-btn.active{background:rgba(56,189,248,.12);border-color:var(--primary);color:var(--primary)}

/* Bulk bar */
.bulk-bar{display:flex;align-items:center;gap:14px;padding:12px 16px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);border-radius:10px;margin-top:12px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:none;align-items:center;justify-content:center;padding:20px}
.modal-overlay.open{display:flex}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:18px;width:100%;max-width:700px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.6)}
.modal-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.modal-header h2{font-size:1.1rem;font-weight:700}
.modal-close{background:none;border:none;color:var(--muted2);font-size:1.2rem;cursor:pointer;padding:4px 8px;border-radius:6px}
.modal-close:hover{background:rgba(255,255,255,.06);color:var(--text)}
.modal-body{padding:24px;overflow-y:auto;flex:1}
.modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:12px;justify-content:flex-end}

/* Form */
.form-group{margin-bottom:18px}
.form-group label{display:block;font-size:.8rem;font-weight:600;color:var(--muted2);margin-bottom:7px;text-transform:uppercase;letter-spacing:.4px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.1)}
.form-group textarea{resize:vertical;min-height:140px;line-height:1.6}
.form-group select option{background:var(--surface)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.char-count{font-size:.75rem;color:var(--muted);text-align:right;margin-top:4px}

/* Tags input */
.tags-wrap{display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:10px;min-height:44px;cursor:text}
.tags-wrap:focus-within{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.1)}
.tag-chip{padding:3px 10px;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.25);border-radius:20px;font-size:.78rem;color:var(--primary);display:flex;align-items:center;gap:5px}
.tag-chip button{background:none;border:none;color:var(--primary);cursor:pointer;font-size:.85rem;padding:0;line-height:1}
.tags-input-inner{border:none;background:transparent;color:var(--text);font-family:inherit;font-size:.88rem;outline:none;flex:1;min-width:80px;padding:2px}

/* Toast */
.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:.9rem;font-weight:600;z-index:9999;opacity:0;transform:translateY(10px);transition:all .3s;pointer-events:none}
.toast.show{opacity:1;transform:translateY(0)}
.toast.success{background:#052e16;border:1px solid #166534;color:#4ade80}
.toast.error{background:#2d0a0a;border:1px solid #7f1d1d;color:#f87171}

/* Skeleton */
.skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px}
.skeleton-card{pointer-events:none}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

/* Responsive */
@media(max-width:900px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main-content{margin-left:0}
  .menu-toggle{display:block}
  .stats-grid{grid-template-columns:1fr 1fr}
  .form-row{grid-template-columns:1fr}
}
@media(max-width:500px){.stats-grid{grid-template-columns:1fr}}

/* SQL Execute */
.sql-editor-wrap{display:flex;flex-direction:column;gap:14px;height:calc(100vh - 120px)}
.sql-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
.sql-label{font-size:.88rem;font-weight:700;color:var(--primary);display:flex;align-items:center;gap:6px}
.sql-editor-container{position:relative;flex-shrink:0}
.sql-editor{width:100%;min-height:140px;max-height:280px;padding:14px 16px;background:#0a1628;border:1px solid rgba(56,189,248,.25);border-radius:12px;color:#e2e8f0;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:.9rem;line-height:1.65;resize:vertical;outline:none;transition:border-color .2s;tab-size:2}
.sql-editor:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.12)}
.sql-editor::placeholder{color:#334155;font-style:italic}
.sql-status-bar{font-size:.8rem;padding:6px 14px;border-radius:8px;min-height:30px;display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:.2px}
.sql-status-bar.ok{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.2);color:var(--success)}
.sql-status-bar.err{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);color:var(--danger)}
.sql-status-bar.running{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.18);color:var(--warning)}
.sql-results{flex:1;overflow:auto;border-radius:12px;border:1px solid var(--border);background:var(--surface);min-height:160px}
.sql-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;text-align:center;color:var(--muted)}
.sql-welcome-icon{font-size:2.5rem;margin-bottom:16px;opacity:.5}
.sql-welcome h3{font-size:1.1rem;font-weight:700;color:var(--muted2);margin-bottom:8px}
.sql-welcome p{font-size:.85rem;line-height:1.6;max-width:420px}
.sql-result-table-wrap{overflow:auto;max-height:340px}
.sql-result-table{width:100%;border-collapse:collapse;font-size:.82rem;font-family:'Fira Code','Consolas',monospace}
.sql-result-table th{padding:8px 12px;text-align:left;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--primary);background:rgba(56,189,248,.05);border-bottom:1px solid var(--border);white-space:nowrap;position:sticky;top:0;z-index:1}
.sql-result-table td{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--text);white-space:nowrap;max-width:300px;overflow:hidden;text-overflow:ellipsis}
.sql-result-table tr:hover td{background:rgba(56,189,248,.04)}
.sql-result-table td.null-val{color:var(--muted);font-style:italic}
.sql-empty-result{padding:32px;text-align:center;color:var(--muted);font-size:.88rem}
.sql-history-wrap{border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden;flex-shrink:0;max-height:180px;display:flex;flex-direction:column}
.sql-history-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border);font-size:.8rem;font-weight:700;color:var(--muted2);flex-shrink:0}
.sql-history-list{overflow-y:auto;flex:1}
.sql-history-item{padding:8px 14px;font-size:.78rem;font-family:'Fira Code','Consolas',monospace;color:var(--muted2);cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .15s}
.sql-history-item:hover{background:rgba(56,189,248,.06);color:var(--text)}
.sql-history-item:last-child{border-bottom:none}
`;
var ADMIN_JS = `
'use strict';

/* ---- State -------------------------------------------- */
let pagesPage = 1, promptsPage = 1;
let selectedPages = new Set();
let pageSearchTimeout, promptSearchTimeout;
let confirmCallback = null;

/* ---- Init -------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadPages();
  loadPrompts();
  loadSitemapXml();
  loadPagesDropdown();
  renderSqlHistory();
});

/* ---- Tab switching ----------------------------------- */
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector('[data-tab="' + name + '"]').classList.add('active');
  document.getElementById('topbar-title').textContent = name.charAt(0).toUpperCase() + name.slice(1);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ---- API --------------------------------------------- */
async function api(path, opts = {}) {
  const res = await fetch('/admin/api' + path, {
    headers: { 'content-type': 'application/json', ...opts.headers },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

/* ---- Toast ------------------------------------------- */
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ---- Confirm dialog ---------------------------------- */
function confirm(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-overlay').style.display = 'flex';
  confirmCallback = cb;
  document.getElementById('confirm-yes-btn').onclick = () => { hideConfirm(); cb(); };
}
function confirmNo() { hideConfirm(); }
function hideConfirm() { document.getElementById('confirm-overlay').style.display = 'none'; }

/* ---- Modal ------------------------------------------- */
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.remove('open');
}

/* ==== SITEMAP VIEWER =============================== */
async function loadSitemapXml() {
  const el = document.getElementById('sitemap-content');
  if (!el) return;
  el.value = 'Loading sitemap.xml...';
  try {
    const res = await fetch('/sitemap.xml?t=' + Date.now());
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    const text = await res.text();
    el.value = text;
  } catch(e) {
    el.value = 'Error loading sitemap: ' + e.message;
  }
}

/* ==== DASHBOARD ==================================== */
async function loadStats() {
  try {
    const d = await api('/stats');
    const g = document.getElementById('stats-grid');
    g.innerHTML = \`
      <div class="stat-card">
        <div class="stat-val">\${d.pages.total ?? 0}</div>
        <div class="stat-label">Total Pages</div>
        <div class="stat-sub">\${d.pages.published ?? 0} published \xB7 \${d.pages.draft ?? 0} draft</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${d.prompts ?? 0}</div>
        <div class="stat-label">Prompts</div>
        <div class="stat-sub">Across all pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${d.categories ?? 0}</div>
        <div class="stat-label">Categories</div>
        <div class="stat-sub">Content taxonomy</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${(d.pages.total_words ?? 0).toLocaleString()}</div>
        <div class="stat-label">Total Words</div>
        <div class="stat-sub">Across all pages</div>
      </div>
    \`;
    const cats = d.topCats || [];
    document.getElementById('top-cats').innerHTML = cats.length
      ? cats.map(c => \`<div class="cat-row"><span class="cat-row-name">\${c.category || 'Uncategorized'}</span><span class="cat-row-cnt">\${c.cnt} pages</span></div>\`).join('')
      : '<p style="color:var(--muted)">No category data yet.</p>';
  } catch(e) { toast('Stats error: ' + e.message, 'error'); }
}

/* ==== PAGES ======================================== */
async function loadPages() {
  const search   = document.getElementById('pages-search').value.trim();
  const status   = document.getElementById('pages-status').value;
  const params   = new URLSearchParams({ page: pagesPage, limit: 20 });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const tbody = document.getElementById('pages-tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="loading-row">Loading\u2026</td></tr>';
  try {
    const d = await api('/pages?' + params);
    if (!d.data.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="loading-row">No pages found.</td></tr>';
    } else {
      tbody.innerHTML = d.data.map(p => \`
        <tr>
          <td><input type="checkbox" class="page-chk" value="\${p.id}" onchange="updateBulkBar()"></td>
          <td><strong>\${esc(p.title)}</strong></td>
          <td><a href="/\${p.slug}" target="_blank" class="slug-link">\${esc(p.slug)}</a></td>
          <td>\${esc(p.category || '\u2014')}</td>
          <td><span class="badge badge-\${p.status || 'draft'}">\${p.status || 'draft'}</span></td>
          <td>\${(p.word_count || 0).toLocaleString()}</td>
          <td>\${fmtDate(p.updated_at)}</td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="editPage(\${p.id})">\u270F\uFE0F</button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="deletePage(\${p.id})">\u{1F5D1}</button>
          </td>
        </tr>\`).join('');
    }
    renderPagination('pages', d.page, d.pages);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="8" class="loading-row">Error: ' + esc(e.message) + '</td></tr>';
  }
}

function debouncedPageSearch() {
  clearTimeout(pageSearchTimeout);
  pagesPage = 1;
  pageSearchTimeout = setTimeout(loadPages, 350);
}

function toggleAllPages() {
  const all = document.getElementById('pages-check-all').checked;
  document.querySelectorAll('.page-chk').forEach(c => { c.checked = all; });
  updateBulkBar();
}

function updateBulkBar() {
  const checked = document.querySelectorAll('.page-chk:checked');
  const bar = document.getElementById('pages-bulk-bar');
  document.getElementById('bulk-count').textContent = checked.length + ' selected';
  bar.style.display = checked.length ? 'flex' : 'none';
}

async function bulkDeletePages() {
  const ids = [...document.querySelectorAll('.page-chk:checked')].map(c => parseInt(c.value));
  if (!ids.length) return;
  confirm(\`Delete \${ids.length} pages? This cannot be undone.\`, async () => {
    try {
      await api('/pages/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) });
      toast('Deleted ' + ids.length + ' pages');
      loadPages();
      loadStats();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

function openPageModal(page = null) {
  const isEdit = !!page;
  const tags = isEdit ? parseTagsDisplay(page.tags) : [];
  const related = isEdit ? parseTagsDisplay(page.related) : [];
  openModal(isEdit ? 'Edit Page' : 'New Page', \`
    <form id="page-form" onsubmit="submitPage(event, \${isEdit ? page.id : 'null'})">
      <div class="form-row">
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="\${esc(page?.title || '')}" required oninput="autoSlug(this)">
        </div>
        <div class="form-group">
          <label>Slug *</label>
          <input type="text" name="slug" id="page-slug" value="\${esc(page?.slug || '')}" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, hyphens only">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" name="description" value="\${esc(page?.description || '')}" maxlength="160" oninput="this.nextElementSibling.textContent=this.value.length+'/160'">
        <div class="char-count">\${(page?.description || '').length}/160</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category</label>
          <input type="text" name="category" value="\${esc(page?.category || '')}" list="cat-datalist">
          <datalist id="cat-datalist"></datalist>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="draft" \${(page?.status||'draft')==='draft'?'selected':''}>Draft</option>
            <option value="published" \${page?.status==='published'?'selected':''}>Published</option>
            <option value="archived" \${page?.status==='archived'?'selected':''}>Archived</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tags-wrap" id="tags-wrap">\${tags.map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">\xD7</button></span>\`).join('')}<input class="tags-input-inner" id="tags-inner" placeholder="Add tag, press Enter\u2026" onkeydown="handleTagKey(event,'tags-wrap')"></div>
        <input type="hidden" name="tags" id="tags-hidden" value="\${esc(page?.tags || '[]')}">
      </div>
      <div class="form-group">
        <label>Related Pages (slugs)</label>
        <div class="tags-wrap" id="related-wrap">\${related.map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">\xD7</button></span>\`).join('')}<input class="tags-input-inner" id="related-inner" placeholder="Add slug, press Enter\u2026" onkeydown="handleTagKey(event,'related-wrap')"></div>
        <input type="hidden" name="related" id="related-hidden" value="\${esc(page?.related || '[]')}">
      </div>
      <div class="form-group">
        <label>Content (HTML)</label>
        <textarea name="content" id="page-content" rows="12">\${esc(page?.content || '')}</textarea>
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">\${isEdit ? '\u{1F4BE} Save Changes' : '\u2795 Create Page'}</button>
      </div>
    </form>
  \`);
  loadCatDatalist();
}

async function editPage(id) {
  try {
    const page = await api('/pages/' + id);
    openPageModal(page);
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function submitPage(e, id) {
  e.preventDefault();
  syncTags('tags-wrap', 'tags-hidden');
  syncTags('related-wrap', 'related-hidden');
  const form = e.target;
  const data = {
    slug: form.slug.value.trim(),
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    category: form.category.value.trim(),
    status: form.status.value,
    tags: form.tags.value || '[]',
    related: form.related.value || '[]',
    content: form.content.value
  };
  try {
    if (id) {
      await api('/pages/' + id, { method: 'PUT', body: JSON.stringify(data) });
      toast('Page updated \u2713');
    } else {
      await api('/pages', { method: 'POST', body: JSON.stringify(data) });
      toast('Page created \u2713');
    }
    closeModal();
    loadPages();
    loadStats();
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function deletePage(id) {
  confirm('Delete this page? This cannot be undone.', async () => {
    try {
      await api('/pages/' + id, { method: 'DELETE' });
      toast('Page deleted');
      loadPages();
      loadStats();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

/* ==== PROMPTS ====================================== */
async function loadPrompts() {
  const search  = document.getElementById('prompts-search').value.trim();
  const page_id = document.getElementById('prompts-page-filter').value;
  const params  = new URLSearchParams({ page: promptsPage, limit: 20 });
  if (search) params.set('search', search);
  if (page_id) params.set('page_id', page_id);
  const tbody = document.getElementById('prompts-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Loading\u2026</td></tr>';
  try {
    const d = await api('/prompts?' + params);
    if (!d.data.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No prompts found.</td></tr>';
    } else {
      tbody.innerHTML = d.data.map(p => \`
        <tr>
          <td>\${p.id}</td>
          <td>\${p.page_title ? \`<a href="/\${p.page_slug}" target="_blank">\${esc(p.page_title)}</a>\` : '\u2014'}</td>
          <td>\${esc(p.title || '\u2014')}</td>
          <td class="prompt-preview">\${esc((p.body || '').slice(0, 80))}\${p.body && p.body.length > 80 ? '\u2026' : ''}</td>
          <td>\${esc(p.tags || '[]')}</td>
          <td>\${p.position}</td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="editPrompt(\${p.id})">\u270F\uFE0F</button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="deletePrompt(\${p.id})">\u{1F5D1}</button>
          </td>
        </tr>\`).join('');
    }
    renderPagination('prompts', d.page, d.pages);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Error: ' + esc(e.message) + '</td></tr>';
  }
}

function debouncedPromptSearch() {
  clearTimeout(promptSearchTimeout);
  promptsPage = 1;
  promptSearchTimeout = setTimeout(loadPrompts, 350);
}

function openPromptModal(prompt = null) {
  const isEdit = !!prompt;
  openModal(isEdit ? 'Edit Prompt' : 'New Prompt', \`
    <form id="prompt-form" onsubmit="submitPrompt(event, \${isEdit ? prompt.id : 'null'})">
      <div class="form-row">
        <div class="form-group">
          <label>Page *</label>
          <select name="page_id" id="prompt-page-select" required>
            <option value="">Select page\u2026</option>
          </select>
        </div>
        <div class="form-group">
          <label>Position</label>
          <input type="number" name="position" value="\${prompt?.position ?? 0}" min="0">
        </div>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" value="\${esc(prompt?.title || '')}">
      </div>
      <div class="form-group">
        <label>Body *</label>
        <textarea name="body" required rows="6">\${esc(prompt?.body || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tags-wrap" id="ptags-wrap">\${parseTagsDisplay(prompt?.tags).map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">\xD7</button></span>\`).join('')}<input class="tags-input-inner" id="ptags-inner" placeholder="Add tag\u2026" onkeydown="handleTagKey(event,'ptags-wrap')"></div>
        <input type="hidden" name="tags" id="ptags-hidden" value="\${esc(prompt?.tags || '[]')}">
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">\${isEdit ? '\u{1F4BE} Save' : '\u2795 Create'}</button>
      </div>
    </form>
  \`);
  // populate pages dropdown
  loadPagesInSelect('prompt-page-select', prompt?.page_id);
}

async function editPrompt(id) {
  try {
    const p = await api('/prompts/' + id);
    openPromptModal(p);
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function submitPrompt(e, id) {
  e.preventDefault();
  syncTags('ptags-wrap', 'ptags-hidden');
  const form = e.target;
  const data = {
    page_id: parseInt(form.page_id.value),
    title: form.title.value.trim(),
    body: form.body.value.trim(),
    tags: form.tags.value || '[]',
    position: parseInt(form.position.value) || 0
  };
  try {
    if (id) {
      await api('/prompts/' + id, { method: 'PUT', body: JSON.stringify(data) });
      toast('Prompt updated \u2713');
    } else {
      await api('/prompts', { method: 'POST', body: JSON.stringify(data) });
      toast('Prompt created \u2713');
    }
    closeModal();
    loadPrompts();
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function deletePrompt(id) {
  confirm('Delete this prompt?', async () => {
    try {
      await api('/prompts/' + id, { method: 'DELETE' });
      toast('Prompt deleted');
      loadPrompts();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

/* ==== CATEGORIES =================================== */
async function loadCategories() {
  const tbody = document.getElementById('cats-tbody');
  tbody.innerHTML = '<tr><td colspan="6" class="loading-row">Loading\u2026</td></tr>';
  try {
    const cats = await api('/categories');
    if (!cats.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading-row">No categories yet.</td></tr>';
    } else {
      tbody.innerHTML = cats.map(c => \`
        <tr>
          <td>\${c.id}</td>
          <td><code>\${esc(c.slug)}</code></td>
          <td><strong>\${esc(c.name)}</strong></td>
          <td>\${esc(c.description || '\u2014')}</td>
          <td>\${c.position}</td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="editCategory(\${c.id})">\u270F\uFE0F</button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="deleteCategory(\${c.id})">\u{1F5D1}</button>
          </td>
        </tr>\`).join('');
    }
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

function openCategoryModal(cat = null) {
  const isEdit = !!cat;
  openModal(isEdit ? 'Edit Category' : 'New Category', \`
    <form onsubmit="submitCategory(event, \${isEdit ? cat.id : 'null'})">
      <div class="form-row">
        <div class="form-group">
          <label>Name *</label>
          <input type="text" name="name" value="\${esc(cat?.name || '')}" required oninput="if(!this.closest('form').querySelector('[name=slug][data-manual]'))this.closest('form').querySelector('[name=slug]').value=slugify(this.value)">
        </div>
        <div class="form-group">
          <label>Slug *</label>
          <input type="text" name="slug" value="\${esc(cat?.slug || '')}" required pattern="[a-z0-9-]+" oninput="this.dataset.manual=1">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" name="description" value="\${esc(cat?.description || '')}">
      </div>
      <div class="form-group">
        <label>Position</label>
        <input type="number" name="position" value="\${cat?.position ?? 0}" min="0">
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">\${isEdit ? '\u{1F4BE} Save' : '\u2795 Create'}</button>
      </div>
    </form>
  \`);
}

async function editCategory(id) {
  try {
    const cats = await api('/categories');
    const cat = cats.find(c => c.id === id);
    if (cat) openCategoryModal(cat);
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function submitCategory(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = {
    slug: form.slug.value.trim(),
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    position: parseInt(form.position.value) || 0
  };
  try {
    if (id) {
      await api('/categories/' + id, { method: 'PUT', body: JSON.stringify(data) });
      toast('Category updated \u2713');
    } else {
      await api('/categories', { method: 'POST', body: JSON.stringify(data) });
      toast('Category created \u2713');
    }
    closeModal();
    loadCategories();
    loadStats();
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteCategory(id) {
  confirm('Delete this category?', async () => {
    try {
      await api('/categories/' + id, { method: 'DELETE' });
      toast('Category deleted');
      loadCategories();
      loadStats();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

/* ==== SQL EXECUTE ================================== */
let sqlHistory = JSON.parse(localStorage.getItem('admin_sql_history') || '[]');

function loadSqlPreset() {
  const sel = document.getElementById('sql-preset');
  if (sel.value) {
    document.getElementById('sql-editor').value = sel.value;
    sel.value = '';
  }
}

function clearSql() {
  document.getElementById('sql-editor').value = '';
  document.getElementById('sql-status-bar').className = 'sql-status-bar';
  document.getElementById('sql-status-bar').textContent = '';
  document.getElementById('sql-results').innerHTML = '<div class="sql-welcome"><div class="sql-welcome-icon">\u{1F5C4}\uFE0F</div><h3>SQL Console</h3><p>Write any SQL query above and press <strong>\u25B6 Run</strong> to execute it.</p></div>';
}

async function runSql() {
  const editor = document.getElementById('sql-editor');
  const sql = editor.value.trim();
  if (!sql) { toast('Enter a SQL query first', 'error'); return; }

  const statusBar = document.getElementById('sql-status-bar');
  const resultsEl = document.getElementById('sql-results');
  const btn = document.getElementById('run-sql-btn');

  btn.disabled = true;
  btn.textContent = '\u23F3 Running\u2026';
  statusBar.className = 'sql-status-bar running';
  statusBar.textContent = 'Executing query\u2026';
  resultsEl.innerHTML = '<div class="sql-empty-result">Running SQL\u2026</div>';

  const t0 = Date.now();
  try {
    const res = await fetch('/admin/api/sql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    const elapsed = Date.now() - t0;
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Query failed');

    // Save to history
    sqlHistory = [sql, ...sqlHistory.filter(h => h !== sql)].slice(0, 30);
    localStorage.setItem('admin_sql_history', JSON.stringify(sqlHistory));
    renderSqlHistory();

    const rows = data.results || [];
    const rowsChanged = data.rowsAffected ?? null;

    if (rows.length === 0 && rowsChanged === null) {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`\u2713 Query executed successfully \xB7 0 rows \xB7 \${elapsed}ms\`;
      resultsEl.innerHTML = '<div class="sql-empty-result">\u2713 Query executed \u2014 no rows returned.</div>';
    } else if (rows.length > 0) {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`\u2713 \${rows.length} row\${rows.length !== 1 ? 's' : ''} returned \xB7 \${elapsed}ms\`;
      resultsEl.innerHTML = renderSqlTable(rows);
    } else {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`\u2713 \${rowsChanged ?? 0} row\${rowsChanged !== 1 ? 's' : ''} affected \xB7 \${elapsed}ms\`;
      resultsEl.innerHTML = \`<div class="sql-empty-result">\u2713 \${rowsChanged ?? 0} row(s) affected.</div>\`;
    }
  } catch(e) {
    const elapsed = Date.now() - t0;
    statusBar.className = 'sql-status-bar err';
    statusBar.textContent = \`\u2717 Error \xB7 \${elapsed}ms\`;
    resultsEl.innerHTML = \`<div class="sql-empty-result" style="color:var(--danger)">\u26A0\uFE0F \${esc(e.message)}</div>\`;
  } finally {
    btn.disabled = false;
    btn.textContent = '\u25B6 Run';
  }
}

function renderSqlTable(rows) {
  const cols = Object.keys(rows[0]);
  const thead = '<tr>' + cols.map(c => \`<th>\${esc(c)}</th>\`).join('') + '</tr>';
  const tbody = rows.map(r =>
    '<tr>' + cols.map(c => {
      const v = r[c];
      if (v === null || v === undefined) return '<td class="null-val">NULL</td>';
      return \`<td title="\${esc(String(v))}">\${esc(String(v))}</td>\`;
    }).join('') + '</tr>'
  ).join('');
  return \`<div class="sql-result-table-wrap"><table class="sql-result-table"><thead>\${thead}</thead><tbody>\${tbody}</tbody></table></div>\`;
}

function renderSqlHistory() {
  const el = document.getElementById('sql-history-list');
  if (!el) return;
  if (!sqlHistory.length) { el.innerHTML = '<div class="sql-empty-result" style="padding:16px">No history yet.</div>'; return; }
  el.innerHTML = sqlHistory.map((h, i) =>
    \`<div class="sql-history-item" onclick="loadFromHistory(\${i})" title="\${esc(h)}">\${esc(h)}</div>\`
  ).join('');
}

function loadFromHistory(i) {
  document.getElementById('sql-editor').value = sqlHistory[i];
}

function clearSqlHistory() {
  sqlHistory = [];
  localStorage.removeItem('admin_sql_history');
  renderSqlHistory();
}

// Ctrl+Enter to run SQL
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const active = document.querySelector('.tab.active');
    if (active && active.id === 'tab-sql') runSql();
  }
});

/* ==== HELPERS ====================================== */
function renderPagination(ns, current, total) {
  const el = document.getElementById(ns + '-pagination');
  if (total <= 1) { el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += \`<button class="page-btn\${i===current?' active':''}" onclick="goPage('\${ns}',\${i})">\${i}</button>\`;
  }
  el.innerHTML = html;
}

function goPage(ns, p) {
  if (ns === 'pages') { pagesPage = p; loadPages(); }
  else if (ns === 'prompts') { promptsPage = p; loadPrompts(); }
}

function fmtDate(s) {
  if (!s) return '\u2014';
  return new Date(s).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function autoSlug(input) {
  const slugEl = document.getElementById('page-slug');
  if (slugEl && !slugEl.dataset.manual) slugEl.value = slugify(input.value);
}

function parseTagsDisplay(v) {
  if (!v) return [];
  try { const arr = JSON.parse(v); return Array.isArray(arr) ? arr : []; } catch { return []; }
}

function handleTagKey(e, wrapId) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (!val) return;
    const wrap = document.getElementById(wrapId);
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = esc(val) + '<button type="button" onclick="removeTag(this)">\xD7</button>';
    wrap.insertBefore(chip, e.target);
    e.target.value = '';
    syncTagsFromWrap(wrapId);
  }
}

function removeTag(btn) {
  const chip = btn.parentElement;
  const wrap = chip.parentElement;
  chip.remove();
  syncTagsFromWrap(wrap.id);
}

function syncTagsFromWrap(wrapId) {
  const hiddenId = wrapId === 'tags-wrap' ? 'tags-hidden' : wrapId === 'related-wrap' ? 'related-hidden' : 'ptags-hidden';
  syncTags(wrapId, hiddenId);
}

function syncTags(wrapId, hiddenId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const chips = [...wrap.querySelectorAll('.tag-chip')].map(c => c.textContent.replace('\xD7','').trim());
  const hidden = document.getElementById(hiddenId);
  if (hidden) hidden.value = JSON.stringify(chips);
}

let pagesListCache = [];
async function loadPagesDropdown() {
  try {
    pagesListCache = await api('/pages-list');
    const sel = document.getElementById('prompts-page-filter');
    pagesListCache.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.title;
      sel.appendChild(o);
    });
  } catch {}
}

function loadPagesInSelect(selectId, selectedId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Select page\u2026</option>';
  pagesListCache.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.title;
    if (p.id === selectedId) o.selected = true;
    sel.appendChild(o);
  });
}

async function loadCatDatalist() {
  try {
    const cats = await api('/categories');
    const dl = document.getElementById('cat-datalist');
    if (dl) cats.forEach(c => { const o = document.createElement('option'); o.value = c.slug; dl.appendChild(o); });
  } catch {}
}
`;

// src/handlers/admin-api.js
function json(data, status = 200) {
  const headers = {
    "content-type": "application/json;charset=UTF-8",
    "Cache-Control": "no-store, no-cache",
    "X-Content-Type-Options": "nosniff"
  };
  return new Response(JSON.stringify(data), { status, headers });
}
__name(json, "json");
function encodeContent(html) {
  try {
    const bytes = new TextEncoder().encode(html || "");
    let bin = "";
    bytes.forEach((b) => bin += String.fromCharCode(b));
    return btoa(bin);
  } catch {
    return btoa(unescape(encodeURIComponent(html || "")));
  }
}
__name(encodeContent, "encodeContent");
function decodeContent(b64) {
  if (!b64) return "";
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
  } catch {
    return b64;
  }
}
__name(decodeContent, "decodeContent");
function wordCount(html) {
  return (html || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
}
__name(wordCount, "wordCount");
async function handleAdminApi(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "Allow": "GET, POST, PUT, DELETE, OPTIONS" }
    });
  }
  const session = await verifyAdminSession(request, env);
  if (!session) return json({ error: "Unauthorized" }, 401);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  if (path === "/admin/api/stats" && method === "GET")
    return getStats(env);
  if (path === "/admin/api/pages") {
    if (method === "GET") return listPages(request, env);
    if (method === "POST") return createPage(request, env);
  }
  const pm = path.match(/^\/admin\/api\/pages\/(\d+)$/);
  if (pm) {
    const id = parseInt(pm[1]);
    if (method === "GET") return getPage(id, env);
    if (method === "PUT") return updatePage(id, request, env);
    if (method === "DELETE") return deletePage(id, env);
  }
  if (path === "/admin/api/pages/bulk-delete" && method === "POST")
    return bulkDeletePages(request, env);
  if (path === "/admin/api/categories") {
    if (method === "GET") return listCategories(env);
    if (method === "POST") return createCategory(request, env);
  }
  const cm = path.match(/^\/admin\/api\/categories\/(\d+)$/);
  if (cm) {
    const id = parseInt(cm[1]);
    if (method === "PUT") return updateCategory(id, request, env);
    if (method === "DELETE") return deleteCategory(id, env);
  }
  if (path === "/admin/api/prompts") {
    if (method === "GET") return listPrompts(request, env);
    if (method === "POST") return createPrompt(request, env);
  }
  const prm = path.match(/^\/admin\/api\/prompts\/(\d+)$/);
  if (prm) {
    const id = parseInt(prm[1]);
    if (method === "GET") return getPrompt(id, env);
    if (method === "PUT") return updatePrompt(id, request, env);
    if (method === "DELETE") return deletePrompt(id, env);
  }
  if (path === "/admin/api/pages-list" && method === "GET")
    return getPagesList(env);
  if (path === "/admin/api/sql" && method === "POST")
    return executeSql(request, env);
  return json({ error: "Not Found" }, 404);
}
__name(handleAdminApi, "handleAdminApi");
async function getStats(env) {
  try {
    const [ps, cc, pc, rc] = await Promise.all([
      env.DB.prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) AS published,
          SUM(CASE WHEN status='draft'     THEN 1 ELSE 0 END) AS draft,
          SUM(CASE WHEN status='archived'  THEN 1 ELSE 0 END) AS archived,
          SUM(word_count) AS total_words
        FROM pages
      `).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM categories").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM prompts").first(),
      env.DB.prepare(`
        SELECT category, COUNT(*) AS cnt FROM pages
        WHERE status='published' GROUP BY category ORDER BY cnt DESC LIMIT 8
      `).all()
    ]);
    return json({
      pages: ps || {},
      categories: cc?.count ?? 0,
      prompts: pc?.count ?? 0,
      topCats: rc?.results || []
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(getStats, "getStats");
async function listPages(request, env) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = (url.searchParams.get("search") || "").trim();
  const status = (url.searchParams.get("status") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];
  if (search) {
    where.push("(title LIKE ? OR slug LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  if (category) {
    where.push("category = ?");
    params.push(category);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  try {
    const [tot, rows] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS count FROM pages ${w}`).bind(...params).first(),
      env.DB.prepare(
        `SELECT id, slug, title, description, category, status, word_count, created_at, updated_at
         FROM pages ${w}
         ORDER BY updated_at DESC
         LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all()
    ]);
    return json({
      data: rows.results || [],
      total: tot?.count ?? 0,
      page,
      limit,
      pages: Math.ceil((tot?.count ?? 0) / limit)
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(listPages, "listPages");
async function getPage(id, env) {
  try {
    const row = await env.DB.prepare("SELECT * FROM pages WHERE id = ?").bind(id).first();
    if (!row) return json({ error: "Not found" }, 404);
    return json({ ...row, content: decodeContent(row.content) });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(getPage, "getPage");
async function createPage(request, env) {
  try {
    const b = await request.json();
    const {
      slug,
      title,
      description = "",
      category = "",
      tags = "[]",
      content = "",
      status = "draft",
      related = "[]"
    } = b;
    if (!slug || !title) return json({ error: "slug and title are required" }, 400);
    if (!/^[a-z0-9-]+$/.test(slug)) return json({ error: "Slug must be lowercase letters, numbers and hyphens only" }, 400);
    const enc = encodeContent(content);
    const wc = wordCount(content);
    const r = await env.DB.prepare(
      `INSERT INTO pages (slug, title, description, category, tags, content, status, related, word_count)
       VALUES (?,?,?,?,?,?,?,?,?)`
    ).bind(slug, title, description, category, tags, enc, status, related, wc).run();
    return json({ success: true, id: r.meta?.last_row_id }, 201);
  } catch (err) {
    if (err.message?.includes("UNIQUE")) return json({ error: "A page with that slug already exists" }, 409);
    return json({ error: err.message }, 500);
  }
}
__name(createPage, "createPage");
async function updatePage(id, request, env) {
  try {
    const b = await request.json();
    const {
      slug,
      title,
      description = "",
      category = "",
      tags = "[]",
      content = "",
      status = "draft",
      related = "[]"
    } = b;
    if (!slug || !title) return json({ error: "slug and title are required" }, 400);
    const enc = encodeContent(content);
    const wc = wordCount(content);
    await env.DB.prepare(
      `UPDATE pages
       SET slug=?, title=?, description=?, category=?, tags=?, content=?, status=?, related=?, word_count=?
       WHERE id=?`
    ).bind(slug, title, description, category, tags, enc, status, related, wc, id).run();
    return json({ success: true });
  } catch (err) {
    if (err.message?.includes("UNIQUE")) return json({ error: "A page with that slug already exists" }, 409);
    return json({ error: err.message }, 500);
  }
}
__name(updatePage, "updatePage");
async function deletePage(id, env) {
  try {
    await env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(id).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(deletePage, "deletePage");
async function bulkDeletePages(request, env) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) return json({ error: "ids array required" }, 400);
    const placeholders = ids.map(() => "?").join(",");
    await env.DB.prepare(`DELETE FROM pages WHERE id IN (${placeholders})`).bind(...ids).run();
    return json({ success: true, deleted: ids.length });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(bulkDeletePages, "bulkDeletePages");
async function getPagesList(env) {
  try {
    const r = await env.DB.prepare("SELECT id, title, slug FROM pages ORDER BY title ASC").all();
    return json(r.results || []);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(getPagesList, "getPagesList");
async function listCategories(env) {
  try {
    const r = await env.DB.prepare("SELECT * FROM categories ORDER BY position ASC, name ASC").all();
    return json(r.results || []);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(listCategories, "listCategories");
async function createCategory(request, env) {
  try {
    const b = await request.json();
    const { slug, name, description = "", position = 0 } = b;
    if (!slug || !name) return json({ error: "slug and name are required" }, 400);
    if (!/^[a-z0-9-]+$/.test(slug)) return json({ error: "Slug must be lowercase letters, numbers and hyphens only" }, 400);
    const r = await env.DB.prepare(
      "INSERT INTO categories (slug, name, description, position) VALUES (?,?,?,?)"
    ).bind(slug, name, description, position).run();
    return json({ success: true, id: r.meta?.last_row_id }, 201);
  } catch (err) {
    if (err.message?.includes("UNIQUE")) return json({ error: "Category slug already exists" }, 409);
    return json({ error: err.message }, 500);
  }
}
__name(createCategory, "createCategory");
async function updateCategory(id, request, env) {
  try {
    const b = await request.json();
    const { slug, name, description = "", position = 0 } = b;
    if (!slug || !name) return json({ error: "slug and name are required" }, 400);
    await env.DB.prepare(
      "UPDATE categories SET slug=?, name=?, description=?, position=? WHERE id=?"
    ).bind(slug, name, description, position, id).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(updateCategory, "updateCategory");
async function deleteCategory(id, env) {
  try {
    await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(deleteCategory, "deleteCategory");
async function listPrompts(request, env) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = (url.searchParams.get("search") || "").trim();
  const page_id = (url.searchParams.get("page_id") || "").trim();
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];
  if (page_id) {
    where.push("p.page_id = ?");
    params.push(parseInt(page_id));
  }
  if (search) {
    where.push("(p.title LIKE ? OR p.body LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  try {
    const [tot, rows] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS count FROM prompts p ${w}`).bind(...params).first(),
      env.DB.prepare(
        `SELECT p.*, pg.title AS page_title, pg.slug AS page_slug
         FROM prompts p
         LEFT JOIN pages pg ON p.page_id = pg.id
         ${w}
         ORDER BY p.page_id ASC, p.position ASC, p.id ASC
         LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all()
    ]);
    return json({
      data: rows.results || [],
      total: tot?.count ?? 0,
      page,
      limit,
      pages: Math.ceil((tot?.count ?? 0) / limit)
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(listPrompts, "listPrompts");
async function getPrompt(id, env) {
  try {
    const r = await env.DB.prepare("SELECT * FROM prompts WHERE id = ?").bind(id).first();
    if (!r) return json({ error: "Not found" }, 404);
    return json(r);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(getPrompt, "getPrompt");
async function createPrompt(request, env) {
  try {
    const b = await request.json();
    const { page_id, title = "", body, tags = "[]", position = 0 } = b;
    if (!page_id || !body) return json({ error: "page_id and body are required" }, 400);
    const r = await env.DB.prepare(
      "INSERT INTO prompts (page_id, title, body, tags, position) VALUES (?,?,?,?,?)"
    ).bind(parseInt(page_id), title, body, tags, position).run();
    return json({ success: true, id: r.meta?.last_row_id }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(createPrompt, "createPrompt");
async function updatePrompt(id, request, env) {
  try {
    const b = await request.json();
    const { page_id, title = "", body, tags = "[]", position = 0 } = b;
    if (!page_id || !body) return json({ error: "page_id and body are required" }, 400);
    await env.DB.prepare(
      "UPDATE prompts SET page_id=?, title=?, body=?, tags=?, position=? WHERE id=?"
    ).bind(parseInt(page_id), title, body, tags, position, id).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(updatePrompt, "updatePrompt");
async function deletePrompt(id, env) {
  try {
    await env.DB.prepare("DELETE FROM prompts WHERE id = ?").bind(id).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(deletePrompt, "deletePrompt");
async function executeSql(request, env) {
  try {
    const body = await request.json();
    const sql = (body.sql || "").trim();
    if (!sql) return json({ error: "sql is required" }, 400);
    const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN|WITH)/i.test(sql);
    if (isSelect) {
      const result = await env.DB.prepare(sql).all();
      return json({
        results: result.results || [],
        rowsAffected: null,
        duration: result.meta?.duration ?? null
      });
    } else {
      const result = await env.DB.prepare(sql).run();
      return json({
        results: [],
        rowsAffected: result.meta?.changes ?? 0,
        lastInsertId: result.meta?.last_row_id ?? null,
        duration: result.meta?.duration ?? null
      });
    }
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(executeSql, "executeSql");

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (err) {
      console.error(JSON.stringify({
        event: "UNHANDLED_ERROR",
        message: err.message,
        stack: err.stack,
        url: request.url,
        ts: (/* @__PURE__ */ new Date()).toISOString()
      }));
      return errorResponse(500, "Internal Server Error");
    }
  }
};
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  let hostname = url.hostname;
  let protocol = url.protocol;
  let pathname = path;
  let needsRedirect = false;
  if (protocol === "http:" && hostname !== "localhost" && hostname !== "127.0.0.1") {
    protocol = "https:";
    needsRedirect = true;
  }
  if (hostname.startsWith("www.")) {
    hostname = hostname.replace("www.", "");
    needsRedirect = true;
  }
  if (pathname.endsWith("index.html")) {
    pathname = pathname.replace(/\/index\.html$/, "");
    if (pathname === "") pathname = "/";
    needsRedirect = true;
  } else if (pathname.endsWith(".html")) {
    pathname = pathname.replace(/\.html$/, "");
    needsRedirect = true;
  }
  if (pathname.endsWith("/index")) {
    pathname = pathname.replace(/\/index$/, "");
    if (pathname === "") pathname = "/";
    needsRedirect = true;
  }
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
    needsRedirect = true;
  }
  if (needsRedirect) {
    const redirectUrl = `${protocol}//${hostname}${pathname}${url.search}`;
    return Response.redirect(redirectUrl, 301);
  }
  if (path.startsWith("/assets") || path.startsWith("/images") || path.match(/\.(css|js|png|jpg|jpeg|svg|webp|gif|ico|woff2|woff|ttf)$/)) {
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return errorResponse(404, "Asset not found");
  }
  if (path === "/robots.txt") {
    return new Response(
      `User-agent: *
Allow: /

Sitemap: https://promptimagelab.com/sitemap.xml
`,
      { headers: secureHeaders({ "content-type": "text/plain" }) }
    );
  }
  if (path.startsWith("/admin/api/")) return handleAdminApi(request, env);
  if (path.startsWith("/admin")) return handleAdmin(request);
  if (path === "/sitemap.xml") return await serveSitemap(request, env, ctx);
  if (path === "/search.json") return await serveSearchJson(request, env, ctx);
  if (path === "/search") return serveSearchPage();
  if (path === "/prompts-hub") return servePromptsHub();
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;
  let slug = path.replace(/^\/+/, "").replace(/\/+$/, "") || "index";
  let page;
  try {
    page = await env.DB.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first();
  } catch (err) {
    console.error(JSON.stringify({ event: "DB_ERROR", slug, message: err.message, ts: (/* @__PURE__ */ new Date()).toISOString() }));
    return errorResponse(500, "Database error");
  }
  if (page) {
    let bodyContent = "";
    try {
      bodyContent = new TextDecoder().decode(
        Uint8Array.from(atob(page.content), (c) => c.charCodeAt(0))
      );
    } catch {
      bodyContent = page.content || "";
    }
    bodyContent = stripStoredChrome(bodyContent);
    const isPromptPage = isPrompt(slug);
    const cssFile = isPromptPage ? "/prompt.css" : "/style.css";
    const relatedHTML = await getRelatedHTML(slug, request, env, ctx);
    const ldJson = buildLdJson(page, slug);
    const html = buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile });
    const response = new Response(html, {
      status: 200,
      headers: secureHeaders({
        "content-type": "text/html;charset=UTF-8",
        "Cache-Control": "public, max-age=86400, s-maxage=604800"
      })
    });
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  }
  return new Response(build404HTML(), {
    status: 404,
    headers: secureHeaders({ "content-type": "text/html;charset=UTF-8" })
  });
}
__name(handleRequest, "handleRequest");

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-sG31MH/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-sG31MH/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
