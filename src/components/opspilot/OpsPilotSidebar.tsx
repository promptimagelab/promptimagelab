import React from 'react';
import { 
  Terminal, 
  Activity, 
  Search, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Zap,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '@ui-core';

interface OpsPilotSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const OpsPilotSidebar: React.FC<OpsPilotSidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const opsNavItems = [
    { id: 'opspilot/overview', label: 'Executive Overview', icon: <Layers className="w-4 h-4" />, badge: 'Briefing' },
    { id: 'opspilot/dashboard', label: 'Operations Dashboard', icon: <Activity className="w-4 h-4" />, badge: 'Live' },
    { id: 'opspilot/investigation', label: 'Incident Resolver', icon: <Search className="w-4 h-4" />, badge: 'AI Swarm' },
    { id: 'opspilot/connections', label: 'Infra Connections', icon: <Server className="w-4 h-4" /> },
    { id: 'opspilot/governance', label: 'Ops Governance', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'opspilot/copilot', label: 'OpsCopilot Terminal', icon: <Sparkles className="w-4 h-4" />, badge: 'GPT-4o' },
  ];

  return (
    <aside
      className={cn(
        'relative h-screen sticky top-0 z-40 border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-950 text-slate-100 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shrink-0 select-none overflow-y-auto',
        collapsed ? 'w-16 p-2' : 'w-64 p-4'
      )}
    >
      <div className="space-y-6">
        
        {/* Back to PromptImageLab Main Application */}
        <button
          onClick={() => setActiveTab('home')}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
            {!collapsed && <span>Main Application</span>}
          </div>
          {!collapsed && <Badge variant="indigo">Exit OpsPilot</Badge>}
        </button>

        {/* OpsPilot Brand Logo */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">
                    OpsPilot
                  </span>
                  <Badge variant="emerald" dot font-bold>v4.2</Badge>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">PromptImageLab Enterprise</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* OpsPilot Navigation Group */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              OpsPilot Controls
            </div>
          )}

          {opsNavItems.map((item) => {
            const isActive = activeTab === item.id || (activeTab === 'opspilot' && item.id === 'opspilot/dashboard');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group',
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                )}
                title={item.label}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400')}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0',
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-indigo-400 border border-indigo-900/50'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px]">Autonomous Status</span>
            <span className="text-emerald-400 font-mono font-bold text-[10px]">99.98% Healthy</span>
          </div>
        </div>
      )}
    </aside>
  );
};
