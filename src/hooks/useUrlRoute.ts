import { useState, useEffect, useCallback } from 'react';

const PAGE_TITLES: Record<string, string> = {
  'home': 'PromptImageLab | Enterprise AI Engineering Platform',
  'platform': 'Platform Overview | OpsPilot, Studio & Multi-Agent Architecture',
  'opspilot-public': 'OpsPilot | Autonomous IT Incident Triage & Telemetry',
  'studio-public': 'Agent Studio | Live Multi-Model Prompt Infrastructure',
  'prompt-library': 'AI Prompt Library | Enterprise Prompts for Gemini, OpenAI & Claude',
  'workflow-library': 'AI Workflow Library | Multi-Agent Orchestration Blueprints',
  'collections': 'Curated AI Collections | Top Prompts & Production Workflows',
  'community': 'Community & Early Access Hub | PromptImageLab Roadmap',
  'agent-studio': 'Agent Studio | Multi-Model Live AI Pipeline & Security Auditor',
  'studio': 'Agent Studio | Multi-Model Live AI Pipeline & Security Auditor',
  'opspilot': 'OpsPilot Workspace | Operations Dashboard & AI Telemetry',
  'opspilot-overview': 'OpsPilot Workspace | Executive Telemetry & Governance',
  'opspilot-triage': 'OpsPilot Workspace | Real-Time Incident Triage',
  'opspilot-copilot': 'OpsPilot Workspace | AI Copilot Terminal',
  'opspilot-governance': 'OpsPilot Workspace | Safety Guardrails',
  'opspilot-connections': 'OpsPilot Workspace | Vault & Infrastructure Connections',
  'dashboard': 'AI Analytics & Real Telemetry | Prompt Execution Metrics',
  'connections': 'AI Connections | Gemini, OpenAI, Groq & Claude API Management',
  'admin': 'AI Governance & OWASP LLM Vulnerability Scanner',
  'docs': 'Documentation & Enterprise AI Walkthroughs | PromptImageLab',
  'pricing': 'Pricing & Enterprise Plans | PromptImageLab',
  'integrations': 'Enterprise Integrations | ServiceNow, Jira, GitHub & Slacks',
  'about': 'About PromptImageLab | Enterprise AI Engineering Platform',
  'contact': 'Contact Support & Enterprise Sales | PromptImageLab',
  'privacy': 'Privacy Policy & Data Security | PromptImageLab',
  'terms': 'Terms of Service | PromptImageLab',
  'security': 'Security, SOC2 & OWASP Safety | PromptImageLab',
  'profile': 'User Profile & BYOK Vault | PromptImageLab',
  'status': 'Operational System Status & Diagnostics | PromptImageLab'
};

export function useUrlRoute(defaultRoute: string = 'home') {
  const getCleanRouteFromPath = useCallback((): string => {
    // 1. Handle legacy hash links if present (e.g., /#/docs -> redirect to clean path /docs)
    if (window.location.hash) {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (rawHash) {
        window.history.replaceState(null, '', `/${rawHash}`);
        return rawHash;
      }
    }

    // 2. Read clean pathname
    const pathname = window.location.pathname.replace(/^\/+/, '').trim();
    if (!pathname || pathname === 'index.html') {
      return defaultRoute;
    }
    return pathname;
  }, [defaultRoute]);

  const [route, setRoute] = useState<string>(getCleanRouteFromPath);

  useEffect(() => {
    const handlePopState = () => {
      const current = getCleanRouteFromPath();
      setRoute(current);
      const titleKey = current.split('/')[0];
      document.title = PAGE_TITLES[current] || PAGE_TITLES[titleKey] || 'PromptImageLab | Enterprise AI Platform';
    };

    // Set initial page title
    const current = getCleanRouteFromPath();
    const titleKey = current.split('/')[0];
    document.title = PAGE_TITLES[current] || PAGE_TITLES[titleKey] || 'PromptImageLab | Enterprise AI Platform';

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [getCleanRouteFromPath]);

  const navigate = useCallback((newRoute: string) => {
    setRoute(newRoute);
    const cleanPath = newRoute === 'home' ? '/' : `/${newRoute}`;
    window.history.pushState(null, '', cleanPath);
    const titleKey = newRoute.split('/')[0];
    document.title = PAGE_TITLES[newRoute] || PAGE_TITLES[titleKey] || 'PromptImageLab | Enterprise AI Platform';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [route, navigate] as const;
}

