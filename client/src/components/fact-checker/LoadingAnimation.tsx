import React from 'react';
import { Sparkles, CheckCircle2, Loader2, Shield } from 'lucide-react';

interface LoadingAnimationProps {
  currentStepIndex: number;
}

const STEPS = [
  { title: 'Extracting claims & atomic assertions', desc: 'Parsing sentence syntax and factual statements' },
  { title: 'Analyzing linguistic sentiment & tone', desc: 'Detecting clickbait signals, emotional manipulation & hyperbole' },
  { title: 'Checking supporting scientific evidence', desc: 'Querying medical, astrophysical & institutional archives' },
  { title: 'Comparing cross-publisher sources', desc: 'Evaluating consensus among certified IFCN fact-checkers' },
  { title: 'Evaluating publisher credibility', desc: 'Assessing author transparency, citations & primary data' },
  { title: 'Synthesizing explainable AI verdict', desc: 'Formulating nuanced confidence and transparent reasoning' },
];

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ currentStepIndex }) => {
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl glass-card-glow border border-brand-500/30 text-center my-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Background Animated Pulse */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-cyan-400 to-purple-500 animate-pulse" />

      {/* Central Rotating AI Shield */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-brand-500/20 animate-ping opacity-30" />
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
          <Shield size={36} className="animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
        <Sparkles size={18} className="text-brand-500" />
        <span>TruthLens AI is Analyzing Claim...</span>
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
        Running multi-phase NLP cross-verification against verified factual corpora.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-6 mb-8 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 6 Step Indicators */}
      <div className="space-y-3 text-left max-w-lg mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500/40 shadow-sm'
                  : isDone
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-emerald-500/30'
                  : 'opacity-40 border-transparent'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone && <CheckCircle2 size={16} className="text-emerald-500" />}
                {isCurrent && <Loader2 size={16} className="text-brand-500 animate-spin" />}
                {!isDone && !isCurrent && (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
