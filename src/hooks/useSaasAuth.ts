import { useState, useEffect } from 'react';

export interface SaasAuthState {
  trialRunsLeft: number;
  isLoggedIn: boolean;
  userEmail: string | null;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'enterprise';
  showAuthModal: boolean;
  showSubscriptionModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  setShowSubscriptionModal: (val: boolean) => void;
  login: (email: string) => void;
  logout: () => void;
  consumeTrialRun: () => boolean; // returns true if execution allowed, false if blocked by paywall
  upgradeSubscription: (tier: 'starter' | 'pro' | 'enterprise') => void;
}

export function useSaasAuth(): SaasAuthState {
  const [trialRunsLeft, setTrialRunsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('pil_trial_runs');
    return saved !== null ? parseInt(saved, 10) : 3;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pil_is_logged_in') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('pil_user_email') || null;
  });

  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'starter' | 'pro' | 'enterprise'>(() => {
    return (localStorage.getItem('pil_sub_tier') as any) || 'free';
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('pil_trial_runs', trialRunsLeft.toString());
  }, [trialRunsLeft]);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('pil_is_logged_in', 'true');
    localStorage.setItem('pil_user_email', email);
    setShowAuthModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setSubscriptionTier('free');
    localStorage.removeItem('pil_is_logged_in');
    localStorage.removeItem('pil_user_email');
    localStorage.setItem('pil_sub_tier', 'free');
  };

  const consumeTrialRun = (): boolean => {
    if (subscriptionTier !== 'free') {
      return true; // Unlimited runs for paid tiers
    }

    if (trialRunsLeft > 0) {
      setTrialRunsLeft(prev => prev - 1);
      return true;
    }

    // Trial runs exhausted (0 left) -> Show Subscription Upgrade Popup
    setShowSubscriptionModal(true);
    return false;
  };

  const upgradeSubscription = (tier: 'starter' | 'pro' | 'enterprise') => {
    setSubscriptionTier(tier);
    localStorage.setItem('pil_sub_tier', tier);
    setShowSubscriptionModal(false);
  };

  return {
    trialRunsLeft,
    isLoggedIn,
    userEmail,
    subscriptionTier,
    showAuthModal,
    showSubscriptionModal,
    setShowAuthModal,
    setShowSubscriptionModal,
    login,
    logout,
    consumeTrialRun,
    upgradeSubscription,
  };
}
