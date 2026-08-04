import React from 'react';
import { 
  X, 
  Bot, 
  Workflow, 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Wand2, 
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface StudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StudioDrawer: React.FC<StudioDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const studioLinks = [
    { id: 'agent-studio', label: 'Agent Studio', icon: <Bot className="w-4 h-4" />, badge: 'Live', desc: '3-pane prompt development & multi-agent laboratory' },
    { id: 'automation', label: 'Automation Studio', icon: <Workflow className="w-4 h-4" />, desc: 'Visual prompt chaining & code exporter' },
    { id: 'dashboard', label: 'AI Analytics', icon: <BarChart3 className="w-4 h-4" />, desc: 'Real-time telemetry, token costs, and latency' },
    { id: 'connections', label: 'Managed Connections', icon: <Cpu className="w-4 h-4" />, desc: 'BYOK vault for OpenAI, Anthropic, Gemini, Groq' },
    { id: 'admin', label: 'AI Governance', icon: <ShieldCheck className="w-4 h-4" />, desc: 'OWASP prompt injection guardrails & audit logs' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in select-none">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                    Studio Workspace Sidebar
                  </h2>
                  <span className="text-[10px] text-slate-400">Enterprise AI OS Quick Selector</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-2">
                All Workspace Tools
              </div>

              {studioLinks.map((item) => {
                const isActive = activeTab === item.id || (item.id === 'agent-studio' && activeTab === 'studio');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={cn(
                      'w-full text-left p-3 rounded-2xl transition-all border flex items-start gap-3.5',
                      isActive
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <div className={cn(
                      'p-2 rounded-xl shrink-0 mt-0.5',
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    )}>
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <button
              onClick={() => {
                setActiveTab('agent-studio');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Agent Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
