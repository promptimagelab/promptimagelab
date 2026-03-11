/* ============================================================
   PromptImageLab — Shared Helper Utilities
   ============================================================ */

/**
 * HTML-escape a value for safe interpolation into HTML attributes or text.
 */
export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Returns true if the slug belongs to a prompt/content page (not a static page).
 */
export function isPrompt(slug) {
  const staticPages = new Set(['index', 'about', 'contact', 'privacy-policy', 'search', ''])
  return !staticPages.has(slug)
}

/**
 * Strip <nav>, <header>, <footer> already embedded in stored HTML
 * so Worker-injected chrome doesn't double-render.
 */
export function stripStoredChrome(html) {
  // If the content has a <main> tag, just extract its inner content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (mainMatch) {
    html = mainMatch[1]
  }

  // Then strip out any stray nav, header, footer, or body that might have slipped through
  return html
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/<a[^>]+class="skip-link"[^>]*>[\s\S]*?<\/a>/gi, '')
}

/**
 * Build JSON-LD structured data for a page.
 * Uses native JSON.stringify — safe against injection.
 */
export function buildLdJson(page, slug) {
  const url = `https://promptimagelab.com/${slug === 'index' ? '' : slug}`
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://promptimagelab.com' },
          { '@type': 'ListItem', position: 2, name: page.title, item: url }
        ]
      },
      {
        '@type': 'WebPage',
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en',
        publisher: {
          '@type': 'Organization',
          name: 'PromptImageLab',
          url: 'https://promptimagelab.com'
        }
      }
    ]
  }
  return JSON.stringify(data)
}

/**
 * Merge caller-provided headers with the full set of security headers.
 */
export function secureHeaders(extra = {}) {
  return {
    'X-Content-Type-Options'  : 'nosniff',
    'X-Frame-Options'         : 'DENY',
    'Referrer-Policy'         : 'strict-origin-when-cross-origin',
    'Permissions-Policy'      : 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy' :
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://www.google-analytics.com; " +
      "frame-ancestors 'none';",
    ...extra
  }
}

/**
 * Plain error response with full security headers.
 */
export function errorResponse(status, message) {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${status} Error</title></head>` +
    `<body style="font-family:sans-serif;text-align:center;padding:60px"><h1>${status}</h1><p>${esc(message)}</p>` +
    `<a href="/">Go home</a></body></html>`,
    { status, headers: secureHeaders({ 'content-type': 'text/html;charset=UTF-8' }) }
  )
}
