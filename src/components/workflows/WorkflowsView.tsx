import React, { useState } from 'react';
import { WorkflowItem, ModelType } from '../../types';
import { useLocalDb } from '../../hooks/useLocalDb';
import { 
  Workflow, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Play, 
  Layers, 
  Copy, 
  Check, 
  ChevronRight,
  FileText,
  Plus,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';

import { INITIAL_WORKFLOWS } from '../../data/workflowsData';

interface WorkflowsViewProps {
  onTestInPlayground: (promptText: string) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({ onTestInPlayground }) => {
  const { db, workflows } = useLocalDb();
  const displayWorkflows = (workflows && workflows.length > 0) ? workflows : INITIAL_WORKFLOWS;

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(displayWorkflows[0]?.id || 'wf-1');
  const activeWorkflow = displayWorkflows.find(w => w.id === activeWorkflowId) || displayWorkflows[0];

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // New Workflow Modal State
  const [isAddWfOpen, setIsAddWfOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newProblem, setNewProblem] = useState('');
  const [step1Title, setStep1Title] = useState('');
  const [step1Prompt, setStep1Prompt] = useState('');
  const [step2Title, setStep2Title] = useState('');
  const [step2Prompt, setStep2Prompt] = useState('');

  const handleCopyStepPrompt = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(index);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleDownloadWorkflowJson = () => {
    if (!activeWorkflow) return;
    db.incrementWorkflowDownloads(activeWorkflow.id);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeWorkflow, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeWorkflow.slug}-workflow.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteWorkflow = (id: string) => {
    if (window.confirm('Delete this workflow from your database?')) {
      db.deleteWorkflow(id);
      const remaining = workflows.filter(w => w.id !== id);
      if (remaining.length > 0) setActiveWorkflowId(remaining[0].id);
    }
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !step1Prompt.trim()) return;

    const newWf = db.addWorkflow({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: newDescription || 'Custom automated multi-step AI pipeline',
      category: newCategory,
      problemSolved: newProblem || 'Streamlines complex reasoning into structured sequential steps.',
      recommendedModels: ['chatgpt', 'claude', 'gemini'],
      expectedResults: 'High accuracy multi-stage pipeline output.',
      tags: [newCategory, 'Custom Pipeline'],
      difficulty: 'Intermediate',
      steps: [
        {
          stepNumber: 1,
          title: step1Title || 'Phase 1 Initial Analysis',
          description: 'Extracts core intent and structures input data',
          promptText: step1Prompt,
          recommendedModel: 'gemini' as ModelType,
          inputVariables: ['user_input'],
          expectedOutputFormat: 'Structured Markdown'
        },
        ...(step2Prompt.trim() ? [{
          stepNumber: 2,
          title: step2Title || 'Phase 2 Execution & Refinement',
          description: 'Refines and executes step 1 outputs',
          promptText: step2Prompt,
          recommendedModel: 'claude' as ModelType,
          inputVariables: [],
          expectedOutputFormat: 'Production Result'
        }] : [])
      ]
    });

    setActiveWorkflowId(newWf.id);
    setIsAddWfOpen(false);
    setNewTitle('');
    setNewDescription('');
    setStep1Prompt('');
    setStep2Prompt('');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white space-y-4 shadow-xl border border-violet-900/50">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-600 text-white shadow-md">
            <Workflow className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Prompt Workflows & Prompt Chains
          </h1>
        </div>
        <p className="text-sm text-slate-300 max-w-2xl">
          Multi-step sequential prompt pipelines designed for complex software engineering, SEO automation, incident management, and business strategy.
        </p>

        {/* Workflow Selector Pills */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
            {displayWorkflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => {
                  setActiveWorkflowId(wf.id);
                  setActiveStepIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeWorkflow?.id === wf.id
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {wf.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddWfOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Workflow Details & Steps Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Diagram & Step Sequence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  {activeWorkflow.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeWorkflow.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDeleteWorkflow(activeWorkflow.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
                  title="Delete Workflow from DB"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownloadWorkflowJson}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Download JSON Template"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {activeWorkflow.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <strong className="text-slate-900 dark:text-white">Problem Solved:</strong>
              <p>{activeWorkflow.problemSolved}</p>
            </div>

            {/* Visual Node Diagram List */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pipeline Nodes ({activeWorkflow.steps.length} Steps)
              </h4>

              <div className="space-y-2">
                {activeWorkflow.steps.map((step, idx) => {
                  const isCurrent = activeStepIndex === idx;
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-violet-950 dark:text-violet-200 font-semibold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isCurrent ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{step.title}</div>
                          <div className="text-[10px] opacity-70">Recommended: {step.recommendedModel}</div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-violet-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Active Step Details & Prompt Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {activeWorkflow.steps[activeStepIndex] && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in duration-150">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Step {activeWorkflow.steps[activeStepIndex].stepNumber} of {activeWorkflow.steps.length}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeWorkflow.steps[activeStepIndex].title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyStepPrompt(activeStepIndex, activeWorkflow.steps[activeStepIndex].promptText)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    {copiedStep === activeStepIndex ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onTestInPlayground(activeWorkflow.steps[activeStepIndex].promptText)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Step Prompt</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {activeWorkflow.steps[activeStepIndex].description}
              </p>

              {/* Step Prompt Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step Prompt Template
                </label>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activeWorkflow.steps[activeStepIndex].promptText}
                </pre>
              </div>

              {/* Inputs & Output Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Required Input Variables:</div>
                  <div className="flex flex-wrap gap-1">
                    {activeWorkflow.steps[activeStepIndex].inputVariables.length > 0 ? (
                      activeWorkflow.steps[activeStepIndex].inputVariables.map(v => (
                        <span key={v} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-[10px]">
                          {"{{"}{v}{"}}"}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None (Uses prior step context)</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Output Format:</div>
                  <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {activeWorkflow.steps[activeStepIndex].expectedOutputFormat}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Add New Workflow Modal */}
      {isAddWfOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Build Custom Multi-Step Workflow Pipeline
              </h3>
              <button onClick={() => setIsAddWfOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pipeline Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Microservices Refactoring Automation"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Engineering, SEO, etc."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Problem Solved</label>
                  <input
                    type="text"
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    placeholder="e.g. Automates monolithic code breaking"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief workflow overview..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Step 1 */}
              <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/50 space-y-2">
                <div className="text-xs font-bold text-violet-700 dark:text-violet-300">Step 1: Input Analysis & Planning *</div>
                <input
                  type="text"
                  value={step1Title}
                  onChange={(e) => setStep1Title(e.target.value)}
                  placeholder="Step 1 Title (e.g. Audit Monolith Architecture)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
                <textarea
                  required
                  rows={3}
                  value={step1Prompt}
                  onChange={(e) => setStep1Prompt(e.target.value)}
                  placeholder="Step 1 prompt instructions..."
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {/* Step 2 Optional */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Step 2: Execution & Output (Optional)</div>
                <input
                  type="text"
                  value={step2Title}
                  onChange={(e) => setStep2Title(e.target.value)}
                  placeholder="Step 2 Title (e.g. Generate Microservice Boilerplate)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
                <textarea
                  rows={3}
                  value={step2Prompt}
                  onChange={(e) => setStep2Prompt(e.target.value)}
                  placeholder="Step 2 prompt instructions..."
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWfOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Save Pipeline to DB
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
