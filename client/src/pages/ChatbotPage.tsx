import React from 'react';
import { BotMessageSquare, Info } from 'lucide-react';
import { ChatInterface } from '../components/chatbot/ChatInterface';
import { useFactCheck } from '../context/FactCheckContext';

export const ChatbotPage: React.FC = () => {
  const { currentResult } = useFactCheck();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <BotMessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            TruthLens AI Assistant
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Conversational fact-checking · Ask questions, probe claims, explore evidence
          </p>
        </div>
      </div>

      {/* Context Banner if fact check is active */}
      {currentResult && (
        <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20 flex items-start gap-2.5 text-xs">
          <Info size={16} className="text-brand-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Active Analysis Context: </span>
            <span className="text-slate-600 dark:text-slate-300">
              The chatbot has context for "{currentResult.inputClaim.substring(0, 80)}..." — verdict: {currentResult.verdict}. You can ask follow-up questions about this analysis.
            </span>
          </div>
        </div>
      )}

      <ChatInterface activeFactCheck={currentResult} />
    </div>
  );
};
