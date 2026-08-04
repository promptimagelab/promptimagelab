import React from 'react';
import { 
  Layers, Network, ShieldCheck, ArrowRight, Activity, Lock, Cpu, Server, CheckCircle2, Milestone, Key
} from 'lucide-react';
import { Card, Badge, Button } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface PlatformPublicViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const PlatformPublicView: React.FC<PlatformPublicViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  useSEO({
    title: 'Platform Overview | OpsPilot, Studio & Multi-Agent Architecture',
    description: 'The unified PromptImageLab platform ecosystem combining OpsPilot enterprise IT AI operations and Studio prompt development workspace.',
    keywords: 'PromptImageLab Platform, AI platform architecture, OpsPilot, Studio, enterprise AI governance, ServiceNow integration'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-24 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-6 max-w-5xl mx-auto pt-6">
        <Badge variant="indigo" className="font-bold">Platform Overview</Badge>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          PromptImageLab <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500">
            Enterprise AI Engineering Platform
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
          A unified enterprise AI engineering architecture bringing together live model execution, ServiceNow IT operations, multi-agent orchestration, and OWASP safety guardrails.
        </p>
      </div>

      {/* 2. THE TWO FLAGSHIP APPLICATIONS */}
      <section className="space-y-8 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="violet">Core Applications</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Two Pillars. One Unified Foundation.</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Integrated end-to-end to deliver operational velocity and engineering determinism.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="p-8 space-y-6 border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20 hover:border-indigo-500/60 transition-all">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <Badge variant="indigo">Development Workspace</Badge>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Studio</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The AI prompt engineering and multi-agent workspace. Design dynamic prompts, evaluate outputs across model providers (Google Gemini, OpenAI, Claude), enforce JSON output schemas, and test live pipelines.
            </p>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('studio-public')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Studio Workspace
            </Button>
          </Card>

          <Card className="p-8 space-y-6 border-violet-500/30 bg-violet-50/20 dark:bg-violet-950/20 hover:border-violet-500/60 transition-all">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold">
                <Network className="w-6 h-6" />
              </div>
              <Badge variant="violet">Operations Engine</Badge>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">OpsPilot</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Autonomous AI operations for IT infrastructure. Connects AI agents directly into production IT systems with live ServiceNow ITSM incident triage, CMDB context resolution, and copilot log analyzer.
            </p>
            <Button variant="outline" size="sm" onClick={() => onSelectTab('opspilot-public')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore OpsPilot Platform
            </Button>
          </Card>

        </div>
      </section>

      {/* 3. PLATFORM ARCHITECTURE */}
      <section className="space-y-8 bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="space-y-3 max-w-3xl">
          <Badge variant="emerald" className="font-bold">System Architecture</Badge>
          <h2 className="text-3xl font-extrabold tracking-tight">Decoupled Multi-Agent Infrastructure</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Both OpsPilot and Studio operate on top of a shared multi-provider engine, local key vault, and real-time execution telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <Cpu className="w-8 h-8 text-indigo-500" />
            <h4 className="font-bold text-base">Multi-Provider SDK Engine</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Native integration with Google Gemini (@google/genai), OpenAI GPT-4o, Groq Llama 3.3, and Anthropic Claude 3.5.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <Key className="w-8 h-8 text-emerald-500" />
            <h4 className="font-bold text-base">Zero Data Retention Vault</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              API keys remain client-encrypted in localStorage. Payloads are proxied directly to LLM endpoints without server-side database storage.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <Activity className="w-8 h-8 text-violet-500" />
            <h4 className="font-bold text-base">Execution Trace Telemetry</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Granular per-step token timing, latency metrics, and agent conversation trace logging for full auditability.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. INTEGRATIONS SUMMARY */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="sky">Ecosystem</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">Enterprise Integrations</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => onSelectTab('integrations')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Integrations
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'ServiceNow ITSM', cat: 'IT Operations', status: 'Live REST API' },
            { name: 'Google Gemini', cat: 'LLM Provider', status: 'Native SDK' },
            { name: 'OpenAI GPT-4o', cat: 'LLM Provider', status: 'Native SDK' },
            { name: 'Anthropic Claude', cat: 'LLM Provider', status: 'Native REST' },
            { name: 'Jira Software', cat: 'Issue Tracker', status: 'Webhook API' },
            { name: 'Slack Ops', cat: 'ChatOps', status: 'Webhook API' },
            { name: 'Groq Cloud', cat: 'Fast Inference', status: 'Compatible API' },
            { name: 'Ollama Local', cat: 'Self-Hosted', status: 'Local REST' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">{item.cat}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECURITY & OWASP SAFETY */}
      <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-2xl font-extrabold">OWASP LLM Vulnerability Scanner & Safety</h3>
            <p className="text-xs text-slate-400">Continuous protection against prompt injection, data leakage, and insecure output handling.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <strong className="block text-white font-bold">Prompt Injection Guard</strong>
            <span className="text-slate-400">Detects malicious instructions attempting to bypass system instructions.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <strong className="block text-white font-bold">PII Auto-Masking</strong>
            <span className="text-slate-400">Scrubs passwords, credit card numbers, and internal IP addresses prior to execution.</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <strong className="block text-white font-bold">Schema Enforcement</strong>
            <span className="text-slate-400">Validates model outputs against JSON schemas before returning to downstream tools.</span>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM ROADMAP */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-indigo-500" />
          <h2 className="text-2xl font-extrabold tracking-tight">Platform Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 space-y-2">
            <Badge variant="indigo">Q3 2026 • Current</Badge>
            <h4 className="font-bold text-sm">ServiceNow Live Triage & Clean URLs</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Full ServiceNow REST API sync, HTML5 History API path routing, and multi-model live prompt execution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Badge variant="violet">Q4 2026 • Upcoming</Badge>
            <h4 className="font-bold text-sm">Self-Hosted Kubernetes Agent Worker</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Deployable Helm chart for running OpsPilot autonomous agents inside air-gapped enterprise VPCs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Badge variant="amber">2027 • Planned</Badge>
            <h4 className="font-bold text-sm">Fine-Tuning Synthetic Data Pipeline</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated conversion of successful agent incident runs into LoRA fine-tuning datasets for open LLMs.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="pt-4 pb-8 text-center space-y-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-extrabold">Ready to Explore PromptImageLab?</h2>
        <div className="flex justify-center gap-4">
          <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="px-10 h-14 font-bold">
            Launch Agent Studio
          </Button>
        </div>
      </section>

    </div>
  );
};

