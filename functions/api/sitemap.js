export async function onRequestGet(context) {
  const { env } = context;
  const BASE = 'https://promptimagelab.com';
  try {
    const rows = await env.DB.prepare('SELECT slug, updated_at FROM prompts ORDER BY created_at DESC').all();
    const staticUrls = [
      `<url><loc>${BASE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${BASE}/about.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
      `<url><loc>${BASE}/contact.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    ];
    const promptUrls = (rows.results || []).map(p =>
      `<url><loc>${BASE}/prompts/${p.slug}</loc><lastmod>${(p.updated_at || new Date().toISOString()).split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`
    );
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls.join('')}${promptUrls.join('')}</urlset>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  } catch (e) {
    return new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', { headers: { 'Content-Type': 'application/xml' } });
  }
}
