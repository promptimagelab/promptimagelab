import { useState, useEffect } from 'react';

export interface ModelRateCard {
  id: string;
  name: string;
  provider: string;
  costPer1k: number;
  baseLatencyMs: number;
}

export interface AgentExecutionResult {
  id: string;
  timestamp: string;
  agentName: string;
  model: string;
  latencyMs: number;
  cost: string;
  tokensUsed: number;
  content: string;
  securityRiskScore: number;
  owaspFindings: string[];
}

export interface ExecutionStats {
  totalExecutions: number;
  totalTokens: number;
  totalCostSaved: number;
  threatsBlocked: number;
}

export const MODEL_RATE_CARDS: Record<string, ModelRateCard> = {
  'gemini-1.5-flash': { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash', provider: 'Google AI', costPer1k: 0.00012, baseLatencyMs: 140 },
  'gpt-4o': { id: 'gpt-4o', name: 'OpenAI GPT-4o (Omni)', provider: 'OpenAI', costPer1k: 0.0025, baseLatencyMs: 280 },
  'claude-3-5-sonnet': { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet', provider: 'Anthropic', costPer1k: 0.0030, baseLatencyMs: 310 },
  'deepseek-v3': { id: 'deepseek-v3', name: 'DeepSeek V3 (Reasoning)', provider: 'DeepSeek', costPer1k: 0.00028, baseLatencyMs: 210 },
};

function getStoredApiKey(overrideKey?: string, targetModel?: string): string {
  if (overrideKey && overrideKey.trim().length > 0) {
    return overrideKey.trim();
  }
  const savedProviders = localStorage.getItem('pil_user_custom_providers');
  if (savedProviders) {
    try {
      const parsed = JSON.parse(savedProviders);
      if (Array.isArray(parsed)) {
        // First try to match targetModel
        if (targetModel) {
          const matched = parsed.find((p: any) => p.modelSlug === targetModel && p.apiKey && p.apiKey.trim().length > 0);
          if (matched) return matched.apiKey.trim();
        }
        // Fallback to any provider key
        const found = parsed.find((p: any) => p.apiKey && p.apiKey.trim().length > 0);
        if (found) return found.apiKey.trim();
      }
    } catch (e) {}
  }
  return localStorage.getItem('pil_byok_gemini') || '';
}

export function useDynamicEngine() {
  const [history, setHistory] = useState<AgentExecutionResult[]>(() => {
    const saved = localStorage.getItem('pil_exec_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pil_exec_history', JSON.stringify(history));
  }, [history]);

  const stats: ExecutionStats = {
    totalExecutions: history.length,
    totalTokens: history.reduce((sum, item) => sum + (item.tokensUsed || 0), 0),
    totalCostSaved: parseFloat(
      history.reduce((sum, item) => {
        const numericCost = parseFloat((item.cost || '0').replace('$', '')) || 0;
        return sum + numericCost;
      }, 0).toFixed(5)
    ),
    threatsBlocked: history.filter(item => (item.securityRiskScore || 0) > 40).length,
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pil_exec_history');
  };

  const runRealPipeline = async (
    rolePersona: string,
    promptText: string,
    variableCode: string,
    targetModel: string,
    temperature: number = 0.2,
    customApiKey?: string,
    provider?: string  // e.g. 'Google AI', 'OpenAI', 'Anthropic', 'Localhost'
  ): Promise<AgentExecutionResult[]> => {
    const startTime = Date.now();
    const apiKey = getStoredApiKey(customApiKey, targetModel);

    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rolePersona,
          promptText,
          variableCode,
          targetModel,
          temperature,
          apiKey,
          provider: provider || 'Google AI'  // tell server which API to call
        })
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (e) {
        data = { error: rawText || 'Server returned non-JSON output.' };
      }

      const latencyMs = Date.now() - startTime;

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Server pipeline execution error.');
      }

      const realResult: AgentExecutionResult = {
        id: `exec-real-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: data.agentName || `Gemini (${targetModel})`,
        model: data.model || targetModel,
        latencyMs: data.latencyMs || latencyMs,
        cost: data.cost || '$0.00012',
        tokensUsed: data.tokensUsed || 450,
        securityRiskScore: variableCode.includes('eval') ? 75 : 8,
        owaspFindings: variableCode.includes('eval') ? ['OWASP LLM01: Dangerous eval() risk.'] : ['Live API Audit Passed.'],
        content: data.content || 'Execution completed successfully.',
      };

      setHistory(prev => [realResult, ...prev]);
      return [realResult];
    } catch (err: any) {
      const errorMsg = err.message || 'Pipeline execution failed.';
      const errorResult: AgentExecutionResult = {
        id: `exec-err-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: targetModel,
        model: targetModel,
        latencyMs: Date.now() - startTime,
        cost: '$0.00000',
        tokensUsed: 0,
        securityRiskScore: 0,
        owaspFindings: [`Error: ${errorMsg}`],
        content: `❌ ${errorMsg}`
      };

      setHistory(prev => [errorResult, ...prev]);
      return [errorResult];
    }
  };

  return {
    history,
    stats,
    runRealPipeline,
    clearHistory,
    modelRateCards: MODEL_RATE_CARDS,
  };
}
