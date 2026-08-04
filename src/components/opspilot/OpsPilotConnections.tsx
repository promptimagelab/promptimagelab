import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Plus, 
  Key, 
  Globe, 
  ShieldCheck, 
  Trash2, 
  RefreshCw,
  Sliders,
  Cloud,
  Zap,
  Lock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Input } from '@ui-core';
import { useToast } from '../ui/Toast';

interface InfraConnection {
  id: string;
  name: string;
  category: 'ServiceNow' | 'Kubernetes' | 'APM Metrics' | 'Alerting' | 'Cloud Infra' | 'Database';
  endpoint: string;
  status: 'Connected' | 'Error' | 'Pending';
  lastPing: string;
}

export const OpsPilotConnections: React.FC = () => {
  const { toast } = useToast();
  
  // ServiceNow Configuration Credentials (matching Startup/pro1.py)
  const [snowUrl, setSnowUrl] = useState(() => localStorage.getItem('opspilot_snow_url') || 'https://dev306702.service-now.com');
  const [snowUser, setSnowUser] = useState(() => localStorage.getItem('opspilot_snow_user') || 'admin');
  const [snowPwd, setSnowPwd] = useState(() => localStorage.getItem('opspilot_snow_pwd') || 'v9/Vq@TnJ4qI');
  
  const [isTestingSnow, setIsTestingSnow] = useState(false);
  const [isSyncingSnow, setIsSyncingSnow] = useState(false);
  const [snowTestStatus, setSnowTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newConnName, setNewConnName] = useState('');
  const [newConnEndpoint, setNewConnEndpoint] = useState('');
  const [newConnCategory, setNewConnCategory] = useState<'ServiceNow' | 'Kubernetes' | 'APM Metrics' | 'Alerting' | 'Cloud Infra' | 'Database'>('ServiceNow');

  const [connections, setConnections] = useState<InfraConnection[]>([
    { id: 'conn-snow', name: 'ServiceNow Production Instance', category: 'ServiceNow', endpoint: snowUrl, status: 'Connected', lastPing: 'Just now' }
  ]);

  // Test ServiceNow Connection via Server Proxy Endpoint (/api/opspilot/snow/test)
  const handleTestServiceNow = async () => {
    setIsTestingSnow(true);
    setSnowTestStatus(null);

    // Save to local storage
    localStorage.setItem('opspilot_snow_url', snowUrl);
    localStorage.setItem('opspilot_snow_user', snowUser);
    localStorage.setItem('opspilot_snow_pwd', snowPwd);

    try {
      const resp = await fetch('/api/opspilot/snow/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceUrl: snowUrl, username: snowUser, password: snowPwd })
      });

      const data = await resp.json() as any;

      if (resp.ok && data.status === 'ok') {
        setSnowTestStatus({ success: true, message: `Connected! ${data.message}` });
        toast('ServiceNow Connected!', {
          type: 'success',
          description: `Successfully authenticated with ${snowUrl}`
        });
      } else {
        setSnowTestStatus({ success: false, message: data.error || 'Connection failed' });
        toast('ServiceNow Connection Error', {
          type: 'error',
          description: data.error || 'Failed to authenticate with ServiceNow instance.'
        });
      }
    } catch (err: any) {
      setSnowTestStatus({ success: false, message: 'Server proxy endpoint error' });
      toast('ServiceNow Proxy Error', { type: 'error', description: err.message });
    } finally {
      setIsTestingSnow(false);
    }
  };

  // Sync Live ServiceNow Incidents (/api/opspilot/snow/incidents)
  const handleSyncServiceNowIncidents = async () => {
    setIsSyncingSnow(true);
    try {
      const resp = await fetch('/api/opspilot/snow/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceUrl: snowUrl, username: snowUser, password: snowPwd, limit: 10 })
      });

      const data = await resp.json() as any;

      if (resp.ok && data.status === 'ok') {
        toast('ServiceNow Incidents Synced!', {
          type: 'success',
          description: `Fetched ${data.incidents?.length || 0} live tickets from ${snowUrl}`
        });
      } else {
        toast('Sync Warning', { type: 'error', description: data.error || 'Could not fetch tickets.' });
      }
    } catch (err: any) {
      toast('Sync Error', { type: 'error', description: err.message });
    } finally {
      setIsSyncingSnow(false);
    }
  };

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnName || !newConnEndpoint) return;

    const newConn: InfraConnection = {
      id: `conn-${Date.now()}`,
      name: newConnName,
      category: newConnCategory,
      endpoint: newConnEndpoint,
      status: 'Connected',
      lastPing: 'Just now'
    };

    setConnections(prev => [...prev, newConn]);
    setShowAddModal(false);
    setNewConnName('');
    setNewConnEndpoint('');

    toast('Infrastructure Integration Saved!', {
      type: 'success',
      description: `${newConnName} connected to OpsPilot pipeline.`
    });
  };

  const handleDeleteConnection = (id: string, name: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
    toast('Integration Disconnected', { type: 'info', description: `Removed ${name}` });
  };

  return (
    <div className="w-full space-y-8 select-none">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">OpsPilot Infrastructure & ServiceNow Vault</h1>
              <Badge variant="indigo" className="font-mono">{connections.length} Active Connections</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Configure ServiceNow Instance credentials, Kubernetes clusters, Datadog APM, PagerDuty, and AWS CloudWatch integrations.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Infra Integration
          </Button>
        </div>
      </div>

      {/* SERVICENOW ENTERPRISE CONFIGURATION CARD (Reference: Startup/pro1.py) */}
      <Card variant="glass" className="border-indigo-500/40 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">ServiceNow Enterprise Instance Configuration</h3>
                <Badge variant="emerald" dot className="font-bold">pro1.py REST Engine</Badge>
              </div>
              <p className="text-xs text-slate-400">Configure your ServiceNow instance URL and basic HTTP authentication credentials.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestServiceNow}
              isLoading={isTestingSnow}
              leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            >
              Test ServiceNow Credentials
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSyncServiceNowIncidents}
              isLoading={isSyncingSnow}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync ServiceNow Incidents
            </Button>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="ServiceNow Instance URL"
            placeholder="https://dev306702.service-now.com"
            value={snowUrl}
            onChange={(e) => setSnowUrl(e.target.value)}
          />
          <Input
            label="ServiceNow Username"
            placeholder="admin"
            value={snowUser}
            onChange={(e) => setSnowUser(e.target.value)}
          />
          <Input
            label="ServiceNow Password"
            type="password"
            placeholder="••••••••••••"
            value={snowPwd}
            onChange={(e) => setSnowPwd(e.target.value)}
          />
        </div>

        {/* Test Result Message */}
        {snowTestStatus && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            snowTestStatus.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            {snowTestStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{snowTestStatus.message}</span>
          </div>
        )}
      </Card>

      {/* Connection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((conn) => (
          <Card key={conn.id} variant="glass" hoverEffect>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{conn.category}</Badge>
                <Badge variant="emerald" dot className="font-bold">{conn.status}</Badge>
              </div>
              <CardTitle className="text-sm mt-2">{conn.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                {conn.endpoint}
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Health Ping</span>
                <span className="font-mono text-emerald-400">{conn.lastPing}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => handleDeleteConnection(conn.id, conn.name)}
                className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 border-indigo-500/30">
            <CardHeader className="p-0">
              <CardTitle className="text-base">Connect Infrastructure Target</CardTitle>
              <CardDescription className="text-xs">Configure ServiceNow instance, Kubernetes cluster, PagerDuty webhook, or Prometheus endpoint.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleAddConnection} className="space-y-4 pt-2">
              <Input
                label="Integration Name"
                placeholder="e.g. Production K8s Cluster EU"
                value={newConnName}
                onChange={(e) => setNewConnName(e.target.value)}
                required
              />

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-300">Category</label>
                <select
                  value={newConnCategory}
                  onChange={(e: any) => setNewConnCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="ServiceNow">ServiceNow Instance</option>
                  <option value="Kubernetes">Kubernetes Cluster</option>
                  <option value="APM Metrics">APM Metrics (Datadog/Prometheus)</option>
                  <option value="Alerting">Alerting (PagerDuty/Slack)</option>
                  <option value="Cloud Infra">Cloud Infra (AWS/GCP)</option>
                  <option value="Database">Database (PostgreSQL)</option>
                </select>
              </div>

              <Input
                label="Endpoint / Connection URI"
                placeholder="https://... or arn:aws:iam::..."
                value={newConnEndpoint}
                onChange={(e) => setNewConnEndpoint(e.target.value)}
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Integration
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
