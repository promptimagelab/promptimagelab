import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, 
  Search, 
  ChevronDown, 
  Settings,
  Network,
  Layers,
  Users,
  FileText,
  Workflow,
  ShieldCheck,
  Info,
  Mail
} from 'lucide-react';
import { Button } from '@ui-core';
import { cn } from '../lib/utils';
import { SaasAuthState } from '../hooks/useSaasAuth';
import { ThemeMenuDropdown } from './navigation/ThemeMenuDropdown';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSettings?: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  onOpenStudioDrawer: () => void;
  saasAuth: SaasAuthState;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenSettings,
  saasAuth,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'platform' | 'ai-library' | 'company' | 'settings' | null>(null);
  const headerNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (headerNavRef.current && !headerNavRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isPlatformActive = activeTab === 'opspilot-public' || activeTab === 'studio-public' || activeTab === 'community';
  const isAiLibraryActive = activeTab === 'prompt-library' || activeTab === 'workflow-library' || activeTab.startsWith('prompt-detail-') || activeTab.startsWith('workflow-detail-');
  const isCompanyActive = activeTab === 'about' || activeTab === 'contact' || activeTab === 'security' || activeTab === 'cookie-policy';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4" ref={headerNavRef}>
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => { setActiveTab('home'); setOpenDropdown(null); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Wand2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                PromptImageLab
              </span>
            </button>
          </div>

          {/* Clean Focused Top Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 relative">
            
            {/* 1. Home */}
            <button
              onClick={() => { setActiveTab('home'); setOpenDropdown(null); }}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
                activeTab === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              )}
            >
              Home
            </button>

            {/* 2. Platform Dropdown (Platform Overview, OpsPilot, Studio, Integrations, Community) */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap',
                  isPlatformActive || activeTab === 'platform' || activeTab === 'integrations'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                )}
              >
                <span>Platform</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'platform' && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                  <button
                    onClick={() => { setActiveTab('platform'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Platform Overview</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Architecture & Capability Hub</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('opspilot-public'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Network className="w-4 h-4 text-violet-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">OpsPilot</strong>
                      <span className="text-[10px] text-slate-400 font-normal">ServiceNow & Autonomous Ops</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('studio-public'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Wand2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Studio</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Prompt Lifecycle & Multi-Agent</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('integrations'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Integrations</strong>
                      <span className="text-[10px] text-slate-400 font-normal">ServiceNow, OpenAI, Gemini</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('community'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Community</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Roadmap & Early Access</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. AI Library Dropdown (Prompt Library, Workflow Library, Collections) */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'ai-library' ? null : 'ai-library')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap',
                  isAiLibraryActive || activeTab === 'collections'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                )}
              >
                <span>AI Library</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'ai-library' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'ai-library' && (
                <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                  <button
                    onClick={() => { setActiveTab('prompt-library'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Prompt Library</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Problem-Centric System Prompts</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('workflow-library'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Workflow className="w-4 h-4 text-violet-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Workflow Library</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Multi-Step Agent Chains</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('collections'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                  >
                    <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white font-bold">Collections</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Curated Industry Blueprints</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Documentation */}
            <button
              onClick={() => { setActiveTab('docs'); setOpenDropdown(null); }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
                activeTab === 'docs' || activeTab.startsWith('docs-')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              )}
            >
              Docs
            </button>

            {/* 5. Pricing */}
            <button
              onClick={() => { setActiveTab('pricing'); setOpenDropdown(null); }}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap',
                activeTab === 'pricing'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              )}
            >
              Pricing
            </button>

            {/* 6. Company Dropdown (About, Contact, Security) */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap',
                  isCompanyActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                )}
              >
                <span>Company</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'company' && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-fadeIn">
                  <button
                    onClick={() => { setActiveTab('about'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 text-indigo-500" />
                    <span>About Us</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('contact'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>Contact Support</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('security'); setOpenDropdown(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-violet-500" />
                    <span>Security & Trust</span>
                  </button>
                </div>
              )}
            </div>

          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => { setActiveTab('agent-studio'); setOpenDropdown(null); }}
              className="hidden sm:flex shadow-sm font-bold text-xs"
            >
              Dashboard / Launch Platform
            </Button>

            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Profile / Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  if (onOpenSettings) onOpenSettings();
                  else setOpenDropdown(openDropdown === 'settings' ? null : 'settings');
                }}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-1.5"
                title="Enterprise Settings & Appearance"
              >
                <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>

              {openDropdown === 'settings' && !onOpenSettings && (
                <div className="absolute right-0 mt-2 z-50 animate-fadeIn">
                  <ThemeMenuDropdown onClose={() => setOpenDropdown(null)} />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
