/**
 * /api/ping-sitemap — Ping Google & Bing after sitemap update
 * Admin-only endpoint (requires Authorization header)
 */

const SITEMAP_URL = 'https://promptimagelab.com/sitemap.xml';

const PING_TARGETS = [
    {
        name: 'Google',
        url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
        submitUrl: 'https://search.google.com/search-console',
    },
    {
        name: 'Bing',
        url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
        submitUrl: 'https://www.bing.com/webmasters',
    },
];

export async function onRequestPost(context) {
    const { request, env } = context;

    // Auth check
    const auth = request.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = [];
    const pingPromises = PING_TARGETS.map(async (target) => {
        try {
            const res = await fetch(target.url, {
                method: 'GET',
                headers: { 'User-Agent': 'PromptImageLab SitemapPinger/1.0' },
                redirect: 'follow',
                signal: AbortSignal.timeout(8000), // 8s timeout
            });
            results.push({
                engine: target.name,
                ok: res.ok || res.status === 200,
                status: res.status,
                message: res.ok ? 'Pinged successfully' : `HTTP ${res.status}`,
            });
        } catch (err) {
            results.push({
                engine: target.name,
                ok: false,
                status: 0,
                message: err.message || 'Network error',
            });
        }
    });

    await Promise.allSettled(pingPromises);

    // Also get current sitemap URL count from DB for stats
    let urlCount = 0;
    let imageCount = 0;
    let categories = {};
    try {
        const { results: prompts } = await env.DB.prepare(
            `SELECT category, image FROM prompts WHERE status='published'`
        ).all();
        urlCount = (prompts || []).length + 4; // +4 for static pages
        imageCount = (prompts || []).filter(p => p.image).length;
        (prompts || []).forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
    } catch (_) { }

    return Response.json({
        ok: results.every(r => r.ok),
        pingedAt: new Date().toISOString(),
        sitemapUrl: SITEMAP_URL,
        results,
        stats: { urlCount, imageCount, categories },
    });
}

// GET: return current sitemap stats only (no ping)
export async function onRequestGet(context) {
    const { request, env } = context;
    const auth = request.headers.get('Authorization') || '';
    if (!auth.replace('Bearer ', '').trim()) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let urlCount = 0;
    let imageCount = 0;
    let lastUpdated = null;
    let categories = {};
    let recentSlugs = [];
    try {
        const { results: prompts } = await env.DB.prepare(
            `SELECT slug, category, image, updated_at FROM prompts WHERE status='published' ORDER BY updated_at DESC`
        ).all();
        urlCount = (prompts || []).length + 4;
        imageCount = (prompts || []).filter(p => p.image).length;
        lastUpdated = prompts?.[0]?.updated_at || null;
        recentSlugs = (prompts || []).slice(0, 5).map(p => p.slug);
        (prompts || []).forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }

    return Response.json({
        sitemapUrl: SITEMAP_URL,
        stats: { urlCount, imageCount, lastUpdated, categories, recentSlugs },
    });
}
