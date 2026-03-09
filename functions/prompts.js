// functions/prompts.js — Prompt Library page
import { searchPages, getPromptPages, totalPrompts, totalPages, e } from './_data.js';
import { layout, orgSchema, breadcrumb } from './_layout.js';

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  let search = (url.searchParams.get('q') || '').trim().replace(/[^\w\s\-.,!]/g, '').slice(0, 100);

  const pages = search ? searchPages(search) : getPromptPages();
  const canonical = 'https://promptimagelab.com/prompts';

  const title = search
    ? `"${e(search)}" AI Prompts — Search Results | PromptImageLab`
    : `AI Image Prompt Library — ${totalPrompts()}+ Free Prompts | PromptImageLab`;

  const description = search
    ? `Browse AI image prompt results for "${e(search)}" on PromptImageLab. Curated prompts for Midjourney, Stable Diffusion and Leonardo AI.`
    : `Explore ${totalPrompts()}+ free AI image prompts for Midjourney, Stable Diffusion, Leonardo AI and DALL·E. Browse ${totalPages()} categories including portraits, anime, landscapes and more.`;

  const itemList = pages.map((p, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'url': `https://promptimagelab.com/${p.slug}`,
    'name': p.title
  }));

  const content = `
<section class="hero text-center" aria-label="Prompt library hero">
<div class="container">
  <h1>${search ? `Results for "${e(search)}"` : 'AI Image Prompt Library'}</h1>
  <p>${search ? `Found ${pages.length} prompt categories matching your search.` : `${totalPrompts()}+ curated prompts across ${totalPages()} categories. Free to use with any AI image generator.`}</p>

  <form class="search-form" method="GET" action="/prompts" role="search" aria-label="Search prompts">
    <label for="prompt-search" class="visually-hidden">Search AI prompts</label>
    <input
      id="prompt-search"
      class="search-input"
      type="search"
      name="q"
      value="${e(search)}"
      placeholder="Search prompts: portrait, anime, cyberpunk..."
      autocomplete="off"
      aria-label="Search prompts">
    <button type="submit" class="btn btn-primary">Search</button>
    ${search ? `<a href="/prompts" class="btn btn-outline">Clear</a>` : ''}
  </form>
</div>
</section>

<div class="container py-5">

${!search ? `
<div class="category-pills" role="list" aria-label="Filter categories">
  <a href="/prompts" class="pill active" role="listitem">All</a>
  <a href="/prompts?q=portrait" class="pill" role="listitem">Portrait</a>
  <a href="/prompts?q=linkedin" class="pill" role="listitem">LinkedIn</a>
  <a href="/prompts?q=instagram" class="pill" role="listitem">Instagram</a>
  <a href="/prompts?q=studio" class="pill" role="listitem">Studio</a>
  <a href="/prompts?q=corporate" class="pill" role="listitem">Corporate</a>
</div>` : ''}

<div class="row g-4" aria-label="Prompt categories">
${pages.length ? pages.map(p => `
  <div class="col-lg-4 col-md-6">
    <article class="card" itemscope itemtype="https://schema.org/Article">
      <h3 itemprop="headline"><a href="/${e(p.slug)}" style="color:var(--text);">${e(p.title)}</a></h3>
      <p itemprop="description">${e(p.seo_description)}</p>
      <a class="btn btn-primary" href="/${e(p.slug)}" aria-label="Explore ${e(p.title)}">Explore Prompts →</a>
    </article>
  </div>`).join('') : `
  <div class="col-12 text-center" style="padding:60px 0;">
    <p style="font-size:1.1rem;">No prompts found for "<strong style="color:var(--text)">${e(search)}</strong>"</p>
    <a href="/prompts" class="btn btn-primary" style="margin-top:16px;">Browse All Categories</a>
  </div>`}
</div>

<section class="mt-5 text-center" aria-label="About the library">
  <div class="container-sm">
    <h2>Why Use PromptImageLab?</h2>
    <p>Every prompt in our library is structured and tested to produce high-quality results across multiple AI image generation platforms. Whether you're a beginner or experienced AI artist, our organized categories help you find the perfect prompt fast.</p>
    <div class="stats-row">
      <div class="stat-item"><span class="num">${totalPrompts()}+</span><span class="label">Tested Prompts</span></div>
      <div class="stat-item"><span class="num">${totalPages()}</span><span class="label">Categories</span></div>
      <div class="stat-item"><span class="num">Free</span><span class="label">Always</span></div>
    </div>
  </div>
</section>

</div>`;

  const jsonLd = [
    orgSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'AI Image Prompt Library',
      'description': description,
      'url': canonical,
      'isPartOf': { '@type': 'WebSite', 'name': 'PromptImageLab', 'url': 'https://promptimagelab.com' }
    },
    ...(itemList.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', 'name': search ? `Search results for ${search}` : 'AI Prompt Categories', 'numberOfItems': itemList.length, 'itemListElement': itemList }] : []),
    breadcrumb([
      { name: 'Home', url: 'https://promptimagelab.com/' },
      { name: 'Prompt Library', url: canonical }
    ])
  ];

  return new Response(layout({
    title,
    description,
    canonical,
    robots: search ? 'noindex, follow' : 'index, follow',
    content,
    jsonLd
  }), {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': search ? 'no-store' : 'public, max-age=3600' }
  });
}
