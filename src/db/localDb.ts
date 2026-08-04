import { 
  PromptItem, 
  WorkflowItem, 
  ToolMeta, 
  LearnArticle, 
  ModelPricing, 
  SavedPrompt, 
  ApiKeyItem, 
  UsageAnalytics 
} from '../types';

import { INITIAL_LIBRARY_PROMPTS } from '../data/libraryData';
import { INITIAL_WORKFLOWS } from '../data/workflowsData';
import { ALL_TOOLS } from '../data/toolsData';
import { LEARN_ARTICLES, MODEL_PRICING_DATA } from '../data/learnData';

const DB_KEY_PROMPTS = 'pil_db_prompts_v2';
const DB_KEY_WORKFLOWS = 'pil_db_workflows_v2';
const DB_KEY_TOOLS = 'pil_db_tools_v2';
const DB_KEY_ARTICLES = 'pil_db_articles_v2';
const DB_KEY_PRICING = 'pil_db_pricing_v2';
const DB_KEY_SAVED_PROMPTS = 'pil_db_saved_prompts_v2';
const DB_KEY_API_KEYS = 'pil_db_api_keys_v2';
const DB_KEY_ANALYTICS = 'pil_db_analytics_v2';
const DB_KEY_SETTINGS = 'pil_db_settings_v2';

export interface SystemSettings {
  dbEngine: 'Local IndexedDB / Storage' | 'Cloudflare D1 SQLite (backend-db)' | 'PostgreSQL / Cloud SQL' | 'Firestore / Firebase';
  d1DatabaseId?: string;
  d1DatabaseName?: string;
  autoSaveOptimizations: boolean;
  enableSafetyGuardrails: boolean;
  defaultModel: string;
  apiRateLimit: number;
  geminiVision?: boolean;
  fluxEngine?: boolean;
  securityScanner?: boolean;
  mcpDiscovery?: boolean;
  [key: string]: any;
}

const DEFAULT_ANALYTICS: UsageAnalytics = {
  totalOptimizations: 1240,
  tokensProcessed: 1850000,
  costSavedEst: 342.50,
  promptsSaved: 12,
  apiCallsThisMonth: 3840,
  safetyAuditsPassed: 890
};

const DEFAULT_SAVED_PROMPTS: SavedPrompt[] = [
  {
    id: 'sp-1',
    title: 'Enterprise Code Reviewer',
    promptText: 'You are a Senior Software Architect. Review code snippet for security, performance, and memory leaks...',
    targetModel: 'claude',
    savedAt: '2026-02-10',
    tags: ['Coding', 'Architecture'],
    notes: 'Works exceptionally well with Claude 3.5 Sonnet'
  },
  {
    id: 'sp-2',
    title: 'Photorealistic Studio Portrait',
    promptText: 'Hyper-realistic photographic portrait of subject, 85mm lens, Rembrandt lighting --v 6.0',
    targetModel: 'midjourney',
    savedAt: '2026-02-12',
    tags: ['Image', 'Midjourney'],
    notes: 'Use --style raw for best results'
  }
];

const DEFAULT_API_KEYS: ApiKeyItem[] = [
  {
    id: 'ak-1',
    keyName: 'Production Web App API',
    keyPrefix: 'pil_live_9x8a',
    createdDate: '2026-01-10',
    lastUsedDate: '2026-02-15',
    usageCount: 2840,
    status: 'active'
  },
  {
    id: 'ak-2',
    keyName: 'Staging Environment',
    keyPrefix: 'pil_test_3m12',
    createdDate: '2026-02-01',
    lastUsedDate: '2026-02-14',
    usageCount: 1000,
    status: 'active'
  }
];

const DEFAULT_SETTINGS: SystemSettings = {
  dbEngine: 'Local IndexedDB / Storage',
  autoSaveOptimizations: true,
  enableSafetyGuardrails: true,
  defaultModel: 'gemini',
  apiRateLimit: 10000,
  geminiVision: true,
  fluxEngine: true,
  securityScanner: true,
  mcpDiscovery: false
};

type Listener = () => void;

class LocalDatabase {
  private listeners: Set<Listener> = new Set();

  private prompts: PromptItem[] = [];
  private workflows: WorkflowItem[] = [];
  private tools: ToolMeta[] = [];
  private learnArticles: LearnArticle[] = [];
  private modelPricing: ModelPricing[] = [];
  private savedPrompts: SavedPrompt[] = [];
  private apiKeys: ApiKeyItem[] = [];
  private analytics: UsageAnalytics = DEFAULT_ANALYTICS;
  private settings: SystemSettings = DEFAULT_SETTINGS;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      // Prompts
      const rawPrompts = localStorage.getItem(DB_KEY_PROMPTS);
      this.prompts = rawPrompts ? JSON.parse(rawPrompts) : INITIAL_LIBRARY_PROMPTS;
      if (!rawPrompts) localStorage.setItem(DB_KEY_PROMPTS, JSON.stringify(this.prompts));

      // Workflows
      const rawWorkflows = localStorage.getItem(DB_KEY_WORKFLOWS);
      this.workflows = rawWorkflows ? JSON.parse(rawWorkflows) : INITIAL_WORKFLOWS;
      if (!rawWorkflows) localStorage.setItem(DB_KEY_WORKFLOWS, JSON.stringify(this.workflows));

      // Tools
      const rawTools = localStorage.getItem(DB_KEY_TOOLS);
      this.tools = rawTools ? JSON.parse(rawTools) : ALL_TOOLS;
      if (!rawTools) localStorage.setItem(DB_KEY_TOOLS, JSON.stringify(this.tools));

      // Articles
      const rawArticles = localStorage.getItem(DB_KEY_ARTICLES);
      this.learnArticles = rawArticles ? JSON.parse(rawArticles) : LEARN_ARTICLES;
      if (!rawArticles) localStorage.setItem(DB_KEY_ARTICLES, JSON.stringify(this.learnArticles));

      // Pricing
      const rawPricing = localStorage.getItem(DB_KEY_PRICING);
      this.modelPricing = rawPricing ? JSON.parse(rawPricing) : MODEL_PRICING_DATA;
      if (!rawPricing) localStorage.setItem(DB_KEY_PRICING, JSON.stringify(this.modelPricing));

      // Saved Prompts
      const rawSaved = localStorage.getItem(DB_KEY_SAVED_PROMPTS);
      this.savedPrompts = rawSaved ? JSON.parse(rawSaved) : DEFAULT_SAVED_PROMPTS;
      if (!rawSaved) localStorage.setItem(DB_KEY_SAVED_PROMPTS, JSON.stringify(this.savedPrompts));

      // API Keys
      const rawKeys = localStorage.getItem(DB_KEY_API_KEYS);
      this.apiKeys = rawKeys ? JSON.parse(rawKeys) : DEFAULT_API_KEYS;
      if (!rawKeys) localStorage.setItem(DB_KEY_API_KEYS, JSON.stringify(this.apiKeys));

      // Analytics
      const rawAnalytics = localStorage.getItem(DB_KEY_ANALYTICS);
      this.analytics = rawAnalytics ? JSON.parse(rawAnalytics) : DEFAULT_ANALYTICS;
      if (!rawAnalytics) localStorage.setItem(DB_KEY_ANALYTICS, JSON.stringify(this.analytics));

      // Settings
      const rawSettings = localStorage.getItem(DB_KEY_SETTINGS);
      this.settings = rawSettings ? JSON.parse(rawSettings) : DEFAULT_SETTINGS;
      if (!rawSettings) localStorage.setItem(DB_KEY_SETTINGS, JSON.stringify(this.settings));

    } catch (e) {
      console.error('Failed to parse local DB state, resetting defaults', e);
      this.prompts = [...INITIAL_LIBRARY_PROMPTS];
      this.workflows = [...INITIAL_WORKFLOWS];
      this.tools = [...ALL_TOOLS];
      this.learnArticles = [...LEARN_ARTICLES];
      this.modelPricing = [...MODEL_PRICING_DATA];
      this.savedPrompts = [...DEFAULT_SAVED_PROMPTS];
      this.apiKeys = [...DEFAULT_API_KEYS];
      this.analytics = { ...DEFAULT_ANALYTICS };
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notify();
    } catch (err) {
      console.error(`Failed to save key ${key} to Local DB`, err);
    }
  }

  // ==================== PROMPTS ====================
  public getPrompts(): PromptItem[] {
    return this.prompts;
  }

  public getPromptById(id: string): PromptItem | undefined {
    return this.prompts.find(p => p.id === id);
  }

  public addPrompt(prompt: Omit<PromptItem, 'id' | 'createdAt' | 'likesCount' | 'copiesCount'>): PromptItem {
    const newPrompt: PromptItem = {
      ...prompt,
      id: `pr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      likesCount: 1,
      copiesCount: 0,
      rating: 5.0
    };
    this.prompts = [newPrompt, ...this.prompts];
    this.save(DB_KEY_PROMPTS, this.prompts);
    return newPrompt;
  }

  public updatePrompt(id: string, updates: Partial<PromptItem>): void {
    this.prompts = this.prompts.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save(DB_KEY_PROMPTS, this.prompts);
  }

  public deletePrompt(id: string): void {
    this.prompts = this.prompts.filter(p => p.id !== id);
    this.save(DB_KEY_PROMPTS, this.prompts);
  }

  public likePrompt(id: string): void {
    this.prompts = this.prompts.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p);
    this.save(DB_KEY_PROMPTS, this.prompts);
  }

  public copyPrompt(id: string): void {
    this.prompts = this.prompts.map(p => p.id === id ? { ...p, copiesCount: p.copiesCount + 1 } : p);
    this.save(DB_KEY_PROMPTS, this.prompts);
  }

  // ==================== WORKFLOWS ====================
  public getWorkflows(): WorkflowItem[] {
    return this.workflows;
  }

  public getWorkflowById(id: string): WorkflowItem | undefined {
    return this.workflows.find(w => w.id === id);
  }

  public addWorkflow(wf: Omit<WorkflowItem, 'id' | 'downloadsCount' | 'updatedAt'>): WorkflowItem {
    const newWf: WorkflowItem = {
      ...wf,
      id: `wf-${Date.now()}`,
      downloadsCount: 1,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.workflows = [newWf, ...this.workflows];
    this.save(DB_KEY_WORKFLOWS, this.workflows);
    return newWf;
  }

  public updateWorkflow(id: string, updates: Partial<WorkflowItem>): void {
    this.workflows = this.workflows.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : w);
    this.save(DB_KEY_WORKFLOWS, this.workflows);
  }

  public deleteWorkflow(id: string): void {
    this.workflows = this.workflows.filter(w => w.id !== id);
    this.save(DB_KEY_WORKFLOWS, this.workflows);
  }

  public incrementWorkflowDownloads(id: string): void {
    this.workflows = this.workflows.map(w => w.id === id ? { ...w, downloadsCount: w.downloadsCount + 1 } : w);
    this.save(DB_KEY_WORKFLOWS, this.workflows);
  }

  // ==================== TOOLS ====================
  public getTools(): ToolMeta[] {
    return this.tools;
  }

  public addTool(tool: Omit<ToolMeta, 'id'>): ToolMeta {
    const newTool: ToolMeta = {
      ...tool,
      id: `t-${Date.now()}`
    };
    this.tools = [...this.tools, newTool];
    this.save(DB_KEY_TOOLS, this.tools);
    return newTool;
  }

  public updateTool(id: string, updates: Partial<ToolMeta>): void {
    this.tools = this.tools.map(t => t.id === id ? { ...t, ...updates } : t);
    this.save(DB_KEY_TOOLS, this.tools);
  }

  public deleteTool(id: string): void {
    this.tools = this.tools.filter(t => t.id !== id);
    this.save(DB_KEY_TOOLS, this.tools);
  }

  // ==================== LEARN ARTICLES ====================
  public getLearnArticles(): LearnArticle[] {
    return this.learnArticles;
  }

  public addLearnArticle(article: Omit<LearnArticle, 'id' | 'date'>): LearnArticle {
    const newArt: LearnArticle = {
      ...article,
      id: `art-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.learnArticles = [newArt, ...this.learnArticles];
    this.save(DB_KEY_ARTICLES, this.learnArticles);
    return newArt;
  }

  public updateLearnArticle(id: string, updates: Partial<LearnArticle>): void {
    this.learnArticles = this.learnArticles.map(a => a.id === id ? { ...a, ...updates } : a);
    this.save(DB_KEY_ARTICLES, this.learnArticles);
  }

  public deleteLearnArticle(id: string): void {
    this.learnArticles = this.learnArticles.filter(a => a.id !== id);
    this.save(DB_KEY_ARTICLES, this.learnArticles);
  }

  // ==================== MODEL PRICING ====================
  public getModelPricing(): ModelPricing[] {
    return this.modelPricing;
  }

  public updateModelPricing(id: string, updates: Partial<ModelPricing>): void {
    this.modelPricing = this.modelPricing.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save(DB_KEY_PRICING, this.modelPricing);
  }

  // ==================== SAVED PROMPTS ====================
  public getSavedPrompts(): SavedPrompt[] {
    return this.savedPrompts;
  }

  public addSavedPrompt(saved: Omit<SavedPrompt, 'id' | 'savedAt'>): SavedPrompt {
    const newItem: SavedPrompt = {
      ...saved,
      id: `sp-${Date.now()}`,
      savedAt: new Date().toISOString().split('T')[0]
    };
    this.savedPrompts = [newItem, ...this.savedPrompts];
    this.analytics.promptsSaved += 1;
    this.save(DB_KEY_SAVED_PROMPTS, this.savedPrompts);
    this.save(DB_KEY_ANALYTICS, this.analytics);
    return newItem;
  }

  public deleteSavedPrompt(id: string): void {
    this.savedPrompts = this.savedPrompts.filter(sp => sp.id !== id);
    this.save(DB_KEY_SAVED_PROMPTS, this.savedPrompts);
  }

  // ==================== API KEYS ====================
  public getApiKeys(): ApiKeyItem[] {
    return this.apiKeys;
  }

  public createApiKey(keyName: string): ApiKeyItem {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const newKey: ApiKeyItem = {
      id: `ak-${Date.now()}`,
      keyName: keyName || 'New Application Key',
      keyPrefix: `pil_live_${randomHex}`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsedDate: 'Just now',
      usageCount: 0,
      status: 'active'
    };
    this.apiKeys = [newKey, ...this.apiKeys];
    this.save(DB_KEY_API_KEYS, this.apiKeys);
    return newKey;
  }

  public revokeApiKey(id: string): void {
    this.apiKeys = this.apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' } : k);
    this.save(DB_KEY_API_KEYS, this.apiKeys);
  }

  public deleteApiKey(id: string): void {
    this.apiKeys = this.apiKeys.filter(k => k.id !== id);
    this.save(DB_KEY_API_KEYS, this.apiKeys);
  }

  // ==================== ANALYTICS ====================
  public getAnalytics(): UsageAnalytics {
    return this.analytics;
  }

  public trackOptimization(tokensSaved: number = 420): void {
    this.analytics = {
      ...this.analytics,
      totalOptimizations: this.analytics.totalOptimizations + 1,
      tokensProcessed: this.analytics.tokensProcessed + tokensSaved + 150,
      costSavedEst: Number((this.analytics.costSavedEst + (tokensSaved * 0.000003)).toFixed(2)),
      apiCallsThisMonth: this.analytics.apiCallsThisMonth + 1
    };
    this.save(DB_KEY_ANALYTICS, this.analytics);
  }

  public trackSecurityCheck(): void {
    this.analytics = {
      ...this.analytics,
      safetyAuditsPassed: this.analytics.safetyAuditsPassed + 1,
      apiCallsThisMonth: this.analytics.apiCallsThisMonth + 1
    };
    this.save(DB_KEY_ANALYTICS, this.analytics);
  }

  // ==================== SETTINGS ====================
  public getSettings(): SystemSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<SystemSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.save(DB_KEY_SETTINGS, this.settings);
  }

  // ==================== DATABASE IMPORT / EXPORT / RESET ====================
  public exportFullJSON(): string {
    const fullDbData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        dbEngine: this.settings.dbEngine
      },
      prompts: this.prompts,
      workflows: this.workflows,
      tools: this.tools,
      learnArticles: this.learnArticles,
      modelPricing: this.modelPricing,
      savedPrompts: this.savedPrompts,
      apiKeys: this.apiKeys,
      analytics: this.analytics,
      settings: this.settings
    };
    return JSON.stringify(fullDbData, null, 2);
  }

  public importFullJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.prompts) this.prompts = parsed.prompts;
      if (parsed.workflows) this.workflows = parsed.workflows;
      if (parsed.tools) this.tools = parsed.tools;
      if (parsed.learnArticles) this.learnArticles = parsed.learnArticles;
      if (parsed.modelPricing) this.modelPricing = parsed.modelPricing;
      if (parsed.savedPrompts) this.savedPrompts = parsed.savedPrompts;
      if (parsed.apiKeys) this.apiKeys = parsed.apiKeys;
      if (parsed.analytics) this.analytics = parsed.analytics;
      if (parsed.settings) this.settings = parsed.settings;

      this.save(DB_KEY_PROMPTS, this.prompts);
      this.save(DB_KEY_WORKFLOWS, this.workflows);
      this.save(DB_KEY_TOOLS, this.tools);
      this.save(DB_KEY_ARTICLES, this.learnArticles);
      this.save(DB_KEY_PRICING, this.modelPricing);
      this.save(DB_KEY_SAVED_PROMPTS, this.savedPrompts);
      this.save(DB_KEY_API_KEYS, this.apiKeys);
      this.save(DB_KEY_ANALYTICS, this.analytics);
      this.save(DB_KEY_SETTINGS, this.settings);

      return true;
    } catch (err) {
      console.error('Failed to import DB JSON', err);
      return false;
    }
  }

  public resetToDefaults(): void {
    localStorage.removeItem(DB_KEY_PROMPTS);
    localStorage.removeItem(DB_KEY_WORKFLOWS);
    localStorage.removeItem(DB_KEY_TOOLS);
    localStorage.removeItem(DB_KEY_ARTICLES);
    localStorage.removeItem(DB_KEY_PRICING);
    localStorage.removeItem(DB_KEY_SAVED_PROMPTS);
    localStorage.removeItem(DB_KEY_API_KEYS);
    localStorage.removeItem(DB_KEY_ANALYTICS);
    localStorage.removeItem(DB_KEY_SETTINGS);

    this.initDatabase();
    this.notify();
  }

  public getDbStats() {
    return {
      promptsCount: this.prompts.length,
      workflowsCount: this.workflows.length,
      toolsCount: this.tools.length,
      articlesCount: this.learnArticles.length,
      savedPromptsCount: this.savedPrompts.length,
      apiKeysCount: this.apiKeys.length,
      totalRecordSizeKB: Math.round(JSON.stringify(this.exportFullJSON()).length / 1024)
    };
  }
}

export const localDb = new LocalDatabase();
