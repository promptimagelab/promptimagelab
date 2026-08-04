import React from 'react';
import { ArrowRight, FileText, Workflow, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { Card } from '@ui-core';

interface RelatedItem {
  id: string;
  type: 'prompt' | 'workflow' | 'doc' | 'integration' | 'architecture';
  title: string;
  category: string;
  targetRoute: string;
}

interface RelatedContentProps {
  currentTitle?: string;
  items?: RelatedItem[];
  onNavigate: (route: string) => void;
}

const DEFAULT_RELATED_ITEMS: RelatedItem[] = [
  {
    id: '1',
    type: 'prompt',
    title: 'ServiceNow P1 Incident Triage & CMDB Resolution',
    category: 'System Prompt',
    targetRoute: 'prompt-detail-snow-triage-p1'
  },
  {
    id: '2',
    type: 'workflow',
    title: 'Autonomous Incident Resolution & Escalation Chain',
    category: 'Agent Workflow',
    targetRoute: 'workflow-detail-snow-p1-investigation-flow'
  },
  {
    id: '3',
    type: 'doc',
    title: 'ServiceNow Integration Architecture & REST API Guide',
    category: 'Documentation',
    targetRoute: 'docs-use-case-it-operations-servicenow'
  },
  {
    id: '4',
    type: 'integration',
    title: 'ServiceNow ITSM Connector & OAuth Config',
    category: 'Integration Catalog',
    targetRoute: 'integrations'
  }
];

export const RelatedContent: React.FC<RelatedContentProps> = ({
  items = DEFAULT_RELATED_ITEMS,
  onNavigate
}) => {
  const getIcon = (type: RelatedItem['type']) => {
    switch (type) {
      case 'prompt':
        return <FileText className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'workflow':
        return <Workflow className="w-4 h-4 text-violet-500 shrink-0" />;
      case 'doc':
        return <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />;
      case 'integration':
        return <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return <Layers className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          Related Platform Assets & Cross-Links
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Connected Enterprise Flow
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            onClick={() => onNavigate(item.targetRoute)}
            className="p-4 space-y-3 cursor-pointer hover:border-indigo-500/50 transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Explore Asset</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
