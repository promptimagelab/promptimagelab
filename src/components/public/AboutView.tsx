import React from 'react';
import { Target, ShieldCheck, Layers } from 'lucide-react';
import { Card, Button, Badge, Accordion } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

interface AboutViewProps {
  onLaunchPlatform: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onLaunchPlatform }) => {
  const faqItems = [
    {
      id: '1',
      title: 'Why was ServiceNow chosen as the first active connector?',
      content: 'ServiceNow is the gold standard for enterprise IT Service Management (ITSM) and Configuration Management Databases (CMDB). Operating on ServiceNow incidents provided the highest operational leverage to prove OpsPilot’s multi-agent triage and automated resolution work note posting capabilities.'
    },
    {
      id: '2',
      title: 'What is the philosophy behind the modular connector architecture?',
      content: 'Enterprise IT environments are inherently heterogeneous. Rather than rebuilding the platform for every new tool, PromptImageLab utilizes a decoupled connector architecture. This allows seamless future expansion into Jira, Azure DevOps, GitHub, Datadog, Splunk, Microsoft Teams, Slack, Confluence, and Salesforce without altering core prompt engineering or multi-agent execution engines.'
    },
    {
      id: '3',
      title: 'What are PromptImageLab’s security engineering standards?',
      content: 'Our platform is engineered on Zero Data Retention (ZDR) processing, client-side AES-256 BYOK encryption, real-time edge PII scrubbing, and strict JSON schema output validation.'
    }
  ];

  useSEO({
    title: 'About PromptImageLab — Mission, Engineering Philosophy & Platform Vision',
    description: 'Learn why PromptImageLab was built: bringing software engineering rigor, modular multi-agent architecture, and OpsPilot operational intelligence to enterprise AI.',
    keywords: 'About PromptImageLab, AI Platform Vision, Enterprise AI Engineering, ServiceNow AI philosophy, Modular Connector Architecture'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-28 py-12 px-6 sm:px-8 select-none animate-fadeIn bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-5xl mx-auto space-y-8 pt-6">
        <Badge variant="indigo" className="font-bold">Platform Mission & Vision</Badge>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
          Bringing Software Engineering Rigor to Generative AI.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-4xl mx-auto">
          PromptImageLab was built to solve the infrastructure gap between raw Large Language Model API endpoints and the strict operational standards of enterprise software engineering.
        </p>
      </div>

      {/* 2. WHY PROMPTIMAGELAB WAS BUILT */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="max-w-4xl space-y-6">
          <Badge variant="emerald" className="font-bold">Why We Built PromptImageLab</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            The Need for Modular Enterprise AI Architecture
          </h2>
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              As Large Language Models emerged, enterprise engineering teams attempted to integrate AI into production systems by hardcoding prompts into application strings, manually copying text into web playgrounds, and writing ad-hoc API wrappers.
            </p>
            <p>
              This approach failed in production. Without version control, deterministic output validation, structured multi-agent coordination, and edge security guardrails, AI integrations remained fragile, slow, and prone to hallucinations.
            </p>
            <p>
              <strong>Generative AI required a dedicated engineering platform.</strong> PromptImageLab was designed around two distinct flagship applications: <strong>Studio</strong> to engineer and evaluate prompts and multi-agent workflows, and <strong>OpsPilot</strong> to connect those agents directly to production IT environments.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY SERVICENOW WAS CHOSEN FIRST & CONNECTOR ARCHITECTURE */}
      <section className="space-y-12 bg-slate-50 dark:bg-slate-900/40 p-10 lg:p-16 rounded-[3rem] border border-slate-200 dark:border-slate-800">
        <div className="space-y-6 max-w-4xl">
          <Badge variant="violet" className="font-bold">Strategic Integration Strategy</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why ServiceNow Was Chosen First
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise IT operations revolve around ServiceNow ITSM and CMDB. Incident triage, service dependency resolution, and ticket updating represent high-frequency, mission-critical operations where AI intelligence yields immediate MTTR reduction.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            By building a native, production-grade ServiceNow connector into OpsPilot first, we proved that autonomous multi-agent swarms can safely read incident parameters, query configuration item vectors, and post structured resolution work notes back to production ITSM tables.
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-2xl font-bold">The Connector-Based Architecture Philosophy</h3>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Enterprise ecosystems are non-uniform. To avoid vendor lock-in, PromptImageLab features a decoupled modular connector framework. While ServiceNow and REST APIs are implemented today, our technical roadmap incorporates planned future connector expansion into:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Jira Software</div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Azure DevOps</div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">GitHub Enterprise</div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Datadog APM</div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Splunk Cloud</div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Microsoft Teams / Slack</div>
          </div>
        </div>
      </section>

      {/* 4. MISSION & ENGINEERING PRINCIPLES */}
      <section className="space-y-12 border-t border-slate-200 dark:border-slate-800/80 pt-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">Our Architectural Principles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <Target className="w-10 h-10 text-indigo-500" />
            <h3 className="text-2xl font-bold">Determinism</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Enforcing JSON output schemas, regression evals, and strict validation to ensure AI responses behave predictably in code.
            </p>
          </Card>

          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
            <h3 className="text-2xl font-bold">Zero Trust Privacy</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Zero Data Retention processing and client-side encrypted BYOK vaults to keep corporate IP secure.
            </p>
          </Card>

          <Card className="p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <Layers className="w-10 h-10 text-violet-500" />
            <h3 className="text-2xl font-bold">Decoupled Agnosticism</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Model and connector agnosticism so enterprise teams can migrate seamlessly between foundation models.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. FAQS */}
      <section className="max-w-4xl mx-auto pt-12 border-t border-slate-200 dark:border-slate-800/80">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">About Platform FAQs</h2>
        </div>
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

      {/* 6. CTA */}
      <section className="pt-8 pb-12 text-center">
        <Button variant="primary" size="lg" onClick={onLaunchPlatform} className="px-10 h-14">
          Launch AI Engineering Platform
        </Button>
      </section>

    </div>
  );
};
