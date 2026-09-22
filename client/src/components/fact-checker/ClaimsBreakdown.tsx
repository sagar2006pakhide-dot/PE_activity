import React, { useState } from 'react';
import { SubClaim } from '../../types';
import { VerdictBadge } from '../common/Badge';
import { ChevronDown, ChevronUp, SplitSquareVertical, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ClaimsBreakdownProps {
  claims: SubClaim[];
}

export const ClaimsBreakdown: React.FC<ClaimsBreakdownProps> = ({ claims }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [claims[0]?.id || '']: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!claims || claims.length === 0) return null;

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
          <SplitSquareVertical size={20} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Claim-by-Claim Atomic Decomposition
          </h3>
          <p className="text-xs text-slate-500">
            Evaluating individual assertions independently to expose mixed misinformation.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {claims.map((sub, idx) => {
          const isExpanded = !!expandedIds[sub.id];

          return (
            <div
              key={sub.id}
              className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(sub.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                      "{sub.claim}"
                    </p>
                    <div className="flex items-center gap-2">
                      <VerdictBadge verdict={sub.verdict} size="sm" />
                      <span className="text-[11px] text-slate-400 font-mono">
                        {sub.confidence}% Conviction
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
                  {/* Evidence Found */}
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      <CheckCircle2 size={14} />
                      <span>Evidence & Fact Analysis:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sub.evidence}
                    </p>
                  </div>

                  {/* Counter Evidence / Flags */}
                  {sub.counterEvidence && (
                    <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 mb-1">
                        <XCircle size={14} />
                        <span>Counter-Evidence & Discrepancies:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {sub.counterEvidence}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
