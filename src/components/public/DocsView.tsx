import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Clock, ArrowRight, Sparkles, 
  Layers, Network, ShieldCheck, Code, Users, X, 
  Building2, Puzzle, Star, Rocket, GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { docsDatabase, DocArticle } from '../../data/docsData';
import { useSEO } from '../../hooks/useSEO';

interface DocsViewProps {
  onSelectArticle: (slug: string) => void;
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, {
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  'Tutorials': {
    label: 'Tutorials',
    desc: 'Step-by-step guides to get you productive quickly',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  'Architecture': {
    label: 'Architecture',
    desc: 'Deep technical specs and system design documents',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  'Integrations': {
    label: 'Integrations',
    desc: 'Connect OpsPilot and Studio to your existing tools',
    icon: <Puzzle className="w-5 h-5" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/40',
    borderColor: 'border-violet-200 dark:border-violet-800',
  },
  'Enterprise Use Cases': {
    label: 'Enterprise Guides',
    desc: 'How real engineering teams deploy and measure ROI',
    icon: <Building2 className="w-5 h-5" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  'Best Practices': {
    label: 'Best Practices',
    desc: 'Proven patterns for production-grade AI systems',
    icon: <Star className="w-5 h-5" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  'API Reference': {
    label: 'API Reference',
    desc: 'Complete REST endpoint specifications and schemas',
    icon: <Code className="w-5 h-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  'IT Operations': {
    label: 'IT Operations',
    desc: 'ServiceNow ITSM automation and MTTR reduction',
    icon: <Network className="w-5 h-5" />,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
  'AI Engineering': {
    label: 'AI Engineering',
    desc: 'Prompt lifecycle management and cost governance',
    icon: <Layers className="w-5 h-5" />,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  'Software Engineering': {
    label: 'Software Engineering',
    desc: 'PR audits, code quality and DevSecOps automation',
    icon: <Rocket className="w-5 h-5" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
};

const PRODUCT_BADGE_COLORS: Record<DocArticle['product'], string> = {
  'Enterprise Use Cases': 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'OpsPilot':            'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  'Studio':              'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Architecture':        'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Shared Services':     'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  'API Reference':       'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

const TOP_LEVEL_CATEGORIES = ['All', 'Tutorials', 'Architecture', 'Integrations', 'Enterprise Use Cases', 'Best Practices', 'API Reference'];

// ─── Main Component ───────────────────────────────────────────────────────────

export const DocsView: React.FC<DocsViewProps> = ({ onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  useSEO({
    title: 'Documentation & Enterprise Guides | PromptImageLab',
    description: 'Technical documentation, architecture specs, integration guides, enterprise use cases, and best practices for PromptImageLab OpsPilot and Studio.',
    keywords: 'PromptImageLab Docs, ServiceNow Integration, Multi-Agent Architecture, Code Audit, Prompt Engineering, API Reference'
  });

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return docsDatabase.filter((doc) => {
      const matchesSearch = !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.keywords.some((k) => k.toLowerCase().includes(q)) ||
        doc.category.toLowerCase().includes(q);
      const matchesFilter = selectedFilter === 'All' || doc.category === selectedFilter || doc.product === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Group by category when no search
  const isSearching = searchQuery.length > 0;
  const groupedByCategory = useMemo(() => {
    if (isSearching || selectedFilter !== 'All') return null;
    const groups: Record<string, DocArticle[]> = {};
    docsDatabase.forEach((doc) => {
      const cat = doc.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(doc);
    });
    return groups;
  }, [isSearching, selectedFilter]);

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 dark:from-slate-900/50 to-white dark:to-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase">
            <BookOpen className="w-4 h-4" />
            Technical Documentation & Enterprise Knowledge Base
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Documentation &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Enterprise Guides
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Architecture specs, integration setups, engineering tutorials, best practices, and in-depth guides showing how real teams deploy OpsPilot and Studio.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Search docs — ServiceNow, PR audit, DAG orchestration, token cost..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORY PILLS ────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-hide">
            {TOP_LEVEL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedFilter(cat); setSearchQuery(''); }}
                className={cn(
                  'shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap',
                  selectedFilter === cat && !searchQuery
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                {cat === 'Enterprise Use Cases' ? 'Enterprise Guides' : cat}
              </button>
            ))}
            <div className="ml-auto shrink-0 text-xs text-slate-400 font-mono pl-4">
              {filteredArticles.length} guide{filteredArticles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Search results mode */}
        {(isSearching || selectedFilter !== 'All') && (
          filteredArticles.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <BookOpen className="w-14 h-14 text-slate-200 dark:text-slate-700 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No guides found</h3>
              <p className="text-sm text-slate-500">Try a different search term or reset your filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedFilter('All'); }}
                className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredArticles.map((a) => <ArticleCard key={a.id} article={a} onClick={() => onSelectArticle(a.slug)} />)}
            </div>
          )
        )}

        {/* Grouped by category mode */}
        {groupedByCategory && !isSearching && selectedFilter === 'All' && (
          <div className="space-y-16">
            {(Object.entries(groupedByCategory) as [string, DocArticle[]][]).map(([category, articles]) => {
              const meta = CATEGORY_META[category];
              return (
                <section key={category}>
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className={cn('p-2.5 rounded-xl border', meta?.bgColor || 'bg-slate-100 dark:bg-slate-800', meta?.borderColor || 'border-slate-200')}>
                      <span className={meta?.color || 'text-slate-600 dark:text-slate-400'}>
                        {meta?.icon || <BookOpen className="w-5 h-5" />}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {meta?.label || category}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {meta?.desc || ''}
                      </p>
                    </div>
                  </div>

                  {/* Articles grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {articles.map((a) => <ArticleCard key={a.id} article={a} onClick={() => onSelectArticle(a.slug)} />)}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Article Card ─────────────────────────────────────────────────────────────

interface ArticleCardProps { article: DocArticle; onClick: () => void }

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn(
          'inline-block px-2.5 py-0.5 rounded-lg border text-[10px] font-bold tracking-wide uppercase',
          PRODUCT_BADGE_COLORS[article.product] || 'bg-indigo-100 text-indigo-700 border-indigo-200'
        )}>
          {article.product === 'Enterprise Use Cases' ? 'Enterprise Guide' : article.product}
        </span>

        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
          <Clock className="w-3 h-3" />
          {article.readTime}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug text-base">
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {article.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 min-w-0">
          <Users className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
          <span className="truncate">{article.targetAudience.split(',')[0].trim()}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0">
          Read <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Keyword tags */}
      <div className="flex flex-wrap gap-1">
        {article.keywords.slice(0, 3).map((kw) => (
          <span key={kw} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            #{kw}
          </span>
        ))}
      </div>
    </div>
  );
};
