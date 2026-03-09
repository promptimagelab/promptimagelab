import { json, cors, validateSession } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestDelete(context) {
  const { request, env } = context;
  if (!await validateSession(env, request)) return json({ error: 'Unauthorized' }, 401);

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'id required' }, 400);
    await env.DB.prepare('DELETE FROM prompts WHERE id=?').bind(id).run();
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
