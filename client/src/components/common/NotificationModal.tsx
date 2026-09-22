import React from 'react';
import { Bell, X, ShieldAlert, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { useFactCheck } from '../../context/FactCheckContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { setActiveNav, analyzeClaim } = useFactCheck();

  if (!isOpen) return null;

  const alerts = [
    {
      id: 'a1',
      type: 'warning',
      title: 'Trending Misinformation Alert',
      message: 'Unverified claims regarding light bulb surveillance are circulating on tech message boards.',
      time: '12m ago',
      claimToTest: 'Leaked Internal Memo Claims Tech Giant Secretly Listening Through Light Bulbs!'
    },
    {
      id: 'a2',
      type: 'update',
      title: 'Model Database Updated',
      message: 'Added 48 new peer-reviewed reference citations in cardiovascular and metabolic medicine.',
      time: '2h ago'
    },
    {
      id: 'a3',
      type: 'alert',
      title: 'High Clickbait Spike Detected',
      message: 'Increased density of miracle-cure supplement scams detected across social network ads.',
      time: '5h ago',
      claimToTest: 'SHOCKING: Secret fruit that Big Pharma wants BANNED cures aging in 48 hours!'
    }
  ];

  const handleTest = (claimText: string) => {
    setActiveNav('fact-checker');
    analyzeClaim(claimText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notifications & Alerts</h3>
              <p className="text-xs text-slate-500">Live intelligence updates from TruthLens</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
          {alerts.map(a => (
            <div 
              key={a.id} 
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {a.type === 'alert' && <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />}
                {a.type === 'warning' && <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />}
                {a.type === 'update' && <Sparkles size={16} className="text-brand-500 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{a.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{a.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{a.message}</p>
                  {a.claimToTest && (
                    <button
                      onClick={() => handleTest(a.claimToTest!)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                    >
                      <span>Analyze This Claim</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <button 
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
