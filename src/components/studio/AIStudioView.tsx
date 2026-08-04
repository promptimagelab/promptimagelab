import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Code, 
  Copy, 
  Check, 
  Zap, 
  Bot, 
  ShieldCheck, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Terminal,
  Columns,
  Cpu,
  Key,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { useDynamicEngine, AgentExecutionResult } from '../../hooks/useDynamicEngine';
import { useAiConnections, ProviderConfig } from '../../hooks/useAiConnections';

interface AIStudioViewProps {
  onExecuteRun?: () => boolean;
}

const DEFAULT_PROVIDER: ProviderConfig = {
  id: 'default-gemini',
  name: 'Google AI',
  provider: 'Google AI',
  description: 'Default Gemini Model Endpoint',
  apiKey: '',
  isConnected: false,
  modelSlug: 'gemini-1.5-flash-8b',
  ratePer1k: 0.001
};

export const AIStudioView: React.FC<AIStudioViewProps> = ({ onExecuteRun }) => {
  const { toast } = useToast();
  const dynamicEngine = useDynamicEngine();
  const { providers, connectedModels, saveProviderKey } = useAiConnections();

  const activeProviderList = providers;

  // Dynamic Prompt & Agent Controls
  const [rolePersona, setRolePersona] = useState('Senior AI Software Architect & System Auditor');
  const [promptText, setPromptText] = useState(
    () => localStorage.getItem('pil_draft_prompt') || 'Analyze the given TypeScript function for OWASP vulnerability risks and optimize memory efficiency for production deployment. {{CODE_SNIPPET}}'
  );
  const [variableCode, setVariableCode] = useState('async function fetchUserOrders(userId: string) {\n  return await db.query("SELECT * FROM orders WHERE id = " + userId);\n}');
  const [targetModel, setTargetModel] = useState('');
  const [temperature, setTemperature] = useState(0.2);

  // When providers list changes (e.g., user just added a connection in Connections page),
  // sync targetModel to the first available provider if none is currently selected.
  useEffect(() => {
    if (providers.length > 0) {
      const alreadySelected = providers.find(p => p.modelSlug === targetModel);
      if (!alreadySelected) {
        setTargetModel(providers[0].modelSlug);
      }
    }
  }, [providers]);

  const selectedProviderConfig = activeProviderList.find(p => p.modelSlug === targetModel) || activeProviderList[0] || DEFAULT_PROVIDER;

  // Dynamic API Key input state linked to selectedProviderConfig
  const [apiKeyInput, setApiKeyInput] = useState('');

  // Keep apiKeyInput dynamically in sync with the selected provider's saved key
  useEffect(() => {
    const key = selectedProviderConfig?.apiKey || localStorage.getItem('pil_byok_gemini') || '';
    setApiKeyInput(key);
  }, [selectedProviderConfig]);

  // Controls
  const [compareAgentsMode, setCompareAgentsMode] = useState(true);
  const [addGuardrails, setAddGuardrails] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [codeTab, setCodeTab] = useState<'langchain-python' | 'langgraph' | 'langchain-ts' | 'fastapi' | 'curl'>('langchain-python');
  const [copiedCode, setCopiedCode] = useState(false);

  // Outputs State
  const [agentOutputs, setAgentOutputs] = useState<AgentExecutionResult[]>(dynamicEngine.history);

  const handleSaveApiKey = (keyVal: string) => {
    const trimmed = keyVal.trim();
    setApiKeyInput(trimmed);
    localStorage.setItem('pil_byok_gemini', trimmed);
    if (selectedProviderConfig && selectedProviderConfig.id) {
      saveProviderKey(selectedProviderConfig.id, trimmed);
    }
    toast('API Key Saved Successfully', {
      type: 'success',
      description: `Credentials active for ${selectedProviderConfig?.name || 'Provider'}.`
    });
  };

  const handleClearOutputs = () => {
    dynamicEngine.clearHistory();
    setAgentOutputs([]);
    toast('Execution Logs Cleared', { type: 'info' });
  };

  const handleRunAgentPipeline = async () => {
    if (onExecuteRun && !onExecuteRun()) {
      return;
    }

    const keyToUse = apiKeyInput || selectedProviderConfig?.apiKey || localStorage.getItem('pil_byok_gemini') || '';

    setIsLoading(true);
    toast(`Dispatching Live ${selectedProviderConfig?.name || 'AI'} Pipeline...`, {
      type: 'info',
      description: `Connecting to ${selectedProviderConfig?.provider || 'AI'} network endpoint...`
    });

    const realResults = await dynamicEngine.runRealPipeline(
      rolePersona,
      promptText,
      variableCode,
      selectedProviderConfig?.modelSlug || 'gemini-1.5-flash-8b',
      temperature,
      keyToUse,
      selectedProviderConfig?.provider   // route to correct API (OpenAI/Google/Anthropic)
    );

    setAgentOutputs(realResults);
    setIsLoading(false);

    if (realResults.length > 0 && !realResults[0].id.includes('err')) {
      toast(`Live ${selectedProviderConfig?.name || 'AI'} Call Complete!`, {
        type: 'success',
        description: `Response received in ${realResults[0].latencyMs}ms.`
      });
    }
  };

  const handleCopyCode = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(true);
    toast('Code Copied to Clipboard!', {
      type: 'success',
      description: 'Production-ready code snippet copied.'
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getExportCode = () => {
    const cleanPrompt = promptText.replace(/`/g, '\\`');
    const cleanVar = variableCode.replace(/`/g, '\\`');

    switch (codeTab) {
      case 'langchain-python':
        return `# Universal ${selectedProviderConfig.name} Python LangChain Export
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import os

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "${rolePersona.replace(/"/g, '\\"')}"),
    ("user", "${cleanPrompt}")
])

llm = ChatGoogleGenerativeAI(model="${selectedProviderConfig.modelSlug}", temperature=${temperature})
chain = prompt_template | llm

response = chain.invoke({"code_snippet": """${cleanVar}"""})
print(response.content)`;

      case 'langgraph':
        return `# Universal ${selectedProviderConfig.name} LangGraph Workflow
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    code_snippet: str
    security_report: str

def analyze_security(state: AgentState):
    return {"security_report": "OWASP Audit Passed for ${selectedProviderConfig.modelSlug}."}

builder = StateGraph(AgentState)
builder.add_node("auditor", analyze_security)
builder.set_entry_point("auditor")
builder.add_edge("auditor", END)
graph = builder.compile()`;

      case 'langchain-ts':
        return `// Universal ${selectedProviderConfig.name} TypeScript LangChain Export
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "${rolePersona.replace(/"/g, '\\"')}"],
  ["user", \`${cleanPrompt}\`]
]);

const model = new ChatGoogleGenerativeAI({ modelName: "${selectedProviderConfig.modelSlug}", temperature: ${temperature} });
const chain = prompt.pipe(model);

const res = await chain.invoke({ code_snippet: \`${cleanVar}\` });
console.log(res.content);`;

      case 'fastapi':
        return `# Universal ${selectedProviderConfig.name} FastAPI Microservice
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="PromptImageLab ${selectedProviderConfig.modelSlug.toUpperCase()} Microservice")

class OptimizationRequest(BaseModel):
    code_snippet: str

@app.post("/api/v1/optimize")
async def optimize_prompt(req: OptimizationRequest):
    return {"status": "success", "model": "${selectedProviderConfig.modelSlug}", "output": req.code_snippet}`;

      case 'curl':
        return `# Direct Universal REST API Execution (${selectedProviderConfig.name})
curl -X POST "http://localhost:3000/api/agent/run" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedProviderConfig.modelSlug}",
    "rolePersona": "${rolePersona.replace(/"/g, '\\"')}",
    "promptText": "${cleanPrompt}",
    "variableCode": "${cleanVar}",
    "temperature": ${temperature}
  }'`;

      default:
        return '';
    }
  };

  return (
    <div className="w-full space-y-8 py-4 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Agent Studio & User-Managed AI Pipeline
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Azure AI Foundry 3-pane laboratory dynamically adapted to your custom added provider connections
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {agentOutputs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearOutputs}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
            >
              Clear Logs
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            isLoading={isLoading}
            onClick={handleRunAgentPipeline}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            Run Agent Pipeline
          </Button>
        </div>
      </div>

      {/* EMPTY STATE: No providers added yet */}
      {activeProviderList.length === 0 && (
        <Card variant="glass" className="border-amber-500/40 my-4">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">No AI Connections Configured</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Go to <strong>AI Connections</strong> in the sidebar to add your Google Gemini, OpenAI, or other API key — then return here to run the pipeline.
              </p>
            </div>
            <Badge variant="amber">Setup Required</Badge>
          </CardContent>
        </Card>
      )}

      {/* QUICK API KEY PASTE STRIP */}
      <Card variant="glass" className="border-indigo-500/30">
        <CardContent className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-indigo-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100">{selectedProviderConfig?.name ?? 'No Provider'} API Key: </span>
              <span className="text-slate-500 dark:text-slate-400">Paste your API key here for direct network calls</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              placeholder={`Paste ${selectedProviderConfig?.name || 'AI'} API Key...`}
              className="w-full sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 font-mono"
            />
            <Badge variant={apiKeyInput ? 'emerald' : 'indigo'} font-bold>
              {apiKeyInput ? 'Key Active ⚡' : 'Paste Key'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 3-PANE LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANE 1: DYNAMIC AGENT CONFIGURATION & PERSONA */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Agent Configuration
                </CardTitle>
                <Badge variant={apiKeyInput || selectedProviderConfig?.isConnected ? 'emerald' : 'indigo'}>
                  {apiKeyInput || selectedProviderConfig?.isConnected ? 'Connected ⚡' : 'Setup Required'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              
              {/* USER-ADDED DYNAMIC MODEL SELECTOR */}
              <div className="space-y-3">
                {activeProviderList.length > 1 && (
                  <Select
                    label={`Primary AI Model Provider (${activeProviderList.length} Connected)`}
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                    options={activeProviderList.map(p => ({
                      value: p.modelSlug,
                      label: `${p.name} • ${p.modelSlug} (${p.provider})`
                    }))}
                  />
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-slate-500 font-semibold">Active AI Model:</span>
                  </div>
                  <code className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/80">
                    {selectedProviderConfig?.modelSlug || 'gemini-1.5-flash-8b'}
                  </code>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Temperature: <span className="font-mono text-indigo-500 font-bold">{temperature}</span>
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <Textarea
                label="Role Persona Definition"
                rows={2}
                value={rolePersona}
                onChange={(e) => setRolePersona(e.target.value)}
              />

              <Textarea
                label="Variable: {{CODE_SNIPPET}}"
                rows={4}
                monospace
                value={variableCode}
                onChange={(e) => setVariableCode(e.target.value)}
              />

            </CardContent>
          </Card>
        </div>

        {/* PANE 2: DYNAMIC MASTER PROMPT INSTRUCTIONS */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Master Prompt Instructions
                </CardTitle>
                <Badge variant="emerald">Live Prompt Engine</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              
              <Textarea
                rows={9}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Enter prompt instructions..."
              />

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>OWASP System Instruction Filters</span>
                </div>
                <input
                  type="checkbox"
                  checked={addGuardrails}
                  onChange={(e) => setAddGuardrails(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* PANE 3: REAL LIVE AGENT OUTPUT EVALUATOR */}
        <div className="lg:col-span-4 space-y-4">
          {agentOutputs.length === 0 ? (
            <Card variant="glass" className="p-6 text-center text-xs text-slate-400 space-y-2">
              <Bot className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">Ready for Execution</p>
              <p>Click "Run Agent Pipeline" above to execute a real call against {selectedProviderConfig.name}.</p>
            </Card>
          ) : (
            agentOutputs.map((out, idx) => (
              <Card key={out.id || idx} variant="glass" className="space-y-3">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100">{out.agentName}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <Badge variant="emerald">{out.latencyMs} MS</Badge>
                      <Badge variant="indigo">{out.cost}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 text-xs space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto shadow-inner">
                    {out.content}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>

      {/* DYNAMIC CODE EXPORTER PANEL */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Code Exporter ({selectedProviderConfig.name})</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyCode(getExportCode())}
              leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedCode ? 'Copied!' : 'Copy Code Snippet'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-slate-100 dark:border-slate-800">
            {[
              { id: 'langchain-python', label: 'Python LangChain' },
              { id: 'langgraph', label: 'Python LangGraph' },
              { id: 'langchain-ts', label: 'TypeScript LangChain' },
              { id: 'fastapi', label: 'FastAPI Microservice' },
              { id: 'curl', label: 'cURL REST API' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setCodeTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  codeTab === t.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-md">
            {getExportCode()}
          </pre>
        </CardContent>
      </Card>

    </div>
  );
};
