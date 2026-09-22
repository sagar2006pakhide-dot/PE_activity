import React from 'react';
import { useFactCheck } from '../context/FactCheckContext';
import { InputTabs } from '../components/fact-checker/InputTabs';
import { LoadingAnimation } from '../components/fact-checker/LoadingAnimation';
import { ResultCard } from '../components/fact-checker/ResultCard';
import { ClaimsBreakdown } from '../components/fact-checker/ClaimsBreakdown';
import { SourceVerification } from '../components/fact-checker/SourceVerification';
import { SourceCredibilityCard } from '../components/fact-checker/SourceCredibilityCard';
import { ClickbaitCard } from '../components/fact-checker/ClickbaitCard';
import { ExplainableAICard } from '../components/fact-checker/ExplainableAICard';
import { SearchCheck, Sparkles } from 'lucide-react';

export const FactCheckerPage: React.FC = () => {
  const { isAnalyzing, analysisStepIndex, currentResult } = useFactCheck();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <SearchCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fact Checker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Multi-source AI claim verification with explainable verdict reasoning
          </p>
        </div>
      </div>

      {/* Input Console */}
      {!isAnalyzing && <InputTabs />}

      {/* Loading Animation */}
      {isAnalyzing && <LoadingAnimation currentStepIndex={analysisStepIndex} />}

      {/* Results */}
      {!isAnalyzing && currentResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ResultCard result={currentResult} />

          {currentResult.claimsBreakdown && currentResult.claimsBreakdown.length > 0 && (
            <ClaimsBreakdown claims={currentResult.claimsBreakdown} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClickbaitCard clickbait={currentResult.clickbait} />
            <SourceCredibilityCard credibility={currentResult.sourceCredibility} />
          </div>

          {currentResult.sources && currentResult.sources.length > 0 && (
            <SourceVerification sources={currentResult.sources} isDemoMode={currentResult.isDemoMode} />
          )}

          <ExplainableAICard factors={currentResult.explainableAI} />
        </div>
      )}

      {/* Empty/Intro state when no result loaded */}
      {!isAnalyzing && !currentResult && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Sparkles size={30} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Ready to Analyze
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Select a sample claim above, paste your own headline, or upload a document to start the multi-source AI verification process.
          </p>
        </div>
      )}
    </div>
  );
};
