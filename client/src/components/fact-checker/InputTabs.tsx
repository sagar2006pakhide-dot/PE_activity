import React, { useState, useRef } from 'react';
import { useFactCheck } from '../../context/FactCheckContext';
import { sampleClaims } from '../../utils/sampleClaims';
import { apiService } from '../../services/api';
import { 
  Type, Link2, UploadCloud, Sparkles, Trash2, FileText, 
  Image as ImageIcon, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const InputTabs: React.FC = () => {
  const { analyzeClaim, isAnalyzing, addToast } = useFactCheck();

  const [inputMode, setInputMode] = useState<'text' | 'url' | 'upload'>('text');
  const [claimText, setClaimText] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // File upload & OCR state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    let textToAnalyze = claimText.trim();

    if (inputMode === 'url') {
      if (!urlInput.trim()) {
        addToast('Please enter a valid news article URL.', 'warning');
        return;
      }
      analyzeClaim(urlInput.trim(), 'url', urlInput.trim());
      return;
    }

    if (inputMode === 'upload') {
      if (!extractedOcrText.trim() && !claimText.trim()) {
        addToast('Please upload a file or extract text before analyzing.', 'warning');
        return;
      }
      textToAnalyze = extractedOcrText.trim() || claimText.trim();
    }

    if (!textToAnalyze || textToAnalyze.length < 5) {
      addToast('Please enter a claim with at least 5 characters.', 'warning');
      return;
    }

    analyzeClaim(textToAnalyze, inputMode === 'upload' ? 'document' : inputMode);
  };

  const handleClear = () => {
    setClaimText('');
    setUrlInput('');
    setSelectedFile(null);
    setExtractedOcrText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('Input console cleared.', 'info');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const resp = await apiService.uploadFile(file);
      if (resp.success && resp.text) {
        setExtractedOcrText(resp.text);
        setClaimText(resp.text);
        addToast(`Successfully extracted text from ${file.name}!`, 'success');
      }
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to parse file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplySample = (sampleText: string) => {
    setInputMode('text');
    setClaimText(sampleText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Console Card */}
      <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden">
        
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-2 gap-2">
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'text'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Type size={16} />
            <span>Option A: Text / Claim</span>
          </button>

          <button
            onClick={() => setInputMode('url')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'url'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Link2 size={16} />
            <span>Option B: Article URL</span>
          </button>

          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'upload'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <UploadCloud size={16} />
            <span>Option C: Document & OCR</span>
          </button>
        </div>

        {/* Input Body */}
        <div className="p-6">
          {/* TAB A: Text */}
          {inputMode === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Enter headline, social media post, paragraph or claim:</span>
                <span>{claimText.length} characters</span>
              </div>
              <textarea
                value={claimText}
                onChange={e => setClaimText(e.target.value)}
                rows={5}
                placeholder="Paste a headline, claim, or article here to analyze for truthfulness, clickbait, and source evidence..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none leading-relaxed"
              />
            </div>
          )}

          {/* TAB B: URL */}
          {inputMode === 'url' && (
            <div className="space-y-4 py-2">
              <div className="text-xs text-slate-400 font-medium">
                Enter full URL of the online news report or claim:
              </div>
              <div className="relative">
                <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://news-outlet.com/article/headline-claim-report"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                TruthLens will fetch publisher metadata, extract core factual propositions, and cross-reference credible wire agencies.
              </p>
            </div>
          )}

          {/* TAB C: Upload & OCR */}
          {inputMode === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500/80 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isUploading ? 'Extracting Text with OCR...' : 'Click to Upload Document or Screenshot'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports TXT, PDF, DOCX, and Screenshots (PNG, JPG) with automatic OCR
                </p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                    <CheckCircle2 size={14} />
                    <span>Uploaded: {selectedFile.name}</span>
                  </div>
                )}
              </div>

              {extractedOcrText && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-brand-500">
                      <CheckCircle2 size={13} /> Text detected from uploaded file / image OCR:
                    </span>
                    <span>Editable preview</span>
                  </div>
                  <textarea
                    value={extractedOcrText}
                    onChange={e => {
                      setExtractedOcrText(e.target.value);
                      setClaimText(e.target.value);
                    }}
                    rows={4}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-100 dark:border-slate-800/80 mt-4">
            <button
              onClick={handleClear}
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isUploading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Sample Click Pills */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Test Cases (Click to load):
          </span>
          <span className="text-[11px] text-slate-400">Nuanced scenarios</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {sampleClaims.map(s => (
            <button
              key={s.id}
              onClick={() => handleApplySample(s.claim)}
              className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/60 hover:border-brand-500/50 hover:bg-brand-500/5 text-left transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {s.expectedVerdict}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-500 transition-colors line-clamp-1">
                {s.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                {s.claim}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
