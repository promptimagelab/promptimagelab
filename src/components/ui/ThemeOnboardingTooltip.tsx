import React from 'react';
import { Moon, Sun, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button, Badge } from '@ui-core';

export const ThemeOnboardingTooltip: React.FC = () => {
  const { showOnboardingTooltip, dismissOnboardingTooltip, resolvedTheme } = useTheme();

  if (!showOnboardingTooltip) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-6 rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-indigo-500/30 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-4">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <Badge variant="indigo" className="font-bold">Appearance Preference</Badge>
            <h4 className="font-bold text-sm text-white mt-0.5">Welcome to PromptImageLab</h4>
          </div>
        </div>
        
        <button
          onClick={() => dismissOnboardingTooltip()}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Dismiss tooltip"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message */}
      <p className="text-xs text-slate-300 leading-relaxed font-medium">
        You're currently using <strong className="text-indigo-300">{resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>. You can customize your theme anytime from the settings menu.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => dismissOnboardingTooltip('dark')}
          leftIcon={<Moon className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-bold h-10"
        >
          Keep Dark Theme
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => dismissOnboardingTooltip('light')}
          leftIcon={<Sun className="w-3.5 h-3.5 text-amber-400" />}
          className="flex-1 text-xs font-bold h-10 border-slate-700 hover:bg-slate-800 text-slate-200"
        >
          Switch to Light
        </Button>
      </div>

    </div>
  );
};
