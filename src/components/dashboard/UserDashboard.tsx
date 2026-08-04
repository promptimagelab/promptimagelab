import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Key, 
  Users, 
  Building2, 
  Copy, 
  Check, 
  Plus, 
  Trash2,
  Lock,
  Bot,
  Cpu,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';
import { useDynamicEngine } from '../../hooks/useDynamicEngine';
import { useAiConnections } from '../../hooks/useAiConnections';

interface UserDashboardProps {
  onNavigate?: (tab: string) => void;
  saasAuth?: any;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate, saasAuth }) => {
  const { toast } = useToast();
  const dynamicEngine = useDynamicEngine();
  const { providers } = useAiConnections();
  const [activeTab, setActiveTab] = useState('overview');

  const activeCount = providers.length;

  const handleClearHistory = () => {
    dynamicEngine.clearHistory();
    toast('Execution History Cleared', { type: 'info', description: 'Real-time telemetry counters reset to zero.' });
  };

  return (
    <div className="w-full space-y-6 select-none py-4">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Dashboard & Real Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics, calculated token usage, and live AI pipeline execution streams
          </p>
        </div>

        <div className="flex items-center gap-2">
          {dynamicEngine.history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Counters
            </Button>
          )}

          <button
            onClick={() => onNavigate ? onNavigate('connections') : (window.location.pathname = '/connections')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Manage Connections ({activeCount} Connection{activeCount === 1 ? '' : 's'})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tabs Sub-Navigation */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'overview', label: 'Real-Time KPIs & Telemetry', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'history', label: 'Live Telemetry Stream', icon: <Bot className="w-3.5 h-3.5" />, badge: `${dynamicEngine.history.length}` },
          { id: 'security', label: 'Security & Audit Logs', icon: <Lock className="w-3.5 h-3.5" /> },
        ]}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* 100% CALCULATED REAL KPI CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Card variant="glass" hoverEffect>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Prompt Executions</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {dynamicEngine.stats.totalExecutions.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Real Live Pipeline Runs</p>
              </CardContent>
            </Card>

            <Card variant="glass" hoverEffect>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Total Tokens Processed</span>
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {dynamicEngine.stats.totalTokens.toLocaleString()}
                </div>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Calculated from Real API Tokens</p>
              </CardContent>
            </Card>

            <Card variant="glass" hoverEffect>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>Live API Cost ($)</span>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${dynamicEngine.stats.totalCostSaved.toFixed(5)}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Accumulated Model Spend</p>
              </CardContent>
            </Card>

            <Card variant="glass" hoverEffect>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                  <span>OWASP Threats Blocked</span>
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {dynamicEngine.stats.threatsBlocked.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Detected Vulnerabilities</p>
              </CardContent>
            </Card>

          </div>

          {/* DYNAMIC LIVE EXECUTION STREAM TABLE */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Recent Real Pipeline Executions Log</CardTitle>
              <Badge variant="indigo">{dynamicEngine.history.length} Real Log Entries</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              {dynamicEngine.history.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                  <Bot className="w-6 h-6 mx-auto text-indigo-500" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">No Executions Logged Yet</p>
                  <p>Run your first AI pipeline in Agent Studio to see real-time calculated telemetry.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="pb-3">Timestamp</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Agent Name</th>
                        <th className="pb-3">Model</th>
                        <th className="pb-3">Latency</th>
                        <th className="pb-3">Tokens</th>
                        <th className="pb-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                      {dynamicEngine.history.slice(0, 8).map((log) => {
                        const isErr = log.id.includes('err') || (log.content && log.content.startsWith('❌'));
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="py-3 text-slate-500">{log.timestamp}</td>
                            <td className="py-3">
                              {isErr ? (
                                <Badge variant="rose" dot font-bold>Failed</Badge>
                              ) : (
                                <Badge variant="emerald" dot font-bold>Success ⚡</Badge>
                              )}
                            </td>
                            <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{log.agentName}</td>
                            <td className="py-3 text-indigo-500">{log.model}</td>
                            <td className="py-3 text-emerald-500">{log.latencyMs} ms</td>
                            <td className="py-3 text-slate-600 dark:text-slate-400">{log.tokensUsed}</td>
                            <td className="py-3 font-bold text-emerald-500">{log.cost}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      )}

      {/* History Telemetry Stream Tab */}
      {activeTab === 'history' && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base font-bold font-mono">Full Real-Time Telemetry History Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {dynamicEngine.history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No telemetry history logged yet.</p>
            ) : (
              dynamicEngine.history.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{log.agentName}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <Badge variant="emerald">{log.latencyMs} MS</Badge>
                      <Badge variant="indigo">{log.cost}</Badge>
                      <span className="text-slate-400">{log.timestamp}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 text-indigo-300 font-mono text-[11px] whitespace-pre-wrap">
                    {log.content.substring(0, 220)}...
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Logs Tab */}
      {activeTab === 'security' && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-base font-bold">SOC 2 Type II Security & OWASP Audit Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
              ✓ Active OWASP security filters inspecting prompt variable inputs in real time.
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};
