import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  GitFork, 
  ShieldCheck, 
  Star, 
  Clock, 
  Cpu, 
  Code, 
  Terminal, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  User,
  Tag
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/Toast';

export interface PromptAsset {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  rating: number;
  version: string;
  updatedAt: string;
  usesCount: string;
  successRate: string;
  tokensCount: number;
  costEstimate: string;
  models: string[];
  compliance: string[];
  description: string;
  promptText: string;
  variables: { name: string; label: string; defaultValue: string }[];
  exampleOutput: {
    score: number;
    securityIssues: number;
    owaspFindings: number;
    codeSnippet: string;
  };
}

interface PromptAssetModalProps {
  asset: PromptAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onRunInStudio: (prompt: string) => void;
}

export const PromptAssetModal: React.FC<PromptAssetModalProps> = ({
  asset,
  isOpen,
  onClose,
  onRunInStudio,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'prompt' | 'outcomes' | 'telemetry' | 'versions'>('overview');
  const [promptLanguage, setPromptLanguage] = useState<'markdown' | 'typescript' | 'python' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);
  const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});

  if (!asset) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(asset.promptText);
    setCopied(true);
    toast('Prompt Asset Copied', { type: 'success', description: 'Production prompt copied to clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightedCode = () => {
    if (promptLanguage === 'json') {
      return JSON.stringify({
        role: "Senior Software Architect",
        instructions: asset.promptText,
        variables: asset.variables,
        metadata: { version: asset.version, model: asset.models[0] }
      }, null, 2);
    }
    if (promptLanguage === 'typescript') {
      return `import { ChatGoogleGenerativeAI } from "@langchain/google-genai";\n\nexport const assetPrompt = \`${asset.promptText}\`;`;
    }
    if (promptLanguage === 'python') {
      return `# Python Production Asset v${asset.version}\nprompt = """${asset.promptText}"""`;
    }
    return asset.promptText;
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="space-y-6">
        
        {/* TOP HEADER: Fortune 500 Trust & Metadata */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" dot font-bold>★ {asset.rating} Enterprise Verified</Badge>
              <Badge variant="indigo">v{asset.version}</Badge>
              <Badge variant="slate">Production Ready</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyPrompt} leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}>
                {copied ? 'Copied' : 'Copy Asset'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => { onRunInStudio(asset.promptText); onClose(); }} leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}>
                Run in AI Studio
              </Button>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {asset.category} Asset Framework
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {asset.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {asset.subtitle}
            </p>
          </div>

          {/* Key Quick Telemetry Pill */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1 font-mono">
            <span>🚀 <strong>{asset.usesCount}</strong> Uses</span>
            <span>⚡ <strong>{asset.successRate}</strong> Success Rate</span>
            <span>🔢 <strong>{asset.tokensCount}</strong> Tokens (~{asset.costEstimate})</span>
            <span>Updated {asset.updatedAt}</span>
          </div>
        </div>

        {/* SPLIT INSPECTOR LAYOUT (Main Inspector + Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MAIN INSPECTOR AREA (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <Tabs
              activeTab={activeTab}
              onChange={(t: any) => setActiveTab(t)}
              tabs={[
                { id: 'overview', label: 'Overview & Vars' },
                { id: 'prompt', label: 'Syntax Prompt' },
                { id: 'outcomes', label: 'Example Outcomes' },
                { id: 'telemetry', label: 'AI Telemetry' },
                { id: 'versions', label: 'Version History' },
              ]}
            />

            {/* TAB 1: OVERVIEW & VARIABLES */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <Card variant="flat">
                  <CardHeader>
                    <CardTitle className="text-xs">Asset Description & Purpose</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {asset.description}
                  </CardContent>
                </Card>

                {asset.variables.length > 0 && (
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle className="text-xs">Required Variables ({asset.variables.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                      {asset.variables.map((v, i) => (
                        <div key={i} className="space-y-1">
                          <label className="block text-[11px] font-mono text-indigo-500 font-bold">
                            {`{{${v.name}}}`} — {v.label}
                          </label>
                          <input
                            type="text"
                            defaultValue={v.defaultValue}
                            onChange={(e) => setVariableValues({ ...variableValues, [v.name]: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* TAB 2: SYNTAX-HIGHLIGHTED PROMPT */}
            {activeTab === 'prompt' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {(['markdown', 'typescript', 'python', 'json'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setPromptLanguage(lang)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors uppercase ${
                        promptLanguage === lang ? 'bg-indigo-600 text-white border-indigo-600 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-80 whitespace-pre-wrap">
                  {getHighlightedCode()}
                </pre>
              </div>
            )}

            {/* TAB 3: EXAMPLE OUTCOMES */}
            {activeTab === 'outcomes' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Architecture Score</div>
                    <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{asset.exampleOutput.score} / 100</div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Security Issues</div>
                    <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{asset.exampleOutput.securityIssues} Flagged</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">OWASP Findings</div>
                    <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{asset.exampleOutput.owaspFindings} Resolved</div>
                  </div>
                </div>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="text-xs">Sample Execution Output Code</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1">
                    <pre className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 whitespace-pre-wrap">
                      {asset.exampleOutput.codeSnippet}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 4: AI TELEMETRY */}
            {activeTab === 'telemetry' && (
              <div className="space-y-3 text-xs">
                <Card variant="glass">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Prompting Technique</span>
                      <Badge variant="indigo">Chain of Thought + Guardrails</Badge>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Structured Output Schema</span>
                      <Badge variant="emerald">JSON Schema Validated</Badge>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-slate-500">Supported AI Models</span>
                      <span className="font-mono">{asset.models.join(' • ')}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 5: VERSION HISTORY */}
            {activeTab === 'versions' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>v3.2.0 (Current Stable)</span>
                    <Badge variant="emerald">Production</Badge>
                  </div>
                  <p className="text-slate-500">Added OWASP LLM02 Sensitive Data Exfiltration guardrails and TypeScript 5.8 compatibility.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between font-medium text-slate-500">
                    <span>v3.1.0</span>
                    <span>2 weeks ago</span>
                  </div>
                  <p className="text-slate-400">Added dynamic variable placeholders for code snippets.</p>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT INSPECTOR SIDEBAR (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            
            {/* Enterprise Tags & Compliance */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-xs">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {asset.compliance.map((c, i) => (
                    <Badge key={i} variant="emerald">{c}</Badge>
                  ))}
                  <Badge variant="indigo">Enterprise SOC2</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Supported Models */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-xs">Verified Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pt-2">
                {asset.models.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {m}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Creator & License */}
            <Card variant="flat">
              <CardContent className="p-4 space-y-2 text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Maintainer:</span>
                  <strong className="text-slate-900 dark:text-slate-100">Enterprise AI Team</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>License:</span>
                  <strong className="text-slate-900 dark:text-slate-100">Apache 2.0 / Commercial</strong>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </Dialog>
  );
};
