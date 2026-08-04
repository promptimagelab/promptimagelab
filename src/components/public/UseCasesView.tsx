import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { USE_CASES_DATA } from '../../data/marketingData';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Server, Code, Sparkles, Building2, HeartPulse, DollarSign } from 'lucide-react';
import { Button } from '@ui-core';

interface UseCasesViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const UseCasesView: React.FC<UseCasesViewProps> = ({ onSelectTab, onLaunchPlatform }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('all');

  const filteredUseCases = selectedPersona === 'all'
    ? USE_CASES_DATA
    : USE_CASES_DATA.filter(uc => uc.persona.toLowerCase().includes(selectedPersona.toLowerCase()));

  const personaIcons: Record<string, React.ReactNode> = {
    'IT Operations': <Server className="w-5 h-5 text-violet-500" />,
    'Developers': <Code className="w-5 h-5 text-indigo-500" />,
    'AI Engineers': <Sparkles className="w-5 h-5 text-emerald-500" />,
    'Business Teams': <Building2 className="w-5 h-5 text-blue-500" />,
    'Healthcare': <HeartPulse className="w-5 h-5 text-rose-500" />,
    'Finance': <DollarSign className="w-5 h-5 text-amber-500" />
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Enterprise AI Use Cases & Solutions"
        description="Discover how IT Operations, Developers, SREs, and AI Engineers leverage PromptImageLab OpsPilot & Studio to automate incident triage, prompt optimization, and workflow chains."
        canonicalUrl="https://promptimagelab.com/use-cases"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Targeted Industry Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built to Solve Real Engineering Problems
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            See how enterprise teams use PromptImageLab to automate ServiceNow ITSM, audit PR security, optimize token budgets, and orchestrate multi-agent workflows.
          </p>
        </div>

        {/* Persona Filter Badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {['all', 'it operations', 'developers', 'ai engineers'].map((personaKey) => (
            <button
              key={personaKey}
              onClick={() => setSelectedPersona(personaKey)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedPersona === personaKey
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
              }`}
            >
              {personaKey === 'all' ? 'All Roles & Personas' : personaKey}
            </button>
          ))}
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUseCases.map((uc) => (
            <div
              key={uc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
                    {personaIcons[uc.persona] || <Sparkles className="w-4 h-4" />}
                    <span>{uc.persona}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                    {uc.metricImpact}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {uc.title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {uc.headline}
                </p>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <strong className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">The Challenge:</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {uc.problem}
                  </p>
                </div>

                <div className="space-y-2">
                  <strong className="text-xs font-extrabold uppercase text-indigo-500 tracking-wider">PromptImageLab Solution:</strong>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                    {uc.solution}
                  </p>
                </div>

                <div className="space-y-2">
                  <strong className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Key Benefits:</strong>
                  <ul className="space-y-1.5">
                    {uc.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex items-center justify-between">
                <button
                  onClick={() => onSelectTab('prompt-library')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View Prompts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Button variant="primary" size="sm" onClick={onLaunchPlatform}>
                  Deploy Solution
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Automate Your Enterprise Workflows?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Join SRE leads and AI engineers using PromptImageLab to manage prompts, audit security, and connect ServiceNow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="font-bold">
              Start Free Trial
            </Button>
            <button
              onClick={() => onSelectTab('contact')}
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-sm transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
