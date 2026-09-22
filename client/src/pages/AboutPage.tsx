import React from 'react';
import { useFactCheck } from '../context/FactCheckContext';
import { Info, Shield, HelpCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveNav } = useFactCheck();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
          <Info size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">About & Ethics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Understanding fact-checking, misinformation, and responsible AI</p>
        </div>
      </div>

      {/* What is fake news */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <HelpCircle size={20} className="text-brand-500" />
          <span>What is Fake News & Misinformation?</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The term "fake news" encompasses a spectrum of false or misleading information—from completely fabricated stories and digitally manipulated imagery, to factually accurate information presented out of context or with selectively omitted counterevidence. 
          Misinformation is shared without intent to deceive; <em>disinformation</em> is deliberately engineered for political, commercial, or ideological manipulation.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Common categories include: <strong className="text-slate-800 dark:text-slate-100">satire misrepresented as fact</strong>, <strong className="text-slate-800 dark:text-slate-100">fabricated content</strong>, <strong className="text-slate-800 dark:text-slate-100">manipulated imagery and video</strong>, <strong className="text-slate-800 dark:text-slate-100">imposter accounts mimicking legitimate journalists</strong>, and <strong className="text-slate-800 dark:text-slate-100">misleading framing of credible research</strong>.
        </p>
      </div>

      {/* Why it matters */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Shield size={20} className="text-rose-500" />
          <span>Why Fact-Checking Matters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
          {[
            'Medical misinformation directly causes vaccine hesitancy, dangerous self-medication, and delayed treatment.',
            'Financial disinformation drives manipulative pump-and-dump schemes and investment fraud.',
            'Political misinformation erodes democratic trust and suppresses informed voter participation.',
            'Climate change denial based on fabricated research delays essential environmental policy.',
            'Viral emotional misinformation destabilizes public safety during crises and natural disasters.',
            'Deepfake media is increasingly weaponized for harassment, identity fraud, and political smearing.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
              <CheckCircle2 size={14} className="text-brand-500 mt-0.5 shrink-0" />
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How TruthLens works */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Sparkles size={20} className="text-brand-500" />
          <span>How TruthLens AI Works</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-center">
          {['Input', 'AI Analysis', 'Evidence Check', 'Cross-Reference', 'Explanation'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div className="px-3 py-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-bold text-xs whitespace-nowrap">
                {step}
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={16} className="text-slate-400 hidden sm:block rotate-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TruthLens AI does not simply categorize text as "fake" or "real." Instead, it decomposes complex claims into atomic propositions, evaluates each against credible reference databases, scores linguistic patterns for clickbait and emotional manipulation, and synthesizes a transparent, well-reasoned assessment with clear confidence indicators.
        </p>
      </div>

      {/* Mandatory Disclaimer Block */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
          <Shield size={18} />
          <span>Important Disclaimer</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">TruthLens AI provides automated assessments based on available information and may make mistakes.</strong> Artificial intelligence systems can be wrong, incomplete, or biased by the data they were trained on. Results should never be treated as definitive, legally binding, or medically authoritative proof. 
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Always verify important information using reliable primary or authoritative sources — including accredited peer-reviewed journals, established wire agencies (Reuters, AP, AFP), government bodies, and internationally recognized fact-checking organizations (PolitiFact, Snopes, FullFact, AFP Fact Check).
        </p>
        <button
          onClick={() => setActiveNav('fact-checker')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-500 transition-colors"
        >
          <Sparkles size={14} />
          Start Verifying Responsibly
        </button>
      </div>
    </div>
  );
};
