import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const statusParam = url.searchParams.get('status') || '';
  if (!slug) return json({ error: 'slug required' }, 400);

  // Allow admin (authenticated) to fetch any slug regardless of status
  const isAdmin = statusParam === 'any' && await validateSession(env, request);

  try {
    const statusFilter = isAdmin ? '' : " AND status='published'";
    const prompt = await env.DB.prepare(`SELECT * FROM prompts WHERE slug=?${statusFilter}`).bind(slug).first();
    if (!prompt) return json({ error: 'Not found' }, 404);
    // increment views only for public (non-admin) requests
    if (!isAdmin) {
      await env.DB.prepare('UPDATE prompts SET views=views+1 WHERE id=?').bind(prompt.id).run();
    }
    const related = await env.DB.prepare(
      "SELECT id,title,slug,category,image,excerpt,reading_time FROM prompts WHERE category=? AND slug!=? AND status='published' ORDER BY featured DESC, created_at DESC LIMIT 4"
    ).bind(prompt.category, slug).all();
    return json({ prompt, related: related.results });
  } catch (e) { return json({ error: e.message }, 500); }
}
