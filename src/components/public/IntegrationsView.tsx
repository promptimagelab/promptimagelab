import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { INTEGRATIONS_DATA } from '../../data/marketingData';
import { ShieldCheck, CheckCircle2, Clock, ArrowRight, Network, GitBranch, CheckSquare, MessageSquare, Cloud } from 'lucide-react';
import { Button } from '@ui-core';

interface IntegrationsViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onSelectTab, onLaunchPlatform }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Network': <Network className="w-6 h-6 text-violet-500" />,
    'GitBranch': <GitBranch className="w-6 h-6 text-indigo-500" />,
    'CheckSquare': <CheckSquare className="w-6 h-6 text-blue-500" />,
    'MessageSquare': <MessageSquare className="w-6 h-6 text-emerald-500" />,
    'Cloud': <Cloud className="w-6 h-6 text-amber-500" />
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Enterprise Connectors & Integrations Catalog"
        description="Connect PromptImageLab OpsPilot & Studio to ServiceNow, GitHub Actions, Jira, Slack, Teams, and Azure DevOps for automated incident response and code reviews."
        canonicalUrl="https://promptimagelab.com/integrations"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Native Enterprise Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Integrate with Your Existing Tech Stack
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            PromptImageLab OpsPilot connects natively to your ITSM platforms, CI/CD code repositories, and incident chat channels without custom API glue code.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INTEGRATIONS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    {iconMap[item.logoIcon] || <Network className="w-6 h-6 text-indigo-500" />}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    item.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1'
                  }`}>
                    {item.status === 'active' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live Native Integration</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Coming Soon</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <strong className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Key Integration Features:
                  </strong>
                  <ul className="space-y-1.5">
                    {item.keyFeatures.map((kf, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex items-center justify-between">
                {item.id === 'int-servicenow' ? (
                  <button
                    onClick={() => onSelectTab('opspilot-public')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View OpsPilot Integration Docs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectTab('docs')}
                    className="text-xs font-bold text-slate-500 hover:underline"
                  >
                    Documentation
                  </button>
                )}

                <Button
                  variant={item.status === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={onLaunchPlatform}
                >
                  {item.status === 'active' ? 'Connect Integration' : 'Request Access'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Need a Custom Enterprise Integration?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            PromptImageLab OpsPilot provides open REST endpoints, webhooks, and Model Context Protocol (MCP) server support for private VPC deployments.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('contact')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
            >
              Contact Integration Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
