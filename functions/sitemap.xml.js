/**
 * PromptImageLab — Professional Dynamic Sitemap
 * Served at: /sitemap.xml
 * Cloudflare Pages Function
 *
 * Features:
 *  - Sitemap Index when prompts > 500 (splits into sub-sitemaps)
 *  - Image extension (<image:image>) for every prompt that has an image
 *  - Accurate lastmod dates from DB updated_at
 *  - Correct priorities and changefreq per Google guidelines
 *  - Proper XML namespaces for image sitemap
 *  - 1-hour server cache, 5-min edge cache
 *  - Graceful fallback if DB is unavailable
 */

const BASE = 'https://promptimagelab.com';
const SITEMAP_LIMIT = 500; // Google max recommended per sitemap file

// Static pages configuration
const STATIC_PAGES = [
    { loc: '/', priority: '1.00', freq: 'daily' },
    { loc: '/about.html', priority: '0.70', freq: 'monthly' },
    { loc: '/contact.html', priority: '0.50', freq: 'monthly' },
    { loc: '/privacy-policy.html', priority: '0.30', freq: 'yearly' },
];

/** Format a DB date string → YYYY-MM-DD for lastmod */
function toDate(val) {
    if (!val) return new Date().toISOString().slice(0, 10);
    // Handle both "2026-03-10 08:22:00" and ISO strings
    return String(val).replace(' ', 'T').slice(0, 10);
}

/** Encode a URL for safe XML inclusion */
function xmlEnc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** Build one <url> block, with optional image sub-element */
function urlBlock({ loc, lastmod, freq, priority, image, imageTitle }) {
    let block = `  <url>\n    <loc>${xmlEnc(loc)}</loc>\n`;
    if (lastmod) block += `    <lastmod>${lastmod}</lastmod>\n`;
    if (freq) block += `    <changefreq>${freq}</changefreq>\n`;
    if (priority) block += `    <priority>${priority}</priority>\n`;
    if (image) {
        block += `    <image:image>\n`;
        block += `      <image:loc>${xmlEnc(image)}</image:loc>\n`;
        if (imageTitle) block += `      <image:title>${xmlEnc(imageTitle)}</image:title>\n`;
        block += `    </image:image>\n`;
    }
    block += `  </url>`;
    return block;
}

/** Full sitemap XML document with image namespace */
function buildSitemapXml(urlBlocks) {
    return [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`,
        `<urlset`,
        `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
        `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`,
        `  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
        `  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
        `                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
        ...urlBlocks,
        `</urlset>`,
    ].join('\n');
}

/** Sitemap Index document (when > SITEMAP_LIMIT prompts) */
function buildSitemapIndex(sitemapUrls, today) {
    const entries = sitemapUrls.map(u =>
        `  <sitemap>\n    <loc>${xmlEnc(u)}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
    );
    return [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ...entries,
        `</sitemapindex>`,
    ].join('\n');
}

/** Response headers for proper caching and content type */
function xmlResponse(body, status = 200) {
    return new Response(body, {
        status,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            // 1 hour browser cache, 5 min Cloudflare edge cache
            'Cache-Control': 'public, max-age=3600, s-maxage=300, stale-while-revalidate=86400',
            // Tell GoogleBot the sitemap itself should NOT be indexed
            'X-Robots-Tag': 'noindex, nofollow',
            'Vary': 'Accept-Encoding',
        },
    });
}

// ══════════════════════════════════════════
// Main handler
// ══════════════════════════════════════════
export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const today = new Date().toISOString().slice(0, 10);

    // Support sub-sitemap pagination: /sitemap.xml?page=2
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));

    try {
        // ── Fetch all published prompts from DB ──
        const { results: prompts } = await env.DB.prepare(
            `SELECT slug, title, image, category, updated_at, created_at
       FROM prompts
       WHERE status='published'
       ORDER BY featured DESC, updated_at DESC`
        ).all();

        const totalPrompts = (prompts || []).length;

        // ── Sitemap Index mode (too many URLs for one file) ──
        if (totalPrompts > SITEMAP_LIMIT && page === 1 && !url.searchParams.has('page')) {
            const totalPages = Math.ceil(totalPrompts / SITEMAP_LIMIT);
            const sitemapUrls = [
                `${BASE}/sitemap.xml?page=static`,
                ...Array.from({ length: totalPages }, (_, i) => `${BASE}/sitemap.xml?page=${i + 1}`),
            ];
            return xmlResponse(buildSitemapIndex(sitemapUrls, today));
        }

        // ── Static pages sitemap ──
        if (url.searchParams.get('page') === 'static') {
            const blocks = STATIC_PAGES.map(p =>
                urlBlock({ loc: BASE + p.loc, lastmod: today, freq: p.freq, priority: p.priority })
            );
            return xmlResponse(buildSitemapXml(blocks));
        }

        // ── Prompt pages sitemap (paginated or all) ──
        const offset = (page - 1) * SITEMAP_LIMIT;
        const pagePrompts = totalPrompts > SITEMAP_LIMIT
            ? (prompts || []).slice(offset, offset + SITEMAP_LIMIT)
            : (prompts || []);

        // Static pages are included on page 1 (or when not paginated)
        const includeStatic = page === 1;
        const allBlocks = [];

        if (includeStatic) {
            STATIC_PAGES.forEach(p => {
                allBlocks.push(urlBlock({
                    loc: BASE + p.loc,
                    lastmod: today,
                    freq: p.freq,
                    priority: p.priority,
                }));
            });
        }

        pagePrompts.forEach(p => {
            const loc = `${BASE}/prompts/${p.slug}`;
            const lastmod = toDate(p.updated_at || p.created_at);
            // Higher priority for recently updated content
            const daysSinceUpdate = (Date.now() - new Date(lastmod + 'T00:00:00Z').getTime()) / 86400000;
            const priority = daysSinceUpdate < 30 ? '0.90' : daysSinceUpdate < 180 ? '0.80' : '0.70';

            allBlocks.push(urlBlock({
                loc,
                lastmod,
                freq: daysSinceUpdate < 30 ? 'weekly' : 'monthly',
                priority,
                image: p.image || null,
                imageTitle: p.image ? (p.title || p.slug.replace(/-/g, ' ')) : null,
            }));
        });

        return xmlResponse(buildSitemapXml(allBlocks));

    } catch (err) {
        // ── Graceful fallback — always return a valid sitemap ──
        const fallback = buildSitemapXml(
            STATIC_PAGES.map(p =>
                urlBlock({ loc: BASE + p.loc, lastmod: today, freq: p.freq, priority: p.priority })
            )
        );
        return xmlResponse(fallback);
    }
}
