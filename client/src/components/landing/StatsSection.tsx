import React from 'react';
import { SearchCheck, Globe2, Users, Award, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '24,800+',
      label: 'Claims Analyzed',
      sublabel: 'Across politics, health, and tech',
      icon: SearchCheck,
      color: 'text-indigo-500',
    },
    {
      value: '140+',
      label: 'Sources Cross-Checked',
      sublabel: 'Academic, medical & news archives',
      icon: Globe2,
      color: 'text-cyan-500',
    },
    {
      value: '12,400+',
      label: 'Users & Students Helped',
      sublabel: 'Promoting digital media literacy',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      value: '94.8%',
      label: 'Heuristic Consensus',
      sublabel: 'Benchmark cross-validation accuracy',
      icon: Award,
      color: 'text-emerald-500',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with Clear Academic Demo Label */}
        <div className="flex items-center justify-center gap-2 mb-10 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 max-w-fit mx-auto px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60">
          <ShieldCheck size={14} className="text-brand-500" />
          <span>Notice: Metrics below represent simulated benchmark test data for college project demonstration.</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl glass-card text-center hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-700 dark:text-slate-200">
                  <Icon size={20} className={s.color} />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {s.label}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {s.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
