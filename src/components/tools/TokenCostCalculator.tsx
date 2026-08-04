import React, { useState } from 'react';
import { Calculator, DollarSign, Zap, BarChart2 } from 'lucide-react';
import { MODEL_PRICING_DATA } from '../../data/learnData';

export const TokenCostCalculator: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Provide a complete architectural analysis and TypeScript code refactor for our microservice API authentication layer.'
  );
  const [estimatedMonthlyQueries, setEstimatedMonthlyQueries] = useState(50000);
  const [outputTokensPerQuery, setOutputTokensPerQuery] = useState(500);

  const inputTokensCount = Math.max(1, Math.ceil(inputText.length / 4));
  const totalInputTokensPerMonth = inputTokensCount * estimatedMonthlyQueries;
  const totalOutputTokensPerMonth = outputTokensPerQuery * estimatedMonthlyQueries;

  return (
    <div className="w-full space-y-6">
      
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-600 text-white shadow-md">
            <Calculator className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            AI Token & Operational Cost Calculator
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Estimate token consumption, average response latency, and monthly API cost across top LLM providers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Sample Prompt Text (Input Tokens)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
              />
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                Estimated Input Tokens: {inputTokensCount} tokens
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Estimated Output Tokens / Response: {outputTokensPerQuery} tokens
              </label>
              <input
                type="range"
                min="50"
                max="4000"
                step="50"
                value={outputTokensPerQuery}
                onChange={(e) => setOutputTokensPerQuery(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Monthly Query Volume: {estimatedMonthlyQueries.toLocaleString()} requests
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="5000"
                value={estimatedMonthlyQueries}
                onChange={(e) => setEstimatedMonthlyQueries(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs space-y-1">
              <div className="font-bold">Monthly Workload Summary:</div>
              <div>Input Tokens: {(totalInputTokensPerMonth / 1_000_000).toFixed(2)}M / mo</div>
              <div>Output Tokens: {(totalOutputTokensPerMonth / 1_000_000).toFixed(2)}M / mo</div>
            </div>

          </div>
        </div>

        {/* Model Pricing Grid Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Estimated Monthly Cost Comparison
            </h3>

            <div className="space-y-2.5">
              {MODEL_PRICING_DATA.filter(m => m.contextWindow !== 'Image Model').map(model => {
                const inputCost = (totalInputTokensPerMonth / 1_000_000) * model.inputCostPer1M;
                const outputCost = (totalOutputTokensPerMonth / 1_000_000) * model.outputCostPer1M;
                const totalCost = inputCost + outputCost;

                return (
                  <div key={model.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{model.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {model.provider}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        In: ${model.inputCostPer1M.toFixed(2)}/M • Out: ${model.outputCostPer1M.toFixed(2)}/M • Latency: ~{model.latencyAvgMs}ms
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${totalCost.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ mo</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ${(totalCost / estimatedMonthlyQueries).toFixed(4)} / query
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
