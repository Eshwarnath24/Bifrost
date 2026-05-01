import { useState } from 'react';
import { Lock, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { InputField } from './FormElements';
import { setPasswordRequest } from '../lib/authApi';

const SetPasswordModal = ({ token, user, onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('form'); // form | success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await setPasswordRequest(token, { newPassword: password });
      setStep('success');
      setTimeout(() => {
        onComplete?.();
      }, 2200);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[modal-backdrop_0.4s_ease-out_both]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
    >
      {/* Decorative floating orbs in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-indigo-500/20 rounded-full blur-[80px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] animate-[float-reverse_10s_ease-in-out_infinite]" />
        <div className="absolute top-[50%] left-[50%] w-24 h-24 bg-cyan-500/15 rounded-full blur-[60px] animate-[float_12s_ease-in-out_infinite]" />
      </div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)] border border-white/40 dark:border-slate-700/40 overflow-hidden animate-[modal-enter_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
        
        {/* Gradient header strip */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-flow" style={{ backgroundSize: '200% 200%' }} />
        
        <div className="p-8 md:p-10">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-700 ${step === 'success' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
              {step === 'success' ? (
                <>
                  {/* Pulse rings behind the icon */}
                  <div className="absolute inset-0 rounded-2xl bg-green-400/20 animate-[pulse-ring_1.5s_ease-out_both]" />
                  <div className="absolute inset-0 rounded-2xl bg-green-400/10 animate-[pulse-ring_1.5s_ease-out_0.3s_both]" />
                  <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400 animate-[success-pop_0.8s_ease-out] relative z-10" />
                </>
              ) : (
                <>
                  <ShieldCheck className="w-10 h-10 text-indigo-500 dark:text-indigo-400 relative z-10" />
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-2 animate-[fade-in-up_0.5s_ease-out_0.1s_both]">
            {step === 'success' ? 'You\'re All Set!' : 'Create a Password'}
          </h2>

          {/* Description */}
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium text-center mb-8 animate-[fade-in-up_0.5s_ease-out_0.2s_both]">
            {step === 'success' ? (
              <>Welcome, <span className="text-indigo-500 dark:text-indigo-400 font-bold">{user?.name || 'there'}</span>! Entering the Bifrost...</>
            ) : (
              <>
                Welcome, <span className="text-indigo-500 dark:text-indigo-400 font-bold">{user?.name || 'there'}</span>! Set a password so you can also sign in with your email.
              </>
            )}
          </p>

          {step === 'form' && (
            <form onSubmit={handleSubmit}>
              <div className="animate-[slide-in-right_0.4s_ease-out_0.25s_both]">
                <InputField
                  icon={Lock}
                  type="password"
                  placeholder="Create Password (min 8 chars)"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                  disabled={isLoading}
                />
              </div>

              <div className="animate-[slide-in-right_0.4s_ease-out_0.35s_both]">
                <InputField
                  icon={Lock}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(''); }}
                  disabled={isLoading}
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 dark:text-red-400 text-sm font-medium mb-4 text-center animate-[shake_0.4s_ease-in-out]">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col items-center gap-3 animate-[fade-in-up_0.4s_ease-out_0.4s_both]">
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 w-full max-w-[280px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SET PASSWORD'}
                  </span>
                  {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>}
                </button>

                <button
                  type="button"
                  onClick={onComplete}
                  disabled={isLoading}
                  className="text-sm font-medium text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  Skip for now
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center gap-4">
              {/* Confetti-like decorative dots */}
              <div className="relative w-full h-12 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-[confetti-burst_1.2s_ease-out_both]"
                    style={{
                      backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#34d399', '#f59e0b', '#ef4444', '#8b5cf6'][i],
                      left: `${25 + (i * 7)}%`,
                      animationDelay: `${i * 0.08}s`,
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Animated progress bar */}
              <div className="w-48 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-[progress-fill_1.6s_ease-out_0.5s_both]"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPasswordModal;
