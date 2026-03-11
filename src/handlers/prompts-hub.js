/* ============================================================
   PromptImageLab — Prompts Hub Handler
   GET /prompts-hub → Full prompts directory with live search
   ============================================================ */

import { esc, secureHeaders } from '../lib/helpers.js'

export function servePromptsHub() {

  const html = `<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index, follow">

  <title>Prompts Hub — All AI Image Prompts | PromptImageLab</title>
  <meta name="description" content="Browse and search all AI image prompts for Midjourney, DALL-E, Stable Diffusion and more. Filter by category and find the perfect prompt instantly.">
  <link rel="canonical" href="https://promptimagelab.com/prompts-hub">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://promptimagelab.com/prompts-hub">
  <meta property="og:title"       content="Prompts Hub — All AI Image Prompts | PromptImageLab">
  <meta property="og:description" content="Browse all curated AI image prompts. Filter by category and search instantly.">
  <meta property="og:image"       content="https://promptimagelab.com/images/og-default.png">
  <meta property="og:site_name"   content="PromptImageLab">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Prompts Hub — All AI Image Prompts | PromptImageLab">
  <meta name="twitter:description" content="Browse all curated AI image prompts.">
  <meta name="twitter:image"       content="https://promptimagelab.com/images/og-default.png">

  <link rel="preload" href="/style.css" as="style">
  <link rel="stylesheet" href="/style.css">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MGTDGLQPSH');
  </script>

  <style>
    /* ============================================================
       Prompts Hub — Page-specific styles
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
            placeholder="Search prompts — e.g. anime, portrait, cyberpunk…"
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
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
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
        </div>`).join('')}
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


  <script src="/script.js" defer></script>

  <script>
  /* ============================================================
     Prompts Hub — client-side logic
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
            var slug = (p.url || '').replace(/^\\//, '');
            return staticSlugs.indexOf(slug) === -1;
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

      var order = ['all'].concat(
        Object.keys(cats).filter(function (k) { return k !== 'all'; }).sort()
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
        return '<a class="hub-card" href="' + esc(p.url) + '" role="listitem">' +
               '<span class="hub-card-cat">' + esc(p.category || 'general') + '</span>' +
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
        if (p === '…') {
          html += '<span style="padding:0 4px;color:var(--muted);">…</span>';
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
      if (cur <= 4) return [1,2,3,4,5,'…',total];
      if (cur >= total - 3) return [1,'…',total-4,total-3,total-2,total-1,total];
      return [1,'…',cur-1,cur,cur+1,'…',total];
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
      return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
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
  </script>

</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: secureHeaders({
      'content-type' : 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    })
  })

}
