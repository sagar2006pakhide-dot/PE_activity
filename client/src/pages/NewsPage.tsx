import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import { apiService } from '../services/api';
import { useFactCheck } from '../context/FactCheckContext';
import { 
  Newspaper, Search, Loader2, ExternalLink, 
  ShieldCheck, ShieldAlert, Shield, RefreshCw, Rss
} from 'lucide-react';

const CATEGORIES = ['All', 'Health', 'Technology', 'Science', 'World'];

const RiskIcon: React.FC<{ risk?: 'Low' | 'Medium' | 'High' }> = ({ risk }) => {
  if (!risk) return null;
  if (risk === 'Low') return <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold"><ShieldCheck size={12} />Low Risk</span>;
  if (risk === 'High') return <span className="flex items-center gap-1 text-rose-500 text-[10px] font-bold"><ShieldAlert size={12} />High Risk</span>;
  return <span className="flex items-center gap-1 text-amber-500 text-[10px] font-bold"><Shield size={12} />Medium Risk</span>;
};

export const NewsPage: React.FC = () => {
  const { analyzeClaim, setActiveNav } = useFactCheck();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fetchNews = async (q?: string, cat?: string) => {
    setLoading(true);
    setError('');
    try {
      const resp = await apiService.getNews(q || '', cat !== 'All' ? cat : '');
      setNews(resp.data || []);
    } catch {
      setError('Unable to load news stream. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews('', category);
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(search, category);
  };

  const handleAnalyze = (article: NewsArticle) => {
    setActiveNav('fact-checker');
    analyzeClaim(article.headline + '. ' + article.summary, 'text');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
          <Newspaper size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            News Intelligence Feed
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Curated news stream with preliminary risk screening — click Analyze to deep-dive any headline
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for a news topic or claim..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => fetchNews(search, category)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
        <Rss size={14} className="shrink-0" />
        <span>Demo Mode: Showing curated sample news with preliminary AI risk scoring. Integrate a NewsAPI key in Settings for live feeds.</span>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 size={20} className="animate-spin text-brand-500" />
            <span className="text-sm font-medium">Loading news intelligence feed...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-rose-500 text-sm font-medium">{error}</p>
          <button onClick={() => fetchNews()} className="mt-3 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold">
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {news.map(article => (
            <div
              key={article.id}
              className="group p-5 rounded-2xl glass-card hover:shadow-xl hover:-translate-y-0.5 transition-all border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                    {article.category}
                  </span>
                  <RiskIcon risk={article.preliminaryRisk} />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-brand-500 transition-colors">
                  {article.headline}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {article.summary}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{article.source}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    title="Open source article"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleAnalyze(article)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold shadow-sm shadow-brand-500/20 transition-all active:scale-95"
                  >
                    Analyze
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
