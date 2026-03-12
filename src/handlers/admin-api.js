/* ============================================================
   PromptImageLab — Admin API Handler
   ALL routes under /admin/api/* — requires valid session cookie
   ============================================================ */

import { verifyAdminSession } from './admin.js'

/* ---- JSON helper ----------------------------------------- */

function json(data, status = 200) {
  const headers = {
    'content-type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-store, no-cache',
    'X-Content-Type-Options': 'nosniff'
  }
  return new Response(JSON.stringify(data), { status, headers })
}

/* ---- Safe Base64 encode/decode for page content ----------- */

function encodeContent(html) {
  try {
    const bytes = new TextEncoder().encode(html || '')
    let bin = ''
    bytes.forEach(b => bin += String.fromCharCode(b))
    return btoa(bin)
  } catch {
    return btoa(unescape(encodeURIComponent(html || '')))
  }
}

function decodeContent(b64) {
  if (!b64) return ''
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)))
  } catch {
    return b64
  }
}

function wordCount(html) {
  return (html || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
}

/* ================================================================
   MAIN ROUTER
   ================================================================ */

export async function handleAdminApi(request, env) {

  /* --- CORS pre-flight ---------------------------------------- */
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Allow': 'GET, POST, PUT, DELETE, OPTIONS' }
    })
  }

  /* --- Auth gate ---------------------------------------------- */
  const session = await verifyAdminSession(request, env)
  if (!session) return json({ error: 'Unauthorized' }, 401)

  const url    = new URL(request.url)
  const path   = url.pathname
  const method = request.method

  /* ---- Stats -------------------------------------------------- */
  if (path === '/admin/api/stats' && method === 'GET')
    return getStats(env)

  /* ---- Pages -------------------------------------------------- */
  if (path === '/admin/api/pages') {
    if (method === 'GET')  return listPages(request, env)
    if (method === 'POST') return createPage(request, env)
  }
  const pm = path.match(/^\/admin\/api\/pages\/(\d+)$/)
  if (pm) {
    const id = parseInt(pm[1])
    if (method === 'GET')    return getPage(id, env)
    if (method === 'PUT')    return updatePage(id, request, env)
    if (method === 'DELETE') return deletePage(id, env)
  }

  /* ---- Bulk delete pages (POST /admin/api/pages/bulk-delete) -- */
  if (path === '/admin/api/pages/bulk-delete' && method === 'POST')
    return bulkDeletePages(request, env)

  /* ---- Categories --------------------------------------------- */
  if (path === '/admin/api/categories') {
    if (method === 'GET')  return listCategories(env)
    if (method === 'POST') return createCategory(request, env)
  }
  const cm = path.match(/^\/admin\/api\/categories\/(\d+)$/)
  if (cm) {
    const id = parseInt(cm[1])
    if (method === 'PUT')    return updateCategory(id, request, env)
    if (method === 'DELETE') return deleteCategory(id, env)
  }

  /* ---- Prompts ------------------------------------------------ */
  if (path === '/admin/api/prompts') {
    if (method === 'GET')  return listPrompts(request, env)
    if (method === 'POST') return createPrompt(request, env)
  }
  const prm = path.match(/^\/admin\/api\/prompts\/(\d+)$/)
  if (prm) {
    const id = parseInt(prm[1])
    if (method === 'GET')    return getPrompt(id, env)
    if (method === 'PUT')    return updatePrompt(id, request, env)
    if (method === 'DELETE') return deletePrompt(id, env)
  }

  /* ---- Pages list for dropdowns ------------------------------ */
  if (path === '/admin/api/pages-list' && method === 'GET')
    return getPagesList(env)

  /* ---- Raw SQL Execute --------------------------------------- */
  if (path === '/admin/api/sql' && method === 'POST')
    return executeSql(request, env)

  return json({ error: 'Not Found' }, 404)
}


/* ================================================================
   STATS
   ================================================================ */

async function getStats(env) {
  try {
    const [ps, cc, pc, rc] = await Promise.all([
      env.DB.prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) AS published,
          SUM(CASE WHEN status='draft'     THEN 1 ELSE 0 END) AS draft,
          SUM(CASE WHEN status='archived'  THEN 1 ELSE 0 END) AS archived,
          SUM(word_count) AS total_words
        FROM pages
      `).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM categories').first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM prompts').first(),
      env.DB.prepare(`
        SELECT category, COUNT(*) AS cnt FROM pages
        WHERE status='published' GROUP BY category ORDER BY cnt DESC LIMIT 8
      `).all()
    ])
    return json({
      pages      : ps || {},
      categories : cc?.count ?? 0,
      prompts    : pc?.count ?? 0,
      topCats    : rc?.results || []
    })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}


/* ================================================================
   PAGES CRUD
   ================================================================ */

async function listPages(request, env) {
  const url      = new URL(request.url)
  const page     = Math.max(1, parseInt(url.searchParams.get('page')  || '1'))
  const limit    = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const search   = (url.searchParams.get('search')   || '').trim()
  const status   = (url.searchParams.get('status')   || '').trim()
  const category = (url.searchParams.get('category') || '').trim()
  const offset   = (page - 1) * limit

  const where  = []
  const params = []

  if (search) {
    where.push('(title LIKE ? OR slug LIKE ? OR description LIKE ?)')
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (status)   { where.push('status = ?');   params.push(status) }
  if (category) { where.push('category = ?'); params.push(category) }

  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const [tot, rows] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS count FROM pages ${w}`).bind(...params).first(),
      env.DB.prepare(
        `SELECT id, slug, title, description, category, status, word_count, created_at, updated_at
         FROM pages ${w}
         ORDER BY updated_at DESC
         LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all()
    ])
    return json({
      data  : rows.results || [],
      total : tot?.count   ?? 0,
      page,
      limit,
      pages : Math.ceil((tot?.count ?? 0) / limit)
    })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function getPage(id, env) {
  try {
    const row = await env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first()
    if (!row) return json({ error: 'Not found' }, 404)
    return json({ ...row, content: decodeContent(row.content) })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function createPage(request, env) {
  try {
    const b = await request.json()
    const { slug, title, description = '', category = '', tags = '[]',
            content = '', status = 'draft', related = '[]' } = b

    if (!slug || !title) return json({ error: 'slug and title are required' }, 400)
    if (!/^[a-z0-9-]+$/.test(slug)) return json({ error: 'Slug must be lowercase letters, numbers and hyphens only' }, 400)

    const enc = encodeContent(content)
    const wc  = wordCount(content)

    const r = await env.DB.prepare(
      `INSERT INTO pages (slug, title, description, category, tags, content, status, related, word_count)
       VALUES (?,?,?,?,?,?,?,?,?)`
    ).bind(slug, title, description, category, tags, enc, status, related, wc).run()

    return json({ success: true, id: r.meta?.last_row_id }, 201)
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return json({ error: 'A page with that slug already exists' }, 409)
    return json({ error: err.message }, 500)
  }
}

async function updatePage(id, request, env) {
  try {
    const b = await request.json()
    const { slug, title, description = '', category = '', tags = '[]',
            content = '', status = 'draft', related = '[]' } = b

    if (!slug || !title) return json({ error: 'slug and title are required' }, 400)

    const enc = encodeContent(content)
    const wc  = wordCount(content)

    await env.DB.prepare(
      `UPDATE pages
       SET slug=?, title=?, description=?, category=?, tags=?, content=?, status=?, related=?, word_count=?
       WHERE id=?`
    ).bind(slug, title, description, category, tags, enc, status, related, wc, id).run()

    return json({ success: true })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return json({ error: 'A page with that slug already exists' }, 409)
    return json({ error: err.message }, 500)
  }
}

async function deletePage(id, env) {
  try {
    await env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function bulkDeletePages(request, env) {
  try {
    const { ids } = await request.json()
    if (!Array.isArray(ids) || ids.length === 0) return json({ error: 'ids array required' }, 400)
    const placeholders = ids.map(() => '?').join(',')
    await env.DB.prepare(`DELETE FROM pages WHERE id IN (${placeholders})`).bind(...ids).run()
    return json({ success: true, deleted: ids.length })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function getPagesList(env) {
  try {
    const r = await env.DB.prepare('SELECT id, title, slug FROM pages ORDER BY title ASC').all()
    return json(r.results || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}


/* ================================================================
   CATEGORIES CRUD
   ================================================================ */

async function listCategories(env) {
  try {
    const r = await env.DB.prepare('SELECT * FROM categories ORDER BY position ASC, name ASC').all()
    return json(r.results || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function createCategory(request, env) {
  try {
    const b = await request.json()
    const { slug, name, description = '', position = 0 } = b
    if (!slug || !name) return json({ error: 'slug and name are required' }, 400)
    if (!/^[a-z0-9-]+$/.test(slug)) return json({ error: 'Slug must be lowercase letters, numbers and hyphens only' }, 400)
    const r = await env.DB.prepare(
      'INSERT INTO categories (slug, name, description, position) VALUES (?,?,?,?)'
    ).bind(slug, name, description, position).run()
    return json({ success: true, id: r.meta?.last_row_id }, 201)
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return json({ error: 'Category slug already exists' }, 409)
    return json({ error: err.message }, 500)
  }
}

async function updateCategory(id, request, env) {
  try {
    const b = await request.json()
    const { slug, name, description = '', position = 0 } = b
    if (!slug || !name) return json({ error: 'slug and name are required' }, 400)
    await env.DB.prepare(
      'UPDATE categories SET slug=?, name=?, description=?, position=? WHERE id=?'
    ).bind(slug, name, description, position, id).run()
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function deleteCategory(id, env) {
  try {
    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}


/* ================================================================
   PROMPTS CRUD
   ================================================================ */

async function listPrompts(request, env) {
  const url    = new URL(request.url)
  const page   = Math.max(1, parseInt(url.searchParams.get('page')    || '1'))
  const limit  = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit')  || '20')))
  const search  = (url.searchParams.get('search')  || '').trim()
  const page_id = (url.searchParams.get('page_id') || '').trim()
  const offset  = (page - 1) * limit

  const where  = []
  const params = []

  if (page_id) { where.push('p.page_id = ?'); params.push(parseInt(page_id)) }
  if (search)  {
    where.push('(p.title LIKE ? OR p.body LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''

  try {
    const [tot, rows] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS count FROM prompts p ${w}`).bind(...params).first(),
      env.DB.prepare(
        `SELECT p.*, pg.title AS page_title, pg.slug AS page_slug
         FROM prompts p
         LEFT JOIN pages pg ON p.page_id = pg.id
         ${w}
         ORDER BY p.page_id ASC, p.position ASC, p.id ASC
         LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all()
    ])
    return json({
      data  : rows.results || [],
      total : tot?.count   ?? 0,
      page,
      limit,
      pages : Math.ceil((tot?.count ?? 0) / limit)
    })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function getPrompt(id, env) {
  try {
    const r = await env.DB.prepare('SELECT * FROM prompts WHERE id = ?').bind(id).first()
    if (!r) return json({ error: 'Not found' }, 404)
    return json(r)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function createPrompt(request, env) {
  try {
    const b = await request.json()
    const { page_id, title = '', body, tags = '[]', position = 0 } = b
    if (!page_id || !body) return json({ error: 'page_id and body are required' }, 400)
    const r = await env.DB.prepare(
      'INSERT INTO prompts (page_id, title, body, tags, position) VALUES (?,?,?,?,?)'
    ).bind(parseInt(page_id), title, body, tags, position).run()
    return json({ success: true, id: r.meta?.last_row_id }, 201)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function updatePrompt(id, request, env) {
  try {
    const b = await request.json()
    const { page_id, title = '', body, tags = '[]', position = 0 } = b
    if (!page_id || !body) return json({ error: 'page_id and body are required' }, 400)
    await env.DB.prepare(
      'UPDATE prompts SET page_id=?, title=?, body=?, tags=?, position=? WHERE id=?'
    ).bind(parseInt(page_id), title, body, tags, position, id).run()
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

async function deletePrompt(id, env) {
  try {
    await env.DB.prepare('DELETE FROM prompts WHERE id = ?').bind(id).run()
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}


/* ================================================================
   SQL EXECUTE
   ================================================================ */

async function executeSql(request, env) {
  try {
    const body = await request.json()
    const sql  = (body.sql || '').trim()

    if (!sql) return json({ error: 'sql is required' }, 400)

    // Determine query type (SELECT-like vs mutation)
    const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN|WITH)/i.test(sql)

    if (isSelect) {
      const result = await env.DB.prepare(sql).all()
      return json({
        results     : result.results || [],
        rowsAffected: null,
        duration    : result.meta?.duration ?? null
      })
    } else {
      const result = await env.DB.prepare(sql).run()
      return json({
        results     : [],
        rowsAffected: result.meta?.changes ?? 0,
        lastInsertId: result.meta?.last_row_id ?? null,
        duration    : result.meta?.duration ?? null
      })
    }
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
