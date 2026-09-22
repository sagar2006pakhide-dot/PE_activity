import React, { useState } from 'react';
import { VerifiedSource, SourceCategory } from '../../types';
import { SourceCategoryBadge } from '../common/Badge';
import { 
  Globe2, ExternalLink, CheckCircle2, ShieldCheck, 
  Calendar, Building2, UserCheck, FileCheck, Info 
} from 'lucide-react';

interface SourceVerificationProps {
  sources: VerifiedSource[];
  isDemoMode: boolean;
}

export const SourceVerification: React.FC<SourceVerificationProps> = ({ sources, isDemoMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | SourceCategory>('All');

  const filteredSources = selectedCategory === 'All'
    ? sources
    : sources.filter(s => s.category === selectedCategory);

  const categories: ('All' | SourceCategory)[] = ['All', 'Supports Claim', 'Contradicts Claim', 'Provides Context'];

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Globe2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Source Verification & Evidence Base
              </h3>
              {isDemoMode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Demo Evidence
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Cross-referenced against academic, governmental, and certified fact-checking archives.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isDemoMode && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Info size={16} className="shrink-0" />
          <span>
            Demo Mode: These references represent vetted sample records for simulation. Live API keys can be configured in Settings for real-time web scraping.
          </span>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSources.map(src => (
          <div
            key={src.id}
            className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col justify-between hover:border-brand-500/40 transition-all"
          >
            <div>
              {/* Header: Publisher & Category */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {src.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 font-medium">
                    {src.publisherType}
                  </span>
                </div>
                <SourceCategoryBadge category={src.category} />
              </div>

              {/* Title & Link */}
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="group text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-start gap-1 leading-snug mb-2"
              >
                <span>{src.title}</span>
                <ExternalLink size={13} className="shrink-0 mt-1 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 mb-3">
                "{src.snippet}"
              </p>
            </div>

            {/* Credibility Checklist & Date */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                {src.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {src.date}
                  </span>
                )}
                <span className="flex items-center gap-1 font-semibold text-emerald-500">
                  <ShieldCheck size={13} />
                  Reliability: {src.reliabilityScore}%
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                {src.credibilityFactors.authorAttribution && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Byline Cited
                  </span>
                )}
                {src.credibilityFactors.peerReviewedOrFactChecked && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                    Peer Reviewed / IFCN
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
