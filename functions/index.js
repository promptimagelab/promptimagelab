// functions/index.js — Homepage (replaces index.php)
import { getPage, getFaqs, getPromptPages, totalPrompts, totalPages, e } from './_data.js';
import { layout, orgSchema, websiteSchema, breadcrumb } from './_layout.js';

export async function onRequest(ctx) {
  const page = getPage('home');
  const faqs = page ? getFaqs(page.id) : [];
  const promptPages = getPromptPages().slice(0, 6);

  const title = page?.seo_title || 'PromptImageLab — Free AI Image Prompt Library for Midjourney & Stable Diffusion';
  const description = page?.seo_description || 'Browse 100+ curated AI image prompts for Midjourney, Stable Diffusion, Leonardo AI and DALL·E. Free prompt library for portraits, anime, landscapes and more.';
  const canonical = 'https://promptimagelab.com/';

  const content = `
<section class="hero text-center" aria-label="Hero">
<div class="container">
  <div class="tag" style="margin-bottom:16px;">🎨 Free AI Prompt Library</div>
  <h1>Generate Stunning AI Images<br>with the Perfect Prompt</h1>
  <p>Browse ${totalPrompts()}+ curated prompts for Midjourney, Stable Diffusion, Leonardo AI and DALL·E. Copy, paste, create.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/prompts" class="btn btn-primary">Browse All Prompts →</a>
    <a href="/ai-profile-picture-prompts" class="btn btn-outline">Try Portrait Prompts</a>
  </div>
  <div class="stats-row">
    <div class="stat-item"><span class="num">${totalPrompts()}+</span><span class="label">AI Prompts</span></div>
    <div class="stat-item"><span class="num">${totalPages()}+</span><span class="label">Categories</span></div>
    <div class="stat-item"><span class="num">4</span><span class="label">AI Tools Supported</span></div>
    <div class="stat-item"><span class="num">100%</span><span class="label">Free</span></div>
  </div>
</div>
</section>

<section class="container py-5" aria-label="Popular categories">
  <h2 class="text-center mb-4">Popular Prompt Categories</h2>
  <p class="text-center muted" style="margin-bottom:40px;max-width:600px;margin-left:auto;margin-right:auto;">Professionally curated prompt collections organized by use case. Each prompt is tested and optimized for best results.</p>

  <div class="row g-4">
    ${promptPages.map(p => `
    <div class="col-lg-4 col-md-6">
      <article class="card">
        <h3><a href="/${e(p.slug)}" style="color:var(--text);">${e(p.title)}</a></h3>
        <p>${e(p.seo_description)}</p>
        <a class="btn btn-primary" href="/${e(p.slug)}" aria-label="Explore ${e(p.title)}">Explore Prompts →</a>
      </article>
    </div>`).join('')}
  </div>

  <div class="text-center mt-4">
    <a href="/prompts" class="btn btn-outline">View All ${totalPages()} Categories →</a>
  </div>
</section>

${page?.what_section ? `
<section class="container py-3" aria-label="About section">
  <div class="container-sm">
    <h2>What is PromptImageLab?</h2>
    <div class="article-content" style="margin-top:16px;">${page.what_section}</div>
  </div>
</section>` : ''}

<section class="container py-5" aria-label="AI tools">
  <h2 class="text-center mb-4">Works With All Major AI Tools</h2>
  <div class="category-pills" role="list">
    <span class="pill" role="listitem">🎨 Midjourney</span>
    <span class="pill" role="listitem">⚡ Stable Diffusion</span>
    <span class="pill" role="listitem">🦁 Leonardo AI</span>
    <span class="pill" role="listitem">🤖 DALL·E</span>
    <span class="pill" role="listitem">🔥 Adobe Firefly</span>
    <span class="pill" role="listitem">✨ Ideogram</span>
  </div>
</section>

${faqs.length ? `
<section class="container py-3" aria-label="FAQ">
  <div class="container-sm">
    <h2 class="mb-4">Frequently Asked Questions</h2>
    ${faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${e(faq.question)}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${e(faq.answer)}</p>
      </div>
    </div>`).join('')}
  </div>
</section>` : ''}`;

  const jsonLd = [
    orgSchema,
    websiteSchema,
    breadcrumb([{ name: 'Home', url: 'https://promptimagelab.com/' }]),
    ...(faqs.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.answer }
      }))
    }] : [])
  ];

  return new Response(layout({ title, description, canonical, content, jsonLd }), {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public, max-age=3600' }
  });
}
