import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { ShieldCheck, Cookie } from 'lucide-react';

export const CookiePolicyView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Cookie Policy & Preference Settings"
        description="PromptImageLab Cookie Policy detailing local storage, session cookies, analytics preferences, and enterprise data privacy."
        canonicalUrl="https://promptimagelab.com/cookie-policy"
      />

      <div className="max-w-4xl mx-auto space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Cookie & Local Storage Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: February 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              1. What Are Cookies and Local Storage?
            </h2>
            <p>
              PromptImageLab uses cookies and browser local storage to maintain session state, preserve user preferences (such as dark mode and API workspace configurations), and evaluate website performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Essential Cookies vs. Analytics</h2>
            <p>
              We categorize browser storage into two tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Essential Session Cookies:</strong> Required to authenticate users into OpsPilot and Studio workspaces and enforce project access controls.</li>
              <li><strong>Preference Storage:</strong> Saves theme preferences, prompt variable defaults, and UI panel settings locally in your browser.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Cookies & AdSense Compliance</h2>
            <p>
              PromptImageLab does NOT sell personal user data to third parties. Any analytics or advertising scripts adhere strictly to GDPR, CCPA, and Google AdSense publisher guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Managing Your Preferences</h2>
            <p>
              You can modify or clear browser cookies and local storage at any time via your web browser settings. Clearing storage will reset theme preferences and require re-authentication.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
