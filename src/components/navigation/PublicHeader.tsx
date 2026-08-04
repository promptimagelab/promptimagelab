import React from 'react';
import { Wand2, ArrowRight } from 'lucide-react';
import { Button, Badge } from '@ui-core';
import { cn } from '../../lib/utils';

interface PublicHeaderProps {
  activePublicTab: string;
  setActivePublicTab: (tab: string) => void;
  onLaunchPlatform: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePublicTab,
  setActivePublicTab,
  onLaunchPlatform,
}) => {
  // STRICT 4 CORE PUBLIC MENUS
  const publicMenus = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'privacy', label: 'Privacy Policy' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setActivePublicTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  PromptImageLab
                </span>
                <Badge variant="indigo">Enterprise</Badge>
              </div>
            </div>
          </button>

          {/* EXACT 4 PUBLIC MENUS (Home, About, Contact, Privacy Policy) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {publicMenus.map((menu) => {
              const isActive = activePublicTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActivePublicTab(menu.id)}
                  className={cn(
                    'px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap',
                    isActive
                      ? 'text-indigo-400 bg-indigo-950/50 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  )}
                >
                  {menu.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onLaunchPlatform}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch AI Studio
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};
