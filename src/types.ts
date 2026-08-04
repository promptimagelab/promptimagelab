export type ModelType = 
  | 'chatgpt' 
  | 'claude' 
  | 'gemini' 
  | 'grok' 
  | 'llama' 
  | 'qwen' 
  | 'mistral' 
  | 'deepseek' 
  | 'midjourney' 
  | 'flux' 
  | 'ideogram' 
  | 'sdxl';

export type IndustryType = 
  | 'software_development'
  | 'python'
  | 'java'
  | 'react'
  | 'sql'
  | 'servicenow'
  | 'azure'
  | 'aws'
  | 'security'
  | 'marketing' 
  | 'sales' 
  | 'finance' 
  | 'healthcare' 
  | 'education' 
  | 'hr' 
  | 'customer_support'
  | 'productivity'
  | 'devops'
  | 'cloud'
  | 'ai_engineering'
  | 'coding'
  | 'seo'
  | 'business'
  | 'legal'
  | 'real_estate';

export interface PromptVariable {
  name: string;
  label: string;
  defaultValue?: string;
  description?: string;
  type?: 'text' | 'select' | 'number';
  options?: string[];
}

export interface PromptFaq {
  question: string;
  answer: string;
}

export interface PromptItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: string; // e.g. Software Development, ServiceNow, SQL, Python, Azure, AWS, Security, Marketing
  models: ModelType[];
  industry: IndustryType;
  promptText: string;
  explanation: string;
  businessContext?: string;
  problemExplanation?: string;
  inputExample?: string;
  expectedOutput: string;
  customizationGuide?: string[];
  limitations?: string[];
  bestPractices?: string[];
  commonMistakes?: string[];
  relatedPrompts?: string[];
  relatedWorkflows?: string[];
  faqs?: PromptFaq[];
  variables: PromptVariable[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  likesCount: number;
  copiesCount: number;
  rating: number;
  isVerified?: boolean;
  author: string;
  createdAt: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  promptText: string;
  recommendedModel: ModelType;
  inputVariables: string[];
  expectedOutputFormat: string;
}

export interface WorkflowFaq {
  question: string;
  answer: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  problemSolved: string;
  businessOverview?: string;
  architectureDiagram?: string;
  stepByStepProcess?: string[];
  agentInteractions?: string[];
  expectedInputs?: string[];
  expectedOutputs?: string;
  implementationGuide?: string[];
  benefits?: string[];
  limitations?: string[];
  bestPractices?: string[];
  relatedWorkflows?: string[];
  faqs?: WorkflowFaq[];
  steps: WorkflowStep[];
  recommendedModels: ModelType[];
  expectedResults: string;
  tags: string[];
  downloadsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  updatedAt: string;
}

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  category: 'Optimization' | 'Generation' | 'Security & Testing' | 'Image & Vision' | 'Utility';
  description: string;
  iconName: string;
  isPopular?: boolean;
  isNew?: boolean;
  endpoint: string;
}

export interface OptimizeRequest {
  prompt: string;
  targetModel: ModelType | 'system_prompt';
  tone?: string;
  includeVariables?: boolean;
  addGuardrails?: boolean;
}

export interface OptimizeResponse {
  optimizedPrompt: string;
  originalPrompt: string;
  targetModel: string;
  qualityScore: number; // 0 - 100
  improvements: string[];
  suggestedVariables: PromptVariable[];
  negativePrompt?: string;
  securityNotes?: string;
  estimatedTokensSaved: number;
  explanation: string;
}

export interface SecurityCheckResult {
  score: number; // 0 - 100
  isSafe: boolean;
  vulnerabilities: {
    type: 'Prompt Injection' | 'Data Exfiltration' | 'System Prompt Bypass' | 'Hallucination Risk' | 'Ambiguity';
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    remediation: string;
  }[];
  clarityRating: string;
  tokenEfficiencyScore: number;
  recommendedSystemPrompt: string;
}

export interface ModelPricing {
  id: ModelType;
  name: string;
  provider: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  contextWindow: string;
  latencyAvgMs: number;
  ratingReasoning: number;
  ratingCoding: number;
  ratingCreative: number;
  bestFor: string;
}

export interface LearnArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Prompt Engineering' | 'Agentic AI' | 'RAG' | 'MCP' | 'Security' | 'ServiceNow AI' | 'Azure AI';
  summary: string;
  readTime: string;
  date: string;
  content: string;
  tags: string[];
  author?: string;
}

export interface SavedPrompt {
  id: string;
  promptId?: string;
  title: string;
  promptText: string;
  targetModel: ModelType;
  savedAt: string;
  notes?: string;
  tags: string[];
}

export interface ApiKeyItem {
  id: string;
  keyName: string;
  keyPrefix: string;
  createdDate: string;
  lastUsedDate: string;
  usageCount: number;
  status: 'active' | 'revoked';
}

export interface UsageAnalytics {
  totalOptimizations: number;
  tokensProcessed: number;
  costSavedEst: number;
  promptsSaved: number;
  apiCallsThisMonth: number;
  safetyAuditsPassed: number;
}

export interface SystemSettings {
  geminiVision: boolean;
  fluxEngine: boolean;
  securityScanner: boolean;
  mcpDiscovery: boolean;
  [key: string]: boolean | string | number | undefined;
}

export interface CommunityPost {
  id: string;
  title: string;
  slug: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  category: 'Discussions' | 'Showcase' | 'Feature Requests';
  content: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
  isPinned?: boolean;
}

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  competitor: string;
  summary: string;
  promptImageLabStrengths: string[];
  competitorStrengths: string[];
  featureMatrix: { feature: string; promptImageLab: boolean | string; competitor: boolean | string }[];
  verdict: string;
  bestForPromptImageLab: string;
  bestForCompetitor: string;
}

export interface IntegrationItem {
  id: string;
  slug: string;
  name: string;
  category: 'ITSM' | 'DevOps' | 'Code Repository' | 'Collaboration' | 'CRM';
  status: 'active' | 'coming_soon';
  description: string;
  keyFeatures: string[];
  logoIcon: string;
}

export interface UseCaseItem {
  id: string;
  slug: string;
  title: string;
  persona: 'IT Operations' | 'Developers' | 'Prompt Engineers' | 'AI Engineers' | 'Business Teams' | 'Marketing' | 'HR' | 'Finance' | 'Healthcare';
  headline: string;
  problem: string;
  solution: string;
  keyBenefits: string[];
  recommendedPrompts: string[];
  recommendedWorkflows: string[];
  metricImpact: string;
}
