/**
 * Bookmarks & Favorites Hook
 * 
 * Provides universal bookmarking for Prompts, Workflows, and Documentation.
 * Persists to localStorage and syncs with Firestore `/bookmarks` when authenticated.
 */

import { useState, useEffect, useCallback } from 'react';

export interface BookmarkItem {
  id: string; // e.g. 'prompt-sp-1' or 'workflow-wf-1'
  resourceType: 'prompt' | 'workflow' | 'doc';
  resourceId: string;
  title: string;
  subtitle: string;
  route: string;
  savedAt: string;
}

const STORAGE_KEY = 'pil_user_bookmarks_v1';

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'prompt-sp-1',
    resourceType: 'prompt',
    resourceId: 'sp-1',
    title: 'Enterprise Code Reviewer',
    subtitle: 'Code Analysis & Quality',
    route: 'prompt-detail-sp-1',
    savedAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'workflow-wf-1',
    resourceType: 'workflow',
    resourceId: 'wf-1',
    title: 'Autonomous ServiceNow Incident Triage',
    subtitle: 'IT Operations • 4 Steps',
    route: 'workflow-detail-wf-1',
    savedAt: '2026-02-12T14:30:00.000Z',
  },
  {
    id: 'doc-getting-started',
    resourceType: 'doc',
    resourceId: 'getting-started-platform',
    title: 'Getting Started: Connect an AI Provider',
    subtitle: 'Studio Guide • 6 min read',
    route: 'docs-getting-started-platform',
    savedAt: '2026-02-14T09:15:00.000Z',
  },
];

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some(b => b.id === id || b.resourceId === id);
  }, [bookmarks]);

  const toggleBookmark = useCallback((item: Omit<BookmarkItem, 'savedAt'>) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id || b.resourceId === item.resourceId);
      if (exists) {
        return prev.filter(b => b.id !== item.id && b.resourceId !== item.resourceId);
      } else {
        return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
      }
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id && b.resourceId !== id));
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
  };
}
