import React from 'react';
import { ClickbaitAnalysis } from '../../types';
import { AlertTriangle, ShieldCheck, Flame, CheckCircle, HelpCircle } from 'lucide-react';

interface ClickbaitCardProps {
  clickbait: ClickbaitAnalysis;
}

export const ClickbaitCard: React.FC<ClickbaitCardProps> = ({ clickbait }) => {
  let riskColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  let barColor = 'bg-emerald-500';

  if (clickbait.risk === 'High') {
    riskColor = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    barColor = 'bg-rose-500';
  } else if (clickbait.risk === 'Medium') {
    riskColor = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Clickbait & Sensation Detector
            </h3>
            <p className="text-xs text-slate-500">
              Linguistic audit for emotional manipulation, urgency hooks, and curiosity gaps.
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${riskColor}`}>
          Risk: {clickbait.risk} ({clickbait.score}/100)
        </span>
      </div>

      {/* Meter Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
          <span>Emotional Sensationalism Intensity</span>
          <span className="font-mono">{clickbait.score}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} transition-all duration-500 rounded-full`} style={{ width: `${clickbait.score}%` }} />
        </div>
      </div>

      {/* Detected Signals List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Detected Linguistic Markers:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {clickbait.signalsDetected.map((sig, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
            >
              {clickbait.risk === 'High' ? (
                <AlertTriangle size={14} className="text-rose-500 shrink-0" />
              ) : (
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
              )}
              <span className="truncate">{sig}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <span className="font-bold text-slate-800 dark:text-slate-100">Stylistic Analysis: </span>
        {clickbait.explanation}
      </div>
    </div>
  );
};
