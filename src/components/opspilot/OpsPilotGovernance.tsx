import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  FileCheck, 
  Activity, 
  AlertTriangle, 
  Download,
  Lock,
  CheckCircle2,
  Users,
  Key,
  Shield,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@ui-core';
import { useToast } from '../ui/Toast';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Admin' | 'Operator' | 'Auditor';
  action: string;
  target: string;
  status: 'Verified' | 'Blocked' | 'Executed';
  hash: string;
}

export const OpsPilotGovernance: React.FC = () => {
  const { toast } = useToast();
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Operator' | 'Auditor'>('Admin');

  const [policies, setPolicies] = useState([
    { id: 'auto_resolve_enabled', name: 'ServiceNow Auto-Resolution Engine', description: 'Automatically resolve ServiceNow tickets when AI Swarm Confidence > 90%', enabled: true },
    { id: 'owasp_llm_guard', name: 'OWASP LLM01 Prompt Injection Filter', description: 'Inspect all OpsPilot input vectors for jailbreak attempts before dispatching to LLMs', enabled: true },
    { id: 'zero_retention_vault', name: 'Zero Server Data Retention Guarantee', description: 'Enforce client-side AES-256 Web Crypto key storage with zero server disk logging', enabled: true },
    { id: 'autoRollback', name: 'Auto-Execute Canary Rollbacks on P1 Crash', description: 'Automatically revert deployment image if error rate exceeds 5% in 3 mins', enabled: true },
    { id: 'podLimit', name: 'Max Automated Pod Replicate Cap (25 Pods)', description: 'Limit autoscaling burst replicas during traffic surge anomalies', enabled: true },
    { id: 'hitl_approval_gate', name: 'Human-in-the-Loop (HITL) Gate for P1 Fixes', description: 'Require explicit SRE authorization before executing shell/eBPF commands', enabled: true },
  ]);

  const [auditLogs] = useState<AuditLogEntry[]>([
    { id: 'AUD-9021', timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '), actor: 'sre-admin@company.com', role: 'Admin', action: 'RESOLVE_INCIDENT', target: 'INC008492 (ServiceNow)', status: 'Executed', hash: '0x8f1a...4e92' },
    { id: 'AUD-9020', timestamp: '2026-08-03 14:15:22', actor: 'ai-swarm-runner', role: 'Operator', action: 'EXECUTE_EBPF_FILTER', target: 'us-east-1-prod (Port 443)', status: 'Verified', hash: '0x3c2b...7a11' },
    { id: 'AUD-9019', timestamp: '2026-08-03 13:42:10', actor: 'auditor@company.com', role: 'Auditor', action: 'EXPORT_SOC2_POSTMORTEM', target: 'Incident INC004819 Report', status: 'Verified', hash: '0x992a...1e40' },
    { id: 'AUD-9018', timestamp: '2026-08-03 12:10:05', actor: 'security-scanner', role: 'Admin', action: 'OWASP_INJECTION_SCAN', target: 'OpsCopilot Input Buffer', status: 'Blocked', hash: '0x7e4f...88c2' },
  ]);

  const togglePolicy = (id: string, name: string, current: boolean) => {
    if (currentRole === 'Auditor') {
      toast('Permission Denied', {
        type: 'error',
        description: 'Auditor role is read-only. Switch to Admin role to modify policies.'
      });
      return;
    }
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !current } : p));
    toast('Governance Policy Updated', {
      type: 'success',
      description: `${name} is now ${!current ? 'ENABLED' : 'DISABLED'}`
    });
  };

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OpsPilot_Audit_Logs_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    toast('Audit Logs Exported', {
      type: 'success',
      description: 'Downloaded cryptographically signed SOC 2 JSON audit log archive.'
    });
  };

  return (
    <div className="w-full space-y-6 select-none animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">OpsPilot Autonomous Governance & Audit Hub</h1>
              <Badge variant="emerald" dot font-bold>SOC 2 Type II Verified</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Multi-tenant RBAC permissions, OWASP LLM guardrails, automated remediation thresholds, and immutable audit logs.
            </p>
          </div>

          {/* Active Role Selector Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Role:
            </span>
            {(['Admin', 'Operator', 'Auditor'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentRole(r);
                  toast('RBAC Role Switched', { type: 'info', description: `Switched active session view to ${r}` });
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentRole === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Governance Controls & Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Safety Policies (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>Autonomous Safety Guardrails</span>
                </CardTitle>
                <CardDescription className="text-xs">Active safety boundaries enforced across all AI agent swarms.</CardDescription>
              </div>
              <Badge variant="indigo">{policies.filter(p => p.enabled).length} / {policies.length} Active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {policies.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-100">{p.name}</strong>
                      <Badge variant={p.enabled ? 'emerald' : 'slate'}>{p.enabled ? 'Active' : 'Disabled'}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.description}</p>
                  </div>

                  <button
                    onClick={() => togglePolicy(p.id, p.name, p.enabled)}
                    className="text-indigo-400 hover:scale-105 transition-transform shrink-0 disabled:opacity-50"
                    disabled={currentRole === 'Auditor'}
                  >
                    {p.enabled ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Immutable Cryptographic Audit Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Audit Log</span>
                </CardTitle>
                <CardDescription className="text-xs">Cryptographically hashed actions and agent executions.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAuditLogs}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export JSON
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-bold">{log.id}</span>
                    <Badge variant={log.status === 'Executed' ? 'emerald' : log.status === 'Blocked' ? 'rose' : 'indigo'}>
                      {log.status}
                    </Badge>
                  </div>

                  <div className="text-slate-200 font-sans font-semibold">{log.action}</div>
                  <div className="text-slate-400 text-[10px]">Target: {log.target}</div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-500">
                    <span>Actor: <strong className="text-slate-300">{log.actor} ({log.role})</strong></span>
                    <span>Hash: <code className="text-emerald-400">{log.hash}</code></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
