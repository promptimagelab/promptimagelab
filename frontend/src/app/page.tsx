"use client";

import { useState } from "react";
import { Terminal, Zap, Clock, DollarSign, Activity, Settings2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", color: "bg-emerald-500" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", color: "bg-amber-500" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", color: "bg-blue-500" },
  { id: "llama-3", name: "Llama 3", provider: "Meta", color: "bg-purple-500" },
];

export default function PromptImageLab() {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o", "claude-3.5-sonnet"]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const handleEvaluate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to evaluate.");
      return;
    }
    if (selectedModels.length === 0) {
      setError("Please select at least one model.");
      return;
    }

    setError(null);
    setIsEvaluating(true);
    setResults(null);

    try {
      const res = await fetch("http://localhost:8000/v1/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          models: selectedModels,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch evaluation results.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-white/20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10 shadow-lg">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">PromptImageLab</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <a href="/" className="hover:text-white transition-colors text-white">Playground</a>
          <a href="/dashboard" className="hover:text-white transition-colors flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> Control Plane</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Start Free
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-6">
            <Activity className="w-3 h-3 text-emerald-500" />
            Live BYOK Evaluation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            The standard for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
              AI model evaluation.
            </span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Test, compare, and benchmark leading foundational models side-by-side. 
            Real-time latency, token tracking, and cost analysis.
          </p>
        </div>

        {/* Playground Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls & Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-white">Model Selection</h2>
              </div>
              <div className="space-y-2">
                {AVAILABLE_MODELS.map(model => (
                  <label 
                    key={model.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedModels.includes(model.id) 
                        ? "bg-white/5 border-white/20" 
                        : "bg-transparent border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={selectedModels.includes(model.id)}
                        onChange={() => toggleModel(model.id)}
                      />
                      <div className={`w-2 h-2 rounded-full ${model.color}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{model.name}</div>
                        <div className="text-xs text-zinc-500">{model.provider}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">System Prompt & Context</h2>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here to evaluate across selected models..."
                className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
              {error && (
                <div className="mt-3 text-xs text-red-400 bg-red-400/10 border border-red-400/20 p-2 rounded-md">
                  {error}
                </div>
              )}
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="mt-4 w-full bg-white text-black hover:bg-zinc-200 transition-colors font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                {isEvaluating ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse" /> Evaluating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> Run Evaluation
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-6 min-h-[600px]">
              <AnimatePresence mode="wait">
                {!results && !isEvaluating && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 pt-32"
                  >
                    <Terminal className="w-12 h-12 opacity-20" />
                    <p className="text-sm">Select models and run an evaluation to see results.</p>
                  </motion.div>
                )}

                {isEvaluating && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center pt-32 space-y-6"
                  >
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-3 h-3 rounded-full bg-white/30"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-zinc-500 animate-pulse">Running concurrent evaluations...</p>
                  </motion.div>
                )}

                {results && !isEvaluating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white">Evaluation Results</h3>
                      <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Total Evaluation Time: <span className="text-white">{results.total_latency_ms}ms</span>
                      </div>
                    </div>
                    
                    <div className={`grid grid-cols-1 ${results.results.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                      {results.results.map((res: any, idx: number) => {
                        const modelConfig = AVAILABLE_MODELS.find(m => m.id === res.model) || AVAILABLE_MODELS[0];
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col"
                          >
                            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${modelConfig.color}`} />
                                <span className="font-semibold text-sm text-white">{modelConfig.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-zinc-400">
                                <span className="flex items-center gap-1" title="Time to first token">
                                  <Zap className="w-3 h-3" /> {res.ttft_ms}ms
                                </span>
                                <span className="flex items-center gap-1" title="Total latency">
                                  <Clock className="w-3 h-3" /> {res.latency_ms}ms
                                </span>
                                <span className="flex items-center gap-1" title="Estimated Cost">
                                  <DollarSign className="w-3 h-3" /> {res.cost_estimate}
                                </span>
                              </div>
                            </div>
                            <div className="p-5 flex-1">
                              <div className="prose prose-invert prose-sm max-w-none">
                                {res.content.split('\n').map((line: string, i: number) => (
                                  <p key={i} className="mb-2 last:mb-0 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
