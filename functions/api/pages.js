import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

// GET ?key=home  → single page (public)
// GET (no key)   → all pages summary (admin only)
export async function onRequestGet(context) {
    const { request, env } = context;
    const key = new URL(request.url).searchParams.get('key');
    try {
        if (key) {
            const page = await env.DB.prepare('SELECT * FROM pages WHERE page_key=?').bind(key).first();
            return json({ page: page || null });
        }
        // List all pages for admin
        if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);
        const rows = await env.DB.prepare(
            'SELECT page_key, meta_title, meta_desc, updated_at FROM pages ORDER BY page_key'
        ).all();
        return json({ pages: rows.results || [] });
    } catch (e) { return json({ error: e.message }, 500); }
}

// PUT: upsert a page (admin only)
export async function onRequestPut(context) {
    const { request, env } = context;
    if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);
    try {
        const b = await request.json();
        const { page_key, meta_title, meta_desc, meta_keywords, og_title, og_desc, og_image,
            schema_type, sections_json } = b;
        if (!page_key) return json({ error: 'page_key required' }, 400);
        await env.DB.prepare(`
      INSERT INTO pages (page_key, meta_title, meta_desc, meta_keywords, og_title, og_desc, og_image,
        schema_type, sections_json, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,datetime('now'))
      ON CONFLICT(page_key) DO UPDATE SET
        meta_title=excluded.meta_title, meta_desc=excluded.meta_desc,
        meta_keywords=excluded.meta_keywords, og_title=excluded.og_title,
        og_desc=excluded.og_desc, og_image=excluded.og_image,
        schema_type=excluded.schema_type, sections_json=excluded.sections_json,
        updated_at=datetime('now')
    `).bind(
            page_key,
            meta_title || null, meta_desc || null, meta_keywords || null,
            og_title || null, og_desc || null, og_image || null,
            schema_type || 'WebPage', sections_json || null
        ).run();
        return json({ success: true });
    } catch (e) { return json({ error: e.message }, 500); }
}
