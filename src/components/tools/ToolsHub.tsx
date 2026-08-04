import React, { useState } from 'react';
import { ToolMeta } from '../../types';
import { useLocalDb } from '../../hooks/useLocalDb';
import { 
  Wand2, 
  Sparkles, 
  Bug, 
  ShieldCheck, 
  Camera, 
  Calculator, 
  Play, 
  Languages, 
  Edit3, 
  ImagePlus, 
  Brackets, 
  UserCheck, 
  Slash, 
  Database, 
  Code2, 
  ArrowRight,
  Search
} from 'lucide-react';

interface ToolsHubProps {
  onSelectTool: (slug: string) => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ onSelectTool }) => {
  const { tools } = useLocalDb();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Optimization', 'Generation', 'Security & Testing', 'Image & Vision', 'Utility'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wand2': return <Wand2 className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Bug': return <Bug className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'Play': return <Play className="w-5 h-5" />;
      case 'Languages': return <Languages className="w-5 h-5" />;
      case 'Edit3': return <Edit3 className="w-5 h-5" />;
      case 'ImagePlus': return <ImagePlus className="w-5 h-5" />;
      case 'Brackets': return <Brackets className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Slash': return <Slash className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      default: return <Wand2 className="w-5 h-5" />;
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Enterprise AI Suite
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            15+ Enterprise AI Prompt Tools
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Optimize, generate, debug, audit, and estimate costs for prompts across OpenAI, Anthropic, Gemini, Midjourney, and Flux.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md relative z-10 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompt tools by keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.slug)}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(tool.iconName)}
                </div>
                
                {tool.isPopular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Popular
                  </span>
                )}
                {tool.isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    New
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Launch Tool</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
