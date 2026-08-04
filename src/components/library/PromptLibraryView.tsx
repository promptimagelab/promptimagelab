import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { INITIAL_LIBRARY_PROMPTS } from '../../data/libraryData';
import { PromptItem } from '../../types';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Star, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Filter,
  ShieldCheck,
  Code,
  Building2,
  Cpu
} from 'lucide-react';
import { Button } from '@ui-core';
import { SaasAuthState } from '../../hooks/useSaasAuth';

interface PromptLibraryViewProps {
  onSelectPrompt: (promptId: string) => void;
  onOpenPlayground: (promptText?: string) => void;
  saasAuth?: SaasAuthState;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({
  onSelectPrompt,
  onOpenPlayground
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Software Development',
    'ServiceNow',
    'Python',
    'SQL',
    'AWS',
    'React',
    'Marketing',
    'Business Operations',
    'Cybersecurity'
  ];

  const handleCopyPrompt = (e: React.MouseEvent, prompt: PromptItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.promptText);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = INITIAL_LIBRARY_PROMPTS.filter(p => {
    const matchesCat = selectedCategory === 'All' || 
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      p.industry.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="AI Prompt Library — Problem-Centric Prompts"
        description="Production-ready, battle-tested AI prompts for ServiceNow automation, Python refactoring, SQL optimization, AWS security audits, and software engineering."
        canonicalUrl="https://promptimagelab.com/prompt-library"
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Friendly Hero Banner Header with Proper Container Margins */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Everyday Problem-Centric AI Prompts</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Prompt Library
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Clear, battle-tested prompts engineered for real business outcomes. Select a prompt to view customization guides, input/output examples, and instant Studio playground execution.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-start sm:items-end gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>4.9 / 5.0 Rating</span>
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-300">100% Verified Production Quality</span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search prompts by domain (e.g. Python, ServiceNow, SQL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User-Friendly Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group hover:border-indigo-500/60"
            >
              <div className="space-y-4">
                {/* Header Pills */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
                    {prompt.category}
                  </span>
                  
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{prompt.rating}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {prompt.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mt-1.5 leading-relaxed">
                    {prompt.description}
                  </p>
                </div>

                {/* Compatible Models */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compatible Models:</span>
                  <div className="flex flex-wrap gap-1">
                    {prompt.models.map(m => (
                      <span key={m} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold uppercase">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar Buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleCopyPrompt(e, prompt)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Copy Raw Prompt"
                >
                  {copiedId === prompt.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === prompt.id ? 'Copied' : 'Copy'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onSelectPrompt(prompt.id); }}
                    className="text-xs font-bold"
                  >
                    Details
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onOpenPlayground(prompt.promptText); }}
                    className="text-xs font-bold flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
