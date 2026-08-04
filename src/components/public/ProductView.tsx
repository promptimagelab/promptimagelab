import React from 'react';
import { 
  Layers, ShieldCheck, Terminal, Cpu, CheckCircle2, 
  Server, Activity, Lock
} from 'lucide-react';
import { Card, Badge, Button } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface ProductViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const ProductView: React.FC<ProductViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  useSEO({
    title: 'Product Hierarchy & Portfolio | PromptImageLab',
    description: 'Explore the complete product hierarchy of PromptImageLab: OpsPilot enterprise operations, Studio multi-agent workspace, shared platform services, and technical architecture.',
    keywords: 'PromptImageLab Product, OpsPilot, Studio, Enterprise AI Product Portfolio, AI Operations, AI Prompt Engineering'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. INTRODUCTION: PROMPTIMAGELAB PLATFORM */}
      <section className="text-center space-y-8 max-w-5xl mx-auto pt-6">
        <Badge variant="indigo" className="font-bold">Platform Product Hierarchy</Badge>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          PromptImageLab <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500">
            Enterprise Product Portfolio
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto">
          PromptImageLab is structured around two flagship products—<strong>OpsPilot</strong> and <strong>Studio</strong>—supported by shared enterprise platform services and a modular connector framework.
        </p>
      </section>

      {/* 2. OPSPILOT SECTION */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Badge variant="violet">Flagship Application 01</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">OpsPilot — Enterprise AI Operations</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => onSelectTab('opspilot-public')}>
            View Dedicated OpsPilot Page
          </Button>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          An intelligent operational layer for enterprise systems. Features active ServiceNow integration for automated incident ingestion, CMDB dependency querying, operational intelligence dashboards, and policy-governed AI copilots.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Server className="w-6 h-6 text-violet-500 mb-2" />
            <h4 className="font-bold text-lg">ServiceNow ITSM Connector</h4>
            <p className="text-xs text-slate-500">Active production-ready integration with ServiceNow table APIs.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Activity className="w-6 h-6 text-indigo-500 mb-2" />
            <h4 className="font-bold text-lg">Operational Dashboards</h4>
            <p className="text-xs text-slate-500">Real-time telemetry, severity metrics, and incident distribution.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
            <h4 className="font-bold text-lg">Operational Governance</h4>
            <p className="text-xs text-slate-500">RBAC validation and edge PII scrubbing for copilot actions.</p>
          </Card>
        </div>
      </section>

      {/* 3. STUDIO SECTION */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Badge variant="indigo">Flagship Application 02</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Studio — AI Prompt Engineering Workspace</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => onSelectTab('studio-public')}>
            View Dedicated Studio Page
          </Button>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          An AI engineering workspace to create, optimize, evaluate, compare, and orchestrate multi-agent workflows backed by 8 collaborative agent roles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Layers className="w-6 h-6 text-indigo-500 mb-2" />
            <h4 className="font-bold text-lg">Prompt & Workflow Libraries</h4>
            <p className="text-xs text-slate-500">Git-style version control, environment tagging, and reusable templates.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Cpu className="w-6 h-6 text-purple-500 mb-2" />
            <h4 className="font-bold text-lg">8 Collaborative Agent Roles</h4>
            <p className="text-xs text-slate-500">Prompt, Workflow, Evaluation, Knowledge, Optimization, Validation, Reasoning, Code Gen.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
            <h4 className="font-bold text-lg">Schema Evaluation Engine</h4>
            <p className="text-xs text-slate-500">Strict JSON output validation across OpenAI, Anthropic, and Gemini models.</p>
          </Card>
        </div>
      </section>

      {/* 4. PLATFORM SERVICES */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="emerald">Platform Services</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Shared Infrastructure Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Lock className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">BYOK AES-256 Vault</h4>
            <p className="text-xs text-slate-500">Client-side encrypted key vault for model providers.</p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Edge PII Redaction</h4>
            <p className="text-xs text-slate-500">Automatic edge scrubbing of sensitive PII data.</p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Terminal className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">REST API Webhook Router</h4>
            <p className="text-xs text-slate-500">Universal API endpoints for prompt and workflow resolution.</p>
          </Card>
        </div>
      </section>

      {/* 5. FUTURE VISION & ROADMAP */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="slate">Roadmap Architecture</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Future Connector Expansion</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            The modular connector framework is designed for future expansion into Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, and Salesforce.
          </p>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="pt-8 pb-12 text-center space-y-6">
        <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="px-10 h-14">
          Access Platform Console
        </Button>
      </section>

    </div>
  );
};
