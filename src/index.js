/* ============================================================
   PromptImageLab — Modular Cloudflare Worker Entry
   ============================================================ */

import { errorResponse, isPrompt, stripStoredChrome, buildLdJson, secureHeaders } from './lib/helpers.js'
import { buildPageHTML, build404HTML } from './lib/template.js'
import { serveSitemap } from './handlers/sitemap.js'
import { getRelatedHTML } from './handlers/related.js'
import { serveSearchJson, serveSearchPage } from './handlers/search.js'
import { servePromptsHub } from './handlers/prompts-hub.js'

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx)
    } catch (err) {
      console.error(JSON.stringify({
        event: 'UNHANDLED_ERROR',
        message: err.message,
        stack: err.stack,
        url: request.url,
        ts: new Date().toISOString()
      }))
      return errorResponse(500, 'Internal Server Error')
    }
  }
}

async function handleRequest(request, env, ctx) {
  const url  = new URL(request.url)
  const path = url.pathname

  /* ---- Static assets ------------------------------------------ */
  if (
    path.startsWith('/assets') ||
    path.startsWith('/images') ||
    path.match(/\.(css|js|png|jpg|jpeg|svg|webp|gif|ico|woff2|woff|ttf)$/)
  ) {
    if (env.ASSETS) return env.ASSETS.fetch(request)
    return errorResponse(404, 'Asset not found')
  }

  /* ---- robots.txt --------------------------------------------- */
  if (path === '/robots.txt') {
    return new Response(
      `User-agent: *\nAllow: /\n\nSitemap: https://promptimagelab.com/sitemap.xml\n`,
      { headers: secureHeaders({ 'content-type': 'text/plain' }) }
    )
  }

  /* ---- API & Specialized Routes ------------------------------- */
  if (path === '/sitemap.xml') return await serveSitemap(request, env, ctx)
  if (path === '/search.json')  return await serveSearchJson(request, env, ctx)
  if (path === '/search')       return serveSearchPage()
  if (path === '/prompts-hub')  return servePromptsHub()

  /* ---- Edge cache --------------------------------------------- */
  const cache  = caches.default
  const cached = await cache.match(request)
  if (cached) return cached

  /* ---- Slug resolution ---------------------------------------- */
  let slug = path.replace(/^\/+/, '').replace(/\/+$/, '') || 'index'

  /* ---- Fetch page from D1 ------------------------------------- */
  let page
  try {
    page = await env.DB
      .prepare('SELECT * FROM pages WHERE slug = ?')
      .bind(slug)
      .first()
  } catch (err) {
    console.error(JSON.stringify({ event: 'DB_ERROR', slug, message: err.message, ts: new Date().toISOString() }))
    return errorResponse(500, 'Database error')
  }

  /* ---- Page found --------------------------------------------- */
  if (page) {
    /* Decode Base64 content */
    let bodyContent = ''
    try {
      bodyContent = new TextDecoder().decode(
        Uint8Array.from(atob(page.content), c => c.charCodeAt(0))
      )
    } catch {
      bodyContent = page.content || ''
    }

    bodyContent = stripStoredChrome(bodyContent)

    /* CSS selection by category */
    const isPromptPage = isPrompt(slug)
    const cssFile      = isPromptPage ? '/prompt.css' : '/style.css'

    /* Related pages */
    const relatedHTML = await getRelatedHTML(slug, request, env, ctx)

    /* Structured data */
    const ldJson = buildLdJson(page, slug)

    /* Full HTML response */
    const html = buildPageHTML({ page, slug, bodyContent, relatedHTML, ldJson, cssFile })

    const response = new Response(html, {
      status: 200,
      headers: secureHeaders({
        'content-type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800'
      })
    })

    ctx.waitUntil(cache.put(request, response.clone()))
    return response
  }

  /* ---- 404 ---------------------------------------------------- */
  return new Response(build404HTML(), {
    status: 404,
    headers: secureHeaders({ 'content-type': 'text/html;charset=UTF-8' })
  })
}
