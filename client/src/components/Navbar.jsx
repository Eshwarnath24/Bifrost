import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ isDark, toggleTheme, isLoading }) => {
  const [tapped, setTapped] = useState(false);

  const handleLogoTap = () => {
    setTapped(true);
    setTimeout(() => setTapped(false), 700);
  };

  const isAnimating = tapped || false; // tapped triggers the same effect as hover on mobile

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 z-50 sticky top-0 transition-colors duration-500">
      <div
        className="flex items-center gap-3 cursor-pointer group relative"
        onClick={handleLogoTap}
      >
        
        {/* Abstract Bifrost Gateway Logo */}
        <div className={`relative w-10 h-10 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-active:scale-95 ${isAnimating ? 'scale-105' : ''}`}>
          {/* Ambient glow */}
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-xl blur-md transition-all duration-500 ${isLoading ? 'opacity-80 animate-pulse' : `opacity-40 group-hover:opacity-60 ${isAnimating ? 'opacity-60' : ''}`}`}></div>
          
          {/* Core shape */}
          <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-inner overflow-hidden border border-white/20">
             {/* Inner secure portal geometry */}
             <div
               className={`w-4 h-4 border-[2px] border-white/90 rounded-[4px] transform transition-transform duration-700 ${isLoading ? 'animate-[spin_1s_linear_infinite]' : isAnimating ? 'rotate-[225deg]' : 'rotate-45 group-hover:rotate-[225deg]'}`}
             ></div>
             <div className={`absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] ${isLoading ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>

        <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-gray-900 dark:from-white dark:to-gray-300 tracking-tight">Bifrost</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
