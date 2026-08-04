/**
 * Firestore Database Helpers
 * 
 * Typed CRUD helpers for all 14 PromptImageLab Firestore collections.
 * Uses graceful fallback patterns when Firestore is unavailable.
 * 
 * Collections:
 *   users, profiles, projects, prompts, workflows, collections,
 *   documentation, bookmarks, notifications, feature_requests,
 *   audit_logs, subscriptions, settings, analytics
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  type Query,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface FeatureRequest {
  id?: string;
  title: string;
  description: string;
  category: 'Platform' | 'Prompts' | 'Workflows' | 'Integrations' | 'Studio' | 'OpsPilot' | 'Other';
  status: 'In Planning' | 'Building' | 'Live' | 'Declined';
  upvotesCount: number;
  upvotedUserIds: string[];
  authorUid: string;
  authorEmail: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface BookmarkEntry {
  id?: string;
  userId: string;
  resourceType: 'prompt' | 'workflow' | 'doc' | 'collection';
  resourceId: string;
  resourceTitle: string;
  savedAt?: any;
}

export interface AuditLogEntry {
  id?: string;
  userId: string;
  action: 'SECURITY_SCAN' | 'PROMPT_EXECUTE' | 'KEY_SAVE' | 'KEY_DELETE' | 'WORKFLOW_RUN' | 'LOGIN' | 'LOGOUT' | 'ROLE_CHANGE' | 'SUBSCRIPTION_CHANGE';
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  severity: 'info' | 'warning' | 'critical';
  timestamp?: any;
}

export interface NotificationEntry {
  id?: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// GUARD: Only run Firestore calls when configured
// ─────────────────────────────────────────────────────────────────────────────
function assertFirestore() {
  if (!db || !isFirebaseConfigured()) {
    throw new Error('Firestore is not configured. Set VITE_FIREBASE_* environment variables.');
  }
  return db;
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

export const featureRequestsCollection = () => collection(assertFirestore(), 'feature_requests');

export async function getFeatureRequests(limitCount = 50): Promise<FeatureRequest[]> {
  const q = query(
    featureRequestsCollection(),
    orderBy('upvotesCount', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeatureRequest));
}

export async function createFeatureRequest(
  request: Omit<FeatureRequest, 'id' | 'upvotesCount' | 'upvotedUserIds' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(featureRequestsCollection(), {
    ...request,
    upvotesCount: 0,
    upvotedUserIds: [],
    status: 'In Planning',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function toggleUpvoteFeatureRequest(requestId: string, userId: string, currentlyUpvoted: boolean): Promise<void> {
  const ref = doc(assertFirestore(), 'feature_requests', requestId);
  if (currentlyUpvoted) {
    await updateDoc(ref, {
      upvotesCount: increment(-1),
      upvotedUserIds: arrayRemove(userId),
    });
  } else {
    await updateDoc(ref, {
      upvotesCount: increment(1),
      upvotedUserIds: arrayUnion(userId),
    });
  }
}

export function subscribeToFeatureRequests(callback: (requests: FeatureRequest[]) => void): Unsubscribe {
  const q = query(featureRequestsCollection(), orderBy('upvotesCount', 'desc'), limit(50));
  return onSnapshot(q, (snap) => {
    const requests = snap.docs.map(d => ({ id: d.id, ...d.data() } as FeatureRequest));
    callback(requests);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKMARKS
// ─────────────────────────────────────────────────────────────────────────────

export const bookmarksCollection = () => collection(assertFirestore(), 'bookmarks');

export async function getUserBookmarks(userId: string): Promise<BookmarkEntry[]> {
  const q = query(bookmarksCollection(), where('userId', '==', userId), orderBy('savedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as BookmarkEntry));
}

export async function addBookmark(entry: Omit<BookmarkEntry, 'id' | 'savedAt'>): Promise<string> {
  const docRef = await addDoc(bookmarksCollection(), {
    ...entry,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  await deleteDoc(doc(assertFirestore(), 'bookmarks', bookmarkId));
}

export function subscribeToUserBookmarks(userId: string, callback: (bookmarks: BookmarkEntry[]) => void): Unsubscribe {
  const q = query(bookmarksCollection(), where('userId', '==', userId), orderBy('savedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as BookmarkEntry)));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

export const auditLogsCollection = () => collection(assertFirestore(), 'audit_logs');

export async function writeAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  await addDoc(auditLogsCollection(), {
    ...entry,
    timestamp: serverTimestamp(),
  });
}

export async function getUserAuditLogs(userId: string, limitCount = 100): Promise<AuditLogEntry[]> {
  const q = query(
    auditLogsCollection(),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLogEntry));
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const notificationsCollection = () => collection(assertFirestore(), 'notifications');

export function subscribeToUserNotifications(userId: string, callback: (notifications: NotificationEntry[]) => void): Unsubscribe {
  const q = query(
    notificationsCollection(),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationEntry)));
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(assertFirestore(), 'notifications', notificationId), { isRead: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// USER SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserSettings(userId: string): Promise<Record<string, any> | null> {
  const snap = await getDoc(doc(assertFirestore(), 'settings', userId));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserSettings(userId: string, settings: Record<string, any>): Promise<void> {
  await setDoc(doc(assertFirestore(), 'settings', userId), {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface SubscriptionRecord {
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  tier: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  trialStart?: string;
  trialEnd?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export async function getSubscription(userId: string): Promise<SubscriptionRecord | null> {
  const snap = await getDoc(doc(assertFirestore(), 'subscriptions', userId));
  return snap.exists() ? (snap.data() as SubscriptionRecord) : null;
}

export async function updateSubscription(userId: string, data: Partial<SubscriptionRecord>): Promise<void> {
  await setDoc(doc(assertFirestore(), 'subscriptions', userId), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
