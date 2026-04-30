import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { InputField, GoogleButton, SocialIcons } from './FormElements';

const SignupForm = ({ isActive, setGlobalLoading, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (setGlobalLoading) setGlobalLoading(true);
    // Simulate server registration — loader stays visible
    setTimeout(() => { 
      setIsLoading(false);
      if (onSignupSuccess) onSignupSuccess();
      // Hide loader after dashboard mounts
      setTimeout(() => { if (setGlobalLoading) setGlobalLoading(false); }, 400);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <h1 className={`text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-100' : 'opacity-0 translate-y-4 blur-sm'}`}>Create Account</h1>
      
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-200' : 'opacity-0 translate-y-4 blur-sm'}`}>
        <GoogleButton />
      </div>

      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 blur-none delay-[250ms]' : 'opacity-0 translate-y-4 blur-sm'}`}>
        <SocialIcons />
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
        <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
      </div>
      <div className={`w-full transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 delay-[600ms]' : 'opacity-0 translate-x-8'}`}>
        <InputField icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
      </div>
      
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
