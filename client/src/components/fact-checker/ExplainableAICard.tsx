import React from 'react';
import { ExplainableFactors } from '../../types';
import { Cpu, CheckCircle2, XCircle, AlertTriangle, HelpCircle, MessageSquare, Info } from 'lucide-react';

interface ExplainableAICardProps {
  factors: ExplainableFactors;
}

export const ExplainableAICard: React.FC<ExplainableAICardProps> = ({ factors }) => {
  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
          <Cpu size={20} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Why Did TruthLens AI Reach This Result?
          </h3>
          <p className="text-xs text-slate-500">
            Transparent explainability audit showing the factors driving the verdict assessment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Evidence Found */}
        {factors.evidenceFound.length > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={15} />
              <span>Supporting Evidence Identified ({factors.evidenceFound.length})</span>
            </div>
            <ul className="space-y-1.5">
              {factors.evidenceFound.map((e, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contradicting Evidence */}
        {factors.contradictingEvidence.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-rose-600 dark:text-rose-400">
              <XCircle size={15} />
              <span>Contradicting Evidence ({factors.contradictingEvidence.length})</span>
            </div>
            <ul className="space-y-1.5">
              {factors.contradictingEvidence.map((e, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Linguistic Patterns */}
        {factors.linguisticPatterns.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle size={15} />
              <span>Language Pattern Flags ({factors.linguisticPatterns.length})</span>
            </div>
            <ul className="space-y-1.5">
              {factors.linguisticPatterns.map((p, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Information */}
        {factors.missingInformation.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <HelpCircle size={15} />
              <span>Missing / Unverified Information</span>
            </div>
            <ul className="space-y-1.5">
              {factors.missingInformation.map((m, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Source Agreement */}
      {factors.sourceAgreement && (
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <MessageSquare size={15} className="text-brand-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100">Cross-Source Agreement: </span>
            {factors.sourceAgreement}
          </div>
        </div>
      )}

      {/* XAI Disclaimer */}
      <div className="mt-4 p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-2 text-[11px] text-slate-500 italic">
        <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
        <span>
          These explanatory factors represent the algorithmic reasoning pathway and linguistic feature weights used by TruthLens AI's NLP engine. They are indicators, not definitive forensic conclusions.
        </span>
      </div>
    </div>
  );
};
