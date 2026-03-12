/* ============================================================
   PromptImageLab — HTML Template Module
   Builds full page HTML for both content pages and 404.
   ============================================================ */

import { esc } from './helpers.js'

/* --- Shared nav fragment (injected once by the Worker) ------- */

const NAV_HTML = /* html */`
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

/* --- Shared footer fragment ----------------------------------- */

const FOOTER_HTML = /* html */`
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

/* --- Google Analytics snippet --------------------------------- */

const GA_SNIPPET = /* html */`
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGTDGLQPSH');
  </script>`

/* --- AdSense snippet ------------------------------------------ */

const ADSENSE_SNIPPET = /* html */`
  <!-- Google AdSense -->
  <!-- ⚠️  REPLACE ca-pub-XXXXXXXX with your real AdSense Publisher ID from:
       https://www.google.com/adsense → Account → Account information -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossorigin="anonymous"></script>`


/* ================================================================
   PROMPTS HUB CTA — injected only on the index (home) page
   ================================================================ */

const PROMPTS_HUB_CTA = /* html */`
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


/* ================================================================
   CONTENT PAGE TEMPLATE
   ================================================================ */

export function buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile }) {

  const cleanSlug = slug.replace(/\.html$/, '')
  const canonicalUrl = `https://promptimagelab.com/${cleanSlug === 'index' ? '' : cleanSlug}`
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

  ${GA_SNIPPET}

  ${ADSENSE_SNIPPET}

</head>

<body>

  ${NAV_HTML}


  <main id="main" role="main">

    ${bodyContent}

    ${slug === 'index' ? PROMPTS_HUB_CTA : ''}

    <!-- Related Pages -->
    <section class="related-links container" aria-label="Related AI Prompt Pages">
      <h2>Related AI Prompt Pages</h2>
      <ul>${relatedHTML}</ul>
    </section>

  </main>

  ${FOOTER_HTML}


  <!-- ===== SCRIPTS ===== -->
  <script src="/script.js" defer></script>

</body>

</html>`

}


/* ================================================================
   404 PAGE TEMPLATE
   ================================================================ */

export function build404HTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>404 – Page Not Found | PromptImageLab</title>
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
  <script src="/script.js" defer></script>
</body>
</html>`
}
