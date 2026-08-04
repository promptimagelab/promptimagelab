import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText, EyeOff, Globe } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8 select-none">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot className="font-bold font-mono">Platform Privacy Policy</Badge>
          <Badge variant="indigo">Effective: August 2026</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise Privacy, Security & Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Comprehensive disclosure regarding data handling, Google AdSense cookies, zero prompt logging, and user privacy rights.
        </p>
      </div>

      {/* Zero Data Retention Highlight */}
      <Card variant="glass" className="border-emerald-500/30">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0">
            <EyeOff className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Zero Model Training & Zero Prompt Retention Guarantee
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              PromptImageLab does NOT store, log, or submit your proprietary prompt templates, code snippets, or API outputs for LLM training purposes. All API requests pass strictly through stateless serverless proxies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Policy Sections */}
      <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">1. Information We Collect</h2>
          <p>
            When you visit PromptImageLab.com, we collect standard server log entries including your IP address, browser type, operating system, referring URLs, pages visited, and access timestamps. When using our BYOK (Bring Your Own Key) features, your secret API keys are encrypted client-side using AES-GCM 256-bit encryption before being cached locally in browser memory. Unencrypted secret keys are never written to disk or database logs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">2. Google AdSense & Third-Party Advertising Disclosures</h2>
          <p>
            Google AdSense and third-party advertising vendors serve ads on PromptImageLab.com. Please note:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              <strong>Cookies & DART Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites on the Internet.
            </li>
            <li>
              <strong>Personalized Ads:</strong> Google’s use of advertising cookies enables it and its partners to serve targeted ads based on your visit to PromptImageLab and/or other sites across the Web.
            </li>
            <li>
              <strong>Opt-Out Mechanism:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-bold underline">Google Ads Settings</a> or by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-bold underline">www.aboutads.info</a>.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">3. Log Files & Web Analytics</h2>
          <p>
            PromptImageLab follows standard log file procedures. These files log visitors when they navigate web applications. The information collected includes IP addresses, browser specs, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and click counts. This data is non-personally identifiable and is used solely for system administration, traffic analysis, and bot prevention.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">4. GDPR Data Protection Rights</h2>
          <p>Under the General Data Protection Regulation (GDPR), every user is entitled to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Right to Access:</strong> Request copies of your stored account telemetry.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate information.</li>
            <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request deletion of your account credentials and stored data.</li>
            <li><strong>Right to Restrict Processing:</strong> Request restrictions on processing your personal data.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to request that a business disclose the categories and specific pieces of personal data collected, or request data deletion. PromptImageLab does NOT sell personal information to third parties under any circumstance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">6. Children's Online Privacy Protection (COPPA)</h2>
          <p>
            PromptImageLab does not knowingly collect any Personal Identifiable Information from children under 13. If you believe your child provided such information on our site, please contact us immediately and we will promptly remove it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">7. Data Protection Officer (DPO) Contact</h2>
          <p>
            For enterprise security inquiries, SOC 2 reports, or privacy requests, contact our team at <span className="font-mono text-indigo-500 font-bold">contact@promptimagelab.com</span> or <span className="font-mono text-indigo-500 font-bold">privacy@promptimagelab.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
};
