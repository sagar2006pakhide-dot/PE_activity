import React from 'react';
import { useFactCheck } from '../context/FactCheckContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, SearchCheck, TrendingUp, History, Bookmark,
  BarChart3, BotMessageSquare, Newspaper, Sparkles, ArrowRight,
  ShieldCheck, Calendar, Shield
} from 'lucide-react';
import { VerdictBadge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { history, savedChecks, currentResult, setCurrentResult, setActiveNav, analyzeClaim } = useFactCheck();
  const { user } = useAuth();

  const stats = {
    total: history.length,
    reliable: history.filter(h => h.verdict === 'Likely Reliable').length,
    false: history.filter(h => h.verdict === 'Likely False').length,
    misleading: history.filter(h => h.verdict === 'Potentially Misleading').length,
    verify: history.filter(h => h.verdict === 'Requires Verification').length,
    saved: savedChecks.length,
    avgConf: history.length > 0 ? Math.round(history.reduce((a, c) => a + c.confidence, 0) / history.length) : 0
  };

  const recentHistory = history.slice(0, 4);

  const quickActions = [
    { label: 'New Fact Check', desc: 'Analyze a headline or claim', icon: SearchCheck, tab: 'fact-checker', color: 'from-brand-500 to-brand-600' },
    { label: 'Ask AI Chatbot', desc: 'Investigate with the assistant', icon: BotMessageSquare, tab: 'chatbot', color: 'from-purple-500 to-brand-500' },
    { label: 'Browse News Feed', desc: 'Scan the latest headlines', icon: Newspaper, tab: 'news', color: 'from-rose-500 to-orange-500' },
    { label: 'View Analytics', desc: 'Your verification stats', icon: BarChart3, tab: 'analytics', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative">
          <p className="text-white/70 text-xs font-semibold mb-1">
            <Calendar className="inline w-3.5 h-3.5 mr-1" />
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-white/80 text-sm">
            You've analyzed <strong>{stats.total}</strong> claims and saved <strong>{stats.saved}</strong> bookmarks. Keep verifying facts!
          </p>
          <button
            onClick={() => setActiveNav('fact-checker')}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-600 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Shield size={16} />
            Start Fact Checking
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Checks', value: stats.total, color: 'text-brand-500' },
          { label: 'Reliable', value: stats.reliable, color: 'text-emerald-500' },
          { label: 'Misleading', value: stats.misleading, color: 'text-amber-500' },
          { label: 'False Claims', value: stats.false, color: 'text-rose-500' },
          { label: 'Avg Confidence', value: stats.avgConf > 0 ? `${stats.avgConf}%` : '–', color: 'text-purple-500' },
          { label: 'Saved Checks', value: stats.saved, color: 'text-cyan-500' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.tab}
                onClick={() => setActiveNav(action.tab as any)}
                className="group p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 hover:-translate-y-0.5 text-left transition-all shadow-sm hover:shadow-md"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{action.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Result if any */}
      {currentResult && (
        <div 
          className="p-5 rounded-2xl glass-card border border-brand-500/30 bg-brand-500/5 cursor-pointer hover:border-brand-500/60 transition-colors"
          onClick={() => setActiveNav('fact-checker')}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-brand-500" />
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Last Active Analysis</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">"{currentResult.inputClaim}"</p>
              <div className="mt-2 flex items-center gap-2">
                <VerdictBadge verdict={currentResult.verdict} size="sm" />
                <span className="text-xs text-slate-400">{currentResult.confidence}% confidence</span>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 shrink-0 mt-1" />
          </div>
        </div>
      )}

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Analyses</h2>
          <button onClick={() => setActiveNav('history')} className="text-xs font-semibold text-brand-500 hover:underline">
            View All
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <SearchCheck size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">No analyses yet. Start your first fact check!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentHistory.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/30 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                onClick={() => { setCurrentResult(item.result); setActiveNav('fact-checker'); }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <VerdictBadge verdict={item.verdict} size="sm" />
                    <span className="text-[11px] text-slate-400">{item.confidence}% · {new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">"{item.claim}"</p>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
