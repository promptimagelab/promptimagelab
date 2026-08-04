import React, { useState } from 'react';
import { ShoppingBag, Star, Download, Play, CheckCircle2, Tag, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const MarketplaceView: React.FC = () => {
  const { toast } = useToast();
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  const marketplaceItems = [
    {
      id: 'm-1',
      title: 'ServiceNow ITSM Incident Resolver',
      category: 'ITIL & DevOps',
      price: '$49',
      rating: 4.9,
      downloads: '1,420',
      author: 'ServiceNow Certified Team',
      description: 'Production GlideRecord script generator and P1 incident classifier for enterprise IT teams.',
      features: ['Automated P1-P4 triage', 'GlideRecord JS generator', 'LangChain Python adapter']
    },
    {
      id: 'm-2',
      title: 'OWASP LLM Security Audit Suite',
      category: 'Security & Compliance',
      price: '$79',
      rating: 5.0,
      downloads: '3,810',
      author: 'AI Security Research Lab',
      description: 'Complete OWASP Top 10 vulnerability scanner suite with system leakage & prompt injection rules.',
      features: ['Injection detection', 'PII redaction rules', 'SOC 2 JSON audit stream']
    },
    {
      id: 'm-3',
      title: 'React 19 & Next.js 15 Refactoring Agent',
      category: 'Software Architecture',
      price: '$29',
      rating: 4.8,
      downloads: '5,120',
      author: 'Vercel Ecosystem Contributor',
      description: 'Refactor legacy React components into clean atomic primitives with Framer Motion animations.',
      features: ['React 19 Server Components', 'TypeScript strict mode', 'Accessibility ARIA tags']
    }
  ];

  const handleBuyItem = (item: typeof marketplaceItems[0]) => {
    setPurchasedIds([...purchasedIds, item.id]);
    toast(`Purchased ${item.title}!`, {
      type: 'success',
      description: `Item added to your AI Studio workspace. Receipt sent.`
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Monetized AI Asset Marketplace
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Buy & sell verified enterprise AI prompt playbooks. 70/30 Creator Revenue Split.
              </p>
            </div>
          </div>
        </div>

        <Badge variant="emerald" dot font-bold>Verified Creator Program Active</Badge>
      </div>

      {/* Grid of Marketplace Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketplaceItems.map((item) => {
          const isPurchased = purchasedIds.includes(item.id);
          return (
            <Card key={item.id} variant="glass" hoverEffect className="flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo">{item.category}</Badge>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{item.price}</span>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-xs text-slate-400 font-medium">
                  By {item.author} • ★ {item.rating} ({item.downloads} downloads)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Included Deliverables</div>
                  <ul className="space-y-1">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                {isPurchased ? (
                  <Button variant="outline" className="w-full" leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}>
                    Owned — In Workspace
                  </Button>
                ) : (
                  <Button variant="primary" className="w-full" onClick={() => handleBuyItem(item)} leftIcon={<ShoppingBag className="w-4 h-4" />}>
                    Buy Asset ({item.price})
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
