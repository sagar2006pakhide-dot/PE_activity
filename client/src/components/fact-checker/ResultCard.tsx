import React, { useState } from 'react';
import { FactCheckResult } from '../../types';
import { VerdictBadge, RiskBadge } from '../common/Badge';
import { 
  Download, Bookmark, BotMessageSquare, Sparkles, Share2, 
  HelpCircle, ShieldCheck, ShieldAlert, Check, Copy 
} from 'lucide-react';
import { exportAnalysisToPdf } from '../../utils/exportPdf';
import { useFactCheck } from '../../context/FactCheckContext';
import { SaveNotesModal } from './SaveNotesModal';

interface ResultCardProps {
  result: FactCheckResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { setActiveNav, addToast } = useFactCheck();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `TruthLens AI Fact Check Assessment:\nClaim: "${result.inputClaim}"\nVerdict: ${result.verdict} (${result.confidence}% Confidence)\nSummary: ${result.summary}\n\nVerify before you believe: TruthLens AI.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Analysis summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = () => {
    exportAnalysisToPdf(result);
    addToast('PDF Report downloaded!', 'success');
  };

  const handleContinueToChat = () => {
    setActiveNav('chatbot');
  };

  // Confidence category
  let confLabel = 'High Confidence';
  let confColor = 'text-emerald-500';
  if (result.confidence <= 30) {
    confLabel = 'Low Confidence';
    confColor = 'text-rose-500';
  } else if (result.confidence <= 70) {
    confLabel = 'Moderate Confidence';
    confColor = 'text-amber-500';
  }

  return (
    <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner with Demo Mode & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            ID: {result.id}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span className="text-xs text-slate-400">
            {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {result.isDemoMode && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Demo Mode Active
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy summary"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Save with research notes"
          >
            <Bookmark size={14} />
            <span className="hidden sm:inline">Bookmark</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
            title="Download PDF Report"
          >
            <Download size={14} />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Claim Headline Callout */}
      <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Analyzed Claim:
        </p>
        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          "{result.inputClaim}"
        </p>
      </div>

      {/* Verdict & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* Main Verdict Badge */}
        <div className="md:col-span-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Verdict:
          </p>
          <div className="flex items-center gap-3">
            <VerdictBadge verdict={result.verdict} size="lg" />
            <RiskBadge risk={result.riskLevel} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Assessed using nuanced 4-tier truth verification scale.
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className="md:col-span-6 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                AI Confidence:
              </span>
              <span className={`text-xs font-extrabold ${confColor}`}>
                {result.confidence}% ({confLabel})
              </span>
            </div>
            <div className="group relative cursor-pointer">
              <HelpCircle size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl z-20 leading-tight">
                AI confidence indicates algorithm conviction based on available evidence density, not absolute physical certainty.
              </div>
            </div>
          </div>

          {/* Meter Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                result.verdict === 'Likely Reliable'
                  ? 'bg-emerald-500'
                  : result.verdict === 'Likely False'
                  ? 'bg-rose-500'
                  : result.verdict === 'Potentially Misleading'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 mt-2 italic">
            *AI confidence, not probability that the claim is true.
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="space-y-4 pt-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Executive Summary
          </h4>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {result.summary}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Detailed AI Reasoning
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            {result.detailedExplanation}
          </p>
        </div>
      </div>

      {/* Quick Launch Chatbot Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-cyan-500/10 border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-500/20">
            <BotMessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Have questions about this analysis?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continue investigating with TruthLens AI Assistant in real time.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinueToChat}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 shrink-0"
        >
          Ask Chatbot About This Claim
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 leading-relaxed italic">
        {result.disclaimer}
      </div>

      {/* Save Modal */}
      <SaveNotesModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        result={result}
      />
    </div>
  );
};
