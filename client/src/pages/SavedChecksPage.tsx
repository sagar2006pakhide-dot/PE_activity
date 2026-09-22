import React, { useState } from 'react';
import { useFactCheck } from '../context/FactCheckContext';
import { VerdictBadge } from '../components/common/Badge';
import { 
  Bookmark, Trash2, Edit3, Eye, Save, X, StickyNote, Calendar
} from 'lucide-react';
import { apiService } from '../services/api';

export const SavedChecksPage: React.FC = () => {
  const { savedChecks, deleteSavedCheck, setCurrentResult, setActiveNav, refreshSaved, addToast } = useFactCheck();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  const handleView = (item: typeof savedChecks[0]) => {
    setCurrentResult(item.result);
    setActiveNav('fact-checker');
  };

  const handleDelete = async (id: string) => {
    await deleteSavedCheck(id);
  };

  const startEditing = (id: string, currentNotes: string) => {
    setEditingId(id);
    setNotesDraft(currentNotes);
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await apiService.updateSavedNotes(id, notesDraft);
      addToast('Research notes updated!', 'success');
      refreshSaved();
    } catch {
      addToast('Failed to save notes.', 'error');
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-brand-500 flex items-center justify-center text-white shadow-lg">
          <Bookmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Checks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {savedChecks.length} bookmarked analyses with personal research notes
          </p>
        </div>
      </div>

      {savedChecks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Bookmark size={26} className="text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-1">No Saved Checks</h3>
          <p className="text-xs text-slate-500">
            Bookmark any fact-check analysis using the Bookmark button in the Fact Checker to save it here with custom notes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedChecks.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/30 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <VerdictBadge verdict={item.verdict} size="sm" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar size={11} />
                      Saved {new Date(item.savedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    "{item.claim}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleView(item)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-all"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => startEditing(item.id, item.notes)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-500 hover:border-brand-500/30 transition-colors"
                    title="Edit notes"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Notes section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <StickyNote size={12} className="text-brand-500" />
                  <span>Research Notes</span>
                </div>

                {editingId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={notesDraft}
                      onChange={e => setNotesDraft(e.target.value)}
                      placeholder="Enter your research observations..."
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Save size={12} />
                        <span>Save Notes</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <X size={12} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-xs text-slate-600 dark:text-slate-300 italic cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                    onClick={() => startEditing(item.id, item.notes)}
                  >
                    {item.notes || 'Click to add research notes...'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
