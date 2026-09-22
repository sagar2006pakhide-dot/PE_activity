import React, { createContext, useContext, useState, useEffect } from 'react';
import { FactCheckResult, HistoryItem, SavedCheck } from '../types';
import { apiService } from '../services/api';

export type NavTab = 
  | 'landing' 
  | 'dashboard' 
  | 'fact-checker' 
  | 'chatbot' 
  | 'news' 
  | 'history' 
  | 'saved' 
  | 'analytics' 
  | 'presentation' 
  | 'about' 
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface FactCheckContextType {
  activeNav: NavTab;
  setActiveNav: (tab: NavTab) => void;
  currentResult: FactCheckResult | null;
  setCurrentResult: (result: FactCheckResult | null) => void;
  isAnalyzing: boolean;
  analysisStepIndex: number;
  history: HistoryItem[];
  savedChecks: SavedCheck[];
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
  analyzeClaim: (text: string, inputType?: 'text' | 'url' | 'document' | 'image', url?: string) => Promise<FactCheckResult>;
  saveCheckWithNotes: (result: FactCheckResult, notes: string) => Promise<void>;
  deleteSavedCheck: (id: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  refreshSaved: () => Promise<void>;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const FactCheckContext = createContext<FactCheckContextType | undefined>(undefined);

const LOADING_STEPS = [
  'Extracting claims & statements',
  'Analyzing linguistic sentiment & tone',
  'Checking supporting scientific evidence',
  'Comparing cross-publisher sources',
  'Evaluating source credibility factors',
  'Synthesizing final explainable verdict',
];

export const FactCheckProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavTab>('landing');
  const [currentResult, setCurrentResult] = useState<FactCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedChecks, setSavedChecks] = useState<SavedCheck[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('truthlens_demo_mode') !== 'false';
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('truthlens_api_key') || '';
  });

  useEffect(() => {
    localStorage.setItem('truthlens_demo_mode', String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem('truthlens_api_key', apiKey);
  }, [apiKey]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshHistory = async () => {
    try {
      const res = await apiService.getHistory();
      if (res.success) setHistory(res.data);
    } catch {
      // Keep existing
    }
  };

  const refreshSaved = async () => {
    try {
      const res = await apiService.getSaved();
      if (res.success) setSavedChecks(res.data);
    } catch {
      // Keep existing
    }
  };

  useEffect(() => {
    refreshHistory();
    refreshSaved();
  }, []);

  const analyzeClaim = async (
    text: string, 
    inputType: 'text' | 'url' | 'document' | 'image' = 'text',
    url?: string
  ): Promise<FactCheckResult> => {
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    // Step animation ticker
    const interval = setInterval(() => {
      setAnalysisStepIndex(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const resp = await apiService.analyzeClaim({
        text,
        url,
        inputType,
        customApiKey: apiKey || undefined,
      });

      clearInterval(interval);
      setAnalysisStepIndex(LOADING_STEPS.length - 1);
      setCurrentResult(resp.data);
      addToast('Fact-check analysis completed successfully!', 'success');
      refreshHistory();
      return resp.data;
    } catch (err) {
      clearInterval(interval);
      const errMsg = err instanceof Error ? err.message : 'Error analyzing claim.';
      addToast(errMsg, 'error');
      throw err;
    } finally {
      setTimeout(() => setIsAnalyzing(false), 300);
    }
  };

  const saveCheckWithNotes = async (result: FactCheckResult, notes: string) => {
    try {
      await apiService.addSaved(result, notes);
      addToast('Check bookmarked to Saved Checks with your notes!', 'success');
      refreshSaved();
    } catch {
      addToast('Failed to save bookmark.', 'error');
    }
  };

  const deleteSavedCheck = async (id: string) => {
    try {
      await apiService.deleteSaved(id);
      addToast('Bookmark removed.', 'info');
      refreshSaved();
    } catch {
      addToast('Failed to delete bookmark.', 'error');
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await apiService.deleteHistoryItem(id);
      addToast('Item removed from history.', 'info');
      refreshHistory();
    } catch {
      addToast('Failed to delete history item.', 'error');
    }
  };

  const clearHistory = async () => {
    try {
      await apiService.clearHistory();
      addToast('All fact-check history cleared.', 'info');
      refreshHistory();
    } catch {
      addToast('Failed to clear history.', 'error');
    }
  };

  return (
    <FactCheckContext.Provider
      value={{
        activeNav,
        setActiveNav,
        currentResult,
        setCurrentResult,
        isAnalyzing,
        analysisStepIndex,
        history,
        savedChecks,
        toasts,
        addToast,
        removeToast,
        analyzeClaim,
        saveCheckWithNotes,
        deleteSavedCheck,
        deleteHistoryItem,
        clearHistory,
        refreshHistory,
        refreshSaved,
        isDemoMode,
        setIsDemoMode,
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </FactCheckContext.Provider>
  );
};

export const useFactCheck = () => {
  const context = useContext(FactCheckContext);
  if (!context) throw new Error('useFactCheck must be used within a FactCheckProvider');
  return context;
};
