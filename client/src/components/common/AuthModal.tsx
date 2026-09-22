import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFactCheck } from '../../context/FactCheckContext';
import { X, Lock, Mail, User, Shield, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, login, continueAsGuest } = useAuth();
  const { addToast } = useFactCheck();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter an email address.', 'warning');
      return;
    }

    if (authModalTab === 'forgot') {
      addToast(`Password reset link sent to ${email}`, 'success');
      closeAuthModal();
      return;
    }

    login(email, name || undefined);
    addToast(authModalTab === 'signup' ? 'Account created successfully!' : 'Signed in successfully!', 'success');
  };

  const handleGoogleLogin = () => {
    login('demo.user@gmail.com', 'Alex Rivera (Google)');
    addToast('Signed in with Google authentication!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Shield size={22} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {authModalTab === 'login' && 'Sign in to TruthLens AI'}
                {authModalTab === 'signup' && 'Create TruthLens Account'}
                {authModalTab === 'forgot' && 'Reset Your Password'}
              </h3>
              <p className="text-xs text-slate-500">Secure AI-powered fact verification</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authModalTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Prof. or Student Name"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {authModalTab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {authModalTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 active:scale-[0.98]"
          >
            {authModalTab === 'login' && 'Sign In'}
            {authModalTab === 'signup' && 'Create Account'}
            {authModalTab === 'forgot' && 'Send Reset Instructions'}
          </button>

          {authModalTab !== 'forgot' && (
            <>
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <span className="relative px-2 bg-white dark:bg-slate-900 text-[11px] text-slate-400 uppercase tracking-wider">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={continueAsGuest}
                className="w-full py-2 px-4 rounded-xl border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles size={14} />
                Continue as Guest (Demo Mode)
              </button>
            </>
          )}

          <div className="pt-2 text-center text-xs text-slate-500">
            {authModalTab === 'login' && (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => openAuthModal('signup')} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            )}
            {authModalTab === 'signup' && (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => openAuthModal('login')} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            )}
            {authModalTab === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button type="button" onClick={() => openAuthModal('login')} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Back to Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
