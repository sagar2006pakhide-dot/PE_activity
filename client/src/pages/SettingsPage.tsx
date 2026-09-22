import React from 'react';
import { useFactCheck } from '../context/FactCheckContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings, Sun, Moon, Monitor, Key, Trash2, Download, User,
  ShieldCheck, Sparkles, Bell, Globe, Info, LogOut, ChevronRight
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, openAuthModal, logout, isAuthenticated } = useAuth();
  const { isDemoMode, setIsDemoMode, apiKey, setApiKey, clearHistory, addToast } = useFactCheck();

  const handleExportHistory = () => {
    const data = JSON.stringify({ exported: new Date().toISOString(), history: [] }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TruthLens_History_Export.json';
    a.click();
    addToast('History exported to JSON!', 'success');
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all fact-check history? This cannot be undone.')) {
      await clearHistory();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-lg">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customize TruthLens AI preferences and API configuration</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <User size={14} /> Profile
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shadow-sm">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={22} />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              {user.isGuest && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Guest Session
                </span>
              )}
            </div>
          </div>
          {isAuthenticated ? (
            <button onClick={logout} className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-500 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button onClick={() => openAuthModal('login')} className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Theme */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sun size={14} /> Theme
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', Icon: Sun },
            { id: 'dark', label: 'Dark', Icon: Moon },
            { id: 'system', label: 'System', Icon: Monitor },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id as any)}
              className={`p-3 rounded-2xl border text-sm font-semibold flex flex-col items-center gap-2 transition-all ${
                theme === id
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Mode */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Sparkles size={14} /> Intelligence Mode
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Demo Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
              Uses pre-configured verified NLP engine with 6 rich case studies. Clearly labels all results as demo assessments.
            </p>
          </div>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDemoMode ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDemoMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Key size={14} /> AI API Configuration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Providing a Google Gemini API key enables live, generative fact-checking and chatbot responses. Leave blank to use the intelligent built-in NLP engine.
        </p>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Google Gemini API Key (optional)</label>
          <div className="relative">
            <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {apiKey && (
            <p className="text-[11px] text-emerald-500 mt-1.5 font-semibold">✓ Gemini Live Mode will be used for analysis and chat</p>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <ShieldCheck size={14} /> Data & Privacy
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExportHistory}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download size={16} className="text-brand-500" />
              <span>Export History as JSON</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={handleClearAll}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-sm font-medium text-rose-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={16} />
              <span>Clear All History</span>
            </div>
            <ChevronRight size={16} className="opacity-50" />
          </button>
        </div>
      </div>

      {/* About */}
      <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
        <Info size={15} className="shrink-0 mt-0.5 text-slate-400" />
        <p>
          TruthLens AI v1.0.0 — BTech CSE Project · Built with React + TypeScript + Node.js + NLP Engine ·{' '}
          <em>Verify before you believe.</em>
        </p>
      </div>
    </div>
  );
};
