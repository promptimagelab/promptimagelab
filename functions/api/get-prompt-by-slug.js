import { json, cors } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestGet(context) {
  const { request, env } = context;
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return json({ error: 'slug required' }, 400);

  try {
    const prompt  = await env.DB.prepare('SELECT * FROM prompts WHERE slug=?').bind(slug).first();
    if (!prompt) return json({ error: 'Not found' }, 404);

    const related = await env.DB.prepare('SELECT id,title,slug,category,image FROM prompts WHERE category=? AND slug!=? LIMIT 4').bind(prompt.category, slug).all();
    return json({ prompt, related: related.results });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
