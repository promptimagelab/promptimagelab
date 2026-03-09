import { json, cors } from './_middleware.js';

export async function onRequestOptions() { return cors(); }

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { username, password } = await request.json();
    const adminUser  = env.ADMIN_USERNAME || 'admin';
    const storedHash = env.ADMIN_PASSWORD_HASH;
    if (!storedHash) return json({ error: 'Admin not configured. Set ADMIN_PASSWORD_HASH in wrangler.toml [vars].' }, 500);
    const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (username !== adminUser || hash !== storedHash) return json({ error: 'Invalid username or password.' }, 401);
    const token     = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    await env.DB.prepare('INSERT INTO admin_sessions (token,expires_at) VALUES (?,?)').bind(token, expiresAt).run();
    await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at < datetime('now')").run();
    return json({ success: true, token });
  } catch (e) { return json({ error: e.message }, 500); }
}