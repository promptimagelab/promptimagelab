"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Activity, 
  FileDigit,
  Lock,
  Menu,
  X,
  User,
  LogOut,
  Terminal,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b border-white/10 shrink-0 bg-black">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter uppercase">
          <div className="w-5 h-5 bg-white flex items-center justify-center">
            <Shield className="w-3 h-3 text-black" />
          </div>
          PROMPTIMAGELAB
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 bg-black">
        <div className="pt-4 pb-2 px-3 text-xs font-black text-zinc-600 uppercase tracking-widest">Network Ops</div>
        <NavItem href="/dashboard" icon={<Activity />} label="NOC Telemetry" active={pathname === "/dashboard"} />
        <NavItem href="/dashboard/proxy" icon={<Terminal />} label="Edge Proxy Config" active={pathname.startsWith("/dashboard/proxy")} />
        
        <div className="pt-8 pb-2 px-3 text-xs font-black text-zinc-600 uppercase tracking-widest">Governance</div>
        <NavItem href="/dashboard/arbitration" icon={<Shield />} label="Agent Arbitration" active={pathname.startsWith("/dashboard/arbitration")} />
        <NavItem href="/dashboard/policies" icon={<Lock />} label="AST Policies" active={pathname.startsWith("/dashboard/policies")} />
        <NavItem href="/dashboard/audit" icon={<FileDigit />} label="WORM Ledger" active={pathname.startsWith("/dashboard/audit")} />

        <div className="pt-8 pb-2 px-3 text-xs font-black text-zinc-600 uppercase tracking-widest">Integration</div>
        <NavItem href="/dashboard/playground" icon={<Terminal />} label="Interactive Playground" active={pathname.startsWith("/dashboard/playground")} />
        <NavItem href="/dashboard/integration" icon={<Terminal />} label="API Keys & Integration" active={pathname.startsWith("/dashboard/integration")} />
        <NavItem href="/dashboard/docs" icon={<Activity />} label="Developer Docs" active={pathname.startsWith("/dashboard/docs")} />
      </nav>
      
      <div className="p-4 border-t border-white/10 shrink-0 bg-black">
        <NavItem href="/dashboard/settings" icon={<Settings />} label="System Settings" active={pathname.startsWith("/dashboard/settings")} />
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-black text-zinc-100 font-mono selection:bg-white/30">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-black z-40 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-64 h-full bg-black border-r border-white/10 flex flex-col"
            >
              <button 
                className="absolute top-4 right-4 p-2 bg-white/5 text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen bg-black">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-zinc-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="hidden md:flex flex-1 items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 animate-pulse" /> EBPF INTERCEPTOR ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 ml-auto relative" ref={userMenuRef}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 bg-white text-black font-bold flex items-center justify-center text-sm"
            >
              CISO
            </motion.button>
            
            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-zinc-950 border border-white/10 shadow-2xl py-1 origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">CISO Account</p>
                    <p className="text-xs text-zinc-500 truncate">admin@veritas.local</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </div>
                  <div className="border-t border-white/10 py-1">
                    <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-red-500 hover:bg-white/10 w-full text-left transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative bg-black bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative flex items-center gap-3 px-3 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-colors ${
        active 
          ? "bg-white text-black" 
          : "text-zinc-500 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="relative z-10 flex items-center gap-3">
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" })}
        {label}
      </span>
    </Link>
  );
}
