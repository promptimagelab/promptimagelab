import { json, cors, validateSession, slugify } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);
  try {
    const b = await request.json();
    const { title, slug, content, excerpt, category, tags, image, meta_title, meta_desc,
            focus_keyword, og_image, schema_type, reading_time, featured, status, author } = b;
    if (!title || !content) return json({ error: 'title and content are required' }, 400);
    const cleanSlug = slug ? slugify(slug) : slugify(title);
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const result = await env.DB.prepare(
      `INSERT INTO prompts (title,slug,content,excerpt,category,tags,image,meta_title,meta_desc,focus_keyword,og_image,schema_type,reading_time,word_count,featured,status,author,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`
    ).bind(
      title, cleanSlug, content, excerpt||null, category||'general', tags||null,
      image||null, meta_title||title, meta_desc||null, focus_keyword||null,
      og_image||image||null, schema_type||'Article',
      reading_time||Math.ceil(wordCount/200), wordCount,
      featured?1:0, status||'published', author||'PromptImageLab'
    ).run();
    return json({ success: true, id: result.meta?.last_row_id, slug: cleanSlug }, 201);
  } catch (e) {
    if (e.message?.includes('UNIQUE')) return json({ error: 'Slug already exists. Choose a different title or slug.' }, 409);
    return json({ error: e.message }, 500);
  }
}
