import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultExpandedId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  defaultExpandedId
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        
        return (
          <div 
            key={item.id} 
            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-200"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              aria-expanded={isExpanded}
            >
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {item.title}
              </span>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ml-4",
                  isExpanded ? "transform rotate-180" : ""
                )}
              />
            </button>
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-5 pt-0 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
