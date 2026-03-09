// _data.js — shared data layer (replaces db.php)
// All your MySQL data is embedded here as JSON
// No database server needed on Cloudflare Pages

import DATA from '../data.json';

export function getPages() {
  return DATA.pages;
}

export function getPage(slug) {
  return DATA.pages.find(p => p.slug === slug) || null;
}

export function getFaqsForPage(pageId) {
  return DATA.faqs.filter(f => f.page_id === pageId);
}

export function getPromptSetsForPage(pageId) {
  const sets = DATA.prompt_sets.filter(s => s.page_id === pageId);
  return sets.map(set => ({
    ...set,
    prompts: DATA.prompts.filter(p => p.set_id === set.id)
  }));
}

export function getRelatedPages(pageId) {
  const related = DATA.related_pages.filter(r => r.page_id === pageId);
  return related.map(r => getPage(r.related_slug)).filter(Boolean);
}

export function searchPages(query) {
  const q = query.toLowerCase();
  const excluded = ['home', 'about', 'contact', 'privacy-policy',
                    'terms-of-service', 'disclaimer', '404'];
  return DATA.pages
    .filter(p => !excluded.includes(p.slug))
    .filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.seo_description?.toLowerCase().includes(q)
    )
    .slice(0, 60);
}

export function getPromptPages() {
  const excluded = ['home', 'about', 'contact', 'privacy-policy',
                    'terms-of-service', 'disclaimer', '404', 'prompts-library'];
  return DATA.pages
    .filter(p => !excluded.includes(p.slug))
    .slice(0, 60);
}

export function e(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
