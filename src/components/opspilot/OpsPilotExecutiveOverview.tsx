import React from 'react';
import { 
  Activity, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  Server, 
  DollarSign, 
  Clock, 
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@ui-core';

interface OpsPilotExecutiveOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

export const OpsPilotExecutiveOverview: React.FC<OpsPilotExecutiveOverviewProps> = ({ onNavigateToTab }) => {
  return (
    <div className="w-full space-y-6 select-none animate-fadeIn">
      
      {/* Executive Hero Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Badge variant="indigo" font-bold>Executive Ops Briefing</Badge>
              <Badge variant="emerald" dot font-bold>Global Health: 99.99%</Badge>
              <Badge variant="sky">Q3 Enterprise Telemetry</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise Operations & Autonomous AI Overview
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Global operational SLA posture, automated MTTR reduction analytics, AI swarm token spend, and real-time incident threat intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigateToTab('opspilot/analytics')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Export SLA Report
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onNavigateToTab('opspilot/incidents')}
              leftIcon={<Activity className="w-3.5 h-3.5" />}
            >
              View Active Incidents
            </Button>
          </div>
        </div>

        {/* Top Tier KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Mean Time To Resolve (MTTR)</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-white font-mono">2.4 mins</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingDown className="w-3.5 h-3.5" /> -68%
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Benchmark vs 42.5m human SRE average</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Autonomous Swarm Rate</span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-indigo-400 font-mono">94.8%</span>
              <Badge variant="indigo">Autonomous</Badge>
            </div>
            <p className="text-[11px] text-slate-500">142 of 150 incidents self-healed</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>OWASP Safety Audit Pass Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">100.0%</span>
              <Badge variant="emerald">Zero Leaks</Badge>
            </div>
            <p className="text-[11px] text-slate-500">Passed 14,920 security scans</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Monthly AI Swarm Budget</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-amber-300 font-mono">$1,240.80</span>
              <span className="text-xs font-semibold text-slate-400">/ $5,000 Cap</span>
            </div>
            <p className="text-[11px] text-slate-500">24.8% of allocated LLM budget spent</p>
          </div>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Regional Infrastructure Status (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Global Multi-Region Cluster Status</span>
                </CardTitle>
                <CardDescription className="text-xs">Real-time health of Kubernetes clusters and ServiceNow ITSM proxy gateways.</CardDescription>
              </div>
              <Badge variant="emerald" dot font-bold>5 Clusters Active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { region: 'us-east-1 (N. Virginia)', service: 'EKS Primary Workday & Payment Cluster', latency: '12ms', status: 'Healthy', nodeCount: 64 },
                { region: 'us-west-2 (Oregon)', service: 'EKS Secondary Read Replica & Proxy', latency: '18ms', status: 'Healthy', nodeCount: 32 },
                { region: 'eu-west-1 (Frankfurt)', service: 'ServiceNow REST Gateway & Audit Vault', latency: '42ms', status: 'Healthy', nodeCount: 16 },
                { region: 'ap-southeast-1 (Singapore)', service: 'Regional Edge Telemetry Ingestion Node', latency: '65ms', status: 'Healthy', nodeCount: 12 },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-bold">{item.region}</strong>
                      <Badge variant="indigo" className="font-mono text-[10px]">{item.nodeCount} Nodes</Badge>
                    </div>
                    <p className="text-slate-400 text-[11px]">{item.service}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-400 text-[11px]">Latency: <strong className="text-slate-200">{item.latency}</strong></span>
                    <Badge variant="emerald" dot font-bold>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Swarm Operational Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span>Swarm Agent Reasoning Feed</span>
                </CardTitle>
                <CardDescription className="text-xs">Live execution log from active AI agents.</CardDescription>
              </div>
              <Badge variant="violet" className="font-mono text-[10px]">Parallel Swarm</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              {[
                { time: '14:22:10', agent: 'Log Parser', msg: 'Analyzed 18,000 log lines from ServiceNow ticket INC008492.' },
                { time: '14:22:15', agent: 'NetSec Agent', msg: 'Verified zero prompt injection risk via OWASP LLM01 scanner.' },
                { time: '14:22:19', agent: 'K8s SRE Agent', msg: 'Generated eBPF rate-limiting rule. Awaiting HITL authorization.' },
                { time: '14:22:24', agent: 'ServiceNow Bot', msg: 'Pushed automated resolution work note to sys_id 8b91a24.' }
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-indigo-400 font-bold">[{log.agent}]</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{log.msg}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
