import React from 'react';
import { useFactCheck, NavTab } from '../../context/FactCheckContext';
import { 
  LayoutDashboard, SearchCheck, BotMessageSquare, Newspaper, History, 
  Bookmark, BarChart3, GraduationCap, Cpu, Info, Settings, Sparkles, ChevronRight, X, LucideIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeNav, setActiveNav, history, savedChecks } = useFactCheck();

  const navItems: { id: NavTab; label: string; icon: LucideIcon; badge?: number | string; highlight?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fact-checker', label: 'Fact Checker', icon: SearchCheck, highlight: true },
    { id: 'chatbot', label: 'AI Chatbot', icon: BotMessageSquare },
    { id: 'news', label: 'News Search', icon: Newspaper },
    { id: 'history', label: 'History', icon: History, badge: history.length },
    { id: 'saved', label: 'Saved Checks', icon: Bookmark, badge: savedChecks.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'presentation', label: 'Project Viva / Demo', icon: GraduationCap, badge: 'CSE' },
    { id: 'about', label: 'About & Ethics', icon: Info },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavTab) => {
    setActiveNav(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200" 
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Mobile close header */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Menu</span>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-white' : item.highlight ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: College Project viva quick pill */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div 
            onClick={() => handleNavClick('presentation')}
            className="p-3 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-cyan-500/10 border border-brand-500/20 hover:border-brand-500/40 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                  <GraduationCap size={14} />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                  BTech CSE Viva
                </span>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
              System Architecture, NLP Pipeline & Evaluation
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
