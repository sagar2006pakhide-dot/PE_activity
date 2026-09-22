import React from 'react';
import { useFactCheck } from '../../context/FactCheckContext';
import { sampleClaims } from '../../utils/sampleClaims';
import { 
  ShieldCheck, BotMessageSquare, Sparkles, ArrowRight, 
  Search, Shield, CheckCircle2, AlertTriangle, XCircle, HelpCircle
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveNav, analyzeClaim } = useFactCheck();

  const handleTestClaim = (text: string) => {
    setActiveNav('fact-checker');
    analyzeClaim(text);
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-cyan-500/15 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold shadow-sm">
              <Sparkles size={14} className="text-brand-500 animate-pulse" />
              <span>Verify before you believe</span>
              <span className="w-1 h-1 rounded-full bg-brand-400" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">BTech CSE College Project</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Detect Fake News with <span className="gradient-text">TruthLens AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Analyze news, verify claims, discover evidence, and understand what the facts really say. Powered by multi-layer NLP heuristics, source cross-referencing, and an interactive fact-checking assistant.
            </p>

            {/* Verdict Types Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                <CheckCircle2 size={13} /> 🟢 Likely Reliable
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                <AlertTriangle size={13} /> 🟡 Potentially Misleading
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium">
                <XCircle size={13} /> 🔴 Likely False
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                <HelpCircle size={13} /> 🔵 Requires Verification
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={() => setActiveNav('fact-checker')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
              >
                <ShieldCheck size={18} />
                <span>Check a Claim</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setActiveNav('chatbot')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <BotMessageSquare size={18} className="text-brand-500" />
                <span>Try AI Chatbot</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Visual Scanner & Demo Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Glowing Outer Card */}
              <div className="p-6 rounded-3xl glass-card-glow relative overflow-hidden">
                {/* Scanner Beam Animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse -translate-y-2 opacity-80" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs">Real-Time Fact Scanner</h3>
                      <p className="text-[10px] text-slate-400">Multi-source verification engine</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                    ACTIVE
                  </span>
                </div>

                {/* Simulated Analysis Scanner Feed */}
                <div className="py-4 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Analyzing statement:</span>
                      <span className="font-mono text-cyan-500 font-semibold">97% Conf</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                      "NASA satellite imagery fabricates Earth curvature using CGI..."
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold border border-rose-500/30">
                        🔴 Likely False
                      </span>
                      <span className="text-[10px] text-slate-400">3 Sources Cross-Checked</span>
                    </div>
                  </div>

                  {/* Micro Heuristic Gauges */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60">
                      <p className="text-[10px] text-slate-400">Clickbait Risk</p>
                      <p className="text-xs font-bold text-rose-500 mt-0.5">High (84%)</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60">
                      <p className="text-[10px] text-slate-400">Source Consensus</p>
                      <p className="text-xs font-bold text-emerald-500 mt-0.5">98% Match</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60">
                      <p className="text-[10px] text-slate-400">Model State</p>
                      <p className="text-xs font-bold text-brand-500 mt-0.5">Explainable</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Click to Test CTA */}
                <button
                  onClick={() => handleTestClaim(sampleClaims[0].claim)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search size={13} />
                  <span>Inspect This Sample in Fact Checker</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Live Demo Claim Pills Ticker */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center lg:text-left">
            Try Sample Fact-Checks With 1-Click:
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {sampleClaims.map(s => (
              <button
                key={s.id}
                onClick={() => handleTestClaim(s.claim)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-brand-500/50 hover:bg-brand-500/5 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2 transition-all shadow-sm group"
              >
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <span className="group-hover:text-brand-500 transition-colors truncate max-w-xs">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
