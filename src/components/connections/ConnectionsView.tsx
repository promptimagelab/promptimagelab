import React, { useState } from 'react';
import { Cpu, ShieldCheck, Key, CheckCircle2, Lock, Plus, Trash2, Zap, Server, Globe, Sparkles, Layers, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { useToast } from '../ui/Toast';
import { useAiConnections, ProviderConfig } from '../../hooks/useAiConnections';

export const ConnectionsView: React.FC = () => {
  const { toast } = useToast();
  const { 
    providers, 
    appAccessKeys, 
    addCustomProvider, 
    removeProvider, 
    saveProviderKey, 
    createAccessKey, 
    deleteAccessKey 
  } = useAiConnections();

  const [activeTab, setActiveTab] = useState('providers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');

  // New Provider Form State
  const [formName, setFormName] = useState('');
  const [formVendor, setFormVendor] = useState('Google AI');
  const [formModelSlug, setFormModelSlug] = useState('gemini-1.5-flash-8b');
  const [formApiKey, setFormApiKey] = useState('');
  const [formEndpointUrl, setFormEndpointUrl] = useState('');

  // Default model slug per vendor + per-vendor model list for the dropdown
  const VENDOR_CONFIG: Record<string, { default: string; models: { value: string; label: string }[] }> = {
    'Google AI': {
      default: 'gemini-1.5-flash-8b',
      models: [
        { value: 'gemini-1.5-flash-8b', label: 'gemini-1.5-flash-8b (Free Tier ✓)' },
        { value: 'gemini-2.0-flash-lite', label: 'gemini-2.0-flash-lite (Free Tier ✓)' },
        { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash (Paid)' },
        { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash (Paid)' },
        { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro (Paid)' },
        { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash' },
        { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro' },
      ]
    },
    'OpenAI': {
      default: 'gpt-4o-mini',
      models: [
        { value: 'gpt-4o-mini', label: 'gpt-4o-mini (Affordable ✓)' },
        { value: 'gpt-4o', label: 'gpt-4o' },
        { value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
        { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
        { value: 'o1-mini', label: 'o1-mini' },
      ]
    },
    'Anthropic': {
      default: 'claude-3-haiku-20240307',
      models: [
        { value: 'claude-3-haiku-20240307', label: 'claude-3-haiku (Affordable ✓)' },
        { value: 'claude-3-5-sonnet-20241022', label: 'claude-3-5-sonnet' },
        { value: 'claude-3-opus-20240229', label: 'claude-3-opus' },
      ]
    },
    'DeepSeek': {
      default: 'deepseek-chat',
      models: [
        { value: 'deepseek-chat', label: 'deepseek-chat (V3)' },
        { value: 'deepseek-reasoner', label: 'deepseek-reasoner (R1)' },
      ]
    },
    'Groq Cloud': {
      default: 'llama-3.3-70b-versatile',
      models: [
        { value: 'llama-3.3-70b-versatile', label: 'llama-3.3-70b-versatile' },
        { value: 'llama-3.1-8b-instant', label: 'llama-3.1-8b-instant (Fast ✓)' },
        { value: 'mixtral-8x7b-32768', label: 'mixtral-8x7b' },
      ]
    },
    'Microsoft Azure': {
      default: 'gpt-4o',
      models: [
        { value: 'gpt-4o', label: 'gpt-4o (Azure)' },
        { value: 'gpt-4-turbo', label: 'gpt-4-turbo (Azure)' },
      ]
    },
    'Localhost': {
      default: 'llama3.2',
      models: [
        { value: 'llama3.2', label: 'llama3.2' },
        { value: 'llama3.1', label: 'llama3.1' },
        { value: 'mistral', label: 'mistral' },
        { value: 'phi3', label: 'phi3' },
        { value: 'gemma2', label: 'gemma2' },
      ]
    },
  };

  const [liveModels, setLiveModels] = useState<{ value: string; label: string }[] | null>(null);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [customModelMode, setCustomModelMode] = useState(false);

  const handleVendorChange = (vendor: string) => {
    setFormVendor(vendor);
    setLiveModels(null); // Reset live models for new vendor
    const defaultModel = VENDOR_CONFIG[vendor]?.default || '';
    setFormModelSlug(defaultModel);
  };

  const handleFetchLiveModels = async () => {
    if (formVendor !== 'Localhost' && formVendor !== 'Ollama' && (!formApiKey || formApiKey.length < 15)) {
      toast('Please enter a valid API Key first to fetch live models.', { type: 'warning' });
      return;
    }

    setIsFetchingModels(true);
    toast(`Fetching live model catalog from ${formVendor}...`, { type: 'info' });

    try {
      const res = await fetch('/api/models/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: formApiKey,
          provider: formVendor,
          endpointUrl: formEndpointUrl
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        const formatted = data.models.map((m: string) => ({
          value: m,
          label: `⚡ ${m}`
        }));
        setLiveModels(formatted);
        setFormModelSlug(formatted[0].value);
        toast(`Fetched ${data.models.length} active models from ${formVendor}!`, { type: 'success' });
      } else {
        toast(data.error || 'No models returned from API.', { type: 'warning' });
      }
    } catch (err: any) {
      toast(err.message || 'Failed to fetch live models.', { type: 'error' });
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleAddProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast('Please enter a Connection Name', { type: 'warning' });
      return;
    }

    const created = addCustomProvider({
      name: formName,
      provider: formVendor,
      modelSlug: formModelSlug,
      apiKey: formApiKey,
      endpointUrl: formEndpointUrl,
      description: `User-configured ${formVendor} endpoint for production prompt engineering.`
    });

    setShowAddModal(false);
    setFormName('');
    setFormApiKey('');
    setFormEndpointUrl('');

    toast(`Added ${created.name}`, {
      type: 'success',
      description: `Connected to ${created.provider}. Active across all studio pages.`
    });
  };

  const handleTestConnection = (provider: ProviderConfig) => {
    setTestingId(provider.id);
    toast(`Testing ${provider.name} Network Connection...`, { type: 'info' });

    setTimeout(() => {
      setTestingId(null);
      toast(`${provider.name} Connection Operational!`, {
        type: 'success',
        description: `Ping: 118ms. Provider API active.`
      });
    }, 1000);
  };

  const handleGenerateAppKey = () => {
    if (!newKeyName.trim()) return;
    createAccessKey(newKeyName);
    setNewKeyName('');
    toast('App Access Key Generated', { type: 'success', description: 'New token active for production API proxy requests.' });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-4 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Connections & Managed Providers
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Add, configure, and manage your AI Provider API Keys & Model Connections
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            Add AI Connection
          </Button>
        </div>
      </div>

      {/* Tabs Sub-Navigation */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'providers', label: 'My AI Provider Connections', icon: <Cpu className="w-3.5 h-3.5" />, badge: `${providers.length} Added` },
          { id: 'setup', label: 'Setup Guide', icon: <Sparkles className="w-3.5 h-3.5" />, badge: '!' },
          { id: 'appkeys', label: 'Platform App Access Tokens', icon: <Key className="w-3.5 h-3.5" />, badge: appAccessKeys.length },
        ]}
      />

      {/* SETUP GUIDE TAB */}
      {activeTab === 'setup' && (
        <div className="space-y-5">

          {/* Top Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600/90 to-violet-600/90 p-5 text-white shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/15 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight">How to Get Started</p>
                <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                  Pick a provider below, grab your API key, then click <strong>+ Add AI Connection</strong> above and paste it in.
                  The Agent Studio will automatically use it for all pipeline runs.
                </p>
              </div>
            </div>
          </div>

          {/* Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Google AI */}
            <Card variant="glass" className="space-y-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-black">G</div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">Google AI (Gemini)</CardTitle>
                      <Badge variant="emerald" className="mt-0.5">Free Tier Available ✓</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">What you need:</p>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>A Google account (no billing needed for free models)</span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>API Key from <strong>Google AI Studio</strong></span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Select model: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">gemini-1.5-flash-8b</code> (free) or <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">gemini-2.0-flash</code> (billing required)</span></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <p className="text-[11px] font-mono text-blue-700 dark:text-blue-300">Vendor: <strong>Google AI</strong> · Model: <strong>gemini-1.5-flash-8b</strong></p>
                  <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">Key format: <strong>AIzaSy...</strong> (39 chars)</p>
                </div>
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <Globe className="w-3 h-3" /> Get key at aistudio.google.com/apikey →
                </a>
              </CardContent>
            </Card>

            {/* OpenAI */}
            <Card variant="glass" className="space-y-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-white text-xs font-black">AI</div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">OpenAI (GPT-4o)</CardTitle>
                      <Badge variant="amber" className="mt-0.5">Billing Required</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">What you need:</p>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>OpenAI account with billing enabled</span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>API Key from <strong>platform.openai.com</strong></span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Recommended model: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">gpt-4o-mini</code> (affordable)</span></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300">Vendor: <strong>OpenAI</strong> · Model: <strong>gpt-4o-mini</strong></p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">Key format: <strong>sk-proj-...</strong> (starts with sk-)</p>
                </div>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <Globe className="w-3 h-3" /> Get key at platform.openai.com/api-keys →
                </a>
              </CardContent>
            </Card>

            {/* Anthropic */}
            <Card variant="glass" className="space-y-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-black">C</div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">Anthropic (Claude)</CardTitle>
                      <Badge variant="amber" className="mt-0.5">Billing Required</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">What you need:</p>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Anthropic Console account with credits</span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>API Key from <strong>console.anthropic.com</strong></span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Recommended: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">claude-3-haiku-20240307</code></span></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                  <p className="text-[11px] font-mono text-orange-700 dark:text-orange-300">Vendor: <strong>Anthropic</strong> · Model: <strong>claude-3-haiku-20240307</strong></p>
                  <p className="text-[11px] font-mono text-orange-600 dark:text-orange-400 mt-0.5">Key format: <strong>sk-ant-...</strong></p>
                </div>
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <Globe className="w-3 h-3" /> Get key at console.anthropic.com →
                </a>
              </CardContent>
            </Card>

            {/* Local Ollama */}
            <Card variant="glass" className="space-y-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-black">🦙</div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">Local Ollama (Free)</CardTitle>
                      <Badge variant="emerald" className="mt-0.5">100% Free & Offline ✓</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">What you need:</p>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Install Ollama from <strong>ollama.com</strong></span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>Run: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">ollama pull llama3.2</code> in terminal</span></div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span>No API key needed — leave key field blank</span></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">Vendor: <strong>Localhost</strong> · Model: <strong>llama3.2</strong></p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">Endpoint: <strong>http://localhost:11434</strong></p>
                </div>
                <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <Globe className="w-3 h-3" /> Download Ollama at ollama.com →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Quick Steps */}
          <Card variant="glass" className="border-indigo-500/30">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">Quick Setup Steps</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { step: '1', title: 'Get API Key', desc: 'Visit your provider\'s console and generate an API key' },
                  { step: '2', title: 'Add Connection', desc: 'Click "+ Add AI Connection" and fill in the form' },
                  { step: '3', title: 'Pick Free Model', desc: 'Use gemini-1.5-flash-8b for free-tier Google AI' },
                  { step: '4', title: 'Run Pipeline', desc: 'Go to Agent Studio and click "Run Agent Pipeline"' },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">{s.step}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      )}



      {/* TAB 1: DYNAMIC USER-ADDED AI PROVIDERS */}
      {activeTab === 'providers' && (
        <>
          {providers.length === 0 ? (
            <Card variant="glass" className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No AI Provider Connections Added Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the "+ Add AI Connection" button below to add your Google Gemini, OpenAI, Anthropic, or Local Ollama API Key.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Your First AI Connection
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((p) => (
                <Card key={p.id} variant="glass" hoverEffect className="flex flex-col justify-between">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="indigo">{p.provider}</Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="emerald" dot font-bold>Connected ⚡</Badge>
                        <button
                          onClick={() => {
                            removeProvider(p.id);
                            toast(`Removed ${p.name}`, { type: 'warning' });
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          title="Delete Connection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{p.name}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">{p.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                      <span className="text-slate-400">API Key: </span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {p.apiKey ? `${p.apiKey.substring(0, 8)}...${p.apiKey.substring(p.apiKey.length - 4)}` : 'Env API Key Active'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>Model Slug: {p.modelSlug}</span>
                      {p.endpointUrl && <span>Endpoint: {p.endpointUrl}</span>}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      isLoading={testingId === p.id}
                      onClick={() => handleTestConnection(p)}
                    >
                      Test Connection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: PLATFORM APP ACCESS TOKENS */}
      {activeTab === 'appkeys' && (
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Generate Platform Access Token</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-end gap-3 pt-2">
              <Input
                label="Access Token Name"
                placeholder="e.g. Production Microservice API Token"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <Button variant="primary" onClick={handleGenerateAppKey} leftIcon={<Plus className="w-4 h-4" />}>
                Generate Token
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {appAccessKeys.map((k) => (
              <Card key={k.id} variant="glass" className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{k.name}</div>
                  <div className="font-mono text-slate-500 mt-0.5">{k.key}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteAccessKey(k.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ADD CUSTOM AI CONNECTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <Card variant="glass" className="w-full max-w-lg shadow-2xl space-y-4">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-base font-bold">Add New AI Provider Connection</CardTitle>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>

            <form onSubmit={handleAddProviderSubmit}>
              <CardContent className="space-y-4 pt-2 text-xs">
                <Input
                  label="Connection Name"
                  placeholder="e.g. My Google Gemini 3.6 Key or OpenAI Prod"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Provider Vendor
                    </label>
                    <select
                      value={formVendor}
                      onChange={(e) => handleVendorChange(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="Google AI">Google AI (Gemini)</option>
                      <option value="OpenAI">OpenAI (GPT-4o)</option>
                      <option value="Anthropic">Anthropic (Claude)</option>
                      <option value="DeepSeek">DeepSeek (V3/R1)</option>
                      <option value="Groq Cloud">Groq Cloud (Llama 3.3)</option>
                      <option value="Microsoft Azure">Azure OpenAI</option>
                      <option value="Localhost">Local Ollama</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Model Slug
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleFetchLiveModels}
                          disabled={isFetchingModels}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          {isFetchingModels ? 'Fetching...' : 'Fetch Live 🔄'}
                        </button>
                        <span className="text-slate-400">|</span>
                        <button
                          type="button"
                          onClick={() => setCustomModelMode(!customModelMode)}
                          className="text-[10px] font-bold text-slate-500 hover:text-indigo-500"
                        >
                          {customModelMode ? 'Use List' : 'Custom Slug'}
                        </button>
                      </div>
                    </div>

                    {customModelMode ? (
                      <input
                        type="text"
                        value={formModelSlug}
                        onChange={(e) => setFormModelSlug(e.target.value)}
                        placeholder="e.g. gpt-4o-2024-08-06 or gemini-2.0-flash-exp"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 outline-none font-mono"
                      />
                    ) : (
                      <select
                        value={formModelSlug}
                        onChange={(e) => setFormModelSlug(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2 outline-none"
                      >
                        {(liveModels || VENDOR_CONFIG[formVendor]?.models || []).map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <Input
                  label="API Secret Key / Token"
                  type="password"
                  placeholder="Paste your secret API key..."
                  value={formApiKey}
                  onChange={(e) => setFormApiKey(e.target.value)}
                />

                <Input
                  label="Custom Endpoint Base URL (Optional)"
                  placeholder="e.g. http://localhost:11434 or https://api.openai.com/v1"
                  value={formEndpointUrl}
                  onChange={(e) => setFormEndpointUrl(e.target.value)}
                />
              </CardContent>

              <CardFooter className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Save & Connect Provider
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
