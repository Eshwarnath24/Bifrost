import { useEffect, useRef, useState } from 'react';
import { loadGoogleIdentityScript } from '../lib/authApi';

// Google Color 'G' SVG Icon
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);


// Shared button style for all social icons
const socialBtnClass = "p-3 flex-1 flex justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-slate-200 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95";

// Reusable Social Icons (Google + GitHub + LinkedIn)
export const SocialIcons = ({ handleGoogleSignIn }) => {
  const googleContainerRef = useRef(null);
  const callbackRef = useRef(handleGoogleSignIn);

  // Keep callback ref in sync
  useEffect(() => {
    callbackRef.current = handleGoogleSignIn;
  }, [handleGoogleSignIn]);

  useEffect(() => {
    if (!handleGoogleSignIn) return;

    let cancelled = false;

    const initGoogle = async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || !googleContainerRef.current) return;

      await loadGoogleIdentityScript();
      if (cancelled || !window.google?.accounts?.id || !googleContainerRef.current) return;

      if (!window.__googleIdInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => callbackRef.current?.(response),
        });
        window.__googleIdInitialized = true;
      }

      // Render the real Google button inside the hidden container
      googleContainerRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleContainerRef.current, {
        type: 'standard',
        shape: 'rectangular',
        size: 'large',
        width: googleContainerRef.current.offsetWidth || 400,
      });
    };

    initGoogle();

    return () => {
      cancelled = true;
      if (googleContainerRef.current) {
        googleContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex justify-center w-full mt-4">
      {/* Google button — custom icon with invisible real Google button overlayed */}
      {handleGoogleSignIn && (
        <div className="relative w-full">
          {/* Visible custom styled button (behind) */}
          <div className={socialBtnClass + " gap-2 text-sm font-medium"}>
            <GoogleIcon className="w-5 h-5" />
            <span>Sign in with Google</span>
          </div>
          {/* Invisible real Google Sign-In button (in front, captures clicks) */}
          <div
            ref={googleContainerRef}
            className="google-btn-overlay absolute inset-0 opacity-[0.01] overflow-hidden cursor-pointer"
            style={{ minHeight: '100%', minWidth: '100%' }}
          />
          <style>{`
            .google-btn-overlay iframe,
            .google-btn-overlay > div {
              width: 100% !important;
              height: 100% !important;
              min-height: 44px;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};



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

// Input Field (with password visibility toggle and optional status icon)
export const InputField = ({ icon: Icon, type, placeholder, value, onChange, onBlur, disabled, statusIcon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasStatusIcon = statusIcon && !isPassword;

  return (
    <div className="relative w-full mb-4 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 group-focus-within:text-indigo-500 z-10">
        <Icon className={`h-5 w-5 transition-colors ${disabled ? 'text-gray-300 dark:text-slate-600' : 'text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
      </div>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full pl-11 ${isPassword || hasStatusIcon ? 'pr-11' : 'pr-4'} py-3.5 border rounded-xl focus:outline-none transition-all text-sm font-medium placeholder-gray-400 dark:placeholder-slate-500 relative z-0 ${disabled ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed' : `bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 ${statusIcon === 'success' ? 'border-emerald-400 dark:border-emerald-500/60' : statusIcon === 'error' ? 'border-red-400 dark:border-red-500/60' : 'border-gray-200 dark:border-slate-700'}`}`}
        placeholder={placeholder}
        required
      />
      {/* Status icon (for email verification) */}
      {hasStatusIcon && !disabled && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 pointer-events-none">
          {statusIcon === 'loading' && (
            <div className="w-5 h-5 border-2 border-indigo-300 dark:border-indigo-500 border-t-transparent rounded-full animate-spin" />
          )}
          {statusIcon === 'success' && (
            <div className="animate-[success-pop_0.5s_ease-out]">
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" className="animate-[draw-check_0.4s_ease-out_0.15s_both]" style={{ strokeDasharray: 24, strokeDashoffset: 24 }} />
              </svg>
            </div>
          )}
          {statusIcon === 'error' && (
            <div className="animate-[shake_0.4s_ease-in-out]">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>
      )}
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
      {!disabled && <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 transition-all duration-500 ease-out group-focus-within:w-[95%] rounded-full z-10 pointer-events-none ${statusIcon === 'success' ? 'bg-emerald-500' : statusIcon === 'error' ? 'bg-red-400' : 'bg-indigo-500'}`}></div>}
    </div>
  );
};
