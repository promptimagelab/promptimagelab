import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Accordion } from '@ui-core';
import { useToast } from '../ui/Toast';
import { useSEO } from '../../hooks/useSEO';

export const PricingView: React.FC = () => {
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSimulateCheckout = (planName: string) => {
    setSelectedPlan(planName);
    toast(`Redirecting to Stripe Checkout`, {
      type: 'info',
      description: `Initiating ${planName} subscription (${isAnnual ? 'Annual 20% Off' : 'Monthly'}).`
    });
    setTimeout(() => {
      toast(`Subscription Activated!`, {
        type: 'success',
        description: `Welcome to PromptImageLab ${planName}. Enterprise quota enabled.`
      });
      setSelectedPlan(null);
    }, 1500);
  };

  const faqItems = [
    {
      id: '1',
      title: 'How do you calculate "Prompt Executions"?',
      content: 'A Prompt Execution is counted anytime your application requests a prompt resolution from Prompt Studio, or anytime OpsPilot executes a step in a multi-agent workflow.'
    },
    {
      id: '2',
      title: 'Are underlying LLM API costs included?',
      content: 'No. PromptImageLab acts as the orchestration and security layer. You must bring your own API keys for OpenAI, Anthropic, or Google. Your requests are sent directly to those providers.'
    },
    {
      id: '3',
      title: 'What happens if I exceed my Starter plan quota?',
      content: 'If you exceed the execution limit on the Starter plan, your API will not go down. Instead, we allow a 10% overage grace period before asking you to upgrade to the Pro plan.'
    },
    {
      id: '4',
      title: 'Can we pay via invoice or Purchase Order?',
      content: 'Yes, on the Enterprise custom plan we support standard invoicing and custom vendor onboarding processes.'
    }
  ];

  useSEO({
    title: 'Enterprise AI Pricing & Plans | PromptImageLab',
    description: 'Flexible pricing for Prompt Studio and OpsPilot orchestration.',
    keywords: 'AI platform pricing, PromptImageLab cost, enterprise AI plans'
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-32 py-16 px-6 sm:px-8 animate-fadeIn">
      
      {/* 1. HEADER BANNER */}
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <Badge variant="indigo" className="font-bold">Platform Access Plans</Badge>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Transparent pricing for <br/> AI engineering teams.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Access Prompt Studio and OpsPilot orchestration at a scale that makes sense for your team. Bring your own API keys.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-16 h-8 bg-indigo-600 rounded-full p-1 transition-colors relative focus:outline-none shadow-inner"
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              Annual Billing
            </span>
            <Badge variant="emerald" className="font-bold">Save 20%</Badge>
          </div>
        </div>
      </div>

      {/* 2. PRICING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        
        {/* Tier 1: Starter */}
        <Card variant="glass" className="flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60">
          <CardHeader className="space-y-4 pt-10 px-8">
            <Badge variant="slate">Starter</Badge>
            <div>
              <CardTitle className="text-3xl font-bold">Developer</CardTitle>
              <CardDescription className="text-base font-medium mt-2">Ideal for solo engineers prototyping AI tools.</CardDescription>
            </div>
            <div className="pt-6 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-slate-900 dark:text-white">
                ${isAnnual ? '29' : '36'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold pb-2"> / month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-base text-slate-600 dark:text-slate-300 px-8 flex-grow mt-8">
            <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">
              Included Features:
            </div>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">10,000 Executions / mo</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Prompt Studio Access</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Basic Output Validation</span>
              </li>
              <li className="flex items-start gap-4 opacity-50">
                <span className="w-6 h-6 flex items-center justify-center font-bold shrink-0">—</span>
                <span className="leading-relaxed">No OpsPilot Workflows</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter className="px-8 pb-10 pt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-bold"
              isLoading={selectedPlan === 'Starter'}
              onClick={() => handleSimulateCheckout('Starter')}
            >
              Get Starter Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Tier 2: Pro (MOST POPULAR) */}
        <Card variant="glass" className="border-indigo-500 border-2 hover:-translate-y-4 transition-all duration-300 shadow-2xl shadow-indigo-500/20 bg-white dark:bg-slate-900 backdrop-blur-xl relative flex flex-col justify-between transform md:scale-105 z-10">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-full text-center">
            <Badge variant="indigo" className="px-6 py-2 text-sm shadow-md uppercase tracking-wider font-bold">Most Popular</Badge>
          </div>

          <CardHeader className="space-y-4 pt-12 px-8">
            <Badge variant="indigo">Pro</Badge>
            <div>
              <CardTitle className="text-3xl font-bold">Pro Team</CardTitle>
              <CardDescription className="text-base font-medium mt-2">For teams building production AI workflows.</CardDescription>
            </div>
            <div className="pt-6 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">
                ${isAnnual ? '99' : '119'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold pb-2"> / month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-base text-slate-600 dark:text-slate-300 px-8 flex-grow mt-8">
            <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">
              Everything in Starter, plus:
            </div>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                <strong className="text-slate-900 dark:text-white leading-relaxed font-bold">1,000,000 Executions / mo</strong>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">OpsPilot Swarm Orchestration</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">PII Redaction Guardrails</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Up to 5 Team Seats</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter className="px-8 pb-10 pt-8">
            <Button
              variant="primary"
              size="lg"
              className="w-full h-14 text-lg font-bold shadow-xl shadow-indigo-600/30"
              isLoading={selectedPlan === 'Pro'}
              onClick={() => handleSimulateCheckout('Pro')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start 14-Day Free Trial
            </Button>
          </CardFooter>
        </Card>

        {/* Tier 3: Enterprise */}
        <Card variant="glass" className="flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60">
          <CardHeader className="space-y-4 pt-10 px-8">
            <Badge variant="emerald">Enterprise</Badge>
            <div>
              <CardTitle className="text-3xl font-bold">Custom</CardTitle>
              <CardDescription className="text-base font-medium mt-2">Unlimited scale for enterprise teams.</CardDescription>
            </div>
            <div className="pt-6 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-slate-900 dark:text-white">
                Custom
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 text-base text-slate-600 dark:text-slate-300 px-8 flex-grow mt-8">
            <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-4">
              Full Enterprise Architecture:
            </div>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Unlimited Executions & Seats</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Dedicated VPC Deployment</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Custom Guardrail Training</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Dedicated Support Channel</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter className="px-8 pb-10 pt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-bold"
              isLoading={selectedPlan === 'Enterprise'}
              onClick={() => handleSimulateCheckout('Enterprise')}
            >
              Contact Sales
            </Button>
          </CardFooter>
        </Card>

      </div>

      {/* 4. FAQS */}
      <section className="max-w-4xl mx-auto pt-8 pb-16 border-t border-slate-200 dark:border-slate-800/50 mt-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Billing & Pricing FAQs</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to know about how we charge.</p>
        </div>
        
        <Accordion items={faqItems} defaultExpandedId="1" />
      </section>

    </div>
  );
};
