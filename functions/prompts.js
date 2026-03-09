// functions/prompts.js — replaces prompts.php
import { searchPages, getPromptPages, e } from './_data.js';
import { layout } from './_layout.js';

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  let search = url.searchParams.get('q') || '';
  
  // Sanitize search — same logic as PHP version
  search = search.trim().replace(/[^\w\s\-.,!]/g, '').slice(0, 100);

  const pages = search ? searchPages(search) : getPromptPages();
  const canonical = 'https://promptimagelab.com/prompts';

  const metaTitle = search
    ? `Search: ${e(search)} — AI Prompt Library | PromptImageLab`
    : 'AI Image Prompt Library | PromptImageLab';

  const metaDesc = search
    ? `Browse AI image prompt results for "${e(search)}" on PromptImageLab.`
    : 'Browse hundreds of curated AI image prompts for Midjourney, Stable Diffusion and Leonardo AI.';

  const itemListElements = pages.map((p, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'url': `https://promptimagelab.com/${p.slug}`,
    'name': p.title
  }));

  const content = `
<section class="hero text-center">
<div class="container">
  <h1>AI Image Prompt Library</h1>
  <p>Search and explore curated AI prompts for Midjourney, Stable Diffusion and other generative AI tools.</p>
</div>
</section>

<main class="container py-5">

<section class="text-center mb-4">
<form method="GET" action="/prompts" role="search">
  <label for="prompt-search" class="visually-hidden">Search AI prompts</label>
  <input
    id="prompt-search"
    type="search"
    name="q"
    value="${e(search)}"
    placeholder="Search prompts (portrait, anime, cyberpunk...)"
    autocomplete="off"
    style="padding:12px;border-radius:10px;width:60%;max-width:500px;border:1px solid #ccc;">
  <button type="submit" class="btn btn-primary" style="margin-left:10px;">Search</button>
</form>
</section>

<h2 class="text-center mb-4">
  ${search ? `Search results for "${e(search)}"` : 'Explore Prompt Categories'}
</h2>

<div class="row g-4">
${pages.length ? pages.map(p => `
  <div class="col-md-6 col-lg-4">
    <div class="card">
      <h3>${e(p.title)}</h3>
      <p class="muted">${e(p.seo_description)}</p>
      <a class="btn btn-primary mt-4" href="/${e(p.slug)}">Explore Prompts</a>
    </div>
  </div>`).join('') : `
  <div class="col-12 text-center">
    <p>No prompts found${search ? ` for "${e(search)}"` : ''}. <a href="/prompts">Browse all categories</a>.</p>
  </div>`}
</div>

<section class="mt-5 text-center">
  <h2>Why Use PromptImageLab?</h2>
  <p class="muted">PromptImageLab provides structured prompt examples for artists, designers and creators working with generative AI tools.</p>
</section>

</main>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'AI Image Prompt Library',
      'description': 'Browse hundreds of curated AI image prompts for Midjourney, Stable Diffusion and Leonardo AI.',
      'url': canonical,
      'isPartOf': { '@type': 'WebSite', 'name': 'PromptImageLab', 'url': 'https://promptimagelab.com' },
      'publisher': { '@type': 'Organization', 'name': 'PromptImageLab', 'url': 'https://promptimagelab.com' }
    },
    ...(itemListElements.length ? [{
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': search ? `Search results for ${search}` : 'AI Prompt Categories',
      'url': canonical,
      'numberOfItems': itemListElements.length,
      'itemListElement': itemListElements
    }] : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://promptimagelab.com/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'AI Prompt Library', 'item': canonical }
      ]
    }
  ];

  const html = layout({
    title: metaTitle,
    description: metaDesc,
    canonical,
    robots: search ? 'noindex, follow' : 'index, follow',
    content,
    jsonLd
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
