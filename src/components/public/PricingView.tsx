import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@ui-core';

export const PricingView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Simple, Transparent Pricing</h1>
        <p className="text-slate-600 dark:text-slate-400">Start for free, scale as your team grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Starter */}
        <Card variant="default" className="border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Starter</CardTitle>
            <div className="mt-4"><span className="text-4xl font-bold">$0</span><span className="text-slate-500">/mo</span></div>
            <p className="text-sm text-slate-500 mt-2">Perfect for side projects and learning.</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 API Calls / mo</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Community Prompts</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic Security Checks</li>
            </ul>
            <Button variant="outline" className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card variant="glass" className="border-indigo-500 shadow-xl shadow-indigo-500/10 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-indigo-500">Pro</CardTitle>
            <div className="mt-4"><span className="text-4xl font-bold">$49</span><span className="text-slate-500">/mo</span></div>
            <p className="text-sm text-slate-500 mt-2">For professional AI engineers.</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 10,000 API Calls / mo</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Private Prompt Library</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Advanced Threat Detection</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Priority Email Support</li>
            </ul>
            <Button variant="primary" className="w-full">Start 14-Day Trial</Button>
          </CardContent>
        </Card>

        {/* Enterprise */}
        <Card variant="default" className="border-slate-200 dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Enterprise</CardTitle>
            <div className="mt-4"><span className="text-4xl font-bold">Custom</span></div>
            <p className="text-sm text-slate-500 mt-2">For large teams and rigorous compliance.</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited API Calls</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> SOC2 Report Access</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Account Manager</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> SLA Guarantees</li>
            </ul>
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
