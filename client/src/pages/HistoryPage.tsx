import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { useFactCheck } from '../context/FactCheckContext';
import { apiService } from '../services/api';
import { VerdictBadge } from '../components/common/Badge';
import { 
  History, Search, Trash2, Eye, Loader2, Calendar,
  CheckCircle2, AlertTriangle, XCircle, HelpCircle, Shield
} from 'lucide-react';

const VERDICT_FILTERS = ['All', 'Likely Reliable', 'Potentially Misleading', 'Likely False', 'Requires Verification'];

export const HistoryPage: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, setCurrentResult, setActiveNav } = useFactCheck();
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    let items = [...history];

    if (verdictFilter !== 'All') {
      items = items.filter(h => h.verdict === verdictFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(h => h.claim.toLowerCase().includes(q));
    }

    setFilteredHistory(items);
  }, [history, verdictFilter, search]);

  const handleView = (item: HistoryItem) => {
    setCurrentResult(item.result);
    setActiveNav('fact-checker');
  };

  const handleDelete = async (id: string) => {
    await deleteHistoryItem(id);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all your fact-check history? This cannot be undone.')) {
      await clearHistory();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fact-Check History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {history.length} total analyses · sorted by most recent first
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your fact-check history..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {VERDICT_FILTERS.map(vf => (
            <button
              key={vf}
              onClick={() => setVerdictFilter(vf)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                verdictFilter === vf
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {vf === 'All' ? 'All' : vf}
            </button>
          ))}
        </div>
      </div>

      {/* History Table / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <History size={26} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-1">No History Found</h3>
          <p className="text-xs text-slate-500">
            {search || verdictFilter !== 'All' ? 'No results match your current filters.' : 'Start fact-checking to build your analysis history.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <VerdictBadge verdict={item.verdict} size="sm" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.confidence}% conf · {item.sourcesCount} sources
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    "{item.claim}"
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleView(item)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Eye size={13} />
                    <span>View Analysis</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors"
                    title="Delete from history"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
