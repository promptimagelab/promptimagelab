import React from 'react';
import { 
  Bot, Network, ShieldCheck, Database, Terminal, Cpu, Zap, ArrowRight, CheckCircle2, 
  Layers, Lock, Server, BarChart3, Activity, RefreshCw, AlertTriangle, Workflow, Sliders
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Accordion } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface OpsPilotPublicViewProps {
  onSelectTab: (tab: string) => void;
  onLaunchPlatform: () => void;
}

export const OpsPilotPublicView: React.FC<OpsPilotPublicViewProps> = ({
  onSelectTab,
  onLaunchPlatform
}) => {
  const faqItems = [
    {
      id: '1',
      title: 'What is OpsPilot and how does it fit into PromptImageLab?',
      content: 'OpsPilot is the Enterprise AI Operations Platform component of PromptImageLab. While Studio handles prompt engineering and multi-agent workflow creation, OpsPilot provides the operational intelligence layer—connecting AI agents directly to enterprise systems (starting with ServiceNow) for automated incident triage, operational dashboards, and governance.'
    },
    {
      id: '2',
      title: 'Which enterprise integrations are currently active in OpsPilot?',
      content: 'Currently, OpsPilot includes a native, deep integration with ServiceNow along with REST API connectors. This enables automated incident ingestion, CMDB lookups, ticket updates, and resolution routing directly within your IT operations environment.'
    },
    {
      id: '3',
      title: 'What is the future connector roadmap for OpsPilot?',
      content: 'OpsPilot is architected with a modular connector framework. Future planned connectors on our technical roadmap include Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, and Salesforce. These modular connectors will allow OpsPilot to ingest operational signals across your entire IT and DevOps stack.'
    },
    {
      id: '4',
      title: 'How does OpsPilot ensure operational safety and governance?',
      content: 'OpsPilot operates under strict enterprise governance rules. All actions executed by autonomous copilot swarms undergo policy validation, role-based access control (RBAC), and edge PII scrubbing before executing system modifications.'
    },
    {
      id: '5',
      title: 'Can OpsPilot run autonomously without human intervention?',
      content: 'OpsPilot supports both Human-in-the-Loop (HITL) approval modes and fully automated execution for low-risk operational playbooks. Enterprise operators can define granular policy thresholds to determine when autonomous execution requires explicit human authorization.'
    }
  ];

  useSEO({
    title: 'OpsPilot — Enterprise AI Operations Platform | PromptImageLab',
    description: 'OpsPilot is the Enterprise AI Operations Platform within PromptImageLab. Delivering AI-powered operational intelligence, ServiceNow integration, automated incident triage, and governance.',
    keywords: 'OpsPilot, Enterprise AI Operations, ServiceNow AI integration, IT operations copilot, operational intelligence, AI SRE, incident automation'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 max-w-5xl mx-auto pt-6">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="violet" className="font-bold">Flagship Product</Badge>
          <Badge variant="indigo" className="font-bold">Enterprise Operations</Badge>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          OpsPilot <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500">
            Enterprise AI Operations Platform
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto">
          An intelligent operational layer for enterprise systems. OpsPilot bridges the gap between generative AI and production IT infrastructure by integrating real-time telemetry, automated incident triage, AI copilots, and strict governance controls into your existing operational workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="w-full sm:w-auto px-10 h-14 text-lg shadow-2xl shadow-violet-500/20">
            Access OpsPilot Console
          </Button>
          <Button variant="outline" size="lg" onClick={() => onSelectTab('architecture')} className="w-full sm:w-auto px-10 h-14 text-lg">
            View Architecture Docs
          </Button>
        </div>
      </section>

      {/* 2. PURPOSE & PLATFORM POSITIONING */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            The Purpose of OpsPilot in Enterprise Operations
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise IT environments generate thousands of daily alerts across ITSM systems, monitoring platforms, and cloud infrastructure. Traditional operational responses rely on manual triage, scattered runbooks, and slow escalation paths.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            OpsPilot transforms operational management by embedding autonomous multi-agent intelligence directly into your IT service management framework. By ingesting tickets, monitoring system health, and orchestrating targeted resolution workflows, OpsPilot reduces Mean Time to Resolution (MTTR) while enforcing strict enterprise safety policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          <Card variant="glass" className="p-8 border-violet-500/20 bg-violet-50/30 dark:bg-violet-950/20">
            <Activity className="w-10 h-10 text-violet-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Operational Intelligence</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Real-time aggregation of operational metrics, active incident severity vectors, and system health status.
            </p>
          </Card>

          <Card variant="glass" className="p-8 border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20">
            <Bot className="w-10 h-10 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Enterprise AI Copilot</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Context-aware operational copilot that queries ITSM databases, diagnoses root causes, and recommends resolution playbooks.
            </p>
          </Card>

          <Card variant="glass" className="p-8 border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Policy Governance</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Role-Based Access Control (RBAC), edge PII scrubbing, and audit logs to ensure autonomous operations comply with corporate policies.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. CURRENT INTEGRATION: SERVICENOW DEEP DIVE */}
      <section className="space-y-12 bg-slate-50 dark:bg-slate-900/40 p-10 lg:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800">
        <div className="space-y-6 max-w-4xl">
          <Badge variant="emerald" className="font-bold">Implemented Capability</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Active Integration: ServiceNow ITSM Platform
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            OpsPilot features a native, production-grade integration with ServiceNow. Designed for enterprise IT Service Management (ITSM), this active connection enables bidirectional synchronization between OpsPilot's multi-agent engine and your ServiceNow instance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h4 className="text-xl font-bold">Automated Incident Ingestion & Classification</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1">
                  OpsPilot automatically listens for incoming ServiceNow incident records (`INCxxxxxxx`). It extracts short descriptions, impact levels, caller information, and technical stack details for instant AI classification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h4 className="text-xl font-bold">CMDB Context Resolution</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1">
                  Connects directly to ServiceNow Configuration Management Databases (CMDB) to resolve upstream and downstream service dependencies before recommending remediation actions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
              <div>
                <h4 className="text-xl font-bold">Automated Work Notes & Resolution Posting</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1">
                  Once an OpsPilot swarm diagnoses an issue or executes a remediation workflow, it posts formatted diagnostic summaries, root cause analyses, and work notes back to the ServiceNow incident.
                </p>
              </div>
            </div>
          </div>

          {/* ServiceNow Visual Mockup */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-slate-300">ServiceNow Instance: prod-sn.service-now.com</span>
              </div>
              <Badge variant="emerald">Connected & Active</Badge>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <span className="text-slate-500">[INC0094821]</span> High CPU Utilization on DB-Primary-01
                <div className="text-emerald-400 text-[11px]">→ Ingested by OpsPilot Agent Engine (Priority 1 - Critical)</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <span className="text-slate-500">[CMDB Query]</span> Fetching upstream dependent microservices...
                <div className="text-violet-400 text-[11px]">→ Found 3 dependent services: PaymentAPI, OrderService, UserAuth</div>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-indigo-200 space-y-1">
                <span className="font-bold">OpsPilot Recommendation:</span>
                <p className="text-[11px] leading-relaxed">Execute connection pool recycling playbook & post diagnostic log to ServiceNow Work Notes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODULAR CONNECTOR ARCHITECTURE: ACTIVE VS PLANNED ROADMAP */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-6 max-w-4xl">
          <Badge variant="indigo" className="font-bold">Connector Framework</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Modular Connector Architecture
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            OpsPilot is engineered around a modular connector framework. This decoupled architecture allows enterprise operations teams to expand AI capabilities across their entire IT ecosystem without core platform redesigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Implemented Connectors */}
          <Card variant="glass" className="p-8 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Active Implemented Connectors</h3>
              <Badge variant="emerald" className="font-bold">Currently Available</Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              These connections are currently implemented, tested, and actively available in the codebase.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>ServiceNow ITSM Connector (Incident & CMDB Sync)</span>
              </li>
              <li className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>REST API Universal Webhook Connector</span>
              </li>
            </ul>
          </Card>

          {/* Planned Future Roadmap Connectors */}
          <Card variant="glass" className="p-8 border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Planned Future Connectors</h3>
              <Badge variant="slate" className="font-bold">Roadmap / Planned</Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              The modular connector architecture allows planned future expansion into the following enterprise systems:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Jira Software</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Azure DevOps</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">GitHub Enterprise</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Datadog APM</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Splunk Cloud</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Microsoft Teams</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Slack Enterprise</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Confluence</div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Salesforce CRM</div>
            </div>
          </Card>

        </div>
      </section>

      {/* 5. STEP-BY-STEP OPERATIONAL WORKFLOW EXAMPLE */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Example Operational Incident Workflow
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Here is how OpsPilot handles a critical production incident from ingestion to resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white font-bold flex items-center justify-center text-sm">1</div>
            <h4 className="font-bold text-lg">Signal Ingestion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ServiceNow triggers a webhook payload to OpsPilot containing incident parameters and system logs.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">2</div>
            <h4 className="font-bold text-lg">Context Enrichment</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              OpsPilot queries the CMDB vector to correlate historical incidents and identify root causes.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">3</div>
            <h4 className="font-bold text-lg">Swarm Execution</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-agent copilot swarm formulates a remediation strategy, validating commands against RBAC security policies.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">4</div>
            <h4 className="font-bold text-lg">Resolution & Audit</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Remediation details and full execution telemetry are written back to ServiceNow, resolving the ticket.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">OpsPilot Frequently Asked Questions</h2>
        </div>
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

      {/* 7. CTA */}
      <section className="pt-8 pb-12">
        <div className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-r from-violet-900 to-indigo-900 text-white text-center space-y-8 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Bring AI Intelligence to Enterprise Operations
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto font-medium">
            Launch the OpsPilot application console to manage ServiceNow connections, operational dashboards, and AI copilot swarms.
          </p>
          <div className="flex justify-center pt-4">
            <Button variant="default" size="lg" onClick={onLaunchPlatform} className="h-14 px-10 bg-white text-slate-950 font-bold hover:bg-slate-100">
              Launch OpsPilot Console
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
