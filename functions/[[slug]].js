// functions/[[slug]].js — dynamic page handler
// Replaces all individual PHP page logic
// Handles: /about, /contact, /privacy-policy, /ai-profile-picture-prompts, etc.

import { getPage, getFaqsForPage, getPromptSetsForPage, getRelatedPages, e } from './_data.js';
import { layout } from './_layout.js';

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const slug = url.pathname.replace(/^\//, '').replace(/\/$/, '') || 'home';

  // Skip API and asset routes
  if (slug.startsWith('assets/') || slug.startsWith('api/') || slug === 'favicon.ico') {
    return ctx.next();
  }

  const page = getPage(slug);

  if (!page) {
    return new Response(notFoundHtml(), {
      status: 404,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  const faqs = getFaqsForPage(page.id);
  const promptSets = getPromptSetsForPage(page.id);
  const relatedPages = getRelatedPages(page.id);

  const canonical = `https://promptimagelab.com/${slug === 'home' ? '' : slug}`;
  const title = page.seo_title || page.title;
  const description = page.seo_description || '';

  const content = `
<main class="container py-5">

<article>
  <h1>${e(page.title)}</h1>

  ${page.intro_text ? `<div class="intro-text muted" style="font-size:1.1rem;line-height:1.8;margin-bottom:2rem;">${page.intro_text}</div>` : ''}

  ${page.what_section ? `
  <section class="mt-4">
    <h2>What Are These Prompts?</h2>
    <div>${page.what_section}</div>
  </section>` : ''}

  ${page.usage_section ? `
  <section class="mt-4">
    <h2>How to Use These Prompts</h2>
    <div>${page.usage_section}</div>
  </section>` : ''}

  ${page.tools_section ? `
  <section class="mt-4">
    <h2>Compatible AI Tools</h2>
    <div>${page.tools_section}</div>
  </section>` : ''}

  ${promptSets.length ? `
  <section class="mt-5">
    <h2>Prompt Collections</h2>
    ${promptSets.map(set => `
    <div class="prompt-set" style="margin-bottom:2rem;">
      <h3>${e(set.set_title)}</h3>
      <div class="prompt-list">
        ${set.prompts.map(p => `
        <div class="prompt-card" style="background:var(--card-bg,#f8f9fa);border:1px solid var(--border,#e9ecef);border-radius:10px;padding:16px;margin-bottom:12px;position:relative;">
          <p style="margin:0;font-family:monospace;font-size:.95rem;">${e(p.prompt_text)}</p>
          <button
            onclick="navigator.clipboard.writeText(this.dataset.prompt).then(()=>{this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)})"
            data-prompt="${e(p.prompt_text)}"
            style="position:absolute;top:12px;right:12px;background:var(--primary,#6366f1);color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:.85rem;">
            Copy
          </button>
        </div>`).join('')}
      </div>
    </div>`).join('')}
  </section>` : ''}

  ${page.examples_section ? `
  <section class="mt-4">
    <h2>Examples</h2>
    <div>${page.examples_section}</div>
  </section>` : ''}

  ${page.tips_section ? `
  <section class="mt-4">
    <h2>Tips for Better Results</h2>
    <div>${page.tips_section}</div>
  </section>` : ''}

  ${page.conclusion_section ? `
  <section class="mt-4">
    <h2>Conclusion</h2>
    <div>${page.conclusion_section}</div>
  </section>` : ''}

  ${faqs.length ? `
  <section class="mt-5">
    <h2>Frequently Asked Questions</h2>
    ${faqs.map(faq => `
    <div style="margin-bottom:20px;">
      <h3 style="font-size:1.05rem;">${e(faq.question)}</h3>
      <p class="muted">${e(faq.answer)}</p>
    </div>`).join('')}
  </section>` : ''}

  ${relatedPages.length ? `
  <section class="mt-5">
    <h2>Related Prompt Categories</h2>
    <div class="row g-4">
      ${relatedPages.map(r => `
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <h3>${e(r.title)}</h3>
          <p class="muted">${e(r.seo_description)}</p>
          <a class="btn btn-primary mt-4" href="/${e(r.slug)}">Explore</a>
        </div>
      </div>`).join('')}
    </div>
  </section>` : ''}

</article>
</main>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': page.title,
      'description': description,
      'url': canonical,
      'publisher': {
        '@type': 'Organization',
        'name': 'PromptImageLab',
        'url': 'https://promptimagelab.com'
      }
    },
    ...(faqs.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer }
      }))
    }] : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://promptimagelab.com/' },
        { '@type': 'ListItem', 'position': 2, 'name': page.title, 'item': canonical }
      ]
    }
  ];

  const html = layout({ title, description, canonical, content, jsonLd });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

function notFoundHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Page Not Found | PromptImageLab</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="/assets/css/theme.css">
</head>
<body>
<nav class="site-nav">
<div class="container nav-inner">
<a class="logo" href="/">PromptImageLab</a>
</div>
</nav>
<main class="container py-5 text-center">
  <h1>404 — Page Not Found</h1>
  <p class="muted">The page you're looking for doesn't exist.</p>
  <a href="/" class="btn btn-primary">Go Home</a>
  <a href="/prompts" class="btn btn-primary" style="margin-left:10px;">Browse Prompts</a>
</main>
</body>
</html>`;
}
