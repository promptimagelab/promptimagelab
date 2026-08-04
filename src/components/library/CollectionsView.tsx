import React from 'react';
import { Layers, ArrowRight, Sparkles, Server, Terminal, Shield, Cpu, Code2 } from 'lucide-react';
import { Card, Badge } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface CollectionsViewProps {
  onSelectTab: (tab: string) => void;
  onSelectPrompt: (id: string) => void;
  onSelectWorkflow: (id: string) => void;
}

export const COLLECTIONS_DATA = [
  {
    id: 'servicenow-ops',
    title: 'Top ServiceNow Operations Prompts & Workflows',
    icon: Server,
    color: 'emerald',
    description: 'Curated blueprints for automated incident triage, CMDB topology enrichment, and automated P1 root-cause analysis.',
    tags: ['ServiceNow', 'ITSM', 'Incident Management', 'OpsPilot'],
    itemCount: '6 Assets',
    featuredPromptId: 'snow-triage-p1',
    featuredWorkflowId: 'snow-p1-investigation-flow'
  },
  {
    id: 'devops-automation',
    title: 'Best DevOps & SRE Workflows',
    icon: Terminal,
    color: 'indigo',
    description: 'Autonomous pipelines for log analysis, Kubernetes crashloop diagnostic, and CI/CD deployment verification.',
    tags: ['DevOps', 'Kubernetes', 'Log Parsing', 'SRE'],
    itemCount: '8 Assets',
    featuredPromptId: 'k8s-pod-crash-analyzer',
    featuredWorkflowId: 'devops-log-triage-pipeline'
  },
  {
    id: 'ai-starter-pack',
    title: 'AI Engineering Starter Pack',
    icon: Sparkles,
    color: 'violet',
    description: 'Essential production system prompts for Google Gemini 1.5/2.0, OpenAI GPT-4o, and Anthropic Claude 3.5.',
    tags: ['Multi-Model', 'Starter Pack', 'Prompt Engineering'],
    itemCount: '10 Assets',
    featuredPromptId: 'json-schema-enforcer',
    featuredWorkflowId: 'multi-model-consensus-eval'
  },
  {
    id: 'owasp-security',
    title: 'OWASP LLM Security & Safety Guardrails',
    icon: Shield,
    color: 'red',
    description: 'Prompts and validators designed to catch prompt injection, PII leakages, and untrusted output execution.',
    tags: ['OWASP', 'Security', 'PII Scrubbing', 'Safety'],
    itemCount: '5 Assets',
    featuredPromptId: 'prompt-injection-guard',
    featuredWorkflowId: 'security-audit-pipeline'
  },
  {
    id: 'azure-cloud',
    title: 'Azure & Cloud Infrastructure Collection',
    icon: Cpu,
    color: 'sky',
    description: 'Automation blueprints for Azure Resource Manager (ARM), Bicep code generation, and cloud cost anomaly detection.',
    tags: ['Azure', 'Cloud Infrastructure', 'Cost Optimization'],
    itemCount: '4 Assets',
    featuredPromptId: 'azure-cost-anomaly-prompt',
    featuredWorkflowId: 'azure-infra-audit-flow'
  },
  {
    id: 'developer-sdk',
    title: 'Python & TypeScript SDK Collection',
    icon: Code2,
    color: 'amber',
    description: 'Copy-paste code blueprints for consuming PromptImageLab REST APIs directly in Python and Node.js backend services.',
    tags: ['Python', 'TypeScript', 'REST API', 'SDK'],
    itemCount: '7 Assets',
    featuredPromptId: 'ts-sdk-wrapper-prompt',
    featuredWorkflowId: 'python-async-agent-stream'
  }
];

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  onSelectTab,
  onSelectPrompt,
  onSelectWorkflow
}) => {
  useSEO({
    title: 'Curated AI Collections | Top ServiceNow & SRE Production Blueprints',
    description: 'Browse curated collections of production system prompts, multi-agent workflows, and ServiceNow enterprise automation blueprints.',
    keywords: 'AI Collections, ServiceNow Prompts, DevOps Workflows, AI Engineering Blueprints'
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8 select-none animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>GitHub-Style Curated Packs</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curated AI Collections
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base max-w-3xl">
          Hand-curated bundles of battle-tested system prompts, agent workflows, and architecture guides organized by ecosystem and engineering discipline.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS_DATA.map((col) => {
          const IconComp = col.icon;
          return (
            <Card key={col.id} className="p-6 space-y-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-600 transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-bold">
                    {col.itemCount}
                  </Badge>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {col.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {col.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {col.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectPrompt(col.featuredPromptId)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Featured Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectWorkflow(col.featuredWorkflowId)}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                >
                  <span>Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
