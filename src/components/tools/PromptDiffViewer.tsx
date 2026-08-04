import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface PromptDiffViewerProps {
  original: string;
  optimized: string;
}

export const PromptDiffViewer: React.FC<PromptDiffViewerProps> = ({ original, optimized }) => {
  const origLines = original.split('\n');
  const optLines = optimized.split('\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Original Raw Prompt Pane */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Original Input Prompt
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {original.length} chars
          </span>
        </div>
        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50">
          {origLines.map((line, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-400 select-none w-5 text-right">{idx + 1}</span>
              <span>{line || ' '}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Prompt Pane */}
      <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/80 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-800/60 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Master Prompt
          </div>
          <span className="text-[11px] font-mono text-indigo-500">
            {optimized.length} chars
          </span>
        </div>
        <div className="font-mono text-xs text-slate-900 dark:text-slate-100 leading-relaxed overflow-x-auto whitespace-pre-wrap p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-200/50 dark:border-indigo-900/50">
          {optLines.map((line, idx) => (
            <div key={idx} className="flex gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded px-1">
              <span className="text-indigo-400 select-none w-5 text-right font-bold">{idx + 1}</span>
              <span>{line || ' '}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
