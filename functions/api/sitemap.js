export async function onRequestGet(context) {
  const { env } = context;
  const BASE = 'https://promptimagelab.com';
  try {
    const rows = await env.DB.prepare(
      "SELECT slug, updated_at FROM prompts WHERE status='published' ORDER BY created_at DESC"
    ).all();
    const staticUrls = [
      { loc: '/', priority: '1.0', freq: 'daily' },
      { loc: '/about.html', priority: '0.7', freq: 'monthly' },
      { loc: '/contact.html', priority: '0.5', freq: 'monthly' },
    ].map(p => `<url><loc>${BASE}${p.loc}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`);

    const promptUrls = (rows.results || []).map(p => {
      const date = (p.updated_at || new Date().toISOString()).split('T')[0];
      return `<url><loc>${BASE}/prompts/${p.slug}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls.join('\n')}
${promptUrls.join('\n')}
</urlset>`;
    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (e) {
    return new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
      headers: { 'Content-Type': 'application/xml' }
    });
  }
}
