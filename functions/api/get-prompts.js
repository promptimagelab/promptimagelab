import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(200, parseInt(url.searchParams.get('limit') || '12'));
  const category = url.searchParams.get('category') || '';
  const featured = url.searchParams.get('featured') || '';
  const search = url.searchParams.get('search') || '';
  const statusParam = url.searchParams.get('status') || '';
  const offset = (page - 1) * limit;

  // Allow admin (authenticated) requests to see all statuses
  const isAdmin = statusParam === 'all' && await validateSession(env, request);

  try {
    let where = isAdmin ? '1=1' : "status='published'";
    const binds = [];
    if (!isAdmin && statusParam && statusParam !== 'all') { where += ' AND status=?'; binds.push(statusParam); }
    if (category) { where += ' AND category=?'; binds.push(category); }
    if (featured) { where += ' AND featured=1'; }
    if (search) { where += ' AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)'; binds.push('%' + search + '%', '%' + search + '%', '%' + search + '%'); }

    const rows = await env.DB.prepare(
      `SELECT id,title,slug,excerpt,category,tags,image,meta_desc,reading_time,word_count,views,featured,status,created_at FROM prompts WHERE ${where} ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`
    ).bind(...binds, limit, offset).all();

    const countRow = await env.DB.prepare(
      `SELECT COUNT(*) as total FROM prompts WHERE ${where}`
    ).bind(...binds).first();

    const total = countRow?.total || 0;
    return json({ prompts: rows.results, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { return json({ error: e.message }, 500); }
}
