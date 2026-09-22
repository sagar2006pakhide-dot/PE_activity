import React from 'react';
import { Type, Cpu, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { useFactCheck } from '../../context/FactCheckContext';

export const HowItWorks: React.FC = () => {
  const { setActiveNav } = useFactCheck();

  const steps = [
    {
      num: '01',
      title: 'Enter a Claim',
      description: 'Paste a news headline, full article text, webpage URL, or upload a document/screenshot for automatic OCR text extraction.',
      icon: Type,
    },
    {
      num: '02',
      title: 'AI Analyzes Syntax & Tone',
      description: 'NLP models segment complex narratives into atomic propositions, parsing emotional bias, clickbait patterns, and subjective hype.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Cross-Checking Evidence',
      description: 'The engine cross-references statements against peer-reviewed journals, institutional archives, and certified fact-check databases.',
      icon: Search,
    },
    {
      num: '04',
      title: 'Get Explained Results',
      description: 'Receive a nuanced verdict (Reliable, Misleading, False, Requires Verification), source credibility metrics, and chatbot inquiry access.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            Intuitive 4-Step Verification
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            How TruthLens AI Works
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            From raw online claim to empirical clarity in seconds through an explainable academic verification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div className="p-6 rounded-2xl glass-card h-full flex flex-col justify-between border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                        <Icon size={20} />
                      </div>
                      <span className="text-2xl font-extrabold text-slate-300 dark:text-slate-700 font-mono">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[11px] font-semibold text-brand-500">
                    <span>Stage {idx + 1}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveNav('fact-checker')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
          >
            <span>Try It Yourself</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
