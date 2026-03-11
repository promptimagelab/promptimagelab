/* ============================================================
   PromptImageLab — Related Pages Handler
   Fetches related page links, with pre-computed `related`
   JSON column taking priority over RANDOM() fallback.
   Results are cached per-slug for 6 hours.
   ============================================================ */

import { esc } from '../lib/helpers.js'

export async function getRelatedHTML(slug, request, env, ctx) {

  const cacheKey = new Request(`https://promptimagelab.com/__related__/${slug}`)
  const cache    = caches.default
  const cached   = await cache.match(cacheKey)

  if (cached) {
    return await cached.text()
  }

  let related = []
  try {
    /* ---- Step 1: Check pre-computed related slugs -------------- */
    const currentPage = await env.DB
      .prepare('SELECT related FROM pages WHERE slug = ?')
      .bind(slug)
      .first()

    const precomputed = currentPage?.related
    if (precomputed) {
      let relatedSlugs = []
      try { relatedSlugs = JSON.parse(precomputed) } catch { /* ignore */ }

      if (relatedSlugs.length > 0) {
        const placeholders = relatedSlugs.map(() => '?').join(',')
        const res = await env.DB
          .prepare(`SELECT slug, title FROM pages WHERE slug IN (${placeholders}) LIMIT 6`)
          .bind(...relatedSlugs)
          .all()
        related = res.results || []
      }
    }

    /* ---- Step 2: Fallback — RANDOM() scan ---------------------- */
    if (related.length === 0) {
      const result = await env.DB
        .prepare('SELECT slug, title FROM pages WHERE slug != ? ORDER BY RANDOM() LIMIT 6')
        .bind(slug)
        .all()
      related = result.results || []
    }
  } catch {
    related = []
  }

  const html = related.map(p => `
    <li>
      <a href="/${esc(p.slug)}">${esc(p.title)}</a>
    </li>`
  ).join('')

  /* Cache for 6 hours — long enough to avoid thrashing,
     short enough to rotate the selection regularly        */
  ctx.waitUntil(
    cache.put(
      cacheKey,
      new Response(html, {
        headers: {
          'content-type'  : 'text/html',
          'Cache-Control' : 'public, max-age=21600'
        }
      })
    )
  )

  return html

}
