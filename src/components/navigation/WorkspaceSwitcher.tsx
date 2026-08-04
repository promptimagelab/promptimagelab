import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ChevronDown, Check, Plus, ShieldCheck, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  type: 'personal' | 'organization';
}

export const WorkspaceSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces] = useState<Workspace[]>([
    { id: 'ws-1', name: 'Acme AI Lab (Prod)', plan: 'Enterprise', type: 'organization' },
    { id: 'ws-2', name: 'Personal Studio', plan: 'Pro Developer', type: 'personal' },
    { id: 'ws-3', name: 'Staging Environment', plan: 'Team', type: 'organization' },
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
          {activeWorkspace.type === 'organization' ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none truncate max-w-[120px]">
            {activeWorkspace.name}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
            {activeWorkspace.plan}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-40 space-y-1"
            >
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Workspaces & Orgs
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left',
                    ws.id === activeWorkspace.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      {ws.type === 'organization' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              ))}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New Workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
