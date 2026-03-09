import { json, cors } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return json({ error: 'slug required' }, 400);
  try {
    const prompt = await env.DB.prepare("SELECT * FROM prompts WHERE slug=? AND status='published'").bind(slug).first();
    if (!prompt) return json({ error: 'Not found' }, 404);
    // increment views
    await env.DB.prepare('UPDATE prompts SET views=views+1 WHERE id=?').bind(prompt.id).run();
    const related = await env.DB.prepare(
      "SELECT id,title,slug,category,image,excerpt,reading_time FROM prompts WHERE category=? AND slug!=? AND status='published' ORDER BY featured DESC, created_at DESC LIMIT 4"
    ).bind(prompt.category, slug).all();
    return json({ prompt, related: related.results });
  } catch (e) { return json({ error: e.message }, 500); }
}