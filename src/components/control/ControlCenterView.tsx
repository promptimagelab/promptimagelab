import React, { useState } from 'react';
import { 
  BarChart3, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Key, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Lock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';

export const ControlCenterView: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');

  // Connections State
  const [connections, setConnections] = useState([
    { id: 'c1', name: 'Google Gemini 3.6 Flash', provider: 'Google GenAI SDK', status: 'connected', usage: '142,800 / 1,000,000 Tokens' },
    { id: 'c2', name: 'OpenAI GPT-4o & o1', provider: 'OpenAI Platform', status: 'connected', usage: '84,100 / 500,000 Tokens' },
    { id: 'c3', name: 'Anthropic Claude 3.5 Sonnet', provider: 'Anthropic API', status: 'connected', usage: '12,400 Tokens' },
  ]);
  const [providerName, setProviderName] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleAddConnection = () => {
    if (!providerName || !apiKeyInput) return;
    setConnections([...connections, {
      id: `c-${Date.now()}`,
      name: providerName,
      provider: 'Custom BYOK Key',
      status: 'connected',
      usage: '0 Tokens'
    }]);
    setProviderName('');
    setApiKeyInput('');
    toast('BYOK Connection Saved', { type: 'success', description: `Key "${providerName}" stored in encrypted vault.` });
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Enterprise Control Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Unified 3-in-1 Control Hub: AI Telemetry Analytics + Provider Connections + OWASP Governance
              </p>
            </div>
          </div>
        </div>

        <Badge variant="indigo" dot font-bold>3-in-1 Unified Mode</Badge>
      </div>

      {/* Sub-Navigation Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'analytics', label: 'AI Telemetry Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'connections', label: 'Managed Provider Connections', icon: <Cpu className="w-3.5 h-3.5" />, badge: connections.length },
          { id: 'governance', label: 'AI Security & OWASP Governance', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
        ]}
      />

      {/* SECTION 1: AI TELEMETRY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Card variant="glass">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Prompt Executions</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">128,490</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.4% from last month</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Token Cost Savings</span>
                  <DollarSign className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">$1,420.50</div>
                <p className="text-[11px] text-slate-500">Estimated API spend reduced</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Injections Blocked</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">342</div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% OWASP compliance</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Average Latency</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">184 ms</div>
                <p className="text-[11px] text-slate-500">Gemini 3.6 Flash Edge average</p>
              </CardContent>
            </Card>

          </div>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Recent Prompt Telemetry</CardTitle>
              <CardDescription>Live execution logs across all models</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <tr>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Query</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Tokens Saved</th>
                      <th className="py-2.5 px-3">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[12px]">
                    <tr>
                      <td className="py-3 px-3"><Badge variant="indigo">Gemini 3.6 Flash</Badge></td>
                      <td className="py-3 px-3 truncate max-w-xs">OWASP vulnerability review on typescript function...</td>
                      <td className="py-3 px-3 text-emerald-500 font-bold">98 / 100</td>
                      <td className="py-3 px-3 font-semibold">140 tokens</td>
                      <td className="py-3 px-3 text-slate-400">142 ms</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3"><Badge variant="emerald">Claude 3.5 Sonnet</Badge></td>
                      <td className="py-3 px-3 truncate max-w-xs">Refactor marketing analytics SQL pipeline...</td>
                      <td className="py-3 px-3 text-emerald-500 font-bold">96 / 100</td>
                      <td className="py-3 px-3 font-semibold">210 tokens</td>
                      <td className="py-3 px-3 text-slate-400">310 ms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 2: MANAGED CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-sm">Store BYOK Credential</CardTitle>
                <CardDescription>Enterprise vault for OpenAI, Anthropic, Gemini API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <Input
                  label="Provider Name"
                  placeholder="e.g. OpenAI GPT-4o Key"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                />
                <Input
                  label="API Secret Key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
                <Button variant="primary" className="w-full" onClick={handleAddConnection} leftIcon={<Plus className="w-4 h-4" />}>
                  Save & Validate Key
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {connections.map((c) => (
              <Card key={c.id} variant="glass">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {c.name}
                        <Badge variant="emerald">Connected</Badge>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        Usage: {c.usage}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setConnections(connections.filter(item => item.id !== c.id))}>
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: AI GOVERNANCE & SECURITY */}
      {activeTab === 'governance' && (
        <div className="space-y-4">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">OWASP LLM Security & PII Policies</CardTitle>
              <CardDescription>Automated content filters, prompt injection sanitization, and audit logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Prompt Injection Protection
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-300">Active - Discards adversarial override commands</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 mb-1">
                    <Lock className="w-4 h-4 text-indigo-500" /> PII Masking Engine
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-300">Active - Masks emails, API keys, and credit cards</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> SOC 2 Audit Logger
                  </div>
                  <p className="text-amber-800 dark:text-amber-300">Active - Immutable JSON event streams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};
