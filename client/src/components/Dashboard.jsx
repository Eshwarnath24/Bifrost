import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Dashboard = ({ onLogout }) => (
  <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden z-10">
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 max-w-2xl w-full text-center relative z-10 border border-white/50 dark:border-slate-700/50 animate-[translate-y-0_0.7s_ease-out]">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-indigo-100 dark:border-indigo-500/20">
        <LayoutDashboard className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">Welcome to your Dashboard</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-10 font-medium transition-colors">You have successfully completed the authentication flow.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left hover:shadow-md transition-all">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Active Session</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Secure connection established.</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-left hover:shadow-md transition-all">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Profile Status</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Verified and up to date.</p>
        </div>
      </div>

      <button onClick={onLogout} className="flex items-center justify-center gap-2 mx-auto px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 shadow-lg group">
        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Sign Out
      </button>
    </div>
  </div>
);

export default Dashboard;
