import React from 'react';
import { SourceCredibilityOverview } from '../../types';
import { ShieldCheck, UserCheck, CheckCircle2, FileText, Database, HelpCircle } from 'lucide-react';

interface SourceCredibilityCardProps {
  credibility: SourceCredibilityOverview;
}

export const SourceCredibilityCard: React.FC<SourceCredibilityCardProps> = ({ credibility }) => {
  const metrics = [
    { label: 'Source Transparency', score: credibility.sourceTransparency, icon: ShieldCheck, desc: 'Disclosure of editorial board, funding & corrections policy' },
    { label: 'Author Attribution', score: credibility.authorInformation, icon: UserCheck, desc: 'Verifiable journalist, scientist, or academic qualifications' },
    { label: 'Cross-Source Agreement', score: credibility.crossSourceAgreement, icon: CheckCircle2, desc: 'Degree of consensus with independent accredited reporting' },
    { label: 'Primary Source Ratio', score: credibility.primarySourceRatio, icon: Database, desc: 'Reliance on original datasets rather than secondary hearsay' },
    { label: 'Citation Quality', score: credibility.citationQuality, icon: FileText, desc: 'Inclusion of verifiable academic DOIs or government archives' },
  ];

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Source Credibility Diagnostics
            </h3>
            <p className="text-xs text-slate-500">
              Heuristic verification indicators evaluated across supporting documentation.
            </p>
          </div>
        </div>

        <div className="group relative cursor-pointer">
          <HelpCircle size={16} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl z-20 leading-tight">
            These metrics represent algorithmic heuristic benchmarks, not subjective moral judgments.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <m.icon size={15} className="text-brand-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {m.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.score >= 80 ? 'bg-emerald-500' : m.score >= 55 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${m.score}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Narrative Synthesis */}
      <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-800 dark:text-slate-100">Algorithmic Assessment: </span>
        {credibility.summary}
      </div>
    </div>
  );
};
