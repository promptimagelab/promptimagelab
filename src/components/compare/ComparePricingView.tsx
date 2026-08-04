import React from 'react';
import { useLocalDb } from '../../hooks/useLocalDb';
import { Check, Zap, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export const ComparePricingView: React.FC = () => {
  const { modelPricing } = useLocalDb();
  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for prompt enthusiasts & individual developers experimenting with LLMs.',
      features: [
        '100 Prompt Optimizations / mo',
        'Access to 50+ Library Prompts',
        'Basic Prompt Security Audit',
        'Standard Token Cost Calculator',
        'Community Support'
      ],
      buttonText: 'Get Started Free',
      isPopular: false
    },
    {
      name: 'Pro Engineer',
      price: '$29',
      period: 'per month',
      description: 'For AI developers, prompt engineers, and growth teams needing high-volume optimization.',
      features: [
        'Unlimited Prompt Optimizations',
        'Midjourney v6 & Flux.1 Image Builder',
        'Full AI Workflow Pipeline Chains',
        'Jailbreak & Prompt Injection Scanner',
        'REST API Access (10k requests/mo)',
        'Custom Variable Preset Presets'
      ],
      buttonText: 'Start Pro Trial',
      isPopular: true
    },
    {
      name: 'Enterprise Platform',
      price: '$199',
      period: 'per month',
      description: 'Dedicated governance, custom prompt guardrails, SOC-2 compliance, and dedicated API capacity.',
      features: [
        'Dedicated Enterprise API Rate Limits',
        'Custom Security Guardrail Ingestion',
        'Team Workspace & Role Governance',
        'Private Prompt Repository & SSO',
        'Audit Logs & Usage Telemetry',
        '24/7 Priority SLA Support'
      ],
      buttonText: 'Contact Enterprise Sales',
      isPopular: false
    }
  ];

  return (
    <div className="w-full space-y-12">
      
      {/* Model Spec Matrix */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Model Benchmarks & Specs
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI LLM & Image Model Comparison
          </h2>
          <p className="text-xs text-slate-500">
            Compare latency, pricing per 1M tokens, reasoning capability, and optimal use cases across leading foundation models.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 font-bold">Model Name</th>
                <th className="p-3.5 font-bold">Provider</th>
                <th className="p-3.5 font-bold">Input Cost / 1M</th>
                <th className="p-3.5 font-bold">Output Cost / 1M</th>
                <th className="p-3.5 font-bold">Latency (ms)</th>
                <th className="p-3.5 font-bold">Context Window</th>
                <th className="p-3.5 font-bold">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {modelPricing.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans">{m.name}</td>
                  <td className="p-3.5">{m.provider}</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">${m.inputCostPer1M.toFixed(2)}</td>
                  <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-bold">${m.outputCostPer1M.toFixed(2)}</td>
                  <td className="p-3.5">~{m.latencyAvgMs}ms</td>
                  <td className="p-3.5">{m.contextWindow}</td>
                  <td className="p-3.5 font-sans text-slate-500">{m.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Simple Transparent Pricing
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Choose the Plan for Your AI Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all ${
                tier.isPopular
                  ? 'bg-slate-900 text-white border-indigo-500 shadow-2xl scale-105'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <p className={`text-xs mt-1 ${tier.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className={`text-xs ${tier.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                    / {tier.period}
                  </span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-200/20 text-xs">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 shrink-0 ${tier.isPopular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                  tier.isPopular
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {tier.buttonText}
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
