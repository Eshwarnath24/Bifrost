import React from 'react';

const LoadingScreen = ({ onFinish }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500">
      
      {/* Ambient background blurs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-15 animate-[float_4s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-300 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 dark:opacity-15 animate-[float-reverse_5s_ease-in-out_infinite] pointer-events-none"></div>

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-6 animate-[fade-in-up_0.6s_ease-out]">
        
        {/* Logo mark — enlarged version of the navbar logo */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-2xl blur-xl opacity-60 animate-[loader-glow_2s_ease-in-out_infinite]"></div>
          
          {/* Core shape */}
          <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
            {/* Inner portal geometry — spinning */}
            <div className="w-8 h-8 border-[3px] border-white/90 rounded-lg animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse"></div>
          </div>
        </div>

        {/* Brand name */}
        <span className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-gray-900 dark:from-white dark:to-gray-300 tracking-tight">
          Bifrost
        </span>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full animate-[loader-bar_1.8s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
