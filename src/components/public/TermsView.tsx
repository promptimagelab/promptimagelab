import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const TermsView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8 select-none">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" className="font-bold">Terms of Service & User Agreement</Badge>
          <Badge variant="emerald">Effective: August 2026</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service & Usage Compliance
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Official terms governing the use of PromptImageLab platform services, BYOK API proxy, and security tools.
        </p>
      </div>

      {/* Summary Highlight */}
      <Card variant="glass" className="border-indigo-500/30">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Acceptance of Enterprise Terms
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              By accessing or using PromptImageLab.com, you agree to be bound by these Terms of Service. If you are using our services on behalf of an enterprise entity, you warrant that you possess full authority to bind that entity.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms Sections */}
      <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">1. API Keys & Bring Your Own Key (BYOK) Responsibility</h2>
          <p>
            Users are solely responsible for maintaining the security of secret API keys configured in PromptImageLab. API calls dispatched through our system communicate directly with provider network endpoints (Google AI Studio, OpenAI, Anthropic, Ollama). PromptImageLab accepts no liability for unauthorized usage or rate limit depletion resulting from user credential leakage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">2. Permitted Use & Acceptable Conduct</h2>
          <p>
            You agree not to use PromptImageLab to generate, distribute, or evaluate prompts intended for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Malicious code execution, malware creation, or cyberattack automation</li>
            <li>Bypassing system security controls or jailbreaking commercial LLM safety filters</li>
            <li>Unlawful harassment, hate speech, or prohibited content generation</li>
            <li>Infrastructure reverse engineering or unauthorized server scanning</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">3. Intellectual Property Rights</h2>
          <p>
            You retain 100% ownership and intellectual property rights to your input code, custom prompt templates, role personas, and generated output payloads. PromptImageLab claims zero ownership rights over user prompt assets.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">4. Service Availability & Limitation of Liability</h2>
          <p>
            PromptImageLab services are provided "AS IS" and "AS AVAILABLE". We make no warranties regarding uninterrupted uptime or third-party model latency. In no event shall PromptImageLab Inc. be liable for indirect, punitive, or consequential damages exceeding the amount paid by you in the preceding 12 months.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">5. Contact Legal Department</h2>
          <p>
            For legal inquiries, copyright notices, or SLA contract reviews, please email <span className="font-mono text-indigo-500 font-bold">legal@promptimagelab.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
};
