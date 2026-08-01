"use client"

import React, { useEffect, useState } from "react";
import { Terminal, Server, Cpu, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function EdgeProxyPage() {
  const [latency, setLatency] = useState(4.2);
  const [throughput, setThroughput] = useState(1205);

  // Simulate fluctuating metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(3.8 + Math.random() * 1.5);
      setThroughput(1100 + Math.floor(Math.random() * 300));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 max-w-6xl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-white" />
            Edge Proxy Fleet
          </h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Rust-based eBPF interceptors deployed across global AWS Nitro Enclaves.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Avg Latency Overhead</span>
            <span className="text-xl font-bold text-green-500 font-mono">{latency.toFixed(2)}ms</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Global Throughput</span>
            <span className="text-xl font-bold text-white font-mono">{throughput.toLocaleString()} t/s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ProxyNode name="us-east-1-alpha" region="N. Virginia" status="HEALTHY" cpu={12} mem={45} intercept={420} />
        <ProxyNode name="eu-central-1-beta" region="Frankfurt" status="HEALTHY" cpu={28} mem={62} intercept={530} />
        <ProxyNode name="ap-northeast-1-gamma" region="Tokyo" status="DEGRADED" cpu={89} mem={92} intercept={255} />
      </div>

      <div className="mt-8 border border-white/10 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center py-16">
        <Server className="w-12 h-12 text-zinc-800 mb-4" />
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Deploy New Proxy Node</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">Provision a new zero-trust Rust proxy directly into your corporate VPC using our Kubernetes Operator.</p>
        <button className="bg-white text-black font-bold uppercase tracking-widest px-8 py-3 text-xs hover:bg-zinc-200 transition-colors">
          Generate Helm Chart
        </button>
      </div>

    </motion.div>
  );
}

function ProxyNode({ name, region, status, cpu, mem, intercept }: { name: string, region: string, status: string, cpu: number, mem: number, intercept: number }) {
  return (
    <div className="border border-white/10 bg-zinc-950 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-zinc-900 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${status === 'HEALTHY' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse'}`} />
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{name}</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">{region} • eBPF v1.4.2</p>
        </div>
      </div>

      <div className="flex items-center gap-8 text-xs font-mono w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <div className="flex flex-col gap-1 min-w-[80px]">
          <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-sans font-black">CPU Load</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-zinc-400" />
            <span className={cpu > 80 ? 'text-red-500' : 'text-zinc-300'}>{cpu}%</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 min-w-[80px]">
          <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-sans font-black">Memory</span>
          <div className="flex items-center gap-2">
            <Server className="w-3 h-3 text-zinc-400" />
            <span className={mem > 80 ? 'text-red-500' : 'text-zinc-300'}>{mem}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-zinc-600 uppercase tracking-widest text-[10px] font-sans font-black">Intercept Rate</span>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-white">{intercept} req/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
