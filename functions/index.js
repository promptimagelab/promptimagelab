// functions/index.js — replaces index.php
import { getPage, getFaqsForPage, getPromptPages, e } from './_data.js';
import { layout } from './_layout.js';

export async function onRequest(ctx) {
  const page = getPage('home');
  const faqs = page ? getFaqsForPage(page.id) : [];
  const promptPages = getPromptPages().slice(0, 6);

  const title = page?.seo_title || 'PromptImageLab — AI Image Prompt Library';
  const description = page?.seo_description || 'Browse curated AI image prompts for Midjourney, Stable Diffusion and Leonardo AI.';

  const content = `
<section class="hero text-center">
<div class="container">
  <h1>${e(page?.title || 'PromptImageLab')}</h1>
  <p>${e(page?.intro_text?.slice(0, 200) || 'Curated AI image prompts for Midjourney, Stable Diffusion and Leonardo AI.')}</p>
  <a href="/prompts" class="btn btn-primary" style="margin-top:20px;">Browse All Prompts</a>
</div>
</section>

<main class="container py-5">

<section class="mb-5">
  <h2 class="text-center mb-4">Popular Prompt Categories</h2>
  <div class="row g-4">
    ${promptPages.map(p => `
    <div class="col-md-6 col-lg-4">
      <div class="card">
        <h3>${e(p.title)}</h3>
        <p class="muted">${e(p.seo_description)}</p>
        <a class="btn btn-primary mt-4" href="/${e(p.slug)}">Explore Prompts</a>
      </div>
    </div>`).join('')}
  </div>
</section>

${page?.what_section ? `
<section class="mt-5">
  <h2>What is PromptImageLab?</h2>
  <div class="muted">${page.what_section}</div>
</section>` : ''}

${faqs.length ? `
<section class="mt-5">
  <h2>Frequently Asked Questions</h2>
  ${faqs.map(faq => `
  <div class="faq-item" style="margin-bottom:24px;">
    <h3 style="font-size:1.1rem;">${e(faq.question)}</h3>
    <p class="muted">${e(faq.answer)}</p>
  </div>`).join('')}
</section>` : ''}

</main>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'PromptImageLab',
      'url': 'https://promptimagelab.com',
      'description': description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://promptimagelab.com/prompts?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  const html = layout({
    title,
    description,
    canonical: 'https://promptimagelab.com/',
    content,
    jsonLd
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
