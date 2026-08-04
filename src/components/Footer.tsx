import React from 'react';
import { Wand2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Wand2 className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              PromptImageLab
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            The enterprise AI engineering platform for teams building, optimizing, and operating production AI solutions. Native OpsPilot ServiceNow incident management and Studio multi-agent lifecycle tools.
          </p>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero Data Retention • Enterprise Security</span>
          </div>
        </div>

        {/* Column 1: Platform & Products */}
        <div className="space-y-3">
          <strong className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider block">
            Platform
          </strong>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('platform')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">
                Platform Overview
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('opspilot-public')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                OpsPilot ServiceNow
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('studio-public')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Studio Workspace
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('integrations')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Integrations Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('community')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Community & Roadmap
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: AI Library & Resources */}
        <div className="space-y-3">
          <strong className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider block">
            AI Library & Resources
          </strong>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('prompt-library')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Prompt Library
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('workflow-library')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Workflow Library
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('collections')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">
                Curated Collections
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('docs')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Documentation & Guides
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('sitemap')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Site Index & Sitemap
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Trust & Legal */}
        <div className="space-y-3">
          <strong className="text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider block">
            Company & Trust
          </strong>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onSelectTab('pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Pricing & Plans
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('about')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Contact Sales
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('cookie-policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Cookie Policy
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <span>© 2026 PromptImageLab Inc. All rights reserved. Built for long-term organic growth & enterprise reliability.</span>
        <div className="flex items-center gap-4">
          <button onClick={() => onSelectTab('robots.txt')} className="hover:underline font-mono">robots.txt</button>
          <button onClick={() => onSelectTab('sitemap')} className="hover:underline">Sitemap</button>
        </div>
      </div>
    </footer>
  );
};
