import React from 'react';
import { 
  Sparkles, ShieldCheck, Database, Layers, Server, Activity, Lock, CheckSquare, GitBranch, CheckCircle2
} from 'lucide-react';
import { Card, Badge, Accordion } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface FeaturesViewProps {
  onSelectTab?: (tab: string) => void;
  onLaunchPlatform?: () => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  const faqItems = [
    {
      id: '1',
      title: 'How are features divided between OpsPilot and Studio?',
      content: 'OpsPilot features focus on operational intelligence, ServiceNow ITSM integration, incident triage, and AI copilots. Studio features focus on prompt creation, optimization, evaluation, 8-agent graph orchestration, and schema validation.'
    },
    {
      id: '2',
      title: 'What connectors are available today?',
      content: 'ServiceNow ITSM and REST API webhooks are active. Future planned connectors include Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, and Salesforce.'
    },
    {
      id: '3',
      title: 'What multi-agent roles are supported in Studio?',
      content: 'Studio supports 8 collaborative agent roles: Prompt Agent, Workflow Agent, Evaluation Agent, Knowledge Agent, Optimization Agent, Validation Agent, Reasoning Agent, and Code Generation Agent.'
    }
  ];

  useSEO({
    title: 'Platform Features & Architectural Capabilities | PromptImageLab',
    description: 'Detailed breakdown of PromptImageLab platform features across OpsPilot operations, Studio prompt engineering, multi-agent engine, ServiceNow connectors, and edge security.',
    keywords: 'PromptImageLab Features, OpsPilot Features, Studio Features, AI Operations, Prompt Engineering Features, Multi-Agent Architecture'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <Badge variant="indigo" className="font-bold">Platform Capabilities</Badge>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Comprehensive AI Platform Features
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Detailed technical features organized across OpsPilot operations, Studio multi-agent workspace, shared services, and security.
        </p>
      </div>

      {/* 2. PLATFORM FEATURES */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="indigo">01. Platform Core Features</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Infrastructure & Ecosystem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Layers className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Decoupled Architecture</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Separates development workspace (Studio) from operational execution (OpsPilot) for maximum scalability.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Lock className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">BYOK Client Vault</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Client-side AES-256 encryption for OpenAI, Anthropic, and Google API keys.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Database className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Zero Data Retention</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In-memory processing model ensures zero disk persistence of prompts and sensitive inputs.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. OPSPILOT FEATURES */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="violet">02. OpsPilot Features</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise AI Operations & Incident Triage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Server className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">ServiceNow ITSM Sync</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated ingestion of incident records (`INCxxxxxxx`) and posting of AI resolution work notes.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Activity className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">CMDB Dependency Resolver</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Queries ServiceNow Configuration Items to identify upstream microservice dependencies during incidents.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Operational Policy Copilot</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforces RBAC permissions and approval thresholds before copilot actions modify system state.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. STUDIO FEATURES */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="indigo">03. Studio Features</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Engineering & Multi-Agent Workspace</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Dynamic Templating</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Handlebars variable injection, system instructions, and few-shot example management.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <CheckSquare className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Schema Evals & Benchmarking</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict JSON schema validation and multi-model latency/cost comparison suites.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <GitBranch className="w-8 h-8 text-purple-500" />
            <h4 className="font-bold text-lg">Prompt & Workflow Libraries</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Git-style commit history, version tagging (`Dev`, `Staging`, `Prod`), and reusable agent graphs.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. MULTI-AGENT ARCHITECTURE (8 ROLES) */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="purple">04. Multi-Agent Architecture</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">8 Collaborative Agent Roles</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-indigo-500">1. Prompt Agent</div>
            <p className="text-slate-500 font-normal">Prompt instruction design.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-violet-500">2. Workflow Agent</div>
            <p className="text-slate-500 font-normal">Graph execution & state.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-emerald-500">3. Evaluation Agent</div>
            <p className="text-slate-500 font-normal">Output benchmarking.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-blue-500">4. Knowledge Agent</div>
            <p className="text-slate-500 font-normal">Context retrieval.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-amber-500">5. Optimization Agent</div>
            <p className="text-slate-500 font-normal">Token optimization.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-rose-500">6. Validation Agent</div>
            <p className="text-slate-500 font-normal">Schema & PII validation.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-cyan-500">7. Reasoning Agent</div>
            <p className="text-slate-500 font-normal">Chain-of-thought analysis.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-purple-500">8. Code Gen Agent</div>
            <p className="text-slate-500 font-normal">Code synthesis.</p>
          </div>
        </div>
      </section>

      {/* 6. CONNECTOR FRAMEWORK */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="emerald">05. Connector Framework</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Active vs Planned Connector Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-3 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Active Implemented Connectors</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ServiceNow ITSM Connector</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> REST API Universal Webhook Gateway</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-3 border-slate-300 dark:border-slate-800">
            <h4 className="font-bold text-slate-500">Planned Future Roadmap Connectors</h4>
            <p className="text-xs text-slate-500 font-mono">
              Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, Salesforce.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. FAQS */}
      <section className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Features FAQs</h2>
        </div>
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

    </div>
  );
};
