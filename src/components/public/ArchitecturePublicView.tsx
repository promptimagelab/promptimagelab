import React from 'react';
import { 
  Cpu, ShieldCheck, Workflow, Lock, Activity
} from 'lucide-react';
import { Card, Badge, Button } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface ArchitecturePublicViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const ArchitecturePublicView: React.FC<ArchitecturePublicViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  useSEO({
    title: 'Platform Architecture & Technical Specifications | PromptImageLab',
    description: 'Deep-dive technical breakdown of PromptImageLab architecture: Multi-Agent engine, OpsPilot ServiceNow integration, Studio 8-agent workspace, Edge PII redaction, and connector framework.',
    keywords: 'PromptImageLab Architecture, AI platform architecture, Multi-agent engine, ServiceNow connector architecture, Edge AI security, LLM telemetry'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO HEADER */}
      <section className="text-center space-y-8 max-w-5xl mx-auto pt-6">
        <Badge variant="indigo" className="font-bold">Technical Deep-Dive</Badge>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          PromptImageLab <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500">
            System Architecture Specifications
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto">
          An in-depth technical analysis of the architectural design, multi-agent state vector engine, edge security middleware, ServiceNow integration model, and modular connector framework.
        </p>
      </section>

      {/* 2. ARCHITECTURAL OVERVIEW */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            1. Core Architectural Topology
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            PromptImageLab is structured as a decoupled, micro-service-ready architecture comprising two core applications: <strong>OpsPilot</strong> (Operations) and <strong>Studio</strong> (Engineering Workspace).
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Both applications interface with a shared core infrastructure layer that handles request routing, edge security inspection, client-side BYOK key decryption, and telemetry aggregation.
          </p>
        </div>

        {/* Topology Diagram Box */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
          <div className="text-center space-y-2 border-b border-slate-800 pb-4">
            <h4 className="font-mono text-sm font-bold text-indigo-400">HIGH-LEVEL SYSTEM TOPOLOGY</h4>
            <p className="text-xs text-slate-500">Decoupled Multi-Agent & Operational Engine Architecture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-center">
              <Badge variant="indigo">Application Layer 1</Badge>
              <h4 className="text-xl font-bold text-white">Studio Workspace</h4>
              <p className="text-xs text-slate-400">Prompt Engineering, Templating, 8-Agent Graph Orchestration, Schema Evals</p>
            </div>

            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-center">
              <Badge variant="violet">Application Layer 2</Badge>
              <h4 className="text-xl font-bold text-white">OpsPilot Engine</h4>
              <p className="text-xs text-slate-400">Operational Dashboards, Incident Triage, ServiceNow ITSM Integration</p>
            </div>
          </div>

          <div className="p-6 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-center space-y-2">
            <span className="font-mono text-xs text-indigo-300 font-bold uppercase tracking-wider">Shared Infrastructure & Security Core</span>
            <p className="text-xs text-slate-400">Edge PII Redaction Middleware | BYOK AES-256 Vault | Execution Trace Telemetry | REST API Gateway</p>
          </div>
        </div>
      </section>

      {/* 3. MULTI-AGENT ORCHESTRATION & STATE VECTOR */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            2. Multi-Agent Engine & State Vector Model
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-agent workflows in Studio and OpsPilot execute over a shared, immutable state vector. Rather than passing raw text strings between agents, the engine manages a structured state object containing step history, context memory, tool execution outputs, and schema validation flags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <Cpu className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-lg">Context Window Vector</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamically compresses and prunes long conversation histories to prevent context window overflow while preserving critical operational variables.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <Workflow className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-lg">Stateful Graph Execution</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Supports directed acyclic graphs (DAGs) and conditional looping for multi-step agent reasoning and self-healing error recovery.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-lg">Schema Enforcement</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforces strict JSON schema validation at every graph node transition, guaranteeing deterministic outputs for downstream API callers.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. SERVICENOW INTEGRATION MODEL & CONNECTOR FRAMEWORK */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            3. ServiceNow Integration & Modular Connector Architecture
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            OpsPilot integrates directly into ServiceNow ITSM using a specialized adapter interface. The integration ingests Incident Table records (`sys_id`, `number`, `short_description`, `impact`, `urgency`), queries Configuration Item (CI) records, and writes diagnostic resolution notes back to ServiceNow.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold">Connector Implementation Matrix</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Badge variant="emerald" className="font-bold">Active Implemented Connectors</Badge>
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">ServiceNow ITSM Connector</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Bidirectional REST synchronization, incident table ingestion, CMDB dependency lookup.</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">REST API Gateway Connector</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Universal webhook payload ingestion and JSON response dispatcher.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Badge variant="slate" className="font-bold">Planned Future Connector Architecture</Badge>
              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">Modular Expansion Architecture</div>
                <p className="text-xs text-slate-500">
                  Planned connectors on the technical roadmap: Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, Salesforce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDGE SECURITY & PII REDACTION */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            4. Edge Security & Privacy Architecture
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            PromptImageLab implements a Zero Data Retention (ZDR) processing model. Prompts and payload inputs pass strictly in-memory through our edge inspection pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <Lock className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-xl">Client-Side BYOK Encryption</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              API keys for LLM providers (OpenAI, Anthropic, Google) are encrypted locally using AES-256 in the browser vault. Raw keys are never stored on platform servers.
            </p>
          </Card>

          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            <h4 className="font-bold text-xl">Real-time PII Scrubber</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Regex and neural classifiers scan outgoing prompt variables to redact Social Security Numbers, credit card numbers, email addresses, and private keys before API transmission.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="pt-8 pb-12 text-center space-y-6 border-t border-slate-200 dark:border-slate-800/80">
        <h2 className="text-3xl font-extrabold">Explore the Implementation Codebase</h2>
        <div className="flex justify-center gap-4">
          <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="px-10 h-14">
            Launch Platform Console
          </Button>
        </div>
      </section>

    </div>
  );
};
