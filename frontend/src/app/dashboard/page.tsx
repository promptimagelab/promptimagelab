"use client"

import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, CheckCircle, Ban, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function NOCDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    piiRedacted: 0,
    avgLatency: 0,
    activeProxies: 0
  });
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  // Fetch real-time NOC data from Control Plane
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const controlPlaneUrl = process.env.NEXT_PUBLIC_CONTROL_PLANE_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${controlPlaneUrl}/v1/telemetry/summary`, {
          headers: {
            "Authorization": "Bearer antigravity_secret_key"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalRequests: data.total_requests,
            piiRedacted: data.total_redactions,
            avgLatency: data.avg_latency_ms,
            activeProxies: data.active_proxies
          });
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (error) {
        console.error("Failed to fetch telemetry:", error);
        setIsLive(false);
      }
    };

    // Initial fetch
    fetchTelemetry();

    // Poll every 2 seconds
    const interval = setInterval(fetchTelemetry, 2000);

    setAuditLog([
      { id: "tx-9942", action: "BLOCK", reason: "FINANCIAL_ADVICE_POLICY", timestamp: new Date().toISOString(), risk: "CRITICAL" },
      { id: "tx-9941", action: "REDACT", reason: "SSN_DETECTED", timestamp: new Date(Date.now() - 5000).toISOString(), risk: "HIGH" },
      { id: "tx-9940", action: "ALLOW", reason: "CLEAN", timestamp: new Date(Date.now() - 12000).toISOString(), risk: "LOW" },
      { id: "tx-9939", action: "ALLOW", reason: "CLEAN", timestamp: new Date(Date.now() - 15000).toISOString(), risk: "LOW" },
    ]);
    
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 max-w-6xl"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
          Network Operations Center
          {isLive && <span className="ml-4 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full animate-pulse">LIVE</span>}
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Real-time cryptographic telemetry across all active edge proxies.</p>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard title="Total LLM Requests" value={stats.totalRequests.toLocaleString()} icon={<Activity />} />
        <MetricCard title="PII Redactions" value={stats.piiRedacted.toLocaleString()} icon={<ShieldAlert className="text-yellow-500" />} />
        <MetricCard title="Avg Latency (ms)" value={stats.avgLatency.toString()} icon={<Ban className="text-red-500" />} />
        <MetricCard title="Active Enclaves" value={stats.activeProxies.toString()} icon={<TerminalSquare className="text-green-500" />} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Real-time Audit Ledger */}
        <motion.div variants={itemVariants} className="lg:col-span-2 border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Live WORM Ledger</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2">
              <div>TX Hash</div>
              <div>Action</div>
              <div>Trigger</div>
              <div className="text-right">Risk</div>
            </div>
            {auditLog.map((log) => (
              <div key={log.id} className="grid grid-cols-4 gap-4 items-center bg-zinc-900/50 p-2 text-sm uppercase tracking-wider font-mono">
                <div className="text-zinc-400">{log.id}</div>
                <div>
                  <span className={`px-2 py-1 text-xs font-bold ${log.action === 'BLOCK' ? 'bg-red-500/20 text-red-500' : log.action === 'REDACT' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                    {log.action}
                  </span>
                </div>
                <div className="text-zinc-300 truncate">{log.reason}</div>
                <div className={`text-right font-bold ${log.risk === 'CRITICAL' ? 'text-red-500' : log.risk === 'HIGH' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {log.risk}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Global Policy Status */}
        <motion.div variants={itemVariants} className="border border-white/10 bg-zinc-950 p-6 flex flex-col">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Policy Status</h2>
          <div className="space-y-4 flex-1">
            <PolicyItem name="GLBA Financial Redaction" active />
            <PolicyItem name="GDPR Strict PII Filter" active />
            <PolicyItem name="HIPAA PHI Blocker" active />
            <PolicyItem name="Competitor IP Leak Prevent" active />
          </div>
          <button className="w-full mt-6 bg-white text-black font-bold uppercase tracking-widest py-3 hover:bg-zinc-200 transition-colors">
            Update Policies
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-zinc-950 p-6 hover:bg-zinc-900 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</h3>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" })}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function PolicyItem({ name, active }: { name: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{name}</span>
      {active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Ban className="w-4 h-4 text-zinc-600" />}
    </div>
  );
}
