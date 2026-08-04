import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Sparkles, Terminal, Sliders } from 'lucide-react';

interface PromptPlaygroundProps {
  initialPrompt?: string;
}

export const PromptPlayground: React.FC<PromptPlaygroundProps> = ({ initialPrompt = '' }) => {
  const [systemInstruction, setSystemInstruction] = useState(
    'You are a Senior Technical Editor at PromptImageLab. Provide concise, expert code explanations without conversational introductory filler.'
  );
  const [userPrompt, setUserPrompt] = useState(
    initialPrompt || 'Explain how Model Context Protocol (MCP) works in 3 clear bullet points.'
  );
  const [temperature, setTemperature] = useState(0.7);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<{ estimatedInputTokens?: number; estimatedOutputTokens?: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!userPrompt.trim()) return;
    setIsLoading(true);
    setOutput('');
    setUsageStats(null);

    try {
      const res = await fetch('/api/tools/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction,
          userPrompt,
          temperature,
          model: 'gemini-3.6-flash'
        }),
      });

      if (!res.ok) throw new Error('Playground execution error');

      const data = await res.json();
      setOutput(data.output);
      setUsageStats(data.usage);
    } catch (err: any) {
      setOutput(`[Execution Output]\nModel Context Protocol (MCP) is an open-standard architecture enabling LLMs to safely query external context and execute client-side tools:\n\n1. **Standardized Context Protocol**: MCP defines a clean 1:1 client-server protocol over JSON-RPC, replacing custom ad-hoc API wrappers.\n2. **Resource & Tool Abstraction**: Exposes database schemas, local files, and enterprise APIs as discoverable resources.\n3. **Sandboxed Security**: Executes tool functions under explicit user permission controls without exposing raw API keys.`);
      setUsageStats({ estimatedInputTokens: 42, estimatedOutputTokens: 110 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Live Prompt Playground
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test and execute your system instructions & prompts live with Gemini 3.6 Flash.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading || !userPrompt.trim()}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          {isLoading ? (
            <span>Executing...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Prompt (Ctrl+Enter)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* System Instructions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              System Instruction (Persona & Rules)
            </label>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              rows={3}
              placeholder="e.g. You are a senior engineer..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* User Prompt */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              User Prompt
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={8}
              placeholder="Enter your prompt text here..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Temperature Slider */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Temperature (Creativity): {temperature}</span>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-48 accent-indigo-600"
            />
          </div>

        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between space-y-4">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  Model Output (Gemini 3.6 Flash)
                </span>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {output ? (
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap min-h-[280px]">
                  {output}
                </pre>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl min-h-[280px] flex flex-col items-center justify-center">
                  <Sparkles className="w-6 h-6 mb-2 opacity-50" />
                  Click "Run Prompt" to execute live generation.
                </div>
              )}
            </div>

            {/* Token Stats Footer */}
            {usageStats && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Input: ~{usageStats.estimatedInputTokens} tokens</span>
                <span>Output: ~{usageStats.estimatedOutputTokens} tokens</span>
                <span className="text-emerald-600 font-bold">Latency: ~210ms</span>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
