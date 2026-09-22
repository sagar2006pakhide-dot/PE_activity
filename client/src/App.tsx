import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FactCheckProvider, useFactCheck } from './context/FactCheckContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FactCheckerPage } from './pages/FactCheckerPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { NewsPage } from './pages/NewsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SavedChecksPage } from './pages/SavedChecksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PresentationPage } from './pages/PresentationPage';
import { AboutPage } from './pages/AboutPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeNav } = useFactCheck();
  const { isAuthModalOpen } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isOnLanding = activeNav === 'landing';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 antialiased">
      {/* Top Navigation */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Layout */}
      {isOnLanding ? (
        /* Landing page: full width, no sidebar */
        <main>
          <LandingPage />
        </main>
      ) : (
        /* App pages: sidebar + content */
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1 overflow-y-auto bg-slate-50/90 dark:bg-slate-950">
            {activeNav === 'dashboard' && <DashboardPage />}
            {activeNav === 'fact-checker' && <FactCheckerPage />}
            {activeNav === 'chatbot' && <ChatbotPage />}
            {activeNav === 'news' && <NewsPage />}
            {activeNav === 'history' && <HistoryPage />}
            {activeNav === 'saved' && <SavedChecksPage />}
            {activeNav === 'analytics' && <AnalyticsPage />}
            {activeNav === 'presentation' && <PresentationPage />}
            {activeNav === 'about' && <AboutPage />}
            {activeNav === 'settings' && <SettingsPage />}
          </main>
        </div>
      )}

      {/* Global UI Elements */}
      <ToastContainer />
      {isAuthModalOpen && <AuthModal />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FactCheckProvider>
          <AppContent />
        </FactCheckProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
