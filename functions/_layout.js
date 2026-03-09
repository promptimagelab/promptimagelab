// _layout.js — shared HTML wrapper (replaces PHP header/footer includes)

export function layout({ title, description, canonical, robots = 'index, follow', content, jsonLd = [] }) {
  const ldScripts = jsonLd.map(obj =>
    `<script type="application/ld+json">${JSON.stringify(obj, null, 2)}</script>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="preconnect" href="https://www.google-analytics.com" crossorigin>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6771008610152378" crossorigin="anonymous"></script>

<script async src="https://www.googletagmanager.com/gtag/js?id=G-MGTDGLQPSH"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-MGTDGLQPSH');
</script>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">

<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="PromptImageLab">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">

<link rel="stylesheet" href="/assets/css/theme.css">
</head>
<body>

<nav class="site-nav">
<div class="container nav-inner">
<a class="logo" href="/">PromptImageLab</a>
<ul class="nav-links">
  <li><a href="/">Home</a></li>
  <li><a href="/prompts">Prompts</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
  <li><a href="/privacy-policy">Privacy</a></li>
</ul>
</div>
</nav>

${content}

<footer class="site-footer">
<div class="container footer-grid">
<div class="footer-col">
  <h3>PromptImageLab</h3>
  <p>AI prompt library for Midjourney and Stable Diffusion.</p>
</div>
<div class="footer-col">
  <h4>Popular Prompts</h4>
  <ul>
    <li><a href="/ai-profile-picture-prompts">AI Profile Picture</a></li>
    <li><a href="/whatsapp-dp-ai-prompts">WhatsApp DP</a></li>
    <li><a href="/instagram-dp-ai-prompts">Instagram DP</a></li>
    <li><a href="/linkedin-profile-picture-prompts">LinkedIn Headshots</a></li>
  </ul>
</div>
<div class="footer-col">
  <h4>Site Links</h4>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/prompts">Prompts</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/privacy-policy">Privacy Policy</a></li>
    <li><a href="/terms-of-service">Terms of Service</a></li>
    <li><a href="/disclaimer">Disclaimer</a></li>
  </ul>
</div>
</div>
<div class="footer-bottom">
  <p>© 2026 PromptImageLab ·
    <a href="/privacy-policy">Privacy Policy</a> ·
    <a href="/terms-of-service">Terms of Service</a> ·
    <a href="/disclaimer">Disclaimer</a>
  </p>
</div>
</footer>

<style>
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;}
.footer-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:60px;align-items:start;}
.footer-col{min-width:0;}
.footer-col h3,.footer-col h4{margin-bottom:14px;color:var(--text);font-weight:700;}
.footer-col p{color:var(--muted);font-size:.95rem;line-height:1.7;}
.footer-col ul{list-style:none;padding:0;margin:0;}
.footer-col ul li{margin-bottom:8px;}
.footer-col a{color:var(--muted);text-decoration:none;transition:.2s;}
.footer-col a:hover{color:var(--primary);}
.footer-bottom{border-top:1px solid var(--border);margin-top:40px;padding-top:20px;text-align:center;color:var(--muted);font-size:.9rem;}
@media(max-width:768px){.footer-grid{grid-template-columns:1fr;gap:30px;}}
</style>

${ldScripts}
</body>
</html>`;
}
