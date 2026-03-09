// _layout.js — full SEO + AdSense + Analytics layout

const ADSENSE_ID = 'ca-pub-6771008610152378';
const GA_ID = 'G-MGTDGLQPSH';

export function layout({ title, description, canonical, robots = 'index, follow', content, jsonLd = [], noAds = false, image = '' }) {
  const ogImage = image || 'https://promptimagelab.com/assets/images/og-default.jpg';

  const ldScripts = jsonLd.map(obj =>
    `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
  ).join('\n');

  const adUnit = noAds ? '' : `
<div class="ad-container" aria-hidden="true">
  <div class="ad-label">Advertisement</div>
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="${ADSENSE_ID}"
    data-ad-slot="auto"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
  <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<!-- Primary Meta -->
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="PromptImageLab">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${ogImage}">

<!-- Additional SEO -->
<meta name="author" content="PromptImageLab">
<meta name="theme-color" content="#38bdf8">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/images/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">

<!-- Performance: Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>

<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}" crossorigin="anonymous"></script>

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}',{page_path:'${canonical}'});
</script>

<!-- Stylesheet -->
<link rel="stylesheet" href="/assets/css/theme.css">

<!-- Structured Data -->
${ldScripts}
</head>
<body>

<!-- Skip to content (accessibility) -->
<a href="#main-content" class="visually-hidden" style="position:absolute;top:8px;left:8px;z-index:9999;background:var(--primary);color:#000;padding:8px 16px;border-radius:6px;font-weight:700;">Skip to content</a>

<!-- Navigation -->
<nav class="site-nav" role="navigation" aria-label="Main navigation">
<div class="container nav-inner">
  <a class="logo" href="/" aria-label="PromptImageLab - Home">
    <img src="/assets/images/logo.png" alt="PromptImageLab logo" width="28" height="28" loading="eager">
    Prompt<span>ImageLab</span>
  </a>
  <button class="nav-toggle" onclick="document.querySelector('.nav-links').classList.toggle('open')" aria-label="Toggle navigation" aria-expanded="false">☰</button>
  <ul class="nav-links" role="list">
    <li><a href="/">Home</a></li>
    <li><a href="/prompts">Prompts</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/privacy-policy">Privacy</a></li>
  </ul>
</div>
</nav>

<!-- Top Ad -->
${adUnit}

<!-- Main Content -->
<main id="main-content" tabindex="-1">
${content}
</main>

<!-- Mid-page Ad -->
${adUnit}

<!-- Footer -->
<footer class="site-footer" role="contentinfo">
<div class="container">
<div class="footer-grid">
  <div class="footer-col">
    <h3>PromptImageLab</h3>
    <p class="tagline">The largest curated AI image prompt library for Midjourney, Stable Diffusion, Leonardo AI and DALL·E.</p>
  </div>
  <div class="footer-col">
    <h4>Popular Prompts</h4>
    <ul>
      <li><a href="/ai-profile-picture-prompts">AI Profile Pictures</a></li>
      <li><a href="/whatsapp-dp-ai-prompts">WhatsApp DP</a></li>
      <li><a href="/instagram-dp-ai-prompts">Instagram DP</a></li>
      <li><a href="/linkedin-profile-picture-prompts">LinkedIn Headshots</a></li>
      <li><a href="/studio-lighting-portrait-prompts">Studio Lighting</a></li>
    </ul>
  </div>
  <div class="footer-col">
    <h4>More Prompts</h4>
    <ul>
      <li><a href="/ceo-style-portrait-prompts">CEO Style Portraits</a></li>
      <li><a href="/corporate-portrait-prompts">Corporate Portraits</a></li>
      <li><a href="/resume-photo-prompts">Resume Photos</a></li>
      <li><a href="/valentine-ai-image-prompts">Valentine Images</a></li>
      <li><a href="/prompts">All Categories →</a></li>
    </ul>
  </div>
  <div class="footer-col">
    <h4>Site</h4>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/prompts">Prompt Library</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
      <li><a href="/privacy-policy">Privacy Policy</a></li>
      <li><a href="/terms-of-service">Terms of Service</a></li>
      <li><a href="/disclaimer">Disclaimer</a></li>
    </ul>
  </div>
</div>
<div class="footer-bottom">
  <p>© ${new Date().getFullYear()} PromptImageLab · All rights reserved</p>
  <p>
    <a href="/privacy-policy">Privacy</a> ·
    <a href="/terms-of-service">Terms</a> ·
    <a href="/disclaimer">Disclaimer</a> ·
    <a href="/sitemap.xml">Sitemap</a>
  </p>
</div>
</div>
</footer>

<!-- Copy Prompt Toast -->
<div class="toast-notification" id="copy-toast" role="status" aria-live="polite">✓ Prompt copied!</div>

<!-- Scripts -->
<script>
// Copy to clipboard
function copyPrompt(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); toast.classList.remove('show'); }, 2500);
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

// Mobile nav close on outside click
document.addEventListener('click', e => {
  const nav = document.querySelector('.nav-links');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});
</script>
</body>
</html>`;
}

// Org schema — used on every page
export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'PromptImageLab',
  'url': 'https://promptimagelab.com',
  'logo': 'https://promptimagelab.com/assets/images/logo.png',
  'sameAs': []
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'PromptImageLab',
  'url': 'https://promptimagelab.com',
  'description': 'Curated AI image prompt library for Midjourney, Stable Diffusion and Leonardo AI.',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://promptimagelab.com/prompts?q={search_term_string}' },
    'query-input': 'required name=search_term_string'
  }
};

export function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}
