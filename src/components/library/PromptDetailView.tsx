import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { PromptItem } from '../../types';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Star, 
  ThumbsUp, 
  Bookmark, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2
} from 'lucide-react';
import { Button } from '@ui-core';
import { RelatedContent } from '../common/RelatedContent';

interface PromptDetailViewProps {
  prompt: PromptItem;
  onBack: () => void;
  onSelectPrompt: (promptId: string) => void;
  onSelectWorkflow: (workflowId: string) => void;
  onTestInPlayground: (promptText: string) => void;
}

export const PromptDetailView: React.FC<PromptDetailViewProps> = ({
  prompt,
  onBack,
  onSelectPrompt,
  onSelectWorkflow,
  onTestInPlayground
}) => {
  const [copied, setCopied] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables.forEach(v => {
      initial[v.name] = v.defaultValue || '';
    });
    return initial;
  });

  const getFilledPromptText = () => {
    let result = prompt.promptText;
    Object.entries(variableValues).forEach(([key, val]) => {
      result = result.replaceAll(`{{${key}}}`, val || `{{${key}}}`);
    });
    return result;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFilledPromptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Structured Data (JSON-LD) for Google Indexing
  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': prompt.title,
      'description': prompt.description,
      'articleCategory': prompt.category,
      'datePublished': prompt.createdAt,
      'author': {
        '@type': 'Organization',
        'name': prompt.author || 'PromptImageLab Engineering'
      }
    },
    ...(prompt.faqs && prompt.faqs.length > 0 ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': prompt.faqs.map(faq => ({
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
        title={prompt.title}
        description={`${prompt.description} Business context, input examples, customization steps, limitations, and FAQs.`}
        canonicalUrl={`https://promptimagelab.com/prompt/${prompt.slug || prompt.id}`}
        ogType="article"
        jsonLd={jsonLdData}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button & Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Prompt Library</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>AI Library</span>
            <ChevronRight className="w-3 h-3" />
            <span>{prompt.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{prompt.title}</span>
          </div>
        </div>

        {/* Main Title & Meta Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
                {prompt.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                Difficulty: {prompt.difficulty}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold ml-auto">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{prompt.rating}</span>
                <span className="text-slate-400">({prompt.likesCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {prompt.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Business Context & Problem Statement */}
          {prompt.businessContext && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-1">
                <strong className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Business Context & ROI Impact:
                </strong>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {prompt.businessContext}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-1">
                <strong className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                  Problem Solved:
                </strong>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {prompt.problemExplanation || prompt.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Model Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400">Verified Model Compatibility:</span>
            {prompt.models.map(m => (
              <span key={m} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Prompt Workspace & Fillable Variables */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Executable Prompt Template</span>
            </h2>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </Button>
              
              <Button variant="primary" size="sm" onClick={() => onTestInPlayground(getFilledPromptText())}>
                Test in Studio
              </Button>
            </div>
          </div>

          {/* Interactive Variable Inputs */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                Customize Template Variable Inputs:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prompt.variables.map(v => (
                  <div key={v.name} className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {v.label} <code className="text-indigo-500 font-mono text-[11px]">{`{{${v.name}}}`}</code>
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.name] || ''}
                      onChange={(e) => setVariableValues({ ...variableValues, [v.name]: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rendered Prompt Text */}
          <div className="relative bg-slate-950 text-slate-100 rounded-2xl p-6 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
            <pre className="whitespace-pre-wrap">{getFilledPromptText()}</pre>
          </div>
        </div>

        {/* Input & Output Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Example Input Payload:
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {prompt.inputExample || 'Default configuration inputs passed to template parameters.'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Expected Output Format:
            </h3>
            <div className="bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              {prompt.expectedOutput}
            </div>
          </div>
        </div>

        {/* Customization Guide, Limitations & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prompt.customizationGuide && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Customization Guide</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {prompt.customizationGuide.map((cg, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-500">•</span>
                    <span>{cg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prompt.limitations && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Limitations</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {prompt.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-500">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prompt.bestPractices && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Best Practices</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {prompt.bestPractices.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-indigo-500">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* FAQs */}
        {prompt.faqs && prompt.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>Frequently Asked Questions</span>
            </h3>
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {prompt.faqs.map((faq, i) => (
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

        {/* Version History & Metadata */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
              Version v1.2.0
            </span>
            <span>Last Updated: <strong>2026-08-01</strong></span>
          </div>
          <div className="text-slate-400">
            Changelog: Added Handlebars schema validation & ServiceNow incident work-note format.
          </div>
        </div>

        {/* Cross-Linking Related Content */}
        <RelatedContent onNavigate={onBack} />

      </div>
    </div>
  );
};
