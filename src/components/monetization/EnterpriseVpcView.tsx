import React, { useState } from 'react';
import { Building2, ShieldCheck, DollarSign, Calculator, ArrowRight, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';

export const EnterpriseVpcView: React.FC = () => {
  const { toast } = useToast();
  const [devCount, setDevCount] = useState<number>(25);
  const [hourlyRate, setHourlyRate] = useState<number>(85);

  // ROI Calculations
  const hoursSavedPerDevMonthly = 12; // 12 hours saved per dev / mo
  const totalHoursSavedMonthly = devCount * hoursSavedPerDevMonthly;
  const totalDollarSavingsMonthly = totalHoursSavedMonthly * hourlyRate;
  const annualSavings = totalDollarSavingsMonthly * 12;

  const handleRequestVpcQuote = () => {
    toast('Enterprise VPC Proposal Requested', {
      type: 'success',
      description: 'Custom SLA proposal & SOC 2 package dispatched to your team.'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <Badge variant="indigo" dot font-bold>Enterprise Custom Deployment</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Private VPC Deployment & ROI Calculator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Deploy PromptImageLab directly inside your AWS, Azure, or GCP VPC with full white-label custom domain support.
        </p>
      </div>

      {/* INTERACTIVE DEVELOPER ROI CALCULATOR */}
      <Card variant="glass" className="border-indigo-500/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Interactive Engineering ROI Calculator</CardTitle>
              <CardDescription>Estimate annual dollar savings from AI prompt optimization</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Number of Software Engineers: <span className="font-mono text-indigo-500 text-sm font-extrabold">{devCount}</span>
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={devCount}
                onChange={(e) => setDevCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Average Developer Hourly Cost ($/hr): <span className="font-mono text-emerald-500 text-sm font-extrabold">${hourlyRate}/hr</span>
              </label>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* CALCULATED RESULTS BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Monthly Dev Hours Saved</div>
              <div className="text-2xl font-extrabold text-white">{totalHoursSavedMonthly.toLocaleString()} hrs / mo</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Monthly Engineering Savings</div>
              <div className="text-2xl font-extrabold text-emerald-400">${totalDollarSavingsMonthly.toLocaleString()} / mo</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Annual Net ROI</div>
              <div className="text-2xl font-extrabold text-indigo-400">${annualSavings.toLocaleString()} / yr</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WHITE LABEL & VPC DEPLOYMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-base">White-Label Custom Domain</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p>Deploy under your corporate identity (e.g., <span className="font-mono text-indigo-500 font-bold">ai.yourcompany.com</span>) with custom logo, SSO/SAML 2.0, and corporate color themes.</p>
            <Button variant="outline" size="sm" onClick={handleRequestVpcQuote} className="w-full">
              Request Custom Domain SLA
            </Button>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-base">Private Cloud VPC Isolated</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p>Run entirely inside your AWS EC2/EKS or Azure Kubernetes cluster. Zero telemetry leaves your private network cloud boundary.</p>
            <Button variant="primary" size="sm" onClick={handleRequestVpcQuote} className="w-full">
              Download VPC Deployment Helm Chart
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
