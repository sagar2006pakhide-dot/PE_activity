import React from 'react';
import { 
  Sparkles, CheckCircle2, SplitSquareVertical, Database, 
  BotMessageSquare, History, AlertTriangle, FileText, ArrowUpRight 
} from 'lucide-react';
import { useFactCheck } from '../../context/FactCheckContext';

export const FeaturesGrid: React.FC = () => {
  const { setActiveNav } = useFactCheck();

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Deploys multi-layer natural language processing and semantic understanding to assess claim validity beyond simplistic binary true/false classifications.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      actionTab: 'fact-checker',
    },
    {
      title: 'Source Verification',
      description: 'Corroborates claims against authoritative archives, distinguishing between peer-reviewed journals, fact-checking networks, and unverified blogs.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      actionTab: 'fact-checker',
    },
    {
      title: 'Claim Decomposition',
      description: 'Deconstructs compound news articles and multi-sentence assertions into individual atomic claims, testing each independently with targeted evidence.',
      icon: SplitSquareVertical,
      color: 'from-purple-500 to-pink-600',
      actionTab: 'fact-checker',
    },
    {
      title: 'Evidence-Based Results',
      description: 'Categorizes references into "Supports Claim", "Contradicts Claim", and "Provides Context" to give readers a panoramic understanding of the topic.',
      icon: Database,
      color: 'from-cyan-500 to-blue-600',
      actionTab: 'fact-checker',
    },
    {
      title: 'Conversational Chatbot',
      description: 'Interact with TruthLens AI Assistant to probe specific doubts, query missing evidence, uncover suspicious wording, and request student-friendly summaries.',
      icon: BotMessageSquare,
      color: 'from-brand-500 to-purple-600',
      actionTab: 'chatbot',
    },
    {
      title: 'Persistent History & Bookmarks',
      description: 'Revisit previous checks, filter by verdict, and maintain a personalized research notebook with custom observations and timestamps.',
      icon: History,
      color: 'from-amber-500 to-orange-600',
      actionTab: 'history',
    },
    {
      title: 'Clickbait & Bias Detection',
      description: 'Pinpoints sensational buzzwords, all-caps hysteria, conspiracy tropes, and emotional manipulation tactics engineered for viral engagement.',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600',
      actionTab: 'fact-checker',
    },
    {
      title: 'Explainable AI (XAI)',
      description: 'Transparently reveals why an assessment was reached: linguistic cues, institutional consensus, and missing documentation in simple English.',
      icon: FileText,
      color: 'from-indigo-500 to-brand-600',
      actionTab: 'presentation',
    },
  ];

  return (
    <section className="py-16 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">
            Engineered For Truth & Transparency
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Misinformation Defense
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            TruthLens AI combines rigorous journalistic standards with cutting-edge linguistic algorithms to dismantle disinformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveNav(f.actionTab as any)}
                className="group p-6 rounded-2xl glass-card hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                    <span>{f.title}</span>
                    <ArrowUpRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                  <span>Explore module</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
