import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import LoadingScreen from './components/LoadingScreen';
import { clearAuthSession, loadAuthSession, saveAuthSession } from './lib/authStorage';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [authSession, setAuthSession] = useState(() => loadAuthSession());
  const [globalLoading, setGlobalLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Initial app load
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setAppLoading(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (session) => {
    saveAuthSession(session);
    setAuthSession(session);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthSession(null);
  };

  // Show loader overlay whenever globalLoading is active
  const showLoader = appLoading || globalLoading;

  return (
    <div className={isDark ? 'dark' : ''}>
      {showLoader && (
        <div className={fadeOut && !globalLoading ? 'animate-[fade-out_0.5s_ease-out_forwards]' : ''}>
          <LoadingScreen />
        </div>
      )}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200 relative overflow-hidden">
        <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} isLoading={globalLoading} />
        {authSession ? (
          <Dashboard user={authSession.user} onLogout={handleLogout} />
        ) : (
          <AuthPage onLoginSuccess={handleAuthSuccess} setGlobalLoading={setGlobalLoading} />
        )}
      </div>
    </div>
  );
}
