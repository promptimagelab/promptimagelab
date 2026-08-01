"use client"

import React from "react";
import { Settings, Key, Globe, ShieldCheck, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function SystemSettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
          <Settings className="w-6 h-6 text-white" />
          Enterprise Settings
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Global configurations for the Veritas Protocol control plane.</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Authentication & SSO */}
        <section className="border border-white/10 bg-zinc-950 p-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Authentication & SSO</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">SAML 2.0 Identity Provider</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Configure Okta, Azure AD, or PingIdentity.</p>
              </div>
              <button className="bg-white/10 text-white font-bold uppercase tracking-widest px-4 py-2 text-xs hover:bg-white/20 transition-colors">
                Configure
              </button>
            </div>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Enforce Multi-Factor Authentication</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Require MFA for all Control Plane access.</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-green-500 flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
              </div>
            </div>
          </div>
        </section>

        {/* API & Proxy Credentials */}
        <section className="border border-white/10 bg-zinc-950 p-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <Key className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold uppercase tracking-widest">API & Edge Proxy Credentials</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">These credentials are required to authenticate your Edge Proxies with the Veritas Control Plane.</p>
            
            <div className="flex items-center gap-4 bg-black border border-white/10 p-3">
              <code className="text-xs font-mono text-zinc-300 flex-1">vp_prod_8f92a4b...</code>
              <button className="text-xs font-bold text-white uppercase tracking-widest hover:text-zinc-400 transition-colors">Rotate</button>
            </div>
            
            <button className="bg-white text-black font-bold uppercase tracking-widest px-6 py-3 text-xs w-fit hover:bg-zinc-200 transition-colors">
              Generate New Token
            </button>
          </div>
        </section>

        {/* Data Residency */}
        <section className="border border-white/10 bg-zinc-950 p-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <Globe className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Data Residency & Logging</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">WORM Ledger Storage Region</label>
              <select className="w-full bg-black border border-white/20 text-white p-3 font-mono text-xs uppercase focus:outline-none focus:border-white transition-colors">
                <option>EU-CENTRAL-1 (Frankfurt) - STRICT GDPR</option>
                <option>US-EAST-1 (N. Virginia)</option>
                <option>AP-NORTHEAST-1 (Tokyo)</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-2 hover:text-zinc-400 transition-colors w-fit">
              <Download className="w-4 h-4" /> Export Compliance Report
            </button>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
