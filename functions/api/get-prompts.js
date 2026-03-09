import { json, cors } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const url      = new URL(request.url);
  const page     = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit    = Math.min(50, parseInt(url.searchParams.get('limit') || '12'));
  const category = url.searchParams.get('category') || '';
  const offset   = (page - 1) * limit;

  try {
    let rows, countRow;
    if (category) {
      rows     = await env.DB.prepare('SELECT id,title,slug,category,image,meta_desc,created_at FROM prompts WHERE category=? ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(category, limit, offset).all();
      countRow = await env.DB.prepare('SELECT COUNT(*) as total FROM prompts WHERE category=?').bind(category).first();
    } else {
      rows     = await env.DB.prepare('SELECT id,title,slug,category,image,meta_desc,created_at FROM prompts ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all();
      countRow = await env.DB.prepare('SELECT COUNT(*) as total FROM prompts').first();
    }
    const total = countRow?.total || 0;
    return json({ prompts: rows.results, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
