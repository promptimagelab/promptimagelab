"use client"

import React, { useState } from "react";
import { Shield, Plus, AlertTriangle, Code2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AstPoliciesPage() {
  const [policies, setPolicies] = useState([
    { id: 1, name: "GLBA Financial Redaction", active: true, risk: "CRITICAL", type: "REDACT" },
    { id: 2, name: "GDPR Strict PII Filter", active: true, risk: "CRITICAL", type: "REDACT" },
    { id: 3, name: "Prompt Injection Defense", active: true, risk: "HIGH", type: "BLOCK" },
    { id: 4, name: "Competitor IP Leak Prevent", active: false, risk: "MEDIUM", type: "BLOCK" },
  ]);

  const [simText, setSimText] = useState("");
  const [simResult, setSimResult] = useState<any>(null);

  const togglePolicy = (id: number) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const runSimulation = () => {
    if (!simText) return;
    
    // Naive simulation logic
    if (simText.toLowerCase().includes("ignore") || simText.toLowerCase().includes("system prompt")) {
      setSimResult({ action: "BLOCK", reason: "PROMPT_INJECTION", output: "Request blocked by AST Policy." });
    } else if (simText.toLowerCase().includes("ssn") || simText.match(/\d{3}-\d{2}-\d{4}/)) {
      setSimResult({ action: "REDACT", reason: "GDPR_PII", output: simText.replace(/ssn/gi, "[REDACTED]").replace(/\d{3}-\d{2}-\d{4}/g, "[REDACTED]") });
    } else {
      setSimResult({ action: "ALLOW", reason: "CLEAN", output: simText });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 max-w-6xl"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Shield className="w-6 h-6 text-white" />
            AST Policy Enforcer
          </h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Deterministic Abstract Syntax Tree rules for semantic governance.</p>
        </div>
        <button className="bg-white text-black font-bold uppercase tracking-widest px-6 py-2 text-xs flex items-center gap-2 hover:bg-zinc-200 transition-colors">
          <Plus className="w-4 h-4" />
          Deploy New Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Policy List */}
        <div className="border border-white/10 bg-zinc-950 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4">Active Governance Rules</h2>
          <div className="flex flex-col gap-3 mt-2">
            {policies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border border-white/5 bg-black hover:border-white/20 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-white">{policy.name}</span>
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                    <span className={policy.risk === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}>{policy.risk}</span>
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-400">{policy.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => togglePolicy(policy.id)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${policy.active ? 'bg-green-500' : 'bg-zinc-800'}`}
                >
                  <motion.div 
                    className="w-4 h-4 bg-white rounded-full"
                    layout
                    initial={false}
                    animate={{ x: policy.active ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Simulator */}
        <div className="border border-white/10 bg-zinc-950 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-white" />
            Policy Sandbox Simulator
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Test prompts against active edge policies in real-time.</p>
          
          <textarea 
            className="w-full h-32 bg-black border border-white/20 text-white p-4 font-mono text-sm focus:outline-none focus:border-white transition-colors resize-none"
            placeholder="Type a test prompt here..."
            value={simText}
            onChange={(e) => setSimText(e.target.value)}
          />
          
          <button 
            onClick={runSimulation}
            className="bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest py-3 text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
          >
            <Play className="w-4 h-4" /> Run Interception
          </button>

          <AnimatePresence>
            {simResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 border ${simResult.action === 'ALLOW' ? 'border-green-500/30 bg-green-500/10' : simResult.action === 'BLOCK' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${simResult.action === 'ALLOW' ? 'text-green-500' : simResult.action === 'BLOCK' ? 'text-red-500' : 'text-yellow-500'}`}>
                    VERDICT: {simResult.action}
                  </span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">({simResult.reason})</span>
                </div>
                <p className="text-sm font-mono text-zinc-300">{simResult.output}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
