import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useFactCheck } from '../../context/FactCheckContext';
import { 
  Sun, Moon, Bell, Search, Menu, X, Shield, Sparkles, User, 
  ChevronDown, LogOut, CheckCircle2, Bookmark
} from 'lucide-react';
import { NotificationModal } from './NotificationModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { activeNav, setActiveNav, isDemoMode, setIsDemoMode, analyzeClaim } = useFactCheck();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    setActiveNav('fact-checker');
    analyzeClaim(quickSearch.trim());
    setQuickSearch('');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => setActiveNav('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* Custom Shield + Check + AI Spark Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-9 h-9 drop-shadow-md group-hover:scale-105 transition-transform" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="nbShield" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="50%" stop-color="#4f46e5" />
                    <stop offset="100%" stop-color="#06b6d4" />
                  </linearGradient>
                </defs>
                <path d="M50 8L82 22V50C82 70 50 92 50 92C50 92 18 70 18 50V22L50 8Z" fill="url(#nbShield)" />
                <path d="M36 50L46 60L65 38" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M80 16L82 22L88 24L82 26L80 32L78 26L72 24L78 22Z" fill="#38bdf8" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  TruthLens<span className="text-brand-500">AI</span>
                </span>
                {isDemoMode && (
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 -mt-1 font-medium tracking-normal">
                Verify before you believe.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={quickSearch}
              onChange={e => setQuickSearch(e.target.value)}
              placeholder="Instant claim search or headline verification..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
              ↵ Enter
            </span>
          </form>
        </div>

        {/* Right Section: Actions + Theme + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode toggle pill */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              isDemoMode 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
            title="Toggle between Zero-Config Intelligent Demo Mode and Live API Engine"
          >
            <Sparkles size={13} />
            <span className="font-semibold">{isDemoMode ? 'Demo Active' : 'Live API Mode'}</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {effectiveTheme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  {user.isGuest && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      Guest Session
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setActiveNav('saved')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Bookmark size={14} />
                    <span>Saved Checks</span>
                  </button>
                  <button
                    onClick={() => setActiveNav('settings')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Shield size={14} />
                    <span>Settings & API Keys</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  {isAuthenticated ? (
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-xs text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 font-medium"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full px-4 py-2 text-left text-xs text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 flex items-center gap-2 font-medium"
                    >
                      <User size={14} />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
};
