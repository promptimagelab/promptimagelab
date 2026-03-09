// _data.js — shared data layer (replaces MySQL + db.php)
import DATA from '../data.json';

export const getPages = () => DATA.pages;
export const getPage = slug => DATA.pages.find(p => p.slug === slug) || null;
export const getFaqs = pageId => DATA.faqs.filter(f => f.page_id === pageId);
export const getPromptSets = pageId => {
  const sets = DATA.prompt_sets.filter(s => s.page_id === pageId);
  return sets.map(set => ({ ...set, prompts: DATA.prompts.filter(p => p.set_id === set.id) }));
};
export const getRelated = pageId => {
  const rels = DATA.related_pages.filter(r => r.page_id === pageId);
  return rels.map(r => getPage(r.related_slug)).filter(Boolean);
};
export const searchPages = query => {
  const q = query.toLowerCase();
  const skip = ['home','about','contact','privacy-policy','terms-of-service','disclaimer','404'];
  return DATA.pages.filter(p => !skip.includes(p.slug))
    .filter(p => p.title?.toLowerCase().includes(q) || p.seo_description?.toLowerCase().includes(q))
    .slice(0, 60);
};
export const getPromptPages = () => {
  const skip = ['home','about','contact','privacy-policy','terms-of-service','disclaimer','404','prompts-library'];
  return DATA.pages.filter(p => !skip.includes(p.slug));
};
export const e = str => str ? String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
export const totalPrompts = () => DATA.prompts.length;
export const totalPages = () => DATA.pages.filter(p => !['home','about','contact','privacy-policy','terms-of-service','disclaimer','404'].includes(p.slug)).length;
