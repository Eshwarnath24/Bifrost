import React from 'react';

// GitHub SVG Icon
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// LinkedIn SVG Icon
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Reusable Social Icons
export const SocialIcons = () => (
  <div className="flex space-x-3 mt-4 justify-center w-full">
    <button className="p-3 flex-1 flex justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-slate-200 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
      <GithubIcon className="w-5 h-5" />
    </button>
    <button className="p-3 flex-1 flex justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-blue-200 dark:hover:border-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-200 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95">
      <LinkedinIcon className="w-5 h-5" />
    </button>
  </div>
);

// Google Button (Periodic Auto-Shine)
export const GoogleButton = () => (
  <button className="relative overflow-hidden w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md group">
    {/* Periodic Shine Element */}
    <div className="absolute inset-0 -translate-x-full animate-[auto-shine_6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-indigo-100/50 dark:via-indigo-500/10 to-transparent z-0 pointer-events-none"></div>
    
    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
    <span className="relative z-10">Continue with Google</span>
  </button>
);

// Eye SVG Icon
const EyeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Eye Off SVG Icon
const EyeOffIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Input Field (with password visibility toggle)
export const InputField = ({ icon: Icon, type, placeholder, value, onChange, disabled }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full mb-4 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-indigo-500 z-10">
        <Icon className={`h-5 w-5 transition-colors ${disabled ? 'text-gray-300 dark:text-slate-600' : 'text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
      </div>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-11 ${isPassword ? 'pr-11' : 'pr-4'} py-3.5 border rounded-xl focus:outline-none transition-all text-sm font-medium placeholder-gray-400 dark:placeholder-slate-500 relative z-0 ${disabled ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed' : 'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800'}`}
        placeholder={placeholder}
        required
      />
      {isPassword && !disabled && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors active:scale-90"
          tabIndex={-1}
        >
          <div key={showPassword ? 'off' : 'on'} className="animate-[eye-toggle_0.3s_ease-out]">
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </div>
        </button>
      )}
      {!disabled && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-indigo-500 transition-all duration-500 ease-out group-focus-within:w-[95%] rounded-full z-10 pointer-events-none"></div>}
    </div>
  );
};
