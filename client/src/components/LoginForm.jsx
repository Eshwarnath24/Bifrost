import { useState, useRef, useCallback } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { InputField, SocialIcons } from './FormElements';
import { googleAuthRequest, loginRequest, checkEmailRequest } from '../lib/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LoginForm = ({ isActive, onForgotClick, onLoginSuccess, setGlobalLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Email verification state
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | checking | found | not-found | error
  const [emailProvider, setEmailProvider] = useState(null);
  const checkTimeoutRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    if (setGlobalLoading) setGlobalLoading(true);

    try {
      const result = await loginRequest({ email, password });
      onLoginSuccess?.(result);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in');
    } finally {
      setIsLoading(false);
      if (setGlobalLoading) setGlobalLoading(false);
    }
  };

  const handleGoogleSignIn = async (response) => {
    setErrorMessage('');
    if (setGlobalLoading) setGlobalLoading(true);

    try {
      if (!response?.credential) {
        throw new Error('Google did not return an ID token');
      }

      const result = await googleAuthRequest(response.credential);
      onLoginSuccess?.(result);
    } catch (error) {
      setErrorMessage(error.message || 'Google sign-in failed');
    } finally {
      if (setGlobalLoading) setGlobalLoading(false);
    }
  };

  const verifyEmail = useCallback(async (emailValue) => {
    const normalized = emailValue.trim().toLowerCase();

    if (!normalized || !emailRegex.test(normalized)) {
      setEmailStatus('idle');
      return;
    }

    setEmailStatus('checking');
    setEmailProvider(null);

    try {
      const result = await checkEmailRequest({ email: normalized });
      if (result.exists) {
        setEmailStatus('found');
        setEmailProvider(result.provider);
      } else {
        setEmailStatus('not-found');
      }
    } catch {
      setEmailStatus('error');
    }
  }, []);

  const handleEmailBlur = () => {
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    checkTimeoutRef.current = setTimeout(() => {
      verifyEmail(email);
    }, 150);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
    // Reset status when user starts editing again
    if (emailStatus !== 'idle') {
      setEmailStatus('idle');
      setEmailProvider(null);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <h1 className={`text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-100' : 'opacity-0 translate-y-4 blur-sm'}`}>Sign In</h1>
      
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-200' : 'opacity-0 translate-y-4 blur-sm'}`}>
        <SocialIcons handleGoogleSignIn={handleGoogleSignIn} />
      </div>

      <div className={`flex items-center w-full my-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'}`}>
        <hr className="flex-grow border-gray-200 dark:border-slate-700" />
        <span className="px-3 text-sm text-gray-400 dark:text-slate-500 font-medium">or continue with email</span>
        <hr className="flex-grow border-gray-200 dark:border-slate-700" />
      </div>
      
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[400ms]' : 'opacity-0 -translate-x-8'}`}>
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          disabled={isLoading}
          statusIcon={
            emailStatus === 'found' ? 'success' :
            emailStatus === 'not-found' ? 'error' :
            emailStatus === 'checking' ? 'loading' : null
          }
        />
      </div>

      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[500ms]' : 'opacity-0 -translate-x-8'}`}>
        <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
      </div>
      
      <div className={`w-full flex justify-end mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 delay-[600ms]' : 'opacity-0'}`}>
        <button type="button" onClick={onForgotClick} disabled={isLoading} className="text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-indigo-600 dark:after:bg-indigo-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left disabled:opacity-50">
          Forget Your Password?
        </button>
      </div>
      {errorMessage && (
        <p className="mb-4 w-full max-w-[320px] text-center text-sm text-red-500 dark:text-red-400 font-medium animate-[shake_0.4s_ease-in-out]">
          {errorMessage}
        </p>
      )}
      <button disabled={isLoading} className={`relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-700 ease-out active:scale-95 w-full max-w-[240px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${isActive ? 'opacity-100 translate-y-0 scale-100 delay-[700ms]' : 'opacity-0 translate-y-8 scale-90'}`}>
        <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN IN'}
          {!isLoading && <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 absolute right-[-24px]" />}
        </span>
        {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
      </button>
    </form>
  );
};

export default LoginForm;
