import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);

  try {
    const { title, slug, content, category, image, meta_desc } = await request.json();
    if (!title || !slug || !content) return json({ error: 'title, slug, content required' }, 400);

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const result = await env.DB.prepare(
      "INSERT INTO prompts (title,slug,content,category,image,meta_desc,created_at,updated_at) VALUES (?,?,?,?,?,?,datetime('now'),datetime('now'))"
    ).bind(title, cleanSlug, content, category || 'general', image || null, meta_desc || null).run();

    return json({ success: true, id: result.meta?.last_row_id, slug: cleanSlug }, 201);
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return json({ error: 'Slug already exists' }, 409);
    return json({ error: e.message }, 500);
  }
}
