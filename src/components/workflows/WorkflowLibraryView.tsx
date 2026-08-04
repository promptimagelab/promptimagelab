import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { INITIAL_WORKFLOWS } from '../../data/workflowsData';
import { WorkflowItem } from '../../types';
import { Search, Compass, Layers, ArrowRight, Zap, ShieldCheck, Download } from 'lucide-react';

interface WorkflowLibraryViewProps {
  onSelectWorkflow: (workflowId: string) => void;
  onSelectTab: (tab: string) => void;
}

export const WorkflowLibraryView: React.FC<WorkflowLibraryViewProps> = ({ onSelectWorkflow, onSelectTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'ServiceNow Operations', 'DevOps & SRE', 'Software Development'];

  const filteredWorkflows = INITIAL_WORKFLOWS.filter(wf => {
    const matchesCategory = selectedCategory === 'All' || wf.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Enterprise AI Workflow Library & Pipeline Directory"
        description="Explore production multi-agent AI workflows for ServiceNow Incident Triage, SRE Root Cause Analysis, GitHub PR Security Audit, and SQL Optimization."
        canonicalUrl="https://promptimagelab.com/workflow-library"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-violet-500" />
            <span>Enterprise Process Automation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Multi-Agent AI Workflow Library
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            End-to-end multi-step AI pipelines designed to solve high-value enterprise engineering problems. Ready to deploy via OpsPilot and Studio.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows by problem or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkflows.map(wf => (
            <div
              key={wf.id}
              onClick={() => onSelectWorkflow(wf.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-extrabold uppercase">
                    {wf.category}
                  </span>

                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{wf.downloadsCount} runs</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {wf.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {wf.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-[11px] font-extrabold uppercase text-slate-400">Problem Solved:</strong>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {wf.problemSolved}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>{wf.steps.length} Executable Steps</span>
                  <span className="font-bold text-emerald-500">{wf.difficulty}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Architecture Workflow</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
