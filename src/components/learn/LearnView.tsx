import React, { useState } from 'react';
import { LearnArticle } from '../../types';
import { useLocalDb } from '../../hooks/useLocalDb';
import { BookOpen, Clock, Tag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LearnView: React.FC = () => {
  const { learnArticles } = useLocalDb();
  const [selectedArticleId, setSelectedArticleId] = useState<string>(learnArticles[0]?.id || 'art-1');
  const selectedArticle = learnArticles.find(a => a.id === selectedArticleId) || learnArticles[0];

  return (
    <div className="w-full space-y-6">
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          AI Engineering & Prompt Academy
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Prompt Engineering Knowledge Hub
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Deep dives into Chain-of-Thought (CoT), Model Context Protocol (MCP), Agentic RAG architectures, and System Prompt Security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Articles List Column */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Featured Guides ({learnArticles.length})
          </h3>

          <div className="space-y-2">
            {learnArticles.map(art => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    <span>{art.category}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {art.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Column */}
        <div className="lg:col-span-8 space-y-4">
          {selectedArticle ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Published: {selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {selectedArticle.content}
                </pre>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select an article on the left to read.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
