// functions/[[slug]].js — All dynamic pages
import { getPage, getFaqs, getPromptSets, getRelated, getPromptPages, e } from './_data.js';
import { layout, orgSchema, breadcrumb } from './_layout.js';

export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const slug = url.pathname.replace(/^\//, '').replace(/\/$/, '') || 'home';

  // Pass through static files
  if (slug.startsWith('assets/') || slug.startsWith('admin') || slug === 'favicon.ico' || slug === 'robots.txt' || slug === 'sitemap.xml' || slug === 'ads.txt') {
    return ctx.next();
  }

  const page = getPage(slug);

  if (!page) {
    return new Response(render404(), {
      status: 404,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  const faqs = getFaqs(page.id);
  const promptSets = getPromptSets(page.id);
  const related = getRelated(page.id);
  const allPromptCount = promptSets.reduce((sum, s) => sum + s.prompts.length, 0);

  const canonical = `https://promptimagelab.com/${slug === 'home' ? '' : slug}`;
  const title = page.seo_title || page.title;
  const description = page.seo_description || '';
  const isContentPage = promptSets.length > 0;

  // Build TOC if content page
  const tocItems = [];
  if (page.what_section) tocItems.push({ id: 'what', label: 'What Are These Prompts?' });
  if (page.usage_section) tocItems.push({ id: 'usage', label: 'How to Use' });
  if (page.tools_section) tocItems.push({ id: 'tools', label: 'Compatible AI Tools' });
  if (promptSets.length) tocItems.push({ id: 'prompts', label: `Prompt Collections (${allPromptCount})` });
  if (page.examples_section) tocItems.push({ id: 'examples', label: 'Examples' });
  if (page.tips_section) tocItems.push({ id: 'tips', label: 'Pro Tips' });
  if (faqs.length) tocItems.push({ id: 'faqs', label: `FAQ (${faqs.length})` });
  if (related.length) tocItems.push({ id: 'related', label: 'Related Categories' });

  const content = `
<div class="container py-5">

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="sep">›</span>
    ${isContentPage ? `<a href="/prompts">Prompts</a><span class="sep">›</span>` : ''}
    <span class="current">${e(page.title)}</span>
  </nav>

  ${isContentPage ? `
  <div class="content-sidebar">
    <div class="article-content">
      <h1>${e(page.title)}</h1>
      ${allPromptCount ? `<p style="margin:12px 0 24px;"><span class="tag">✨ ${allPromptCount} Prompts</span> <span class="tag">📋 ${promptSets.length} Sets</span> <span class="tag">🆓 Free</span></p>` : ''}

      ${page.intro_text ? `<p style="font-size:1.05rem;line-height:1.85;color:var(--text);margin-bottom:28px;">${e(page.intro_text)}</p>` : ''}

      ${tocItems.length > 2 ? `
      <nav class="toc" aria-label="Table of contents">
        <h4>📋 Contents</h4>
        <ol>${tocItems.map(t => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}</ol>
      </nav>` : ''}

      ${page.what_section ? `
      <section id="what" aria-labelledby="what-heading">
        <h2 id="what-heading">What Are These Prompts?</h2>
        <div>${page.what_section}</div>
      </section>` : ''}

      ${page.usage_section ? `
      <section id="usage" aria-labelledby="usage-heading" style="margin-top:32px;">
        <h2 id="usage-heading">How to Use These Prompts</h2>
        <div>${page.usage_section}</div>
      </section>` : ''}

      ${page.tools_section ? `
      <section id="tools" aria-labelledby="tools-heading" style="margin-top:32px;">
        <h2 id="tools-heading">Compatible AI Tools</h2>
        <div>${page.tools_section}</div>
        <div class="category-pills" style="justify-content:flex-start;margin-top:16px;">
          <span class="pill">Midjourney</span>
          <span class="pill">Stable Diffusion</span>
          <span class="pill">Leonardo AI</span>
          <span class="pill">DALL·E</span>
        </div>
      </section>` : ''}

      ${promptSets.length ? `
      <section id="prompts" aria-labelledby="prompts-heading" style="margin-top:40px;">
        <h2 id="prompts-heading">Prompt Collections</h2>
        <p style="margin-bottom:24px;">Click <strong style="color:var(--text)">Copy</strong> next to any prompt to copy it to your clipboard. Paste directly into Midjourney, Stable Diffusion, or any other AI image tool.</p>
        ${promptSets.map(set => `
        <div class="prompt-set">
          <h3>${e(set.set_title)}</h3>
          ${set.prompts.map(p => `
          <div class="prompt-card">
            <p>${e(p.prompt_text)}</p>
            <button
              class="copy-btn"
              onclick="copyPrompt(this, ${JSON.stringify(p.prompt_text)})"
              aria-label="Copy prompt: ${e(p.prompt_text.slice(0, 50))}">
              Copy
            </button>
          </div>`).join('')}
        </div>`).join('')}
      </section>` : ''}

      ${page.examples_section ? `
      <section id="examples" aria-labelledby="examples-heading" style="margin-top:32px;">
        <h2 id="examples-heading">Examples</h2>
        <div>${page.examples_section}</div>
      </section>` : ''}

      ${page.tips_section ? `
      <section id="tips" aria-labelledby="tips-heading" style="margin-top:32px;">
        <h2 id="tips-heading">Pro Tips for Better Results</h2>
        <div>${page.tips_section}</div>
      </section>` : ''}

      ${page.conclusion_section ? `
      <section style="margin-top:32px;">
        <h2>Conclusion</h2>
        <div>${page.conclusion_section}</div>
      </section>` : ''}

      ${faqs.length ? `
      <section id="faqs" aria-labelledby="faqs-heading" style="margin-top:48px;">
        <h2 id="faqs-heading">Frequently Asked Questions</h2>
        <div itemscope itemtype="https://schema.org/FAQPage">
          ${faqs.map(faq => `
          <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name">${e(faq.question)}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text">${e(faq.answer)}</p>
            </div>
          </div>`).join('')}
        </div>
      </section>` : ''}

      ${related.length ? `
      <section id="related" class="related-section" aria-labelledby="related-heading">
        <h2 id="related-heading">Related Prompt Categories</h2>
        <div class="row g-4" style="margin-top:16px;">
          ${related.map(r => `
          <div class="col-md-6">
            <article class="card">
              <h3><a href="/${e(r.slug)}" style="color:var(--text);">${e(r.title)}</a></h3>
              <p>${e(r.seo_description)}</p>
              <a class="btn btn-primary" href="/${e(r.slug)}">Explore →</a>
            </article>
          </div>`).join('')}
        </div>
      </section>` : ''}

    </div>

    <!-- Sidebar -->
    <aside aria-label="Sidebar">
      <div style="position:sticky;top:88px;">
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;">
          <h4 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px;">Quick Info</h4>
          <p style="font-size:.88rem;margin-bottom:8px;"><strong style="color:var(--text);">Prompts:</strong> ${allPromptCount}</p>
          <p style="font-size:.88rem;margin-bottom:8px;"><strong style="color:var(--text);">Sets:</strong> ${promptSets.length}</p>
          <p style="font-size:.88rem;margin-bottom:0;"><strong style="color:var(--text);">Cost:</strong> Free</p>
        </div>

        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;">
          <h4 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px;">Works With</h4>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <span class="tag" style="text-align:left;">🎨 Midjourney</span>
            <span class="tag" style="text-align:left;">⚡ Stable Diffusion</span>
            <span class="tag" style="text-align:left;">🦁 Leonardo AI</span>
            <span class="tag" style="text-align:left;">🤖 DALL·E</span>
          </div>
        </div>

        <!-- Sidebar Ad -->
        <div class="ad-label">Advertisement</div>
        <ins class="adsbygoogle"
          style="display:block;min-height:250px;"
          data-ad-client="ca-pub-6771008610152378"
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>

        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-top:20px;">
          <h4 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px;">More Categories</h4>
          <ul style="list-style:none;padding:0;">
            <li style="margin-bottom:8px;"><a href="/ai-profile-picture-prompts" style="font-size:.88rem;color:var(--muted);">AI Profile Pictures</a></li>
            <li style="margin-bottom:8px;"><a href="/linkedin-profile-picture-prompts" style="font-size:.88rem;color:var(--muted);">LinkedIn Headshots</a></li>
            <li style="margin-bottom:8px;"><a href="/studio-lighting-portrait-prompts" style="font-size:.88rem;color:var(--muted);">Studio Lighting</a></li>
            <li style="margin-bottom:8px;"><a href="/corporate-portrait-prompts" style="font-size:.88rem;color:var(--muted);">Corporate Portraits</a></li>
            <li><a href="/prompts" style="font-size:.88rem;color:var(--primary);">All Categories →</a></li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
  ` : `
  <!-- Simple content page (about, contact, privacy, etc.) -->
  <div class="container-sm">
    <h1>${e(page.title)}</h1>
    ${page.intro_text ? `<p style="font-size:1.05rem;margin-top:16px;margin-bottom:32px;">${e(page.intro_text)}</p>` : ''}
    ${page.what_section ? `<div class="article-content" style="margin-top:24px;">${page.what_section}</div>` : ''}
    ${page.usage_section ? `<div class="article-content" style="margin-top:24px;">${page.usage_section}</div>` : ''}
    ${page.conclusion_section ? `<div class="article-content" style="margin-top:24px;">${page.conclusion_section}</div>` : ''}
    ${faqs.length ? `
    <section style="margin-top:48px;">
      <h2 class="mb-4">Frequently Asked Questions</h2>
      ${faqs.map(faq => `
      <div class="faq-item">
        <h3>${e(faq.question)}</h3>
        <p>${e(faq.answer)}</p>
      </div>`).join('')}
    </section>` : ''}
  </div>`}

</div>`;

  const jsonLd = [
    orgSchema,
    {
      '@context': 'https://schema.org',
      '@type': isContentPage ? 'Article' : 'WebPage',
      'headline': page.title,
      'description': description,
      'url': canonical,
      'publisher': { '@type': 'Organization', 'name': 'PromptImageLab', 'url': 'https://promptimagelab.com' },
      'datePublished': page.created_at || new Date().toISOString(),
      'dateModified': page.created_at || new Date().toISOString()
    },
    breadcrumb([
      { name: 'Home', url: 'https://promptimagelab.com/' },
      ...(isContentPage ? [{ name: 'Prompts', url: 'https://promptimagelab.com/prompts' }] : []),
      { name: page.title, url: canonical }
    ]),
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

function render404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>404 — Page Not Found | PromptImageLab</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="/assets/css/theme.css">
</head>
<body>
<nav class="site-nav"><div class="container nav-inner"><a class="logo" href="/">Prompt<span>ImageLab</span></a></div></nav>
<main class="container py-5 text-center">
  <h1 style="font-size:4rem;color:var(--primary);margin-bottom:16px;">404</h1>
  <h2>Page Not Found</h2>
  <p style="margin:16px auto 32px;max-width:400px;">The page you're looking for doesn't exist or has been moved.</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    <a href="/" class="btn btn-primary">Go Home</a>
    <a href="/prompts" class="btn btn-outline">Browse Prompts</a>
  </div>
</main>
</body></html>`;
}
