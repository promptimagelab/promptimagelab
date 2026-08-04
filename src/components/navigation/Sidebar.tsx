import React, { useState } from 'react';
import { 
  Wand2, 
  Sliders, 
  ShieldCheck, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Search,
  Bot,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SaasAuthState } from '../../hooks/useSaasAuth';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSettings?: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  saasAuth: SaasAuthState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenSettings,
  saasAuth,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  const handleToggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  const navItems = [
    { id: 'agent-studio', label: 'Agent Studio', icon: Wand2, badge: 'Core' },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'connections', label: 'Connection Vault', icon: Sliders },
    { id: 'opspilot', label: 'OpsPilot Console', icon: Bot, badge: 'v4.2' },
    { id: 'admin', label: 'Governance & RBAC', icon: ShieldCheck },
  ];

  return (
    <aside className={cn(
      'h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 relative z-30 select-none',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Top Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
                <Wand2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Studio Workspace
              </span>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mx-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Quick Launcher */}
        <div className="p-3">
          <button
            onClick={onOpenSearch}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800',
              collapsed && 'justify-center px-0'
            )}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            {!collapsed && <span className="font-medium truncate">Search platform...</span>}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {saasAuth.subscriptionTier === 'free' && (
          <button
            onClick={() => saasAuth.setShowSubscriptionModal(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Trial Quota</span>
            </div>
            <span>{saasAuth.trialRunsLeft}/3 Left</span>
          </button>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleTheme}
            className={cn(
              'flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors',
              collapsed && 'justify-center px-0'
            )}
            title={`Currently ${resolvedTheme} mode (Mode: ${themeMode})`}
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-indigo-600 shrink-0" />}
            {!collapsed && <span>{resolvedTheme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Enterprise Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className={cn('flex items-center gap-2.5 px-2 py-1.5', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Alex Developer</div>
              <div className="text-[10px] text-slate-400 truncate">{saasAuth.userEmail || 'alex@enterprise.com'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
