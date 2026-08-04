import { useState, useEffect } from 'react';
import { localDb } from '../db/localDb';

export function useLocalDb() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to DB updates
    const unsubscribe = localDb.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    db: localDb,
    prompts: localDb.getPrompts(),
    workflows: localDb.getWorkflows(),
    tools: localDb.getTools(),
    learnArticles: localDb.getLearnArticles(),
    modelPricing: localDb.getModelPricing(),
    savedPrompts: localDb.getSavedPrompts(),
    apiKeys: localDb.getApiKeys(),
    analytics: localDb.getAnalytics(),
    settings: localDb.getSettings(),
    stats: localDb.getDbStats()
  };
}
