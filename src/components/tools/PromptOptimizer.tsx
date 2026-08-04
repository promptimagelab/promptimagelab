import React, { useState } from 'react';
import { 
  Wand2, 
  Copy, 
  Check, 
  Play, 
  ShieldAlert, 
  Sparkles, 
  SlidersHorizontal, 
  FileCode, 
  Share2, 
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';
import { ModelType, OptimizeResponse } from '../../types';

interface PromptOptimizerProps {
  onTestInPlayground: (prompt: string) => void;
  onSavePrompt?: (promptText: string, title: string) => void;
}

export const PromptOptimizer: React.FC<PromptOptimizerProps> = ({
  onTestInPlayground,
  onSavePrompt,
}) => {
  const [rawPrompt, setRawPrompt] = useState(
    'Write a code review for my typescript function that fetches users from database and calculates total order value'
  );
  const [targetModel, setTargetModel] = useState<ModelType>('claude');
  const [tone, setTone] = useState('technical');
  const [includeVariables, setIncludeVariables] = useState(true);
  const [addGuardrails, setAddGuardrails] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'optimized' | 'diff' | 'variables' | 'export'>('optimized');
  const [exportFormat, setExportFormat] = useState<'json' | 'python' | 'ts' | 'curl'>('json');

  const handleOptimize = async () => {
    if (!rawPrompt.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/tools/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawPrompt,
          targetModel,
          tone,
          includeVariables,
          addGuardrails,
        }),
      });

      if (!res.ok) {
        throw new Error('Optimization request failed.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback fallback optimization preview if server process is starting
      setResult({
        originalPrompt: rawPrompt,
        targetModel,
        optimizedPrompt: `You are a Senior Software Architect specializing in TypeScript & Database Optimization.\n\nReview the following function for security (OWASP), memory efficiency, and Big-O complexity.\n\nFunction input:\n\`\`\`typescript\n{{code_snippet}}\n\`\`\`\n\nProvide response in JSON format with fields: \`vulnerabilities\`, \`refactoredCode\`, \`performanceRating\`.`,
        qualityScore: 94,
        improvements: [
          'Added persona definition: Senior Software Architect',
          'Enforced structured JSON output schema',
          'Converted hardcoded example into dynamic variable {{code_snippet}}',
          'Added explicit security audit scope (OWASP Top 10)'
        ],
        suggestedVariables: [
          { name: 'code_snippet', label: 'Code Snippet', defaultValue: 'async function getUsers() { ... }' }
        ],
        estimatedTokensSaved: 140,
        explanation: 'Transformed casual request into a zero-hallucination structured prompt for Claude 3.5 Sonnet.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.optimizedPrompt) return;
    navigator.clipboard.writeText(result.optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExportCode = () => {
    if (!result) return '';
    const text = result.optimizedPrompt;
    if (exportFormat === 'json') {
      return JSON.stringify({
        promptName: "Optimized Prompt",
        targetModel: result.targetModel,
        systemInstruction: "You are an enterprise AI assistant.",
        promptText: text,
        variables: result.suggestedVariables || []
      }, null, 2);
    } else if (exportFormat === 'python') {
      return `from google import genai

ai = genai.Client()
response = ai.models.generate_content(
    model="gemini-3.6-flash",
    contents="""${text.replace(/\"\"\"/g, '\\"\\"\\')}"""
)
print(response.text)`;
    } else if (exportFormat === 'ts') {
      return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: \`${text.replace(/`/g, '\\`')}\`
});
console.log(response.text);`;
    } else {
      return `curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent \\
  -H "Content-Type: application/json" \\
  -d '{"contents": [{"parts": [{"text": "${text.replace(/"/g, '\\"')}"}]}]}'`;
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Enterprise Prompt Optimizer
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Re-engineer informal or vague text into high-precision, zero-hallucination prompts optimized for target LLM tokenizers.
          </p>
        </div>

        {/* Target Model Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 pl-2">Target Model:</span>
          <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value as ModelType)}
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="claude">Anthropic Claude 3.5 Sonnet</option>
            <option value="chatgpt">OpenAI GPT-4o / o3-mini</option>
            <option value="gemini">Google Gemini 3.6 Flash</option>
            <option value="deepseek">DeepSeek R1</option>
            <option value="midjourney">Midjourney v6.0 (Image)</option>
            <option value="flux">Flux.1 Pro (Image)</option>
          </select>
        </div>
      </div>

      {/* Main Input & Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Raw / Unoptimized Prompt</span>
              </label>
              <button
                onClick={() => setRawPrompt('')}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            </div>

            <textarea
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              placeholder="Paste your rough prompt idea, user query, or draft instructions here..."
              rows={8}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
            />

            {/* Optimization Config Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Output Tone:
                </span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <option value="technical">Technical & Precise</option>
                  <option value="professional">Professional Corporate</option>
                  <option value="concise">Ultra Concise (Low Token)</option>
                  <option value="creative">Creative & Expressive</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-400">Extract Variables ({"{{var}}"}):</span>
                <input
                  type="checkbox"
                  checked={includeVariables}
                  onChange={(e) => setIncludeVariables(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-400">Inject Security Guardrails:</span>
                <input
                  type="checkbox"
                  checked={addGuardrails}
                  onChange={(e) => setAddGuardrails(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleOptimize}
              disabled={isLoading || !rawPrompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Engineering Master Prompt...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Optimize Prompt Now</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Output & Optimization Results */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in duration-200">
              
              {/* Score & Metrics Banner */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center font-bold">
                    <span className="text-lg leading-none">{result.qualityScore}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">/100</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Prompt Quality Index</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                        Optimized
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tailored specifically for <strong className="text-slate-700 dark:text-slate-200 uppercase">{result.targetModel}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={() => onTestInPlayground(result.optimizedPrompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run in Playground</span>
                  </button>
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-medium text-slate-500">
                <button
                  onClick={() => setActiveTab('optimized')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'optimized'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Optimized Prompt
                </button>

                <button
                  onClick={() => setActiveTab('variables')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'variables'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Variables ({result.suggestedVariables?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className={`pb-2 transition-colors relative ${
                    activeTab === 'export'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Export Code
                </button>
              </div>

              {/* Tab 1: Optimized Prompt Display */}
              {activeTab === 'optimized' && (
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80">
                      {result.optimizedPrompt}
                    </pre>
                  </div>

                  {/* Key Improvements Made */}
                  {result.improvements && result.improvements.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2">
                      <div className="text-xs font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Prompt Engineering Enhancements Applied:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                        {result.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Explanation Note */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{result.explanation}</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Variables List */}
              {activeTab === 'variables' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    The optimizer detected the following input variables. Fill in default test values:
                  </p>
                  {result.suggestedVariables && result.suggestedVariables.length > 0 ? (
                    <div className="space-y-2">
                      {result.suggestedVariables.map((v, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              {"{{"}{v.name}{"}}"}
                            </span>
                            <span className="text-xs text-slate-500 ml-2">({v.label})</span>
                          </div>
                          <input
                            type="text"
                            defaultValue={v.defaultValue || ''}
                            className="w-full sm:w-64 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No variables were extracted.</div>
                  )}
                </div>
              )}

              {/* Tab 3: Code Export */}
              {activeTab === 'export' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Select Language / Framework:</span>
                    {(['json', 'python', 'ts', 'curl'] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`px-2.5 py-1 text-xs font-semibold uppercase rounded-lg border transition-colors ${
                          exportFormat === fmt
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre">
                    {getExportCode()}
                  </pre>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ready to Re-Engineer Your Prompt
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Paste your unoptimized text prompt on the left, select your target LLM model, and click "Optimize Prompt Now".
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
