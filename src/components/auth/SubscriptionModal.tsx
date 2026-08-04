import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Zap, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (tier: 'starter' | 'pro' | 'enterprise') => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoadingTier, setIsLoadingTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = (tier: 'starter' | 'pro' | 'enterprise', price: string) => {
    setIsLoadingTier(tier);
    toast(`Redirecting to Stripe Paywall`, {
      type: 'info',
      description: `Activating ${tier.toUpperCase()} plan (${price})...`
    });

    setTimeout(() => {
      setIsLoadingTier(null);
      onUpgradeSuccess(tier);
      toast(`Subscription Upgrade Complete!`, {
        type: 'success',
        description: `Welcome to PromptImageLab ${tier.toUpperCase()}. Unlimited executions unlocked!`
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <Badge variant="indigo" dot font-bold>⚡ Free Trial Runs Exhausted</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upgrade to Continue Building
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You've used your 3 free trial runs! Unlock unlimited AI Agent runs, multi-agent evaluation, and LangChain exports.
          </p>

          {/* Monthly / Annual Switcher */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-11 h-6 bg-indigo-600 rounded-full p-1 transition-colors relative focus:outline-none"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-bold ${isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>Annual</span>
              <Badge variant="emerald" font-bold>20% OFF</Badge>
            </div>
          </div>
        </div>

        {/* 2 MAIN PAYWALL TIERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Starter Plan */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter Developer</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${isAnnual ? '29' : '36'}</span>
                <span className="text-slate-400 text-xs">/ mo</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>500 Optimizations / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>2 Team Seats Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Gemini 3.6 Flash Engine</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full"
              isLoading={isLoadingTier === 'starter'}
              onClick={() => handleCheckout('starter', isAnnual ? '$29/mo' : '$36/mo')}
            >
              Get Starter
            </Button>
          </div>

          {/* Pro Team Plan (RECOMMENDED) */}
          <div className="p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/20 space-y-4 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4">
              <Badge variant="indigo" font-bold>★ Recommended</Badge>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Pro Engineering</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${isAnnual ? '99' : '119'}</span>
                <span className="text-slate-400 text-xs">/ mo</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <strong>Unlimited Prompt Executions</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Multi-Agent Comparison Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Python LangChain & FastAPI Exporter</span>
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              className="w-full shadow-lg shadow-indigo-600/30"
              isLoading={isLoadingTier === 'pro'}
              onClick={() => handleCheckout('pro', isAnnual ? '$99/mo' : '$119/mo')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Upgrade to Pro
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
