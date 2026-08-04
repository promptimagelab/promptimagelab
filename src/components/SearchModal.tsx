/**
 * SearchModal — Global Command Palette (Ctrl+K)
 *
 * Features:
 * - Searches: Prompts, Workflows, Documentation, Pages
 * - Recent searches stored in localStorage (last 5)
 * - Keyboard arrow navigation (↑↓ + Enter)
 * - ARIA focus trap — Tab/Shift+Tab cycles inside modal
 * - Escape to close
 * - Typo-tolerant fuzzy search
 * - Search result count per category
 * - Docs articles included in search
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search, X, FileText, Workflow, BookOpen, Layers, Network,
  ShieldCheck, ArrowRight, Clock, Sparkles, Hash
} from 'lucide-react';
import { INITIAL_LIBRARY_PROMPTS } from '../data/libraryData';
import { INITIAL_WORKFLOWS } from '../data/workflowsData';
import { docsDatabase } from '../data/docsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tab: string) => void;
}

const RECENT_SEARCHES_KEY = 'pil_recent_searches';
const MAX_RECENT = 5;

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Fuzzy match: returns true if all chars of needle appear in order in haystack
function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h.includes(n)) return true;
  let hi = 0;
  for (let ni = 0; ni < n.length; ni++) {
    const found = h.indexOf(n[ni], hi);
    if (found === -1) return false;
    hi = found + 1;
  }
  return true;
}

type Category = 'All' | 'Prompts' | 'Workflows' | 'Docs' | 'Pages';

interface SearchResult {
  id: string;
  title: string;
  desc: string;
  route: string;
  category: Category;
  icon: React.ElementType;
  accent: string;
}

const STATIC_PAGES: SearchResult[] = [
  { id: 'page-home', title: 'Home', desc: 'Enterprise AI Engineering Platform', route: 'home', category: 'Pages', icon: Layers, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-platform', title: 'Platform Overview', desc: 'Architecture, OpsPilot & Studio', route: 'platform', category: 'Pages', icon: Layers, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-opspilot', title: 'OpsPilot — IT Operations AI', desc: 'Autonomous incident triage & telemetry', route: 'opspilot-public', category: 'Pages', icon: Network, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-studio', title: 'Agent Studio', desc: 'Live multi-model prompt pipeline', route: 'studio-public', category: 'Pages', icon: Sparkles, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-collections', title: 'Curated Collections', desc: 'GitHub-style AI blueprint bundles', route: 'collections', category: 'Pages', icon: Layers, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-community', title: 'Community & Roadmap', desc: 'Feature requests & waitlist hub', route: 'community', category: 'Pages', icon: Layers, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-docs', title: 'Documentation & Guides', desc: 'Step-by-step enterprise tutorials', route: 'docs', category: 'Pages', icon: BookOpen, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-pricing', title: 'Pricing & Plans', desc: 'Transparent SaaS pricing', route: 'pricing', category: 'Pages', icon: ShieldCheck, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  { id: 'page-integrations', title: 'Integrations Catalog', desc: 'ServiceNow, OpenAI, Gemini connectors', route: 'integrations', category: 'Pages', icon: Network, accent: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'); }
    catch { return []; }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const listboxId = 'search-results-listbox';

  // ── Focus trap ────────────────────────────────────────────────────────────
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];
    if (e.key === 'Tab') {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (!isOpen) return;
      if (e.key === 'Escape') { onClose(); return; }
      trapFocus(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, trapFocus]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ── Build search results ──────────────────────────────────────────────────
  const allResults = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const prompts: SearchResult[] = INITIAL_LIBRARY_PROMPTS
      .filter(p => fuzzyMatch(p.title, query) || fuzzyMatch(p.category, query) || p.tags.some(t => fuzzyMatch(t, query)))
      .slice(0, 5)
      .map(p => ({
        id: `prompt-${p.id}`,
        title: p.title,
        desc: `${p.category} • ${p.models.join(', ')}`,
        route: `prompt-detail-${p.id}`,
        category: 'Prompts' as Category,
        icon: FileText,
        accent: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
      }));

    const workflows: SearchResult[] = INITIAL_WORKFLOWS
      .filter(w => fuzzyMatch(w.title, query) || fuzzyMatch(w.description, query))
      .slice(0, 5)
      .map(w => ({
        id: `wf-${w.id}`,
        title: w.title,
        desc: `${w.steps.length} Steps • ${w.description.substring(0, 60)}`,
        route: `workflow-detail-${w.id}`,
        category: 'Workflows' as Category,
        icon: Workflow,
        accent: 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400',
      }));

    const docs: SearchResult[] = docsDatabase
      .filter(d => fuzzyMatch(d.title, query) || fuzzyMatch(d.description, query) || d.keywords.some(k => fuzzyMatch(k, query)))
      .slice(0, 5)
      .map(d => ({
        id: `doc-${d.id}`,
        title: d.title,
        desc: `${d.product} • ${d.category} • ${d.readTime}`,
        route: `docs-${d.slug}`,
        category: 'Docs' as Category,
        icon: BookOpen,
        accent: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
      }));

    const pages: SearchResult[] = STATIC_PAGES
      .filter(p => fuzzyMatch(p.title, query) || fuzzyMatch(p.desc, query));

    return [...prompts, ...workflows, ...docs, ...pages];
  }, [query]);

  const filteredResults = useMemo(() => {
    if (activeCategory === 'All') return allResults;
    return allResults.filter(r => r.category === activeCategory);
  }, [allResults, activeCategory]);

  // ── Arrow key navigation ──────────────────────────────────────────────────
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      selectResult(filteredResults[focusedIndex]);
    }
  };

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && resultsRef.current) {
      const item = resultsRef.current.querySelector<HTMLElement>(`[data-index="${focusedIndex}"]`);
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const saveSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const selectResult = (result: SearchResult) => {
    saveSearch(query);
    onSelect(result.route);
    onClose();
  };

  const countByCategory = (cat: Category) =>
    cat === 'All' ? allResults.length : allResults.filter(r => r.category === cat).length;

  if (!isOpen) return null;

  const groupedResults = (['Prompts', 'Workflows', 'Docs', 'Pages'] as const).map(cat => ({
    cat,
    items: filteredResults.filter(r => r.category === cat),
  })).filter(g => g.items.length > 0);

  let globalIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        style={{ maxHeight: 'min(75vh, 600px)' }}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            role="combobox"
            aria-expanded={filteredResults.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocusedIndex(-1); }}
            onKeyDown={handleKeyNavigation}
            placeholder="Search prompts, workflows, docs, pages..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
            autoComplete="off"
          />
          <div className="flex items-center gap-2 ml-3">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">
              Esc
            </kbd>
            <button
              onClick={onClose}
              aria-label="Close command palette"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {query && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/80 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto">
            {(['All', 'Prompts', 'Workflows', 'Docs', 'Pages'] as const).map(cat => {
              const count = countByCategory(cat);
              if (cat !== 'All' && count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat} {count > 0 && <span className="ml-0.5 opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Results / Recent Searches */}
        <div
          ref={resultsRef}
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto"
        >
          {/* Empty query — show recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Recent Searches</div>
              {recentSearches.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group transition-colors text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Empty query, no recents */}
          {!query && recentSearches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-slate-400">
              <Hash className="w-8 h-8" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Search everything</p>
                <p className="text-xs mt-1">Prompts, Workflows, Docs, Pages</p>
              </div>
            </div>
          )}

          {/* Search results */}
          {query && filteredResults.length > 0 && (
            <div className="p-3 space-y-4">
              {groupedResults.map(({ cat, items }) => (
                <div key={cat}>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 px-2">{cat}</div>
                  <div className="space-y-0.5">
                    {items.map(result => {
                      globalIndex++;
                      const thisIndex = globalIndex;
                      const isFocused = focusedIndex === thisIndex;
                      const Icon = result.icon;
                      return (
                        <button
                          key={result.id}
                          data-index={thisIndex}
                          role="option"
                          aria-selected={isFocused}
                          onClick={() => selectResult(result)}
                          onMouseEnter={() => setFocusedIndex(thisIndex)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between group transition-colors focus:outline-none ${
                            isFocused ? 'bg-indigo-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 ${result.accent}`} aria-hidden="true">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className={`text-xs font-bold truncate ${isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                {result.title}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">{result.desc}</div>
                            </div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 shrink-0 ml-2 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-300'}`} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query && filteredResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2 text-slate-400">
              <Search className="w-8 h-8 opacity-40" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No results for <em>"{query}"</em></p>
              <p className="text-xs">Try searching for a prompt category, workflow type, or doc topic.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">↑↓</kbd> navigate
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">↵</kbd> select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px]">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
};
