import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { INITIAL_LIBRARY_PROMPTS } from '../../data/libraryData';
import { INITIAL_WORKFLOWS } from '../../data/workflowsData';
import { DOCS_ARTICLES } from '../../data/docsData';
import { Network, FileText, Compass, ExternalLink } from 'lucide-react';

interface SitemapViewProps {
  onSelectTab: (tab: string) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({ onSelectTab }) => {
  const mainPages = [
    { title: 'Home', route: 'home' },
    { title: 'OpsPilot Enterprise Platform', route: 'opspilot-public' },
    { title: 'Studio Prompt Workspace', route: 'studio-public' },
    { title: 'Community Hub', route: 'community' },
    { title: 'Prompt Library', route: 'prompt-library' },
    { title: 'Workflow Library', route: 'workflow-library' },
    { title: 'Use Cases', route: 'use-cases' },
    { title: 'Comparisons Matrix', route: 'comparisons' },
    { title: 'Integrations Catalog', route: 'integrations' },
    { title: 'Documentation & Guides', route: 'docs' },
    { title: 'Pricing & Plans', route: 'pricing' },
    { title: 'About Us', route: 'about' },
    { title: 'Contact Sales', route: 'contact' },
    { title: 'Privacy Policy', route: 'privacy' },
    { title: 'Terms of Service', route: 'terms' },
    { title: 'Cookie Policy', route: 'cookie-policy' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Site Map & Page Directory"
        description="Complete site index for PromptImageLab containing all platform products, AI prompt library items, workflow chains, documentation articles, and legal disclosures."
        canonicalUrl="https://promptimagelab.com/sitemap"
      />

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
            <Compass className="w-4 h-4" />
            <span>XML & Visual Site Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            PromptImageLab Site Architecture Map
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Easily navigate every route, product module, documentation topic, and problem-centric prompt page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Core Platform & Legal */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              <Network className="w-5 h-5 text-indigo-500" />
              <h2>Platform & Corporate Pages</h2>
            </div>
            <ul className="space-y-2 text-xs">
              {mainPages.map((p, i) => (
                <li key={i}>
                  <button
                    onClick={() => onSelectTab(p.route)}
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center justify-between w-full text-left font-medium"
                  >
                    <span>{p.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Problem-Centric Prompts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h2>Prompt Library Directory</h2>
            </div>
            <ul className="space-y-2.5 text-xs">
              {INITIAL_LIBRARY_PROMPTS.map((pr) => (
                <li key={pr.id}>
                  <button
                    onClick={() => onSelectTab(`prompt-detail-${pr.id}`)}
                    className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline text-left block w-full"
                  >
                    <span className="font-bold text-slate-900 dark:text-white block">{pr.title}</span>
                    <span className="text-[10px] text-slate-400">Category: {pr.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Workflows & Documentation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              <Compass className="w-5 h-5 text-violet-500" />
              <h2>Workflows & Documentation</h2>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <strong className="text-[10px] font-extrabold uppercase text-slate-400 block mb-2">Workflows:</strong>
                <ul className="space-y-2">
                  {INITIAL_WORKFLOWS.map((wf) => (
                    <li key={wf.id}>
                      <button
                        onClick={() => onSelectTab(`workflow-detail-${wf.id}`)}
                        className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:underline text-left block font-medium"
                      >
                        {wf.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <strong className="text-[10px] font-extrabold uppercase text-slate-400 block mb-2">Technical Documentation:</strong>
                <ul className="space-y-2">
                  {DOCS_ARTICLES.map((doc) => (
                    <li key={doc.id}>
                      <button
                        onClick={() => onSelectTab(`docs-${doc.slug}`)}
                        className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left block font-medium"
                      >
                        {doc.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
