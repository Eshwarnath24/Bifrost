import { useState, useEffect, useRef } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle, Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import { InputField } from './FormElements';

const ForgotPasswordForm = ({ isActive, onBackClick, setGlobalLoading }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [step, setStep] = useState('email'); // email → otp → otpSuccess → newPassword → verified
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        setStep('email');
        setEmail('');
        setOtp(['', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (setGlobalLoading) setGlobalLoading(true);
    setTimeout(() => { 
      setIsLoading(false); 
      if (setGlobalLoading) setGlobalLoading(false);
      setStep('otp'); 
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (setGlobalLoading) setGlobalLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (setGlobalLoading) setGlobalLoading(false);
      // Show brief OTP success animation before transitioning
      setStep('otpSuccess');
      setTimeout(() => {
        setStep('newPassword');
      }, 2200);
    }, 1500);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    if (setGlobalLoading) setGlobalLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (setGlobalLoading) setGlobalLoading(false);
      setStep('verified');
      setTimeout(() => { onBackClick(); }, 2000);
    }, 1500);
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

  const getFormSubmitHandler = () => {
    if (step === 'email') return handleSendOtp;
    if (step === 'otp') return handleVerifyOtp;
    if (step === 'newPassword') return handleResetPassword;
    return (e) => e.preventDefault();
  };

  const getIcon = () => {
    if (step === 'verified') return <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />;
    if (step === 'otpSuccess') return <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />;
    if (step === 'newPassword') return <ShieldCheck className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />;
    if (step === 'otp') return <KeyRound className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />;
    return <Lock className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />;
  };

  const getTitle = () => {
    if (step === 'verified') return 'Password Reset!';
    if (step === 'otpSuccess') return 'OTP Verified!';
    if (step === 'newPassword') return 'New Password';
    if (step === 'otp') return 'Enter OTP';
    return 'Reset Password';
  };

  const getDescription = () => {
    if (step === 'verified') return "Your password has been successfully reset. Redirecting you to login...";
    if (step === 'otpSuccess') return "Identity confirmed. Preparing password reset...";
    if (step === 'newPassword') return "Create a strong new password for your account.";
    if (step === 'otp') return `We've sent a 4-digit code to ${email}. Please enter it below.`;
    return "Enter your email address and we'll send you an OTP to reset your password.";
  };

  const isSuccessStep = step === 'otpSuccess' || step === 'verified';

  return (
    <form onSubmit={getFormSubmitHandler()} className="w-full flex flex-col items-center">

      {/* Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 scale-100 delay-100' : 'opacity-0 scale-50'} ${isSuccessStep ? 'bg-green-50 dark:bg-green-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
        <div className={`transition-all duration-500 ${step === 'otpSuccess' ? 'animate-[success-pop_0.8s_ease-out]' : ''}`}>
          {getIcon()}
        </div>
      </div>
      
      {/* Title */}
      <h1 className={`text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 transition-all duration-700 ease-out text-center ${isActive ? 'opacity-100 translate-y-0 blur-none delay-200' : 'opacity-0 translate-y-4 blur-sm'}`}>
        {getTitle()}
      </h1>
      
      {/* Description */}
      <p className={`text-gray-500 dark:text-slate-400 text-sm mb-8 text-center font-medium px-4 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'}`}>
        {getDescription()}
      </p>

      {/* ── Step: Email ── */}
      {step === 'email' && (
        <>
          <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[400ms]' : 'opacity-0 translate-x-8'}`}>
            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          
          <button disabled={isLoading || !email} className={`relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-700 ease-out active:scale-95 w-full max-w-[240px] flex items-center justify-center mt-4 disabled:opacity-70 disabled:cursor-not-allowed ${isActive ? 'opacity-100 translate-y-0 scale-100 delay-[500ms]' : 'opacity-0 translate-y-8 scale-90'}`}>
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEND OTP'}
            </span>
            {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
          </button>
        </>
      )}

      {/* ── Step: OTP ── */}
      {step === 'otp' && (
        <>
          <div className={`flex gap-3 justify-center mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 delay-[400ms]' : 'opacity-0 translate-y-4'}`}>
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

          <button disabled={isLoading || otp.some(d => d === '')} className={`relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-700 ease-out active:scale-95 w-full max-w-[240px] flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed ${isActive ? 'opacity-100 translate-y-0 scale-100 delay-[500ms]' : 'opacity-0 translate-y-8 scale-90'}`}>
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY OTP'}
            </span>
            {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
          </button>
        </>
      )}

      {/* ── Step: OTP Success (brief transition animation) ── */}
      {step === 'otpSuccess' && (
        <div className="flex flex-col items-center gap-4 animate-[fade-in-up_0.5s_ease-out]">
          {/* Animated OTP boxes turning green */}
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
          
          {/* Animated progress bar */}
          <div className="w-48 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-[progress-fill_1.6s_ease-out_0.5s_both]"></div>
          </div>
        </div>
      )}

      {/* ── Step: New Password ── */}
      {step === 'newPassword' && (
        <div className="w-full animate-[fade-in-up_0.3s_ease-out]">
          <div className="w-full mb-0 animate-[slide-in-right_0.25s_ease-out_0.05s_both]">
            <InputField icon={Lock} type="password" placeholder="New Password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }} disabled={isLoading} />
          </div>
          <div className="w-full mb-0 animate-[slide-in-right_0.25s_ease-out_0.15s_both]">
            <InputField icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }} disabled={isLoading} />
          </div>

          {passwordError && (
            <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-4 text-center animate-[shake_0.4s_ease-in-out]">
              {passwordError}
            </p>
          )}

          <div className="flex justify-center animate-[fade-in-up_0.25s_ease-out_0.2s_both]">
            <button disabled={isLoading || !newPassword || !confirmPassword} className="relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 w-full max-w-[240px] flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'RESET PASSWORD'}
              </span>
              {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
            </button>
          </div>
        </div>
      )}

      {/* Back to Login (hidden during transition/success steps) */}
      {step !== 'verified' && step !== 'otpSuccess' && (
        <div className={`mt-8 transition-all duration-700 ease-out ${isActive ? 'opacity-100 delay-[600ms]' : 'opacity-0'}`}>
          <button type="button" onClick={onBackClick} disabled={isLoading} className="text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group disabled:opacity-50">
            <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </button>
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
