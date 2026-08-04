import React, { useState } from 'react';
import { Database, Download, Upload, RotateCcw, Check, X, Server, Table, Sparkles, HardDrive, ShieldCheck } from 'lucide-react';
import { useLocalDb } from '../../hooks/useLocalDb';

interface DatabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseManagerModal: React.FC<DatabaseManagerModalProps> = ({ isOpen, onClose }) => {
  const { db, stats, settings } = useLocalDb();
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMsg, setImportMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'export' | 'import' | 'migrate'>('overview');

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = db.exportFullJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptimagelab_db_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = db.importFullJSON(importJsonText);
    if (ok) {
      setImportStatus('success');
      setImportMsg('Database imported successfully! All records have been updated in real-time.');
      setImportJsonText('');
    } else {
      setImportStatus('error');
      setImportMsg('Failed to parse database JSON. Ensure the JSON schema is valid.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the database back to default seed records? All custom additions will be restored.')) {
      db.resetToDefaults();
      setImportStatus('success');
      setImportMsg('Database reset to initial default seed records successfully.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Dynamic Database Console</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Dynamic Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero hardcoded items. Fully persistent local database with JSON export & import.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>DB Tables ({stats.totalRecordSizeKB} KB)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('migrate')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'migrate'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Migration Ready</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-slate-100">
          
          {importStatus !== 'idle' && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              importStatus === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}>
              <span>{importMsg}</span>
              <button onClick={() => setImportStatus('idle')} className="font-bold underline ml-2">Dismiss</button>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Prompts Table</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.promptsCount}</div>
                  <span className="text-[10px] text-slate-500">Live dynamic records</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Workflows Table</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.workflowsCount}</div>
                  <span className="text-[10px] text-slate-500">Multi-step chains</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tools Meta</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.toolsCount}</div>
                  <span className="text-[10px] text-slate-500">Interactive modules</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Learn Guides</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.articlesCount}</div>
                  <span className="text-[10px] text-slate-500">Educational articles</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Saved Prompts</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.savedPromptsCount}</div>
                  <span className="text-[10px] text-slate-500">User library favorites</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">API Keys</span>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.apiKeysCount}</div>
                  <span className="text-[10px] text-slate-500">Generated tokens</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Reset Database to Seed State
                  </h4>
                  <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80">
                    Restores all initial prompts, workflows, and tool configurations.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  Export Complete Database Backup
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Download a single, complete JSON export containing all prompts, multi-step workflows, tools metadata, articles, saved user prompts, API key records, and analytics. Use this file to backup or move your data to external databases like PostgreSQL or Firestore later.
                </p>
              </div>

              <button
                onClick={handleExport}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Database Backup (.json)
              </button>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Import Database JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="db-file-upload"
                  />
                  <label
                    htmlFor="db-file-upload"
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Choose JSON File
                  </label>
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste database JSON contents here or select a file above..."
                  className="w-full h-40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                onClick={handleImportSubmit}
                disabled={!importJsonText.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Apply Database Import
              </button>
            </div>
          )}

          {activeTab === 'migrate' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cloud DB Migration Architecture</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your application is built with a 100% decoupled data service abstraction (<code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">/src/db/localDb.ts</code>). All views connect dynamically via reactive subscriptions.
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">When moving to another DB later (PostgreSQL / Firestore):</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    <li>Export your current DB state using the <strong>Export JSON</strong> button.</li>
                    <li>Update the API endpoint drivers in <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">server.ts</code> or replace <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">localDb.ts</code> with a SQL/Firestore client driver.</li>
                    <li>Because components consume data 100% dynamically via <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">useLocalDb()</code>, zero UI code changes will be required!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Database Engine: <strong className="text-slate-700 dark:text-slate-300">{settings.dbEngine}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-all"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
