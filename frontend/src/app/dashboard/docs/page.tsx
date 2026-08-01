"use client"

import React, { useState } from "react";
import { BookOpen, Copy, Check, Code2, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function APIDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeSnippets = {
    install: `pip install openai`,
    init: `import os
from openai import OpenAI

# Initialize the standard OpenAI client, but point it to the Antigravity Edge Proxy
client = OpenAI(
    api_key="antigravity_secret_key", # Replace with your Antigravity API Key
    base_url="https://api.promptimagelab.com/v1" # Your Antigravity Edge Proxy URL
)`,
    request: `try:
    # Drop-in replacement for OpenAI SDK
    response = client.chat.completions.create(
        model="gpt-4o", # Or qwen3:4b for Ollama fallback
        messages=[
            {"role": "user", "content": "My SSN is 123-45-6789."}
        ]
    )
    
    # The proxy will automatically redact PII before sending it to OpenAI
    print(response.choices[0].message.content)
    
except Exception as e:
    # Handle policy rejections (e.g., rate limits or blocked topics)
    print(f"Request Intercepted: {e}")`
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-white" />
          Developer Documentation
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Integrate the Antigravity Zero-Trust Proxy into your applications using standard SDKs.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Architecture Overview */}
        <section className="border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-4">Integration Architecture</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Antigravity is designed to be 100% compatible with the official OpenAI SDK. You do not need to install custom libraries. Simply change the <code>base_url</code> in your existing OpenAI client to point to the Antigravity Edge Proxy. The proxy will handle PII redaction, telemetry gathering, rate-limiting, and multi-cloud fallback automatically.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8 border border-white/5 bg-black">
            <div className="border border-white/20 p-4 text-center">
              <Code2 className="w-6 h-6 mx-auto mb-2 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Your App</span>
            </div>
            <div className="hidden md:block w-8 h-px bg-white/20 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-white/50 rotate-45" />
            </div>
            <div className="border border-white p-4 text-center bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Terminal className="w-6 h-6 mx-auto mb-2 text-white" />
              <span className="text-xs font-black uppercase tracking-wider text-white">Antigravity Proxy</span>
            </div>
            <div className="hidden md:block w-8 h-px bg-white/20 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-white/50 rotate-45" />
            </div>
            <div className="border border-white/20 p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider">OpenAI / Ollama</span>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Quick Start (Python)</h2>
          
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">1. Installation</h3>
              <p className="text-xs text-zinc-500 mb-3">Install the official OpenAI Python SDK.</p>
              <CodeBlock code={codeSnippets.install} index={0} copiedIndex={copiedIndex} onCopy={copyToClipboard} />
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">2. Client Initialization</h3>
              <p className="text-xs text-zinc-500 mb-3">Point the client to your Antigravity proxy instead of api.openai.com.</p>
              <CodeBlock code={codeSnippets.init} index={1} copiedIndex={copiedIndex} onCopy={copyToClipboard} />
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">3. Governed Inference</h3>
              <p className="text-xs text-zinc-500 mb-3">Execute requests exactly as you would normally. Antigravity handles the Zero-Trust policies implicitly.</p>
              <CodeBlock code={codeSnippets.request} index={2} copiedIndex={copiedIndex} onCopy={copyToClipboard} />
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}

function CodeBlock({ code, index, copiedIndex, onCopy }: { code: string, index: number, copiedIndex: number | null, onCopy: (text: string, idx: number) => void }) {
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 z-10">
        <button 
          onClick={() => onCopy(code, index)}
          className="p-2 bg-white/10 hover:bg-white/20 transition-colors rounded-none"
        >
          {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
        </button>
      </div>
      <pre className="bg-black border border-white/10 p-4 overflow-x-auto">
        <code className="text-xs font-mono text-zinc-300 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}
