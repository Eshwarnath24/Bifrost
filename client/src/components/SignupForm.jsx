import { useState, useRef, useEffect, useCallback } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, KeyRound, CheckCircle } from 'lucide-react';
import { InputField, SocialIcons } from './FormElements';
import { googleAuthRequest, signupRequest, verifySignupOtpRequest, checkEmailRequest } from '../lib/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SignupForm = ({ isActive, setGlobalLoading, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('form'); // form → otp → success
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Email verification state
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | checking | available | taken | error
  const checkTimeoutRef = useRef(null);

  const verifyEmail = useCallback(async (emailValue) => {
    const normalized = emailValue.trim().toLowerCase();
    if (!normalized || !emailRegex.test(normalized)) {
      setEmailStatus('idle');
      return;
    }
    setEmailStatus('checking');
    try {
      const result = await checkEmailRequest({ email: normalized });
      setEmailStatus(result.exists ? 'taken' : 'available');
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
    if (emailStatus !== 'idle') {
      setEmailStatus('idle');
    }
  };

  // Reset form when leaving
  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        setStep('form');
        setOtp(['', '', '', '']);
        setErrorMessage('');
        setEmailStatus('idle');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    if (setGlobalLoading) setGlobalLoading(true);

    try {
      await signupRequest({ name, email: normalizedEmail, password });
      setEmail(normalizedEmail);
      setStep('otp');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign up');
    } finally {
      setIsLoading(false);
      if (setGlobalLoading) setGlobalLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (!/^\d{4}$/.test(otpCode)) {
      setErrorMessage('OTP must be a 4-digit code');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    if (setGlobalLoading) setGlobalLoading(true);

    try {
      const result = await verifySignupOtpRequest({ email, otp: otpCode });
      setStep('success');
      setTimeout(() => {
        onSignupSuccess?.(result);
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || 'OTP verification failed');
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
      onSignupSuccess?.(result);
    } catch (error) {
      setErrorMessage(error.message || 'Google sign-in failed');
    } finally {
      if (setGlobalLoading) setGlobalLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // ── OTP Step ──
  if (step === 'otp' || step === 'success') {
    return (
      <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ease-out ${step === 'success' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'} ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          {step === 'success'
            ? <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400 animate-[success-pop_0.8s_ease-out]" />
            : <KeyRound className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          }
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
          {step === 'success' ? 'Verified!' : 'Verify Email'}
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 text-center font-medium px-4">
          {step === 'success'
            ? 'Your account has been created. Redirecting...'
            : `We've sent a 4-digit code to ${email}. Enter it below.`
          }
        </p>

        {step === 'otp' && (
          <>
            {/* OTP Inputs */}
            <div className="flex gap-3 justify-center mb-6 animate-[fade-in-up_0.5s_ease-out]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all text-gray-900 dark:text-white disabled:opacity-50"
                />
              ))}
            </div>

            {errorMessage && (
              <p className="mb-4 w-full max-w-[320px] text-center text-sm text-red-500 dark:text-red-400 font-medium animate-[shake_0.4s_ease-in-out]">
                {errorMessage}
              </p>
            )}

            {/* Verify Button */}
            <button disabled={isLoading || otp.some(d => d === '')} className="relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 w-full max-w-[240px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY OTP'}
              </span>
              {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
            </button>
          </>
        )}

        {step === 'success' && (
          <div className="flex gap-3 justify-center mb-2">
            {otp.map((digit, index) => (
              <div
                key={index}
                className="w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl border-2 transition-all duration-700 bg-green-50 dark:bg-green-500/10 border-green-400 dark:border-green-500 text-green-600 dark:text-green-400 animate-[otp-confirm_0.6s_ease-out_both]"
                style={{ animationDelay: `${index * 180}ms` }}
              >
                {digit}
              </div>
            ))}
          </div>
        )}
      </form>
    );
  }

  // ── Registration Form Step ──
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <h1 className={`text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-100' : 'opacity-0 translate-y-4 blur-sm'}`}>Create Account</h1>
      
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-200' : 'opacity-0 translate-y-4 blur-sm'}`}>
        <SocialIcons handleGoogleSignIn={handleGoogleSignIn} />
      </div>

      <div className={`flex items-center w-full my-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'}`}>
        <hr className="flex-grow border-gray-200 dark:border-slate-700" />
        <span className="px-3 text-sm text-gray-400 dark:text-slate-500 font-medium">or register with email</span>
        <hr className="flex-grow border-gray-200 dark:border-slate-700" />
      </div>
      
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[400ms]' : 'opacity-0 translate-x-8'}`}>
        <InputField icon={User} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
      </div>
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[500ms]' : 'opacity-0 translate-x-8'}`}>
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          disabled={isLoading}
          statusIcon={
            emailStatus === 'available' ? 'success' :
            emailStatus === 'taken' ? 'error' :
            emailStatus === 'checking' ? 'loading' : null
          }
        />
      </div>
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[600ms]' : 'opacity-0 translate-x-8'}`}>
        <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
      </div>

      {errorMessage && (
        <p className="mb-4 w-full max-w-[320px] text-center text-sm text-red-500 dark:text-red-400 font-medium">
          {errorMessage}
        </p>
      )}
      
      <button disabled={isLoading} className={`relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide mt-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-700 ease-out active:scale-95 w-full max-w-[240px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${isActive ? 'opacity-100 translate-y-0 scale-100 delay-[700ms]' : 'opacity-0 translate-y-8 scale-90'}`}>
        <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SIGN UP'}
          {!isLoading && <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 absolute right-[-24px]" />}
        </span>
        {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
      </button>
    </form>
  );
};

export default SignupForm;
