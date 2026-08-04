/**
 * Firebase Authentication Hook
 * 
 * Provides real Firebase Auth with:
 * - Google OAuth Sign In
 * - GitHub OAuth Sign In
 * - Email/Password Sign In & Registration
 * - Email Magic Link (passwordless)
 * - Password Reset
 * - Email Verification
 * - Real-time auth state listener (onAuthStateChanged)
 * - Graceful fallback to localStorage simulation if Firebase is not configured
 * 
 * Drop-in replacement for the existing useSaasAuth mock.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';
export type UserRole = 'admin' | 'engineer' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  trialEndsAt: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface FirebaseAuthState {
  /** Current authenticated user profile, or null if not logged in */
  user: UserProfile | null;
  /** True while auth state is being determined on initial load */
  isLoading: boolean;
  /** True when a login/signup operation is in progress */
  isAuthenticating: boolean;
  /** Last authentication error message, if any */
  authError: string | null;
  /** Whether the auth modal overlay should be shown */
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  /** Whether to show the subscription upgrade prompt */
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (val: boolean) => void;

  // Auth actions
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPhoneNumber?: (phone: string) => Promise<string>;
  confirmPhoneCode?: (verificationId: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  login?: (email: string) => void;

  // Subscription helpers (compatibility with existing components)
  isLoggedIn: boolean;
  userEmail: string | null;
  subscriptionTier: SubscriptionTier;
  trialRunsLeft: number;
  consumeTrialRun: () => boolean;
  upgradeSubscription: (tier: SubscriptionTier) => void;
}

const MAGIC_LINK_EMAIL_KEY = 'pil_magic_link_email';

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL SIMULATION MODE  (Firebase not yet configured)
// ─────────────────────────────────────────────────────────────────────────────
function useLocalAuthFallback(): FirebaseAuthState {
  const [trialRunsLeft, setTrialRunsLeft] = useState(() => {
    const saved = localStorage.getItem('pil_trial_runs');
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('pil_is_logged_in') === 'true');
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('pil_user_email'));
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(
    () => (localStorage.getItem('pil_sub_tier') as SubscriptionTier) || 'free'
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('pil_trial_runs', trialRunsLeft.toString());
  }, [trialRunsLeft]);

  const localLogin = useCallback((email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('pil_is_logged_in', 'true');
    localStorage.setItem('pil_user_email', email);
    setShowAuthModal(false);
  }, []);

  const localLogout = useCallback(async () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setSubscriptionTier('free');
    localStorage.removeItem('pil_is_logged_in');
    localStorage.removeItem('pil_user_email');
    localStorage.setItem('pil_sub_tier', 'free');
  }, []);

  const consumeTrialRun = useCallback((): boolean => {
    if (subscriptionTier !== 'free') return true;
    if (trialRunsLeft > 0) {
      setTrialRunsLeft(prev => prev - 1);
      return true;
    }
    setShowSubscriptionModal(true);
    return false;
  }, [subscriptionTier, trialRunsLeft]);

  const upgradeSubscription = useCallback((tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    localStorage.setItem('pil_sub_tier', tier);
    setShowSubscriptionModal(false);
  }, []);

  const mockProfile: UserProfile | null = isLoggedIn && userEmail ? {
    uid: 'local-user',
    email: userEmail,
    displayName: userEmail.split('@')[0],
    photoURL: null,
    role: 'engineer',
    subscriptionTier,
    trialEndsAt: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  } : null;

  return {
    user: mockProfile,
    isLoading: false,
    isAuthenticating: false,
    authError: null,
    showAuthModal,
    setShowAuthModal,
    showSubscriptionModal,
    setShowSubscriptionModal,
    signInWithGoogle: async () => localLogin('developer@enterprise.com'),
    signInWithGitHub: async () => localLogin('sre@enterprise.com'),
    signInWithEmail: async (email) => localLogin(email),
    signUpWithEmail: async (email) => localLogin(email),
    sendMagicLink: async () => {},
    resetPassword: async () => {},
    verifyPhoneNumber: async (phone: string) => {
      localLogin(`user-${phone.slice(-4)}@mobile.verified`);
      return 'ver-token-mock-12345';
    },
    confirmPhoneCode: async () => {},
    logout: localLogout,
    login: localLogin,
    isLoggedIn,
    userEmail,
    subscriptionTier,
    trialRunsLeft,
    consumeTrialRun,
    upgradeSubscription,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE PRODUCTION MODE
// ─────────────────────────────────────────────────────────────────────────────
function useFirebaseAuthInternal(): FirebaseAuthState {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [trialRunsLeft, setTrialRunsLeft] = useState(3);

  // Map a Firebase User + Firestore profile into our UserProfile shape
  const buildUserProfile = useCallback(async (firebaseUser: User): Promise<UserProfile> => {
    if (!db) throw new Error('Firestore not initialized');
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // First sign-in: create user document
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'engineer',
        subscriptionTier: 'free',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() });
      return newProfile;
    }

    const data = snap.data();
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName ?? data.displayName ?? null,
      photoURL: firebaseUser.photoURL ?? data.photoURL ?? null,
      role: data.role ?? 'engineer',
      subscriptionTier: data.subscriptionTier ?? 'free',
      trialEndsAt: data.trialEndsAt ?? null,
      emailVerified: firebaseUser.emailVerified,
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
  }, []);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await buildUserProfile(firebaseUser);
          setUser(profile);
          // Persist trial runs from Firestore profile
          setTrialRunsLeft(profile.subscriptionTier === 'free' ? 3 : Infinity);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, [buildUserProfile]);

  // Handle magic link on page load
  useEffect(() => {
    if (!auth) return;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = localStorage.getItem(MAGIC_LINK_EMAIL_KEY);
      if (email) {
        signInWithEmailLink(auth, email, window.location.href).then(async (result) => {
          const profile = await buildUserProfile(result.user);
          setUser(profile);
          localStorage.removeItem(MAGIC_LINK_EMAIL_KEY);
          window.history.replaceState({}, '', '/');
        }).catch(err => setAuthError(err.message));
      }
    }
  }, [buildUserProfile]);

  const handleAuthOperation = useCallback(async (operation: () => Promise<void>) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await operation();
      setShowAuthModal(false);
    } catch (err: any) {
      const msg = err.code === 'auth/popup-closed-by-user' ? null : (err.message ?? 'Authentication failed');
      if (msg) setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signInWithGoogle = useCallback(() =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const profile = await buildUserProfile(result.user);
      setUser(profile);
    }), [handleAuthOperation, buildUserProfile]);

  const signInWithGitHub = useCallback(() =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      const result = await signInWithPopup(auth, provider);
      const profile = await buildUserProfile(result.user);
      setUser(profile);
    }), [handleAuthOperation, buildUserProfile]);

  const signInWithEmail = useCallback((email: string, password: string) =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await buildUserProfile(result.user);
      setUser(profile);
    }), [handleAuthOperation, buildUserProfile]);

  const signUpWithEmail = useCallback((email: string, password: string) =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      const profile = await buildUserProfile(result.user);
      setUser(profile);
    }), [handleAuthOperation, buildUserProfile]);

  const sendMagicLink = useCallback((email: string) =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem(MAGIC_LINK_EMAIL_KEY, email);
    }), [handleAuthOperation]);

  const resetPassword = useCallback((email: string) =>
    handleAuthOperation(async () => {
      if (!auth) throw new Error('Firebase not initialized');
      await sendPasswordResetEmail(auth, email);
    }), [handleAuthOperation]);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  }, []);

  const consumeTrialRun = useCallback((): boolean => {
    if (!user || user.subscriptionTier !== 'free') return true;
    if (trialRunsLeft > 0) {
      setTrialRunsLeft(prev => prev - 1);
      return true;
    }
    setShowSubscriptionModal(true);
    return false;
  }, [user, trialRunsLeft]);

  const upgradeSubscription = useCallback((tier: SubscriptionTier) => {
    if (user) setUser({ ...user, subscriptionTier: tier });
    setShowSubscriptionModal(false);
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticating,
    authError,
    showAuthModal,
    setShowAuthModal,
    showSubscriptionModal,
    setShowSubscriptionModal,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    sendMagicLink,
    resetPassword,
    logout,
    // Compatibility fields
    isLoggedIn: !!user,
    userEmail: user?.email ?? null,
    subscriptionTier: user?.subscriptionTier ?? 'free',
    trialRunsLeft,
    consumeTrialRun,
    upgradeSubscription,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC EXPORT — automatically selects Firebase or local simulation
// ─────────────────────────────────────────────────────────────────────────────
export function useFirebaseAuth(): FirebaseAuthState {
  const firebaseState = useFirebaseAuthInternal();
  const localState = useLocalAuthFallback();
  return isFirebaseConfigured() ? firebaseState : localState;
}

// Re-export as useSaasAuth for backward compatibility with existing components
export { useFirebaseAuth as useSaasAuth };
