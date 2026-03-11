/* ============================================================
   PromptImageLab — Sitemap Handler
   Serves /sitemap.xml from D1, cached for 24 hours.
   ============================================================ */

import { esc, secureHeaders } from '../lib/helpers.js'

export async function serveSitemap(request, env, ctx) {

  const cache  = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  let pages = []
  try {
    const result = await env.DB
      .prepare(
        'SELECT slug, updated_at, created_at FROM pages WHERE status IS NULL OR status = ?'
      )
      .bind('published')
      .all()
    pages = result.results || []
  } catch {
    /* Fallback: ignore status column (older schema) */
    try {
      const result = await env.DB.prepare('SELECT slug FROM pages').all()
      pages = result.results || []
    } catch { /* silent */ }
  }

  const today = new Date().toISOString().substring(0, 10)

  const urls = pages.map(p => {
    const lastmod  = (p.updated_at || p.created_at || '').substring(0, 10) || today
    const priority = p.slug === 'index' ? '1.0' : '0.8'
    const loc      = `https://promptimagelab.com/${p.slug === 'index' ? '' : p.slug}`
    return `
  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${esc(lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://promptimagelab.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://promptimagelab.com/search</loc>
    <priority>0.6</priority>
    <changefreq>weekly</changefreq>
  </url>
${urls}
</urlset>`

  const response = new Response(xml, {
    headers: secureHeaders({
      'content-type'  : 'application/xml;charset=UTF-8',
      'Cache-Control' : 'public, max-age=86400, s-maxage=86400'
    })
  })

  ctx.waitUntil(cache.put(request, response.clone()))
  return response

}
