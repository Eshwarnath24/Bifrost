import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import { clearAuthSession, loadAuthSession } from '../lib/authStorage';

const Home = () => {
  const navigate = useNavigate();
  const authSession = loadAuthSession();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('bifrost-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('bifrost-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Dashboard user={authSession?.user} onLogout={handleLogout} />
    </div>
  );
};

export default Home;