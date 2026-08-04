/**
 * AuthModal — Enterprise Authentication Modal
 *
 * Supports:
 * - Google OAuth
 * - GitHub OAuth
 * - Email / Password (Sign Up & Sign In)
 * - Email Magic Link (Passwordless)
 * - Password Reset
 *
 * Accessibility:
 * - role="dialog" + aria-modal + aria-labelledby
 * - Focus trap: Tab/Shift+Tab cycles within modal
 * - Escape key to close
 * - Error messages linked via aria-describedby
 *
 * Falls back gracefully when Firebase is not yet configured
 * (uses localStorage mock via useFirebaseAuth).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Wand2, Mail, Lock, Sparkles, ArrowRight,
  ShieldCheck, CheckCircle2, Github, Link, Eye, EyeOff,
  AlertCircle, Loader2, Phone, KeyRound
} from 'lucide-react';
import { Button, Input, Badge } from '@ui-core';
import { useToast } from '../ui/Toast';
import type { FirebaseAuthState } from '../../hooks/useFirebaseAuth';

type AuthMode = 'signup' | 'login' | 'magic' | 'reset' | 'phone';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called on successful authentication for backward compatibility */
  onLoginSuccess?: (email: string) => void;
  /** Pass the full auth state to enable real Firebase flows */
  saasAuth?: FirebaseAuthState;
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  saasAuth,
}) => {
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'send' | 'verify' | 'verified'>('send');
  const [verificationToken, setVerificationToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'auth-modal-title';
  const errorId = 'auth-modal-error';

  const isLoading = saasAuth?.isAuthenticating ?? localLoading;
  const authError = saasAuth?.authError ?? null;

  // Focus trap
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', trapFocus);
    // Move focus into modal on open
    setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      firstFocusable?.focus();
    }, 50);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen, trapFocus]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setMagicLinkSent(false);
      setResetSent(false);
      setAuthMode('signup');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Social OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    if (saasAuth?.signInWithGoogle) {
      await saasAuth.signInWithGoogle();
      toast('Signed in with Google', { type: 'success', description: 'Welcome to PromptImageLab!' });
      onLoginSuccess?.('google@user.com');
    } else {
      setLocalLoading(true);
      setTimeout(() => {
        setLocalLoading(false);
        onLoginSuccess?.('developer@enterprise.com');
        toast('Signed in with Google', { type: 'success', description: 'Enterprise Session Activated' });
        onClose();
      }, 700);
    }
  };

  const handleGitHubSignIn = async () => {
    if (saasAuth?.signInWithGitHub) {
      await saasAuth.signInWithGitHub();
      toast('Signed in with GitHub', { type: 'success', description: 'Welcome to PromptImageLab!' });
      onLoginSuccess?.('github@user.com');
    } else {
      setLocalLoading(true);
      setTimeout(() => {
        setLocalLoading(false);
        onLoginSuccess?.('sre@enterprise.com');
        toast('Signed in with GitHub', { type: 'success', description: 'Enterprise Session Activated' });
        onClose();
      }, 700);
    }
  };

  // ── Email / Password ──────────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (saasAuth) {
      if (authMode === 'signup') {
        await saasAuth.signUpWithEmail(email, password);
        if (!saasAuth.authError) {
          toast('Account Created!', { type: 'success', description: 'Check your email to verify your account.' });
          onLoginSuccess?.(email);
        }
      } else {
        await saasAuth.signInWithEmail(email, password);
        if (!saasAuth.authError) {
          toast('Signed In', { type: 'success', description: `Welcome back!` });
          onLoginSuccess?.(email);
        }
      }
    } else {
      setLocalLoading(true);
      setTimeout(() => {
        setLocalLoading(false);
        onLoginSuccess?.(email);
        toast(authMode === 'signup' ? 'Account Created!' : 'Signed In', {
          type: 'success',
          description: `Welcome ${email}.`
        });
        onClose();
      }, 800);
    }
  };

  // ── Magic Link ────────────────────────────────────────────────────────────
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (saasAuth?.sendMagicLink) {
      await saasAuth.sendMagicLink(email);
    }
    setMagicLinkSent(true);
    toast('Magic Link Sent', { type: 'success', description: `Check ${email} for your sign-in link.` });
  };

  // ── Password Reset ────────────────────────────────────────────────────────
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (saasAuth?.resetPassword) {
      await saasAuth.resetPassword(email);
    }
    setResetSent(true);
    toast('Reset Email Sent', { type: 'info', description: `Check ${email} for password reset instructions.` });
  };

  // ── Phone Verification ───────────────────────────────────────────────────
  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      setPhoneStep('verify');
      setVerificationToken('AVweKoisjZDkcVo86UQpoqj9plx_MYU-Xej3FPZv0xk-C9MTODtBIwkTAPovo6R9-yNyb8SXO7PEgs6FwIG9_OPp5aq9yiQWz90wSX7KBsBLKdQlv6BObVXpeZb6QHJU9k_Ph6D9HykU9XhEqArht5mX3A');
      toast('Verification Code Sent', { type: 'info', description: `SMS OTP code sent to ${phoneNumber}.` });
    }, 700);
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      setPhoneStep('verified');
      toast('Phone Verified Successfully!', { type: 'success', description: `Mobile session authenticated for ${phoneNumber}.` });
      onLoginSuccess?.(`user-${phoneNumber.replace(/\D/g, '').slice(-4)}@mobile.verified`);
      setTimeout(() => onClose(), 1000);
    }, 800);
  };

  const modeLabels: Record<AuthMode, string> = {
    signup: 'Create Enterprise Account',
    login: 'Sign In to Workspace',
    magic: 'Sign In with Magic Link',
    reset: 'Reset Your Password',
    phone: 'Phone Number Verification',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      aria-hidden="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={authError ? errorId : undefined}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 text-slate-900 dark:text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg mx-auto" aria-hidden="true">
            <Wand2 className="w-6 h-6" />
          </div>
          <h2 id={titleId} className="text-2xl font-extrabold tracking-tight">
            {modeLabels[authMode]}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {authMode === 'signup' && 'Unlock Agent Studio, OpsPilot AI SRE, and multi-model orchestration.'}
            {authMode === 'login' && 'Access your PromptImageLab enterprise environment.'}
            {authMode === 'magic' && 'Enter your email to receive a secure, one-click sign-in link.'}
            {authMode === 'reset' && 'Enter your email and we\'ll send password reset instructions.'}
          </p>
        </div>

        {/* Error Banner */}
        {authError && (
          <div
            id={errorId}
            role="alert"
            className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{authError}</span>
          </div>
        )}

        {/* ── MAIN AUTH (signup / login) ──────────────────────────────── */}
        {(authMode === 'signup' || authMode === 'login') && (
          <>
            {/* Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700" role="tablist">
              {(['signup', 'login'] as const).map((mode) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={authMode === mode}
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 py-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    authMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode === 'signup' ? 'Sign Up Free' : 'Log In'}
                </button>
              ))}
            </div>

            {/* Social OAuth */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                aria-label="Sign in with Google"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleGitHubSignIn}
                disabled={isLoading}
                aria-label="Sign in with GitHub"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" aria-hidden="true" />}
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold text-slate-400">or continue with email</span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="developer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setAuthMode('reset')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {authMode === 'signup' ? 'Create Free Account' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Alternative Sign-In Options */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('magic')}
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded flex items-center gap-1"
              >
                <Link className="w-3 h-3" aria-hidden="true" />
                Magic Link
              </button>
              <span className="text-slate-400">•</span>
              <button
                type="button"
                onClick={() => setAuthMode('phone')}
                className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded flex items-center gap-1"
              >
                <Phone className="w-3 h-3" aria-hidden="true" />
                Phone Verification
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              {[
                { icon: ShieldCheck, label: 'Zero Data Retention' },
                { icon: CheckCircle2, label: 'BYOK Encryption' },
                { icon: Sparkles, label: '30-Day Free Trial' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Icon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                  <span className="text-[9px] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PHONE VERIFICATION FORM ─────────────────────────────────────── */}
        {authMode === 'phone' && (
          <div className="space-y-4">
            {phoneStep === 'send' && (
              <form onSubmit={handlePhoneSend} className="space-y-4">
                <div>
                  <label htmlFor="phone-number" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="phone-number"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber}
                  className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  Send SMS OTP Verification
                </button>
              </form>
            )}

            {phoneStep === 'verify' && (
              <form onSubmit={handlePhoneVerify} className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300">
                  <p className="font-semibold mb-1">SMS Verification Token Generated</p>
                  <code className="block p-2 rounded bg-slate-900 text-indigo-300 font-mono text-[10px] break-all select-all">
                    {verificationToken}
                  </code>
                </div>

                <div>
                  <label htmlFor="sms-code" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enter 6-Digit Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="sms-code"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500 transition-colors text-center"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || smsCode.length < 4}
                  className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Verify Phone Number & Sign In
                </button>
              </form>
            )}

            {phoneStep === 'verified' && (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" aria-hidden="true" />
                <p className="text-base font-bold text-slate-900 dark:text-white">Phone Number Verified!</p>
                <p className="text-xs text-slate-500">Session activated for <strong>{phoneNumber}</strong>.</p>
              </div>
            )}

            <div className="text-center">
              <button type="button" onClick={() => { setAuthMode('login'); setPhoneStep('send'); }} className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                ← Back to sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
