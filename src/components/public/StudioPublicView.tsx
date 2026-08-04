import React from 'react';
import { 
  Wand2, Layers, Cpu, ShieldCheck, CheckCircle2, 
  Workflow, GitBranch, Sparkles, Database, FileCode, CheckSquare
} from 'lucide-react';
import { Card, Badge, Button, Accordion } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface StudioPublicViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const StudioPublicView: React.FC<StudioPublicViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  const faqItems = [
    {
      id: '1',
      title: 'What is Studio in the PromptImageLab platform?',
      content: 'Studio is the AI Prompt Engineering and Multi-Agent Platform workspace within PromptImageLab. It goes far beyond basic text editors by providing a full AI development workspace to design, optimize, evaluate, compare, and version-control dynamic prompts and multi-agent workflows.'
    },
    {
      id: '2',
      title: 'What are the 8 collaborative agent roles in Studio architecture?',
      content: 'Studio features a modular multi-agent architecture powered by 8 specialized agent roles: Prompt Agent, Workflow Agent, Evaluation Agent, Knowledge Agent, Optimization Agent, Validation Agent, Reasoning Agent, and Code Generation Agent. These agents share context vectors to complete complex engineering tasks.'
    },
    {
      id: '3',
      title: 'How does Studio handle prompt evaluation and comparison?',
      content: 'Studio includes an Evaluation Engine where you can test prompts against edge cases, benchmark outputs across multiple model providers (e.g., OpenAI, Anthropic, Gemini), and validate strict JSON output schemas for deterministic behavior.'
    },
    {
      id: '4',
      title: 'What connectivity does Studio support today?',
      content: 'Studio currently connects directly to ServiceNow and universal REST APIs for context retrieval and payload execution. Future planned connector extensions include Jira, Azure DevOps, GitHub, Datadog, Splunk, Teams, Slack, Confluence, and Salesforce.'
    }
  ];

  useSEO({
    title: 'Studio — AI Prompt Engineering & Multi-Agent Platform | PromptImageLab',
    description: 'Studio is the AI development workspace in PromptImageLab for prompt engineering, optimization, evaluation, and multi-agent workflow orchestration across 8 specialized agent roles.',
    keywords: 'Studio, AI Prompt Engineering, Multi-Agent Platform, Prompt Optimization, LLM Evaluation, Workflow Orchestration, Prompt Library, AI workspace'
  });

  const agentRoles = [
    {
      title: 'Prompt Agent',
      icon: Wand2,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      description: 'Generates, structures, and refines system prompts using advanced templating and variable injection.'
    },
    {
      title: 'Workflow Agent',
      icon: Workflow,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      description: 'Orchestrates multi-step agent graphs, managing execution sequence, state persistence, and branching.'
    },
    {
      title: 'Evaluation Agent',
      icon: CheckSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      description: 'Benchmarks prompt outputs against regression test suites, evaluating accuracy, latency, and cost.'
    },
    {
      title: 'Knowledge Agent',
      icon: Database,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      description: 'Retrieves relevant domain context, vector embeddings, and schema metadata to enrich prompt context.'
    },
    {
      title: 'Optimization Agent',
      icon: Sparkles,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      description: 'Iteratively rewrites system instructions to minimize token consumption while maintaining output quality.'
    },
    {
      title: 'Validation Agent',
      icon: ShieldCheck,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      description: 'Enforces strict JSON schema validation, PII redaction rules, and prompt injection security policies.'
    },
    {
      title: 'Reasoning Agent',
      icon: Cpu,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      description: 'Applies step-by-step chain-of-thought analysis to solve complex technical logic problems.'
    },
    {
      title: 'Code Generation Agent',
      icon: FileCode,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      description: 'Synthesizes clean executable code blocks, backend integrations, and component templates.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 max-w-5xl mx-auto pt-6">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="indigo" className="font-bold">Flagship Workspace</Badge>
          <Badge variant="violet" className="font-bold">Multi-Agent Engineering</Badge>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          Studio <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500">
            AI Prompt Engineering & Multi-Agent Workspace
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto">
          Studio is not just a prompt editor. It is an enterprise AI development workspace designed to create, organize, optimize, evaluate, compare, and orchestrate multi-agent workflows backed by an 8-agent collaborative architecture.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="w-full sm:w-auto px-10 h-14 text-lg shadow-2xl shadow-indigo-500/20">
            Open Studio Workspace
          </Button>
          <Button variant="outline" size="lg" onClick={() => onSelectTab('features')} className="w-full sm:w-auto px-10 h-14 text-lg">
            Explore Studio Features
          </Button>
        </div>
      </section>

      {/* 2. PURPOSE: AI DEVELOPMENT WORKSPACE */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Comprehensive AI Engineering Workspace
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Developing production-grade generative AI requires more than pasting text into playground boxes. Studio provides software engineers and prompt architects with a structured environment to manage the entire AI lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Wand2 className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Prompt Creation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Design dynamic prompts with Handlebars templating, system contexts, and few-shot examples.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h4 className="font-bold text-lg">Prompt Optimization</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Iteratively optimize prompt tokens and instructions for higher accuracy and lower latency.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <CheckSquare className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Evaluation & Testing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Benchmark prompt variations against historical test cases and strict output JSON schemas.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800">
            <Workflow className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">Agent Orchestration</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chain multiple specialized agents together into stateful execution graphs.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. MULTI-AGENT ARCHITECTURE (8 ROLES) */}
      <section className="space-y-12 bg-slate-50 dark:bg-slate-900/40 p-10 lg:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800">
        <div className="space-y-6 max-w-4xl">
          <Badge variant="purple" className="font-bold">Agent Framework</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            8 Collaborative Agent Roles in Studio Architecture
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Studio follows a modular multi-agent architecture where agents collaborate in parallel or sequence while sharing context through a centralized state vector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentRoles.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card key={agent.title} className="p-6 space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className={`w-12 h-12 rounded-2xl ${agent.bg} ${agent.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{agent.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {agent.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. PROMPT LIBRARY & WORKFLOW LIBRARY */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-6 p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60">
            <Layers className="w-10 h-10 text-indigo-500" />
            <h3 className="text-2xl font-bold">Enterprise Prompt Library</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Centralized repository to organize, tag, and version control all organizational prompts. Prompts support environment tags (`Development`, `Staging`, `Production`), allowing your backend application to fetch verified prompt schemas programmatically via API.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Git-style commit history per prompt</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Tag-based deployment routing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Strict JSON Schema output enforcement</li>
            </ul>
          </div>

          <div className="space-y-6 p-8 rounded-3xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/60">
            <GitBranch className="w-10 h-10 text-violet-500" />
            <h3 className="text-2xl font-bold">Workflow Canvas & Library</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Save and reuse multi-agent workflows across your engineering team. Workflows define how specialized agents pass state, handle retries, and parse structured output payloads.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Visual graph orchestration</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Stateful agent memory management</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500" /> Automated error recovery & fallbacks</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. CONNECTIVITY & ROADMAP */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="emerald" className="font-bold font-mono">System Connectivity</Badge>
          <h2 className="text-3xl font-extrabold">Active & Future Connectivity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4 border-emerald-500/30">
            <h4 className="font-bold text-xl text-emerald-500">Implemented Active Connectivity</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Studio currently supports direct connectivity to:
            </p>
            <div className="space-y-2 text-sm font-semibold">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                ServiceNow ITSM Connector
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                REST API Webhook Integrations
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-4 border-slate-300 dark:border-slate-800">
            <h4 className="font-bold text-xl text-slate-500">Planned Future Connector Expansion</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Planned future modular extensions include:
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, Salesforce.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">Studio Frequently Asked Questions</h2>
        </div>
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

      {/* 7. CTA */}
      <section className="pt-8 pb-12">
        <div className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white text-center space-y-8 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Start Engineering Production Prompts & Agents
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto font-medium">
            Launch the Studio workspace to design prompts, test schemas, and orchestrate 8-agent swarms.
          </p>
          <div className="flex justify-center pt-4">
            <Button variant="default" size="lg" onClick={onLaunchPlatform} className="h-14 px-10 bg-white text-slate-950 font-bold hover:bg-slate-100">
              Open Studio Workspace
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
