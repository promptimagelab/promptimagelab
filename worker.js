/* ============================================================
   PromptImageLab — Cloudflare Worker
   PromptImageLab.com
   ============================================================ */

export default {

  async fetch(request, env, ctx) {

    try {
      return await handleRequest(request, env, ctx)
    } catch (err) {
      console.error(JSON.stringify({
        event: 'UNHANDLED_ERROR',
        message: err.message,
        stack: err.stack,
        url: request.url,
        ts: new Date().toISOString()
      }))
      return errorResponse(500, 'Internal Server Error')
    }

  }

}


/* ----------------------------------------------------------------
   MAIN HANDLER
   ---------------------------------------------------------------- */

async function handleRequest(request, env, ctx) {

  const url  = new URL(request.url)
  const path = url.pathname


  /* ---- Static assets ------------------------------------------ */

  if (
    path.startsWith('/assets') ||
    path.startsWith('/images') ||
    path.match(/\.(css|js|png|jpg|jpeg|svg|webp|gif|ico|woff2|woff|ttf)$/)
  ) {
    if (env.ASSETS) return env.ASSETS.fetch(request)
    return errorResponse(404, 'Asset not found')
  }


  /* ---- robots.txt --------------------------------------------- */

  if (path === '/robots.txt') {
    return new Response(
      `User-agent: *\nAllow: /\n\nSitemap: https://promptimagelab.com/sitemap.xml\n`,
      { headers: secureHeaders({ 'content-type': 'text/plain' }) }
    )
  }


  /* ---- sitemap.xml -------------------------------------------- */

  if (path === '/sitemap.xml') {
    return await serveSitemap(request, env, ctx)
  }


  /* ---- Prompts Hub -------------------------------------------- */

  if (path === '/prompts-hub') {
    /* Handled by src/handlers/prompts-hub.js in src/index.js */
    return Response.redirect('https://promptimagelab.com/prompts-hub', 302)
  }


  /* ---- Edge cache --------------------------------------------- */

  const cache  = caches.default
  const cached = await cache.match(request)
  if (cached) return cached


  /* ---- Slug resolution ---------------------------------------- */

  let slug = path.replace(/^\/+/, '').replace(/\/+$/, '') || 'index'


  /* ---- Fetch page from D1 ------------------------------------- */

  let page
  try {
    page = await env.DB
      .prepare('SELECT * FROM pages WHERE slug = ?')
      .bind(slug)
      .first()
  } catch (err) {
    console.error(JSON.stringify({ event: 'DB_ERROR', slug, message: err.message, ts: new Date().toISOString() }))
    return errorResponse(500, 'Database error')
  }


  /* ---- Page found --------------------------------------------- */

  if (page) {

    /* Decode Base64 content */
    let bodyContent = ''
    try {
      bodyContent = new TextDecoder().decode(
        Uint8Array.from(atob(page.content), c => c.charCodeAt(0))
      )
    } catch {
      bodyContent = page.content || ''
    }

    /* Strip duplicate <nav>, <header>, <footer> from stored content
       so the Worker-injected chrome is the only one rendered        */
    bodyContent = stripStoredChrome(bodyContent)

    /* CSS selection by category ---------------------------------- */
    const isPromptPage = isPrompt(slug)
    const cssFile      = isPromptPage ? '/assets/prompt.css' : '/assets/style.css'

    /* Related pages (cached separately per slug) ----------------- */
    const relatedHTML = await getRelatedHTML(slug, request, env, ctx)

    /* Structured data ------------------------------------------- */
    const ldJson = buildLdJson(page, slug)

    /* Full HTML response ---------------------------------------- */
    const html = buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile })

    const response = new Response(html, {
      status: 200,
      headers: secureHeaders({
        'content-type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800'
      })
    })

    ctx.waitUntil(cache.put(request, response.clone()))
    return response

  }


  /* ---- 404 ---------------------------------------------------- */

  return build404()

}


/* ================================================================
   SITEMAP
   ================================================================ */

async function serveSitemap(request, env, ctx) {

  const cache  = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  let pages = []
  try {
    const result = await env.DB
      .prepare('SELECT slug, updated_at, created_at FROM pages WHERE status IS NULL OR status = ?')
      .bind('published')
      .all()
    pages = result.results || []
  } catch {
    const result = await env.DB.prepare('SELECT slug FROM pages').all()
    pages = result.results || []
  }

  const urls = pages.map(p => {
    const lastmod = (p.updated_at || p.created_at || '').substring(0, 10) || new Date().toISOString().substring(0, 10)
    const priority = p.slug === 'index' ? '1.0' : '0.8'
    return `
  <url>
    <loc>https://promptimagelab.com/${p.slug === 'index' ? '' : p.slug}</loc>
    <lastmod>${esc(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://promptimagelab.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
${urls}
</urlset>`

  const response = new Response(xml, {
    headers: secureHeaders({
      'content-type': 'application/xml;charset=UTF-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    })
  })

  ctx.waitUntil(cache.put(request, response.clone()))
  return response

}


/* ================================================================
   RELATED PAGES — cached per slug to avoid RANDOM() on every req
   ================================================================ */

async function getRelatedHTML(slug, request, env, ctx) {

  const cacheKey = new Request(`https://promptimagelab.com/__related__/${slug}`)
  const cache    = caches.default
  const cached   = await cache.match(cacheKey)

  if (cached) {
    return await cached.text()
  }

  let related = []
  try {
    /* Prefer pre-computed related slugs stored in the `related` JSON column.
       Falls back to RANDOM() only when the column is NULL or empty.
       Pre-populate the `related` column at publish time for best performance. */
    const currentPage = await env.DB
      .prepare('SELECT related FROM pages WHERE slug = ?')
      .bind(slug)
      .first()

    const precomputed = currentPage?.related
    if (precomputed) {
      let relatedSlugs = []
      try { relatedSlugs = JSON.parse(precomputed) } catch { /* ignore */ }
      if (relatedSlugs.length > 0) {
        const placeholders = relatedSlugs.map(() => '?').join(',')
        const stmt = env.DB.prepare(
          `SELECT slug, title FROM pages WHERE slug IN (${placeholders}) LIMIT 6`
        )
        const bound = stmt.bind(...relatedSlugs)
        const res   = await bound.all()
        related = res.results || []
      }
    }

    /* Fallback: RANDOM() scan (acceptable for pages without pre-computed data) */
    if (related.length === 0) {
      const result = await env.DB
        .prepare('SELECT slug, title FROM pages WHERE slug != ? ORDER BY RANDOM() LIMIT 6')
        .bind(slug)
        .all()
      related = result.results || []
    }
  } catch {
    related = []
  }

  const html = related.map(p => `
    <li>
      <a href="/${esc(p.slug)}">${esc(p.title)}</a>
    </li>`
  ).join('')

  /* Cache related pages for 6 hours — long enough to avoid thrashing,
     short enough to rotate content regularly                          */
  ctx.waitUntil(
    cache.put(
      cacheKey,
      new Response(html, {
        headers: { 'content-type': 'text/html', 'Cache-Control': 'public, max-age=21600' }
      })
    )
  )

  return html

}


/* ================================================================
   HTML BUILDER
   ================================================================ */

function buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile }) {

  const canonicalUrl = `https://promptimagelab.com/${slug === 'index' ? '' : slug}`
  const ogImage      = `https://promptimagelab.com/images/og-default.png`

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
  <script type="application/ld+json">${ldJson}</script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGTDGLQPSH');
  </script>

  <!-- Google AdSense -->
  <!-- ⚠️  REPLACE ca-pub-XXXXXXXX with your real AdSense Publisher ID from:
       https://www.google.com/adsense → Account → Account information -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossorigin="anonymous"></script>

</head>

<body>

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
  </nav>


  <!-- ===== MAIN CONTENT ===== -->
  <main id="main" role="main">

    <div class="container">
      ${bodyContent}
    </div>

    <!-- Related Pages -->
    <section class="related-links container" aria-label="Related AI Prompt Pages">
      <h2>Related AI Prompt Pages</h2>
      <ul>${relatedHTML}</ul>
    </section>

  </main>


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
  </footer>


  <!-- ===== SCRIPTS ===== -->
  <script src="/assets/script.js" defer></script>

</body>

</html>`

}


/* ================================================================
   404 PAGE
   ================================================================ */

function build404() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>404 – Page Not Found | PromptImageLab</title>
  <link rel="stylesheet" href="/assets/style.css">
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
      <a href="/" class="btn btn-primary" style="margin-top:24px;display:inline-block;">
        Go Back Home
      </a>
    </div>
  </main>
  <script src="/assets/script.js" defer></script>
</body>
</html>`

  return new Response(html, {
    status: 404,
    headers: secureHeaders({ 'content-type': 'text/html;charset=UTF-8' })
  })
}


/* ================================================================
   ERROR RESPONSE
   ================================================================ */

function errorResponse(status, message) {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${status} Error</title></head>` +
    `<body style="font-family:sans-serif;text-align:center;padding:60px"><h1>${status}</h1><p>${esc(message)}</p>` +
    `<a href="/">Go home</a></body></html>`,
    { status, headers: secureHeaders({ 'content-type': 'text/html;charset=UTF-8' }) }
  )
}


/* ================================================================
   STRUCTURED DATA BUILDER
   ================================================================ */

function buildLdJson(page, slug) {
  const url = `https://promptimagelab.com/${slug === 'index' ? '' : slug}`
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://promptimagelab.com' },
          { '@type': 'ListItem', position: 2, name: page.title, item: url }
        ]
      },
      {
        '@type': 'WebPage',
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en',
        publisher: {
          '@type': 'Organization',
          name: 'PromptImageLab',
          url: 'https://promptimagelab.com'
        }
      }
    ]
  }
  return JSON.stringify(data)
}


/* ================================================================
   HELPERS
   ================================================================ */

/**
 * HTML-escape a value for safe interpolation into HTML attributes or text.
 */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Returns true if the slug is a prompt content page (vs static page).
 * Covers pages that ARE prompt pages but don't contain "prompt" in slug.
 */
function isPrompt(slug) {
  const staticPages = new Set(['index', 'about', 'contact', 'privacy-policy', ''])
  return !staticPages.has(slug)
}

/**
 * Strip <nav>, <header>, <footer> tags already embedded in stored HTML
 * so Worker-injected chrome doesn't double-render.
 */
function stripStoredChrome(html) {
  return html
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<a[^>]+class="skip-link"[^>]*>[\s\S]*?<\/a>/gi, '')
}

/**
 * Merge base headers with security headers.
 */
function secureHeaders(extra = {}) {
  return {
    'X-Content-Type-Options'  : 'nosniff',
    'X-Frame-Options'         : 'DENY',
    'Referrer-Policy'         : 'strict-origin-when-cross-origin',
    'Permissions-Policy'      : 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy' :
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://www.google-analytics.com; " +
      "frame-ancestors 'none';",
    ...extra
  }
}