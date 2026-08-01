"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Terminal, CheckCircle2 } from "lucide-react";

export default function IntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const apiKey = "antigravity_secret_key";
  const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL || "https://api.promptimagelab.com/v1";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pythonSnippet = `from openai import OpenAI

client = OpenAI(
    api_key="${apiKey}",
    base_url="${proxyUrl}" # <-- Route through Antigravity Proxy!
)

# Use standard OpenAI SDK, but let Antigravity do the heavy lifting
response = client.chat.completions.create(
    model="qwen3:4b", # Works with local Ollama or GPT models!
    messages=[
        {"role": "user", "content": "Hello, world!"}
    ],
)

print(response.choices[0].message.content)`;

  const nodeSnippet = `import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "${apiKey}",
  baseURL: "${proxyUrl}", // <-- Route through Antigravity Proxy!
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{"role": "user", "content": "Hello, world!"}],
  });

  console.log(response.choices[0].message.content);
}

main();`;

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
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">API Integration Hub</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs">Drop-in replacement for OpenAI SDKs.</p>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Edge Proxy URL</h3>
          <div className="flex items-center justify-between bg-zinc-900 p-3 rounded border border-white/5">
            <code className="text-sm font-mono text-white">{proxyUrl}</code>
            <button onClick={() => handleCopy(proxyUrl, 'url')} className="text-zinc-400 hover:text-white">
              {copied === 'url' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="border border-white/10 bg-zinc-950 p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Global API Key</h3>
          <div className="flex items-center justify-between bg-zinc-900 p-3 rounded border border-white/5">
            <code className="text-sm font-mono text-white">{apiKey}</code>
            <button onClick={() => handleCopy(apiKey, 'key')} className="text-zinc-400 hover:text-white">
              {copied === 'key' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="border border-white/10 bg-zinc-950 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Python Quickstart</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-4">You do not need a custom SDK. Just pass the Antigravity Proxy URL into the official OpenAI package.</p>
        
        <div className="relative group">
          <pre className="bg-black border border-white/10 p-4 rounded overflow-x-auto">
            <code className="text-sm font-mono text-zinc-300">{pythonSnippet}</code>
          </pre>
          <button 
            onClick={() => handleCopy(pythonSnippet, 'python')}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          >
            {copied === 'python' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="border border-white/10 bg-zinc-950 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Node.js Quickstart</h2>
        </div>
        
        <div className="relative group">
          <pre className="bg-black border border-white/10 p-4 rounded overflow-x-auto">
            <code className="text-sm font-mono text-zinc-300">{nodeSnippet}</code>
          </pre>
          <button 
            onClick={() => handleCopy(nodeSnippet, 'node')}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          >
            {copied === 'node' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
