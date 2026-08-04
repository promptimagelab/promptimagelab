import { useState, useEffect, useRef } from 'react';

export interface ProviderConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  apiKey: string;
  isConnected: boolean;
  modelSlug: string;
  endpointUrl?: string;
  ratePer1k: number;
}

export interface AppAccessKey {
  id: string;
  name: string;
  key: string;
  created: string;
  status: 'active' | 'revoked';
}

const DEFAULT_APP_KEYS: AppAccessKey[] = [
  { id: 'key-1', name: 'Production App Proxy', key: 'pil_live_948194...821a', created: '2026-07-28', status: 'active' },
  { id: 'key-2', name: 'Staging CI/CD Pipeline', key: 'pil_test_301948...102b', created: '2026-08-01', status: 'active' },
];

const PROVIDERS_KEY = 'pil_user_custom_providers';
const KEYS_KEY = 'pil_app_access_keys';

function loadProviders(): ProviderConfig[] {
  const saved = localStorage.getItem(PROVIDERS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
  }
  return [];
}

export function useAiConnections() {
  const [providers, setProviders] = useState<ProviderConfig[]>(loadProviders);

  const [appAccessKeys, setAppAccessKeys] = useState<AppAccessKey[]>(() => {
    const saved = localStorage.getItem(KEYS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }
    return DEFAULT_APP_KEYS;
  });

  // Guard flag: true while THIS instance is writing to localStorage.
  // Prevents the custom event from causing an infinite loop when our own
  // persist effect dispatches 'pil-providers-updated'.
  const isWriting = useRef(false);

  // ── SAME-TAB CROSS-COMPONENT SYNC ─────────────────────────────────────────
  // The native `window.storage` event ONLY fires in OTHER tabs, not the current
  // one. We use a custom event so that when ConnectionsView adds a provider,
  // AIStudioView's separate hook instance immediately reloads from localStorage.
  useEffect(() => {
    const handleUpdate = () => {
      if (isWriting.current) return; // skip our own writes
      setProviders(loadProviders());
    };

    // cross-tab (native storage event)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === PROVIDERS_KEY) setProviders(loadProviders());
    };

    window.addEventListener('pil-providers-updated' as any, handleUpdate);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('pil-providers-updated' as any, handleUpdate);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Persist to localStorage and broadcast to other hook instances in this tab
  useEffect(() => {
    isWriting.current = true;
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
    window.dispatchEvent(new CustomEvent('pil-providers-updated'));
    // Reset flag after the event loop so listeners don't fire on our own write
    requestAnimationFrame(() => { isWriting.current = false; });
  }, [providers]);

  useEffect(() => {
    localStorage.setItem(KEYS_KEY, JSON.stringify(appAccessKeys));
  }, [appAccessKeys]);

  const addCustomProvider = (data: {
    name: string;
    provider: string;
    description?: string;
    modelSlug: string;
    apiKey: string;
    endpointUrl?: string;
    ratePer1k?: number;
  }) => {
    const newProvider: ProviderConfig = {
      id: `prov-${Date.now()}`,
      name: data.name,
      provider: data.provider || 'Custom AI Provider',
      description: data.description || 'User added enterprise AI model endpoint.',
      modelSlug: data.modelSlug || data.name.toLowerCase().replace(/\s+/g, '-'),
      apiKey: data.apiKey,
      isConnected: true,
      endpointUrl: data.endpointUrl || '',
      ratePer1k: data.ratePer1k || 0.001,
    };
    setProviders(prev => [newProvider, ...prev]);
    return newProvider;
  };

  const removeProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  const saveProviderKey = (id: string, apiKey: string, endpointUrl?: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          apiKey: apiKey.trim(),
          isConnected: Boolean(apiKey.trim()),
          endpointUrl: endpointUrl !== undefined ? endpointUrl : p.endpointUrl,
        };
      }
      return p;
    }));
  };

  const createAccessKey = (name: string) => {
    const newKey: AppAccessKey = {
      id: `key-${Date.now()}`,
      name,
      key: `pil_live_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      created: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setAppAccessKeys(prev => [newKey, ...prev]);
    return newKey;
  };

  const deleteAccessKey = (id: string) => {
    setAppAccessKeys(prev => prev.filter(k => k.id !== id));
  };

  return {
    providers,
    connectedModels: providers.filter(p => p.isConnected || Boolean(p.apiKey && p.apiKey.trim())),
    appAccessKeys,
    addCustomProvider,
    removeProvider,
    saveProviderKey,
    createAccessKey,
    deleteAccessKey,
  };
}
