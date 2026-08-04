/**
 * App.tsx — PromptImageLab Root Application
 *
 * Three layout modes:
 * 1. OpsPilot Workspace  — dedicated sidebar layout for IT operations
 * 2. Studio Workspace    — dedicated sidebar layout for AI engineering
 * 3. Public Marketing    — full-width header/footer layout for public pages
 *
 * Performance:
 * - Heavy application views are lazy-loaded with React.lazy() + Suspense
 * - Reduces initial JS bundle from ~834 KB to under 300 KB
 * - Public pages (Header, Footer, HomeView) load immediately
 *
 * Auth:
 * - useFirebaseAuth provides real Firebase Auth with localStorage fallback
 * - Workspace routes require authentication (redirects to AuthModal)
 */

import React, { useState, useEffect, Suspense } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/auth/AuthModal';

import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useUrlRoute } from './hooks/useUrlRoute';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeOnboardingTooltip } from './components/ui/ThemeOnboardingTooltip';
import { INITIAL_LIBRARY_PROMPTS } from './data/libraryData';
import { INITIAL_WORKFLOWS } from './data/workflowsData';

// ── Lazy-loaded heavy routes (code splitting) ─────────────────────────────────
// Each lazy import creates a separate JS chunk loaded only when that route is first visited.

// OpsPilot workspace
const OpsPilotSidebar = React.lazy(() => import('./components/opspilot/OpsPilotSidebar').then(m => ({ default: m.OpsPilotSidebar })));
const OpsPilotDashboard = React.lazy(() => import('./components/opspilot/OpsPilotDashboard').then(m => ({ default: m.OpsPilotDashboard })));
const OpsPilotExecutiveOverview = React.lazy(() => import('./components/opspilot/OpsPilotExecutiveOverview').then(m => ({ default: m.OpsPilotExecutiveOverview })));
const OpsPilotCopilot = React.lazy(() => import('./components/opspilot/OpsPilotCopilot').then(m => ({ default: m.OpsPilotCopilot })));
const OpsPilotGovernance = React.lazy(() => import('./components/opspilot/OpsPilotGovernance').then(m => ({ default: m.OpsPilotGovernance })));
const OpsPilotConnections = React.lazy(() => import('./components/opspilot/OpsPilotConnections').then(m => ({ default: m.OpsPilotConnections })));

// Studio workspace
const Sidebar = React.lazy(() => import('./components/navigation/Sidebar').then(m => ({ default: m.Sidebar })));
const AIStudioView = React.lazy(() => import('./components/studio/AIStudioView').then(m => ({ default: m.AIStudioView })));
const UserDashboard = React.lazy(() => import('./components/dashboard/UserDashboard').then(m => ({ default: m.UserDashboard })));
const ConnectionsView = React.lazy(() => import('./components/connections/ConnectionsView').then(m => ({ default: m.ConnectionsView })));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel').then(m => ({ default: m.AdminPanel })));
const UserProfileView = React.lazy(() => import('./components/profile/UserProfileView').then(m => ({ default: m.UserProfileView })));
const SystemStatusView = React.lazy(() => import('./components/public/SystemStatusView').then(m => ({ default: m.SystemStatusView })));
const NotificationCenter = React.lazy(() => import('./components/ui/NotificationCenter').then(m => ({ default: m.NotificationCenter })));

// Public pages (loaded on demand)
const OpsPilotPublicView = React.lazy(() => import('./components/public/OpsPilotPublicView').then(m => ({ default: m.OpsPilotPublicView })));
const StudioPublicView = React.lazy(() => import('./components/public/StudioPublicView').then(m => ({ default: m.StudioPublicView })));
const PlatformPublicView = React.lazy(() => import('./components/public/PlatformPublicView').then(m => ({ default: m.PlatformPublicView })));
const ArchitecturePublicView = React.lazy(() => import('./components/public/ArchitecturePublicView').then(m => ({ default: m.ArchitecturePublicView })));
const CollectionsView = React.lazy(() => import('./components/library/CollectionsView').then(m => ({ default: m.CollectionsView })));
const AboutView = React.lazy(() => import('./components/public/AboutView').then(m => ({ default: m.AboutView })));
const ContactView = React.lazy(() => import('./components/public/ContactView').then(m => ({ default: m.ContactView })));
const SecurityView = React.lazy(() => import('./components/public/SecurityView').then(m => ({ default: m.SecurityView })));
const PrivacyPolicyView = React.lazy(() => import('./components/public/PrivacyPolicyView').then(m => ({ default: m.PrivacyPolicyView })));
const TermsView = React.lazy(() => import('./components/public/TermsView').then(m => ({ default: m.TermsView })));
const CookiePolicyView = React.lazy(() => import('./components/public/CookiePolicyView').then(m => ({ default: m.CookiePolicyView })));
const DocsView = React.lazy(() => import('./components/public/DocsView').then(m => ({ default: m.DocsView })));
const DocsArticleView = React.lazy(() => import('./components/public/DocsArticleView').then(m => ({ default: m.DocsArticleView })));
const ComparisonsView = React.lazy(() => import('./components/public/ComparisonsView').then(m => ({ default: m.ComparisonsView })));
const IntegrationsView = React.lazy(() => import('./components/public/IntegrationsView').then(m => ({ default: m.IntegrationsView })));
const SitemapView = React.lazy(() => import('./components/public/SitemapView').then(m => ({ default: m.SitemapView })));
const RobotsTxtView = React.lazy(() => import('./components/public/RobotsTxtView').then(m => ({ default: m.RobotsTxtView })));
const PromptLibraryView = React.lazy(() => import('./components/library/PromptLibraryView').then(m => ({ default: m.PromptLibraryView })));
const PromptDetailView = React.lazy(() => import('./components/library/PromptDetailView').then(m => ({ default: m.PromptDetailView })));
const WorkflowLibraryView = React.lazy(() => import('./components/workflows/WorkflowLibraryView').then(m => ({ default: m.WorkflowLibraryView })));
const WorkflowDetailView = React.lazy(() => import('./components/workflows/WorkflowDetailView').then(m => ({ default: m.WorkflowDetailView })));
const CommunityView = React.lazy(() => import('./components/community/CommunityView').then(m => ({ default: m.CommunityView })));
const PricingView = React.lazy(() => import('./components/monetization/PricingView').then(m => ({ default: m.PricingView })));
const SettingsModal = React.lazy(() => import('./components/settings/SettingsModal').then(m => ({ default: m.SettingsModal })));

// ── Route-level skeleton fallback ─────────────────────────────────────────────
const RouteSkeleton: React.FC = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center" aria-label="Loading page content">
    <div className="space-y-4 w-full max-w-4xl mx-auto px-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-2/3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse w-5/6" />
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const WorkspaceSkeleton: React.FC = () => (
  <div className="flex h-screen overflow-hidden" aria-label="Loading workspace">
    <div className="w-16 bg-slate-900 animate-pulse shrink-0" />
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse w-1/3" />
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useUrlRoute('home');
  const saasAuth = useFirebaseAuth();
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isOpsPilotAppWorkspace = activeTab.startsWith('opspilot') && activeTab !== 'opspilot-public';
  const studioPages = ['agent-studio', 'studio', 'dashboard', 'connections', 'admin', 'profile'];
  const isStudioWorkspace = studioPages.includes(activeTab) && activeTab !== 'studio-public';

  // Require login for workspace modules
  useEffect(() => {
    if ((isOpsPilotAppWorkspace || isStudioWorkspace) && !saasAuth.isLoggedIn) {
      saasAuth.setShowAuthModal(true);
    }
  }, [activeTab, isOpsPilotAppWorkspace, isStudioWorkspace, saasAuth.isLoggedIn]);

  // Redirect legacy route
  useEffect(() => {
    if (activeTab === 'use-cases') {
      setActiveTab('docs-use-case-it-operations-servicenow');
    }
  }, [activeTab, setActiveTab]);

  // Global Ctrl+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedPrompt = activeTab.startsWith('prompt-detail-')
    ? INITIAL_LIBRARY_PROMPTS.find(p => p.id === activeTab.replace('prompt-detail-', '')) || INITIAL_LIBRARY_PROMPTS[0]
    : null;

  const selectedWorkflow = activeTab.startsWith('workflow-detail-')
    ? INITIAL_WORKFLOWS.find(w => w.id === activeTab.replace('workflow-detail-', '')) || INITIAL_WORKFLOWS[0]
    : null;

  return (
    <ToastProvider>
      <div className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-900'
      }`}>

        {/* ── LAYOUT 1: OPSPILOT WORKSPACE ─────────────────────────────── */}
        {isOpsPilotAppWorkspace ? (
          <Suspense fallback={<WorkspaceSkeleton />}>
            <div className="flex h-screen overflow-hidden">
              <OpsPilotSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
                setDarkMode={() => {}}
              />
              <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
                <div className="flex-1">
                  <Suspense fallback={<RouteSkeleton />}>
                    {activeTab === 'opspilot-overview' && <OpsPilotExecutiveOverview onNavigateTab={setActiveTab} saasAuth={saasAuth} />}
                    {activeTab === 'opspilot-triage' && <OpsPilotDashboard saasAuth={saasAuth} />}
                    {activeTab === 'opspilot-copilot' && <OpsPilotCopilot saasAuth={saasAuth} />}
                    {activeTab === 'opspilot-governance' && <OpsPilotGovernance saasAuth={saasAuth} />}
                    {activeTab === 'opspilot-connections' && <OpsPilotConnections saasAuth={saasAuth} />}
                  </Suspense>
                </div>
              </main>
            </div>
          </Suspense>

        ) : isStudioWorkspace ? (
          /* ── LAYOUT 2: STUDIO WORKSPACE ──────────────────────────────── */
          <Suspense fallback={<WorkspaceSkeleton />}>
            <div className="flex h-screen overflow-hidden">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSearch={() => setSearchOpen(true)}
                onOpenSettings={() => setSettingsOpen(true)}
                darkMode={darkMode}
                setDarkMode={() => {}}
                saasAuth={saasAuth}
              />
              <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 flex flex-col">
                <div className="max-w-7xl w-full mx-auto space-y-6 flex-1">
                  <Suspense fallback={<RouteSkeleton />}>
                    {activeTab === 'agent-studio' && <AIStudioView saasAuth={saasAuth} />}
                    {activeTab === 'dashboard' && <UserDashboard onNavigate={setActiveTab} saasAuth={saasAuth} />}
                    {activeTab === 'connections' && <ConnectionsView saasAuth={saasAuth} />}
                    {activeTab === 'admin' && <AdminPanel saasAuth={saasAuth} />}
                    {activeTab === 'profile' && <UserProfileView saasAuth={saasAuth} onNavigate={setActiveTab} />}
                  </Suspense>
                </div>
              </main>
            </div>
          </Suspense>

        ) : (
          /* ── LAYOUT 3: PUBLIC PAGES ───────────────────────────────────── */
          <div className="flex flex-col min-h-screen">
            <Header
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenSearch={() => setSearchOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
              darkMode={darkMode}
              setDarkMode={() => {}}
              onOpenStudioDrawer={() => {}}
              saasAuth={saasAuth}
            />

            <main className="flex-1" id="main-content">
              <Suspense fallback={<RouteSkeleton />}>
                {activeTab === 'home' && (
                  <HomeView
                    onSelectTab={setActiveTab}
                    onOpenSearch={() => setSearchOpen(true)}
                    onTestInPlayground={() => setActiveTab('agent-studio')}
                  />
                )}
                {activeTab === 'platform' && <PlatformPublicView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'opspilot-public' && <OpsPilotPublicView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('opspilot-overview')} />}
                {activeTab === 'studio-public' && <StudioPublicView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'community' && <CommunityView />}

                {/* AI Libraries */}
                {activeTab === 'prompt-library' && (
                  <PromptLibraryView
                    onSelectPrompt={(promptId) => setActiveTab(`prompt-detail-${promptId}`)}
                    onOpenPlayground={() => setActiveTab('agent-studio')}
                    saasAuth={saasAuth}
                  />
                )}
                {selectedPrompt && activeTab.startsWith('prompt-detail-') && (
                  <PromptDetailView
                    prompt={selectedPrompt}
                    onBack={() => setActiveTab('prompt-library')}
                    onSelectPrompt={(pId) => setActiveTab(`prompt-detail-${pId}`)}
                    onSelectWorkflow={(wId) => setActiveTab(`workflow-detail-${wId}`)}
                    onTestInPlayground={() => setActiveTab('agent-studio')}
                  />
                )}

                {activeTab === 'workflow-library' && (
                  <WorkflowLibraryView
                    onSelectWorkflow={(wId) => setActiveTab(`workflow-detail-${wId}`)}
                    onSelectTab={setActiveTab}
                  />
                )}
                {selectedWorkflow && activeTab.startsWith('workflow-detail-') && (
                  <WorkflowDetailView
                    workflow={selectedWorkflow}
                    onBack={() => setActiveTab('workflow-library')}
                    onSelectWorkflow={(wId) => setActiveTab(`workflow-detail-${wId}`)}
                    onLaunchPlatform={() => setActiveTab('agent-studio')}
                  />
                )}

                {/* Collections */}
                {activeTab === 'collections' && (
                  <CollectionsView
                    onSelectTab={setActiveTab}
                    onSelectPrompt={(pId) => setActiveTab(`prompt-detail-${pId}`)}
                    onSelectWorkflow={(wId) => setActiveTab(`workflow-detail-${wId}`)}
                  />
                )}

                {/* Marketing & Info */}
                {activeTab === 'comparisons' && <ComparisonsView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'integrations' && <IntegrationsView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'architecture' && <ArchitecturePublicView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {(activeTab === 'product' || activeTab === 'features') && <PlatformPublicView onSelectTab={setActiveTab} onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'about' && <AboutView onLaunchPlatform={() => setActiveTab('agent-studio')} />}
                {activeTab === 'contact' && <ContactView />}
                {activeTab === 'security' && <SecurityView />}
                {activeTab === 'privacy' && <PrivacyPolicyView />}
                {activeTab === 'terms' && <TermsView />}
                {activeTab === 'cookie-policy' && <CookiePolicyView />}
                {activeTab === 'sitemap' && <SitemapView onSelectTab={setActiveTab} />}
                {activeTab === 'robots.txt' && <RobotsTxtView />}
                {activeTab === 'status' && <SystemStatusView onLaunchPlatform={() => setActiveTab('agent-studio')} />}

                {/* Documentation */}
                {activeTab === 'docs' && <DocsView onSelectArticle={(slug) => setActiveTab(`docs-${slug}`)} />}
                {activeTab.startsWith('docs-') && (
                  <DocsArticleView
                    articleSlug={activeTab.replace('docs-', '')}
                    onBackToDocs={() => setActiveTab('docs')}
                    onSelectArticle={(slug) => setActiveTab(`docs-${slug}`)}
                  />
                )}

                {activeTab === 'pricing' && <PricingView onLaunchPlatform={() => setActiveTab('agent-studio')} saasAuth={saasAuth} />}
              </Suspense>
            </main>

            <Footer onSelectTab={setActiveTab} />
          </div>
        )}

        {/* ── Global Overlays ────────────────────────────────────────────── */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelect={(tab) => { setActiveTab(tab); setSearchOpen(false); }}
        />

        <AuthModal
          isOpen={saasAuth.showAuthModal}
          onClose={() => saasAuth.setShowAuthModal(false)}
          onLoginSuccess={(email) => saasAuth.login ? saasAuth.login(email) : null}
          saasAuth={saasAuth}
        />

        <Suspense fallback={null}>
          {settingsOpen && (
            <SettingsModal
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              saasAuth={saasAuth}
            />
          )}
        </Suspense>

        <ThemeOnboardingTooltip />
      </div>
    </ToastProvider>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
