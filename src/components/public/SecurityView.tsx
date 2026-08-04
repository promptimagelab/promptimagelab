import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card, Badge } from '@ui-core';
import { useSEO } from '../../hooks/useSEO';

export const SecurityView: React.FC = () => {
  useSEO({
    title: 'Platform Governance & Guardrails',
    description: 'Learn how PromptImageLab secures your generative AI infrastructure with Zero Data Retention, prompt injection defenses, and client-side encryption.',
    keywords: 'AI security, LLM security, Zero Retention AI, PromptImageLab guardrails'
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16 py-16 px-6 sm:px-8 animate-fadeIn">
      <div className="text-center space-y-6">
        <Badge variant="indigo" className="font-bold">Trust & Governance</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Governance & Guardrails
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Your data belongs to you. We provide the architectural guardrails to help you build and operate AI safely without ever compromising privacy.
        </p>
      </div>

      <div className="space-y-6 mt-12">
        <Card variant="glass" className="p-8 border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-500/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Zero Data Retention Architecture</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                We do not train our models on your prompts, system instructions, or model outputs. In fact, we do not log them at all. Our inference infrastructure processes your requests strictly in-memory and immediately flushes the data after execution.
              </p>
            </div>
          </div>
        </Card>
        
        <Card variant="glass" className="p-8 border-indigo-500/20 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-indigo-500/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">BYOK (Bring Your Own Key) Vault</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Store your OpenAI, Anthropic, and Google API keys securely in your browser using AES-256 client-side encryption. We never see your raw API keys. They only decrypt when executing requests directly to the provider.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-8 border-rose-500/20 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-rose-500/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Real-time PII Redaction</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Automatically detect and redact sensitive Personally Identifiable Information (PII) such as SSNs, credit cards, and addresses before the payload ever reaches external LLM providers.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-8 border-violet-500/20 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-violet-500/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Prompt Injection Defenses</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Our edge middleware actively scans inputs to detect and block malicious jailbreak attempts, role-play bypasses, and instruction overrides, ensuring your autonomous agents execute only their intended workflows.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
