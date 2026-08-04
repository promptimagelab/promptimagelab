import React, { useState } from 'react';
import { Terminal, Send, Sparkles, Bot, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@ui-core';

export const OpsPilotCopilot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Welcome to **OpsPilot AI Copilot Terminal**. Ask me to analyze cluster telemetry, parse incident syslog dumps, or trigger automated remediation playbooks.' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = `OpsPilot Copilot processed: "${userMsg}". All EKS pods in us-east-1-prod are operational. MTTR metric: 3.8 mins.`;
      if (userMsg.toLowerCase().includes('log') || userMsg.toLowerCase().includes('inc')) {
        reply = `**OpsPilot Syslog Analysis**:\n- Target: INC008492 (Global VPN Gateway)\n- Root Cause: Port 443 UDP Surge\n- Fix: eBPF rate-limiting rule applied successfully.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 700);
  };

  return (
    <div className="w-full space-y-6 select-none">
      <Card variant="glass" className="space-y-4 p-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" /> OpsPilot AI Copilot Terminal
            </h3>
            <p className="text-xs text-slate-400">Direct interface for incident querying, pod log analysis, and cluster remediation commands.</p>
          </div>
          <Badge variant="emerald" dot className="font-bold">Multi-Provider Engine Online</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 h-96 overflow-y-auto space-y-3 font-mono text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl max-w-2xl leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type an OpsPilot command (e.g. 'Show active P1 incidents' or 'Check EKS cluster status')..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors font-mono"
          />
          <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
            Send Command
          </Button>
        </form>
      </Card>
    </div>
  );
};
