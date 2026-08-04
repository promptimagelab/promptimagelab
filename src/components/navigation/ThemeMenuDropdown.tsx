import React from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ThemeMenuDropdownProps {
  onClose?: () => void;
}

export const ThemeMenuDropdown: React.FC<ThemeMenuDropdownProps> = ({ onClose }) => {
  const { themeMode, setThemeMode } = useTheme();

  const handleSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    if (onClose) onClose();
  };

  const options: Array<{
    id: ThemeMode;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    previewBg: string;
  }> = [
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Clean Apple/Stripe-style light surface',
      icon: Sun,
      previewBg: 'bg-slate-100 border-slate-300 text-slate-900',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Default GitHub/Linear-style slate workspace',
      icon: Moon,
      previewBg: 'bg-slate-950 border-slate-800 text-white',
    },
    {
      id: 'system',
      label: 'System Default',
      description: 'Matches your OS color scheme automatically',
      icon: Laptop,
      previewBg: 'bg-gradient-to-r from-slate-100 to-slate-900 border-slate-400 text-slate-700 dark:text-slate-300',
    },
  ];

  return (
    <div className="p-2 space-y-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-fadeIn text-slate-900 dark:text-slate-100">
      <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Appearance Theme
        </span>
      </div>

      <div className="space-y-1 pt-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = themeMode === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                'w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 transition-colors',
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center shrink-0', opt.previewBg)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {opt.label}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
