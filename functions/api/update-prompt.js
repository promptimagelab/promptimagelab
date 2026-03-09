import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestPut(context) {
  const { request, env } = context;
  if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);

  try {
    const body = await request.json();
    const { id, title, slug, content, category, image, meta_desc } = body;
    if (!id) return json({ error: 'id required' }, 400);

    const cleanSlug = slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    await env.DB.prepare(
      "UPDATE prompts SET title=?,slug=?,content=?,category=?,image=?,meta_desc=?,updated_at=datetime('now') WHERE id=?"
    ).bind(title, cleanSlug, content, category || 'general', image || null, meta_desc || null, id).run();

    return json({ success: true, slug: cleanSlug });
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return json({ error: 'Slug already exists' }, 409);
    return json({ error: e.message }, 500);
  }
}
