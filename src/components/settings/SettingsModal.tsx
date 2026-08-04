import React, { useState } from 'react';
import { 
  X, User, Palette, Bell, Lock, CreditCard, Bot, Link2, 
  Code, HelpCircle, Info, ShieldCheck, Sun, Moon, Laptop, Check, 
  Copy, RefreshCw, Key, ExternalLink, Download, AlertTriangle
} from 'lucide-react';
import { Button, Card, Badge, Input, Select } from '@ui-core';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { SaasAuthState } from '../../hooks/useSaasAuth';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  saasAuth: SaasAuthState;
  initialTab?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  saasAuth,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { themeMode, setThemeMode, resolvedTheme } = useTheme();
  const { toast } = useToast();

  // Profile State
  const [fullName, setFullName] = useState('Alex Developer');
  const [userEmail, setUserEmail] = useState(saasAuth.userEmail || 'alex@enterprise.com');
  const [organization, setOrganization] = useState('PromptImageLab Enterprise');

  // AI Workspace State
  const [defaultModel, setDefaultModel] = useState('gpt-4o');
  const [maxTokens, setMaxTokens] = useState('4096');
  const [temperature, setTemperature] = useState('0.7');

  // ServiceNow Integration State
  const [serviceNowUrl, setServiceNowUrl] = useState('https://enterprise-instance.service-now.com');
  const [snowUsername, setSnowUsername] = useState('opspilot_integration');

  // Developer API Key State
  const [apiKey, setApiKey] = useState('pil_live_89f4b2a1e7c3098f41129a');
  const [copiedKey, setCopiedKey] = useState(false);

  // Notification State
  const [emailIncidents, setEmailIncidents] = useState(true);
  const [emailSecurity, setEmailSecurity] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast('API Key Copied', { type: 'success', description: 'API Key copied to clipboard.' });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `pil_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    toast('API Key Regenerated', { type: 'warning', description: 'Old API key revoked. New live key generated.' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Settings Saved', { type: 'success', description: 'Your profile settings have been updated.' });
  };

  const navCategories = [
    { id: 'profile', label: 'Profile', icon: User, group: 'Account' },
    { id: 'appearance', label: 'Appearance', icon: Palette, group: 'Account' },
    { id: 'notifications', label: 'Notifications', icon: Bell, group: 'Account' },
    { id: 'security', label: 'Security', icon: Lock, group: 'Account' },
    { id: 'billing', label: 'Billing', icon: CreditCard, group: 'Account' },
    { id: 'ai', label: 'AI Workspace', icon: Bot, group: 'System' },
    { id: 'integrations', label: 'Integrations', icon: Link2, group: 'System' },
    { id: 'developer', label: 'Developer & API', icon: Code, group: 'System' },
    { id: 'support', label: 'Support', icon: HelpCircle, group: 'Resources' },
    { id: 'about', label: 'About Platform', icon: Info, group: 'Resources' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Bar */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Enterprise Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure your profile, AI parameters, integrations, and preferences</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (Two Columns) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar Navigation */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-3 space-y-4 overflow-y-auto shrink-0">
            <div className="space-y-1">
              {navCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeTab === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors',
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white dark:bg-slate-900">
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Personal Profile & Account</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your identity and organization details.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Organization / Company"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm" className="font-bold">
                      Save Profile Changes
                    </Button>
                  </div>
                </form>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
                  <h5 className="font-bold text-sm text-rose-600 dark:text-rose-400">Danger Zone</h5>
                  <p className="text-xs text-slate-500">Permanently remove your profile and workspace API keys.</p>
                  <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                    Delete Account & Data
                  </Button>
                </div>
              </div>
            )}

            {/* 2. APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Appearance & Theme Preferences</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Customize your platform visual experience and color modes.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Color Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    
                    <button
                      onClick={() => setThemeMode('light')}
                      className={cn(
                        'p-4 rounded-2xl border text-left space-y-3 transition-all',
                        themeMode === 'light'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Light Mode</div>
                        <div className="text-[10px] text-slate-500">Stripe/Apple style</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setThemeMode('dark')}
                      className={cn(
                        'p-4 rounded-2xl border text-left space-y-3 transition-all',
                        themeMode === 'dark'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-950 text-white border border-slate-800 flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Dark Mode</div>
                        <div className="text-[10px] text-slate-500">Linear/GitHub style</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setThemeMode('system')}
                      className={cn(
                        'p-4 rounded-2xl border text-left space-y-3 transition-all',
                        themeMode === 'system'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-slate-100 to-slate-950 border border-slate-400 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">System OS</div>
                        <div className="text-[10px] text-slate-500">Auto match OS</div>
                      </div>
                    </button>

                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold">Currently Active Resolution</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Theme Mode: <span className="text-indigo-500 font-bold uppercase">{themeMode}</span> | Active Class: <span className="text-emerald-500 font-bold uppercase">{resolvedTheme}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Notification Channels & Alerts</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure email digest and operational incident notifications.</p>
                </div>

                <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <div>
                      <div className="font-bold text-sm">ServiceNow Incident Alerts</div>
                      <div className="text-xs text-slate-500">Receive email alerts when OpsPilot triages high-severity P1 incidents.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailIncidents}
                      onChange={(e) => setEmailIncidents(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <div>
                      <div className="font-bold text-sm">Security & Audit Alerts</div>
                      <div className="text-xs text-slate-500">Notifications regarding new API keys, BYOK updates, or login attempts.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailSecurity}
                      onChange={(e) => setEmailSecurity(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <div>
                      <div className="font-bold text-sm">Weekly Usage Digest</div>
                      <div className="text-xs text-slate-500">Weekly report detailing token consumption and agent execution runs.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 4. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Security & Active Sessions</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Password updates and active device sessions.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <Badge variant="emerald" className="font-bold">BYOK Vault Active</Badge>
                    <div className="text-xs font-bold">Client-Side AES-256 Key Encryption</div>
                  </div>
                  <Lock className="w-5 h-5 text-indigo-500" />
                </div>

                <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <h5 className="font-bold text-sm">Active Browser Session</h5>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold">Chrome on Windows (Current Session)</div>
                      <div className="text-slate-400">IP: 192.168.1.104 | Last active: Just now</div>
                    </div>
                    <Badge variant="emerald">Active</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* 5. BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Billing & Subscription Tier</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage platform subscription, quotas, and payment details.</p>
                </div>

                <Card className="p-6 border-indigo-500/30 bg-indigo-50/10 dark:bg-indigo-950/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="indigo" className="font-bold uppercase">{saasAuth.subscriptionTier} Plan</Badge>
                    <span className="text-xs text-slate-500">Trial Quota: {saasAuth.trialRunsLeft}/3 Runs Left</span>
                  </div>
                  <h4 className="text-2xl font-extrabold">Enterprise Platform Tier</h4>
                  <p className="text-xs text-slate-500">Unlimited Studio prompt development, ServiceNow ITSM integration, and 8 collaborative agent roles.</p>
                  <Button variant="primary" size="sm" onClick={() => saasAuth.setShowSubscriptionModal(true)}>
                    Upgrade Subscription
                  </Button>
                </Card>
              </div>
            )}

            {/* 6. AI WORKSPACE TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">AI Engine Parameters</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Default model provider selections and token boundaries.</p>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Default LLM Foundation Model"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                    options={[
                      { value: 'gpt-4o', label: 'OpenAI GPT-4o (Default Recommended)' },
                      { value: 'claude-3-5-sonnet', label: 'Anthropic Claude 3.5 Sonnet' },
                      { value: 'gemini-1.5-pro', label: 'Google Gemini 1.5 Pro' },
                    ]}
                  />

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Token Output: {maxTokens}</label>
                    <input
                      type="range"
                      min="1024"
                      max="8192"
                      step="512"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Temperature / Randomness: {temperature}</label>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Enterprise Integrations</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ServiceNow ITSM Connector & Webhook Router Configuration.</p>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="emerald" className="font-bold">Active Implemented Connector</Badge>
                    <span className="text-xs text-emerald-500 font-mono font-bold">CONNECTED</span>
                  </div>
                  <h5 className="font-bold text-base">ServiceNow ITSM Integration</h5>
                  
                  <div className="space-y-3">
                    <Input
                      label="ServiceNow Instance URL"
                      value={serviceNowUrl}
                      onChange={(e) => setServiceNowUrl(e.target.value)}
                    />
                    <Input
                      label="Integration User Account"
                      value={snowUsername}
                      onChange={(e) => setSnowUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. DEVELOPER TAB */}
            {activeTab === 'developer' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Developer API Keys & Telemetry</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage API authorization keys for programmatic execution.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Live API Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={apiKey}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"
                    />
                    <Button variant="outline" size="sm" onClick={handleCopyKey} leftIcon={<Copy className="w-3.5 h-3.5" />}>
                      {copiedKey ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRegenerateKey} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">Support & Help Channels</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Access documentation, report issues, or contact technical support.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
                    <HelpCircle className="w-6 h-6 text-indigo-500" />
                    <h5 className="font-bold text-sm">Documentation Hub</h5>
                    <p className="text-xs text-slate-500">Explore technical guides for OpsPilot and Studio.</p>
                  </Card>

                  <Card className="p-5 space-y-2 border-slate-200 dark:border-slate-800">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    <h5 className="font-bold text-sm">Report Issue</h5>
                    <p className="text-xs text-slate-500">Submit a bug report directly to our engineering team.</p>
                  </Card>
                </div>
              </div>
            )}

            {/* 10. ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-2xl animate-fadeIn">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight">About PromptImageLab</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Platform architecture and version specification.</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs text-slate-500">Platform Version</span>
                    <Badge variant="indigo" className="font-bold font-mono">v4.2 Enterprise</Badge>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs text-slate-500">OpsPilot Operations Engine</span>
                    <Badge variant="violet" className="font-bold font-mono">v4.2 Active</Badge>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs text-slate-500">Studio Multi-Agent Graph</span>
                    <Badge variant="emerald" className="font-bold font-mono">v3.1 Active</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Security Architecture</span>
                    <Badge variant="slate" className="font-bold font-mono">Zero Data Retention (ZDR)</Badge>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
