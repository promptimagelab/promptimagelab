/* ============================================================
   PromptImageLab — Search Handler
   GET /search.json  → JSON index of all published pages
   GET /search       → Full search UI page
   ============================================================ */

import { esc, secureHeaders } from '../lib/helpers.js'

/* ----------------------------------------------------------------
   1.  /search.json  — lightweight JSON index for client-side search
   ---------------------------------------------------------------- */

export async function serveSearchJson(request, env, ctx) {

  const cache  = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  let pages = []
  try {
    const result = await env.DB
      .prepare(
        `SELECT slug, title, description, category, word_count
         FROM pages
         WHERE status IS NULL OR status = 'published'
         ORDER BY updated_at DESC`
      )
      .all()
    pages = result.results || []
  } catch {
    try {
      const result = await env.DB
        .prepare('SELECT slug, title, description FROM pages')
        .all()
      pages = result.results || []
    } catch { /* silent */ }
  }

  const index = pages.map(p => ({
    slug        : p.slug,
    title       : p.title        || '',
    description : p.description  || '',
    category    : p.category     || 'general',
    words       : p.word_count   || 0,
    url         : `/${p.slug === 'index' ? '' : p.slug}`
  }))

  const json = JSON.stringify(index)

  const response = new Response(json, {
    headers: secureHeaders({
      'content-type'                 : 'application/json;charset=UTF-8',
      'Cache-Control'                : 'public, max-age=3600, s-maxage=21600',
      'Access-Control-Allow-Origin'  : '*'   /* public read-only index */
    })
  })

  ctx.waitUntil(cache.put(request, response.clone()))
  return response

}


/* ----------------------------------------------------------------
   2.  /search  — full-page search UI
   ---------------------------------------------------------------- */

export function serveSearchPage() {

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
            placeholder="e.g. anime avatar, professional headshot, landscape…"
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
        </div>`).join('')}
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


  <script src="/script.js" defer></script>

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
          ALL_PAGES = data;
          skeletonGrid.style.display = 'none';
          resultsGrid.style.display  = 'grid';
          buildCategoryPills(data);
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
        /* Text match — title, description */
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
          ? 'No results for \u201c' + q + '\u201d'
          : 'No prompts in this category yet.';
        statsEl.textContent = '';
        return;
      }

      emptyState.style.display  = 'none';
      resultsGrid.style.display = 'grid';

      statsEl.textContent = filtered.length + ' prompt' + (filtered.length !== 1 ? 's' : '') +
        (q ? ' matching \u201c' + query + '\u201d' : ' total') +
        (category !== 'all' ? ' in \u201c' + cap(category) + '\u201d' : '');

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
      /* Case-insensitive replacement — only escape the query once */
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
  </script>

</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: secureHeaders({
      'content-type'  : 'text/html;charset=UTF-8',
      'Cache-Control' : 'public, max-age=3600, s-maxage=86400'
    })
  })

}
