import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Wand2, 
  ShieldCheck, 
  Calculator, 
  BookOpen, 
  Workflow, 
  Play, 
  Code, 
  BarChart3, 
  Settings, 
  Layers, 
  ArrowRight,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tab: string, slug?: string) => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: string;
  tab: string;
  slug?: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandItems: CommandItem[] = [
    { id: 'opt', label: 'Prompt Optimizer', category: 'Tools', tab: 'tools', slug: 'prompt-optimizer', icon: <Wand2 className="w-4 h-4 text-indigo-500" />, shortcut: 'P O' },
    { id: 'sec', label: 'Security & Injection Auditor', category: 'Tools', tab: 'tools', slug: 'prompt-security-checker', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, shortcut: 'P S' },
    { id: 'calc', label: 'Token & Cost Calculator', category: 'Tools', tab: 'tools', slug: 'token-cost-calculator', icon: <Calculator className="w-4 h-4 text-amber-500" />, shortcut: 'T C' },
    { id: 'lib', label: 'Search Prompt Library', category: 'Platform', tab: 'library', icon: <BookOpen className="w-4 h-4 text-sky-500" />, shortcut: 'G L' },
    { id: 'wf', label: 'AI Agent Workflows', category: 'Platform', tab: 'workflows', icon: <Workflow className="w-4 h-4 text-purple-500" />, shortcut: 'G W' },
    { id: 'pg', label: 'Live Multi-Model Playground', category: 'Platform', tab: 'playground', icon: <Play className="w-4 h-4 text-rose-500" />, shortcut: 'G P' },
    { id: 'docs', label: 'API Reference & OpenAPI', category: 'Developers', tab: 'api', icon: <Code className="w-4 h-4 text-cyan-500" />, shortcut: 'G A' },
    { id: 'dash', label: 'Enterprise Analytics Dashboard', category: 'Workspace', tab: 'dashboard', icon: <BarChart3 className="w-4 h-4 text-emerald-500" />, shortcut: 'G D' },
    { id: 'admin', label: 'Governance & Audit Logs', category: 'Workspace', tab: 'admin', icon: <Layers className="w-4 h-4 text-amber-500" />, shortcut: 'G M' },
    { id: 'compare', label: 'Pricing & Model Matrix', category: 'Platform', tab: 'compare', icon: <Settings className="w-4 h-4 text-slate-500" />, shortcut: 'G C' },
  ];

  const filteredItems = commandItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global CMD+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Arrow key navigation inside palette
  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      onSelectAction(item.tab, item.slug);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onKeyDown={handleKeyDownModal}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command, tool, or search query (e.g. optimizer, security)..."
                className="w-full py-4 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              />
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Command className="w-3 h-3" /> K
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No matching commands or tools found for "{query}".
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectAction(item.tab, item.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors text-sm',
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700/60">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {item.label}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.shortcut && (
                          <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight className={cn('w-4 h-4 transition-transform', isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600')} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-3">
                <span><strong className="text-slate-600 dark:text-slate-300">↑↓</strong> Navigate</span>
                <span><strong className="text-slate-600 dark:text-slate-300">↵</strong> Select</span>
                <span><strong className="text-slate-600 dark:text-slate-300">ESC</strong> Close</span>
              </div>
              <span>PromptImageLab Command Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
