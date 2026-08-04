import React from 'react';
import { SeoHead } from '../seo/SeoHead';
import { WorkflowItem } from '../../types';
import { ArrowLeft, Layers, CheckCircle2, ChevronRight, AlertTriangle, Sparkles, HelpCircle, Code, Play } from 'lucide-react';
import { Button } from '@ui-core';

interface WorkflowDetailViewProps {
  workflow: WorkflowItem;
  onBack: () => void;
  onSelectWorkflow: (workflowId: string) => void;
  onLaunchPlatform: () => void;
}

export const WorkflowDetailView: React.FC<WorkflowDetailViewProps> = ({
  workflow,
  onBack,
  onSelectWorkflow,
  onLaunchPlatform
}) => {
  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': workflow.title,
      'description': workflow.description,
      'articleCategory': workflow.category,
      'dateModified': workflow.updatedAt,
      'author': {
        '@type': 'Organization',
        'name': 'PromptImageLab Workflow Guild'
      }
    },
    ...(workflow.faqs && workflow.faqs.length > 0 ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': workflow.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title={workflow.title}
        description={`${workflow.description} Complete multi-step architecture diagram, prompt chain steps, agent interactions, and implementation guide.`}
        canonicalUrl={`https://promptimagelab.com/workflow/${workflow.slug}`}
        ogType="article"
        jsonLd={jsonLdData}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow Library</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Workflow Library</span>
            <ChevronRight className="w-3 h-3" />
            <span>{workflow.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{workflow.title}</span>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-extrabold uppercase">
                {workflow.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                {workflow.steps.length} Step Chain
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {workflow.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {workflow.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-1">
              <strong className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                Business Problem Solved:
              </strong>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {workflow.problemSolved}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-1">
              <strong className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Business Overview & Impact:
              </strong>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {workflow.businessOverview || workflow.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Models Used:</span>
              {workflow.recommendedModels.map(m => (
                <span key={m} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase">
                  {m}
                </span>
              ))}
            </div>

            <Button variant="primary" size="md" onClick={onLaunchPlatform} className="font-bold flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>Deploy Workflow in Studio</span>
            </Button>
          </div>
        </div>

        {/* Visual Architecture Flowchart */}
        {workflow.architectureDiagram && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-500" />
              <span>Visual Workflow Architecture</span>
            </h2>

            <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{workflow.architectureDiagram}</pre>
            </div>
          </div>
        )}

        {/* Executable Step Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-500" />
            <span>Step-by-Step Execution Chain</span>
          </h2>

          <div className="space-y-6">
            {workflow.steps.map((step, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-extrabold text-sm flex items-center justify-center">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">Recommended Model: {step.recommendedModel}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>

                <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase mb-1">Step System Prompt:</span>
                  <pre className="whitespace-pre-wrap">{step.promptText}</pre>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Inputs:</span>
                    {step.inputVariables.map(v => (
                      <code key={v} className="bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        {v}
                      </code>
                    ))}
                  </div>
                  <span className="text-emerald-500 font-bold">Output: {step.expectedOutputFormat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits, Limitations & Implementation Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflow.benefits && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Enterprise Benefits & SLA Impact</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {workflow.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-500">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {workflow.implementationGuide && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>Implementation Guide</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {workflow.implementationGuide.map((ig, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-violet-500">•</span>
                    <span>{ig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* FAQs */}
        {workflow.faqs && workflow.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-500" />
              <span>Workflow FAQs</span>
            </h3>
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {workflow.faqs.map((faq, i) => (
                <div key={i} className="pt-4 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
