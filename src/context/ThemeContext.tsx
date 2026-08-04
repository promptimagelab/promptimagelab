import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  showOnboardingTooltip: boolean;
  dismissOnboardingTooltip: (chosenMode?: ThemeMode) => void;
}

const STORAGE_KEY = 'pil_theme_mode';
const ONBOARDING_KEY = 'pil_theme_onboarding_dismissed';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial stored preference or default to 'dark'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch (e) {
      // Fallback
    }
    return 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [showOnboardingTooltip, setShowOnboardingTooltip] = useState(false);

  // Determine system theme
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Update resolvedTheme and document class
  useEffect(() => {
    let active: ResolvedTheme = 'dark';
    if (themeMode === 'system') {
      active = getSystemTheme();
    } else {
      active = themeMode;
    }

    setResolvedTheme(active);

    const root = document.documentElement;
    if (active === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [themeMode]);

  // Listen to OS theme changes if in 'system' mode
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const active = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(active);
      const root = document.documentElement;
      if (active === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // 3-Second Onboarding Tooltip Timer
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ONBOARDING_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowOnboardingTooltip(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // Ignore
    }
  };

  const dismissOnboardingTooltip = (chosenMode?: ThemeMode) => {
    setShowOnboardingTooltip(false);
    if (chosenMode) {
      setThemeMode(chosenMode);
    }
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      // Ignore
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        setThemeMode,
        showOnboardingTooltip,
        dismissOnboardingTooltip,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
