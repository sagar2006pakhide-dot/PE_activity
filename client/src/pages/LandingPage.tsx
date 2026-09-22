import React from 'react';
import { Hero } from '../components/landing/Hero';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { StatsSection } from '../components/landing/StatsSection';
import { useFactCheck } from '../context/FactCheckContext';
import { Shield, GraduationCap, ArrowRight, Github } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveNav } = useFactCheck();

  return (
    <div className="min-h-screen">
      <Hero />
      <StatsSection />
      <FeaturesGrid />
      <HowItWorks />

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield size={28} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Start Verifying Today
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            TruthLens AI is free to explore. No API key required to experience the full intelligent demo mode with 6 rich pre-analyzed cases.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveNav('fact-checker')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-600 font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Start Fact Checking
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setActiveNav('presentation')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap size={18} />
              View College Project Module
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs space-y-2">
          <p className="text-slate-300 font-bold text-sm">TruthLens AI — Verify Before You Believe</p>
          <p>BTech CSE College Project · Built with React + TypeScript + Node.js + NLP Engine</p>
          <p className="text-slate-600 max-w-2xl mx-auto italic">
            TruthLens AI provides automated assessments based on available information and may make mistakes. Its results should not be treated as definitive proof. Always verify important information using reliable primary sources.
          </p>
        </div>
      </footer>
    </div>
  );
};
