/**
 * NotificationCenter — Real-Time Notification Center Drawer & Dropdown
 * 
 * Features:
 * - Real-time notification inbox with unread counter badge
 * - Filter by category (All, Security, System, Billing)
 * - Mark as read / Mark all as read
 * - Direct navigation links to relevant platform routes
 */

import React, { useState } from 'react';
import { Bell, CheckCheck, X, ShieldAlert, Sparkles, CreditCard, Info, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';

export interface NotificationItem {
  id: string;
  type: 'info' | 'security' | 'system' | 'billing';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'security',
    title: 'OWASP Security Audit Complete',
    message: 'Zero prompt injection vulnerabilities detected in active Studio prompt templates.',
    timestamp: '10 min ago',
    isRead: false,
    actionRoute: 'admin',
  },
  {
    id: 'n-2',
    type: 'billing',
    title: '30-Day Free Trial Activated',
    message: 'Your enterprise trial includes unlimited prompt optimizations & OpsPilot telemetry.',
    timestamp: '2 hours ago',
    isRead: false,
    actionRoute: 'pricing',
  },
  {
    id: 'n-3',
    type: 'system',
    title: 'Google Gemini 1.5 Flash Provider Active',
    message: 'API key successfully validated for Gemini high-throughput execution stream.',
    timestamp: '1 day ago',
    isRead: true,
    actionRoute: 'connections',
  },
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'security' | 'billing'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'security') return n.type === 'security';
    if (activeFilter === 'billing') return n.type === 'billing';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'billing': return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'system': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4 sm:pr-8 bg-slate-950/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-extrabold tracking-tight">Notifications</h3>
            {unreadCount > 0 && <Badge variant="indigo">{unreadCount} New</Badge>}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold overflow-x-auto">
          {(['all', 'unread', 'security', 'billing'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                activeFilter === cat ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No notifications found.
            </div>
          ) : (
            filtered.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markRead(n.id);
                  if (n.actionRoute && onNavigate) {
                    onNavigate(n.actionRoute);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-colors cursor-pointer space-y-1 ${
                  !n.isRead
                    ? 'bg-indigo-50/70 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    {getIcon(n.type)}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {n.message}
                </p>
                {n.actionRoute && (
                  <div className="pl-6 pt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
