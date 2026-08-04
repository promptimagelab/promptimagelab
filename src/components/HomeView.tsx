import React, { useState } from 'react';
import { 
  Wand2, ShieldCheck, ArrowRight, CheckCircle2, 
  Layers, Bot, Terminal, Cpu, Network, 
  Activity, Server, Workflow, Database, CheckSquare, Lock
} from 'lucide-react';
import { Button, Card, Badge, Accordion } from '@ui-core';
import { useSEO } from '../hooks/useSEO';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onTestInPlayground: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
}) => {
  const faqItems = [
    {
      id: '1',
      title: 'What is PromptImageLab?',
      content: 'PromptImageLab is an Enterprise AI Engineering Platform consisting of two flagship applications: OpsPilot (Enterprise AI Operations Platform) and Studio (AI Prompt Engineering & Multi-Agent Workspace). It provides the critical infrastructure layer to build, test, secure, and operate AI agents in production.'
    },
    {
      id: '2',
      title: 'What is the difference between OpsPilot and Studio?',
      content: 'Studio is the AI development workspace where engineers create, optimize, evaluate, and version-control prompts and multi-agent workflows across 8 collaborative agent roles. OpsPilot is the enterprise AI operations platform that connects these AI agents directly to operational environments—such as ServiceNow—for automated incident triage and operational intelligence.'
    },
    {
      id: '3',
      title: 'Which integrations are currently implemented vs planned?',
      content: 'Currently, PromptImageLab features an active production integration with ServiceNow ITSM alongside universal REST API webhooks. Our modular connector framework allows planned future expansion into Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, and Salesforce.'
    },
    {
      id: '4',
      title: 'What are the 8 collaborative agent roles in Studio?',
      content: 'Studio follows a multi-agent architecture powered by 8 specialized agent roles: Prompt Agent, Workflow Agent, Evaluation Agent, Knowledge Agent, Optimization Agent, Validation Agent, Reasoning Agent, and Code Generation Agent. These agents share context vectors to complete complex technical workflows.'
    },
    {
      id: '5',
      title: 'How does PromptImageLab handle enterprise security and data privacy?',
      content: 'Security is natively built into the platform infrastructure. PromptImageLab enforces a Zero Data Retention processing model, client-side AES-256 BYOK key encryption, real-time edge PII redaction, and strict JSON schema validation for deterministic output behavior.'
    }
  ];

  useSEO({
    title: 'PromptImageLab — Enterprise AI Engineering Platform (OpsPilot & Studio)',
    description: 'PromptImageLab is the Enterprise AI Engineering Platform consisting of OpsPilot for enterprise AI operations and Studio for AI prompt engineering and multi-agent orchestration.',
    keywords: 'PromptImageLab, OpsPilot, Studio, Enterprise AI Platform, AI Operations, AI Prompt Engineering, Multi-Agent Orchestration, ServiceNow AI'
  });

  const [heroPromptInput, setHeroPromptInput] = useState(
    'Analyze ServiceNow incident payload, evaluate root cause, and format resolution work note'
  );

  const handleHeroQuickOptimize = () => {
    if (heroPromptInput.trim()) {
      localStorage.setItem('pil_draft_prompt', heroPromptInput.trim());
    }
    onSelectTab('studio-public');
  };

  return (
    <div className="w-full space-y-32 py-12 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="indigo" className="font-bold">Build, Test & Orchestrate Production AI</Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white max-w-5xl mx-auto">
          Production AI Engineering <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500">
            Without Prompt Chaos
          </span>
        </h1>

        {/* 5-Second Clarity Block: Audience, Problem, Solution */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
          Built for <strong>developers, AI engineers, and IT Ops leads</strong>. Stop juggling brittle prompt templates and unmonitored LLM integrations. PromptImageLab gives you a unified playground to <strong>test system prompts across Gemini, OpenAI & Claude</strong>, visually chain multi-agent workflows, and automate ServiceNow IT operations safely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button variant="primary" size="lg" onClick={() => onSelectTab('prompt-library')} className="w-full sm:w-auto px-8 h-14 text-base font-bold shadow-2xl shadow-indigo-500/20">
            Explore Prompt Library
          </Button>
          <Button variant="outline" size="lg" onClick={() => onSelectTab('opspilot-public')} className="w-full sm:w-auto px-8 h-14 text-base bg-white dark:bg-slate-900 font-bold">
            Explore OpsPilot ServiceNow
          </Button>
        </div>

        {/* Quick Hero Interactive Input */}
        <div className="max-w-4xl mx-auto mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-4 px-4 w-full">
            <Wand2 className="w-6 h-6 text-indigo-500 shrink-0" />
            <input
              type="text"
              value={heroPromptInput}
              onChange={(e) => setHeroPromptInput(e.target.value)}
              placeholder="Test prompt string or agent workflow query..."
              className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
            />
          </div>

          <Button
            variant="primary"
            onClick={handleHeroQuickOptimize}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto shrink-0 h-12 px-8"
          >
            Launch Studio
          </Button>
        </div>
      </section>

      {/* 2. PLATFORM OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-16 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="indigo">Platform Architecture</Badge>
          <h2 className="text-4xl font-extrabold tracking-tight">Two Flagship Applications. One AI Engineering Ecosystem.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            PromptImageLab brings software engineering rigor to Generative AI by separating operational execution (OpsPilot) from prompt and multi-agent development (Studio).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* OpsPilot Card */}
          <Card className="p-8 space-y-6 border-violet-500/30 bg-violet-50/20 dark:bg-violet-950/20">
            <div className="flex justify-between items-center">
              <Network className="w-10 h-10 text-violet-500" />
              <Badge variant="violet">Flagship Application</Badge>
            </div>
            <h3 className="text-3xl font-extrabold">OpsPilot</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Enterprise AI Operations Platform. Provides an intelligent operational layer for enterprise systems. Features active ServiceNow integration, operational dashboards, AI copilots, and connection management.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-semibold">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Real-Time ServiceNow Incident Ingestion</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> CMDB Context Resolution Engine</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Enterprise Policy Governance & Copilots</li>
            </ul>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('opspilot-public')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Discover OpsPilot
            </Button>
          </Card>

          {/* Studio Card */}
          <Card className="p-8 space-y-6 border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20">
            <div className="flex justify-between items-center">
              <Layers className="w-10 h-10 text-indigo-500" />
              <Badge variant="indigo">Flagship Application</Badge>
            </div>
            <h3 className="text-3xl font-extrabold">Studio</h3>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              AI Prompt Engineering and Multi-Agent Workspace. Develop, optimize, evaluate, compare, and version-control prompts and workflows across 8 collaborative agent roles.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-semibold">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 8 Collaborative Agent Roles Architecture</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Dynamic Handlebars Templating & JSON Schemas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Prompt & Workflow Libraries</li>
            </ul>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('studio-public')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Discover Studio
            </Button>
          </Card>
        </div>
      </section>

      {/* 3. OPSPILOT DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-4">
          <Badge variant="violet" className="font-bold font-mono">Flagship Product 01</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">OpsPilot — Enterprise AI Operations Platform</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            OpsPilot sits directly on top of your enterprise infrastructure to transform manual IT service operations into intelligent, agent-assisted workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Server className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">Active ServiceNow Integration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ingests incident records, queries CMDB context, and posts automated work notes back to ServiceNow.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Activity className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Operational Dashboards</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides real-time operational intelligence, ticket severity distributions, and system health metrics.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Policy Governance</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Validates copilot execution steps against RBAC permissions, audit logs, and safety guardrails.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. STUDIO DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-4">
          <Badge variant="indigo" className="font-bold font-mono">Flagship Product 02</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Studio — AI Prompt Engineering Workspace</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Studio is an AI development workspace built for engineering teams to create, evaluate, and orchestrate complex multi-agent reasoning pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Wand2 className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Prompt Engineering & Templating</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Design prompts using system instructions, few-shot examples, dynamic Handlebars variables, and strict JSON schemas.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <CheckSquare className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Evaluation & Comparison</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Run evaluation suites across OpenAI, Anthropic, and Google Gemini models to compare latency, token cost, and output accuracy.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Workflow className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">Multi-Agent Orchestration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Orchestrate graph-based agent workflows where specialized roles pass context and state variables seamlessly.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. HOW BOTH APPLICATIONS WORK TOGETHER */}
      <section className="space-y-12 bg-slate-50 dark:bg-slate-900/40 p-10 lg:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="emerald" className="font-bold">Platform Lifecycle</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How OpsPilot & Studio Work Together</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Studio and OpsPilot form a continuous engineering feedback loop for enterprise Generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center">1</div>
            <h4 className="text-xl font-bold">Design & Test in Studio</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Engineers use Studio to build system prompts, evaluate model outputs, and define multi-agent graph workflows.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center">2</div>
            <h4 className="text-xl font-bold">Deploy to OpsPilot Engine</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Verified prompts and agent workflows are tagged as `Production` and exposed to OpsPilot via API connectors.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500 text-white font-bold flex items-center justify-center">3</div>
            <h4 className="text-xl font-bold">Operate in Enterprise Systems</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              OpsPilot executes the agent workflows against production systems (such as ServiceNow), returning trace telemetry back to Studio.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM ARCHITECTURE */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Platform Architecture Specifications</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            PromptImageLab features a decoupled architectural topology designed for zero data retention, high throughput, and strict security compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Lock className="w-6 h-6 text-indigo-500 mb-2" />
            <h5 className="font-bold text-base">BYOK Vault</h5>
            <p className="text-xs text-slate-500">AES-256 client-side encrypted key management.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
            <h5 className="font-bold text-base">Edge PII Redaction</h5>
            <p className="text-xs text-slate-500">Real-time regex and classifier PII scrubbing.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Cpu className="w-6 h-6 text-violet-500 mb-2" />
            <h5 className="font-bold text-base">State Vector</h5>
            <p className="text-xs text-slate-500">Shared context vector across multi-agent steps.</p>
          </Card>

          <Card className="p-6 space-y-2 border-slate-200 dark:border-slate-800">
            <Activity className="w-6 h-6 text-blue-500 mb-2" />
            <h5 className="font-bold text-base">Trace Telemetry</h5>
            <p className="text-xs text-slate-500">Granular latency and token execution logs.</p>
          </Card>
        </div>
      </section>

      {/* 7. ENTERPRISE FEATURES */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Infrastructure Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Database className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Zero Data Retention</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prompts and inputs pass strictly in-memory. Zero disk persistence ensures compliance with enterprise data policies.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Terminal className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">REST API Webhooks</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Programmatically trigger OpsPilot workflows or resolve Studio prompt schemas via secure HTTP webhooks.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Lock className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">Role-Based Governance</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Define explicit team roles (Admin, Engineer, Viewer) to restrict access to connection keys and production prompts.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. MULTI-AGENT ARCHITECTURE (8 ROLES) */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="purple" className="font-bold">Agent Framework</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Multi-Agent Architecture: 8 Collaborative Roles</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Studio is powered by 8 specialized agent roles that collaborate over a shared state vector.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-indigo-500 text-sm">Prompt Agent</div>
            <p className="text-slate-500 font-normal">System instruction design.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-violet-500 text-sm">Workflow Agent</div>
            <p className="text-slate-500 font-normal">Graph execution & state.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-emerald-500 text-sm">Evaluation Agent</div>
            <p className="text-slate-500 font-normal">Output benchmarking.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-blue-500 text-sm">Knowledge Agent</div>
            <p className="text-slate-500 font-normal">CMDB context retrieval.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-amber-500 text-sm">Optimization Agent</div>
            <p className="text-slate-500 font-normal">Token optimization.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-rose-500 text-sm">Validation Agent</div>
            <p className="text-slate-500 font-normal">Schema & PII validation.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-cyan-500 text-sm">Reasoning Agent</div>
            <p className="text-slate-500 font-normal">Chain-of-thought analysis.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="font-bold text-purple-500 text-sm">Code Gen Agent</div>
            <p className="text-slate-500 font-normal">Code synthesis.</p>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE CONNECTORS: ACTIVE VS FUTURE ROADMAP */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="indigo" className="font-bold">Connector Framework</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Connectors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-4 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20">
            <h4 className="font-bold text-xl text-emerald-600 dark:text-emerald-400">Implemented & Active Connectors</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ServiceNow ITSM (Incident & CMDB Sync)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Universal REST API Webhooks</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4 border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
            <h4 className="font-bold text-xl text-slate-500">Planned Future Connectors (Technical Roadmap)</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              Planned future modular extensions include: Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, Salesforce.
            </p>
          </Card>
        </div>
      </section>

      {/* 10. TECHNICAL FAQS */}
      <section className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        </div>
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

      {/* 11. CTA */}
      <section className="pt-8 pb-12">
        <div className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white text-center space-y-8 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Build and Operate Enterprise AI Today
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto font-medium">
            Launch PromptImageLab to access OpsPilot and Studio applications.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button variant="default" size="lg" onClick={() => onSelectTab('opspilot-public')} className="h-14 px-8 bg-white text-slate-950 font-bold hover:bg-slate-100">
              Open OpsPilot
            </Button>
            <Button variant="outline" size="lg" onClick={() => onSelectTab('studio-public')} className="h-14 px-8 border-white text-white hover:bg-white/10">
              Open Studio
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

