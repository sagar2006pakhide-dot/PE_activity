import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FactCheckResult } from '../../types';
import { apiService } from '../../services/api';
import { useFactCheck } from '../../context/FactCheckContext';
import { 
  BotMessageSquare, Send, User, Loader2, Copy, RefreshCw, 
  Trash2, Plus, ThumbsUp, ThumbsDown, Sparkles, AlertCircle
} from 'lucide-react';

interface ChatInterfaceProps {
  activeFactCheck: FactCheckResult | null;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'assistant',
  content: `**Hi! I'm TruthLens AI Assistant.** 👋\n\nSend me a news claim, headline, article, or question and I'll help you evaluate the available evidence.\n\nYou can ask me things like:\n- *"Is this claim true or false?"*\n- *"Why is this suspicious?"*\n- *"What evidence contradicts this?"*\n- *"Is this headline clickbait?"*\n- *"Explain this in simple language"*\n\n**Note:** My assessments are based on available AI analysis. For critical decisions, always verify with primary academic or institutional sources.`,
  timestamp: new Date().toISOString(),
  suggestedFollowUps: [
    'The Earth is flat and NASA fakes space images',
    'Why is Big Pharma hiding cancer cures?',
    'Explain how to identify fake news',
    'What makes a headline clickbait?'
  ]
};

const SUGGESTED_PROMPTS = [
  'Is this news claim true?',
  'Why is this claim suspicious?',
  'What evidence contradicts this?',
  'What evidence supports this?',
  'Is this headline clickbait?',
  'Explain this in simple language for students',
  'Find reliable peer-reviewed sources',
  'What information is missing?',
  'Summarize this article',
  'What are conflicting reports about this?'
];

// Simple markdown renderer for bold/italic/bullets
const renderMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n- /g, '\n• ')
    .replace(/\n/g, '<br/>');
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeFactCheck }) => {
  const { addToast } = useFactCheck();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await apiService.sendChatMessage({
        message: trimmed,
        history: messages.slice(-6),
        currentFactCheck: activeFactCheck
      });

      if (resp.success && resp.data) {
        setMessages(prev => [...prev, resp.data]);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: 'I encountered a temporary issue processing your question. Please try again. If this persists, check the Settings to ensure the backend server is running.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRegenerate = async () => {
    const lastUser = [...messages].reverse().find(m => m.sender === 'user');
    if (!lastUser) return;
    setMessages(prev => prev.filter(m => m.id !== prev[prev.length - 1].id));
    await sendMessage(lastUser.content);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast('Message copied to clipboard!', 'success');
  };

  const handleNewConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    addToast('New conversation started.', 'info');
  };

  return (
    <div className="flex flex-col h-[700px] rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <BotMessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">TruthLens AI Assistant</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online · Fact-checking mode {activeFactCheck ? '· Context loaded' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFactCheck && (
            <span className="hidden sm:inline-flex text-[11px] px-2.5 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-semibold">
              Claim Context Active
            </span>
          )}
          <button
            onClick={handleNewConversation}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Start new conversation"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={() => setMessages([WELCOME_MESSAGE])}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
            )}

            <div className={`max-w-[85%] group relative ${msg.sender === 'user' ? 'order-first' : ''}`}>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200/60 dark:border-slate-700/60'
              }`}>
                <div 
                  className="prose-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              </div>

              {/* Timestamp & Actions */}
              <div className={`flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleCopyMessage(msg.content)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Copy">
                      <Copy size={11} />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Helpful">
                      <ThumbsUp size={11} />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Not helpful">
                      <ThumbsDown size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* Confidence Note */}
              {msg.confidenceNote && (
                <p className="mt-1 px-1 text-[11px] text-slate-400 italic leading-snug max-w-xs">
                  {msg.confidenceNote}
                </p>
              )}

              {/* Suggested Follow-ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-brand-500/30 text-brand-600 dark:text-brand-400 hover:bg-brand-500/5 font-medium transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles size={16} />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 p-3.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 size={16} className="text-brand-500 animate-spin" />
              <span className="text-xs text-slate-500">TruthLens AI is analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Strip */}
      <div className="px-4 pb-2 overflow-x-auto shrink-0">
        <div className="flex gap-2 pb-1">
          {SUGGESTED_PROMPTS.slice(0, 5).map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-brand-500/5 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all font-medium"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about misinformation, evidence, clickbait, or claim analysis... (Enter to send)"
            className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all leading-relaxed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white shadow-md shadow-brand-500/20 transition-all active:scale-95"
              title="Send message"
            >
              <Send size={18} />
            </button>
            {messages.length > 2 && (
              <button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 disabled:opacity-40 transition-colors"
                title="Regenerate last response"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start gap-1.5 mt-2 text-[11px] text-slate-400">
          <AlertCircle size={12} className="shrink-0 mt-0.5" />
          <span>
            TruthLens AI may make mistakes. Always verify critical claims through accredited primary or institutional sources.
          </span>
        </div>
      </div>
    </div>
  );
};
