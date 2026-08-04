import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { COMPARISONS_DATA } from '../../data/marketingData';
import { Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@ui-core';

interface ComparisonsViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const ComparisonsView: React.FC<ComparisonsViewProps> = ({ onSelectTab, onLaunchPlatform }) => {
  const [activeComparisonId, setActiveComparisonId] = useState<string>(COMPARISONS_DATA[0].id);

  const activeComp = COMPARISONS_DATA.find(c => c.id === activeComparisonId) || COMPARISONS_DATA[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="PromptImageLab Comparisons & Technical Evaluation Matrix"
        description="Detailed technical comparison matrix evaluating PromptImageLab vs LangSmith, PromptLayer, Langfuse, ServiceNow AI, CrewAI, and LangGraph."
        canonicalUrl="https://promptimagelab.com/comparisons"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-violet-500" />
            <span>Honest Technical Comparisons</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How PromptImageLab Compares
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Compare PromptImageLab OpsPilot & Studio against traditional prompt logging tools and tracing libraries to select the right platform for your enterprise architecture.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {COMPARISONS_DATA.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActiveComparisonId(comp.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeComparisonId === comp.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
              }`}
            >
              {comp.title}
            </button>
          ))}
        </div>

        {/* Selected Comparison Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeComp.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeComp.summary}
            </p>
          </div>

          {/* Feature Matrix Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-700 dark:text-slate-200">
                  <th className="p-4">Feature Capability</th>
                  <th className="p-4 text-indigo-600 dark:text-indigo-400">PromptImageLab</th>
                  <th className="p-4 text-slate-500">{activeComp.competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {activeComp.featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {typeof row.promptImageLab === 'boolean' ? (
                        row.promptImageLab ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />
                      ) : (
                        row.promptImageLab
                      )}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {typeof row.competitor === 'boolean' ? (
                        row.competitor ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />
                      ) : (
                        row.competitor
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Strengths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 rounded-2xl p-6 space-y-3">
              <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-300">
                PromptImageLab Key Advantages
              </h3>
              <ul className="space-y-2">
                {activeComp.promptImageLabStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-indigo-950 dark:text-indigo-200">
                    <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-200">
                {activeComp.competitor} Strengths
              </h3>
              <ul className="space-y-2">
                {activeComp.competitorStrengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3">
            <h3 className="font-extrabold text-sm uppercase text-indigo-400 tracking-wider">
              Technical Verdict
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeComp.verdict}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onSelectTab('docs')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Persona Use Cases</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Button variant="primary" size="md" onClick={onLaunchPlatform}>
              Try PromptImageLab Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
