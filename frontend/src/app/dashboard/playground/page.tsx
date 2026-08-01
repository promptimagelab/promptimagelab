"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Send, AlertCircle, RefreshCw } from "lucide-react";

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("My SSN is 123-45-6789 and I want to buy crypto.");
  const [model, setModel] = useState("qwen3:4b");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL || "http://127.0.0.1:8080/v1";
      const res = await fetch(`${proxyUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer antigravity_secret_key"
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP Error ${res.status}`);
      }

      setResponse(data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2));
    } catch (err: any) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Failed to reach Edge Proxy. Is it running? Make sure to run the proxy on port 8080 (e.g. `docker-compose up` or `cargo run`)");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Edge Playground</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Test Zero-Trust Policies and Semantic Caching instantly.</p>
      </div>

      <div className="flex-1 border border-white/10 bg-zinc-950 flex flex-col overflow-hidden">
        
        {/* Settings Bar */}
        <div className="h-14 border-b border-white/10 bg-black flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Model Routing</span>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="bg-zinc-900 border border-white/10 text-xs px-3 py-1.5 uppercase font-mono focus:outline-none focus:border-white/30"
            >
              <option value="gpt-4">GPT-4 (OpenAI)</option>
              <option value="o1-preview">o1-preview (OpenAI)</option>
              <option value="qwen3:4b">qwen3:4b (Local Ollama)</option>
              <option value="llama3">llama3 (Local Ollama)</option>
            </select>
          </div>
          <div className="text-xs font-mono text-zinc-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            PROXY ONLINE
          </div>
        </div>

        {/* Console Output */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm relative">
          {!response && !error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
              <Terminal className="w-12 h-12 mb-4 opacity-50" />
              <p className="uppercase tracking-widest text-xs">Awaiting Transmission</p>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center gap-3 text-yellow-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>ROUTING REQUEST TO UPSTREAM...</span>
            </div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-red-500/20 bg-red-500/5 text-red-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest text-xs">Request Intercepted / Failed</span>
              </div>
              <div>{error}</div>
            </motion.div>
          )}

          {response && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="whitespace-pre-wrap text-zinc-300">
              {response}
            </motion.div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full bg-zinc-900 border border-white/10 rounded-none p-4 pr-16 text-sm font-mono focus:outline-none focus:border-white/30 resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTest();
                }
              }}
            />
            <button
              onClick={handleTest}
              disabled={loading || !prompt.trim()}
              className="absolute right-4 bottom-4 w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
