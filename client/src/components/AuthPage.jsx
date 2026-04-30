import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = ({ onLoginSuccess, setGlobalLoading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  const handleToggleMode = (toLogin) => {
    setIsLogin(toLogin);
    if (!toLogin && isForgot) {
      setTimeout(() => setIsForgot(false), 500);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 relative z-10 w-full">
      
      {/* Decorative Ambient Background Blurs (Bifrost Cosmic Energy Theme) */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-20 animate-[float_10s_ease-in-out_infinite] z-0 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-cyan-300 dark:bg-cyan-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-40 dark:opacity-20 animate-[float-reverse_12s_ease-in-out_infinite] z-0 pointer-events-none"></div>
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-fuchsia-300 dark:bg-fuchsia-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-30 dark:opacity-10 animate-[float_15s_ease-in-out_infinite] z-0 pointer-events-none"></div>

      {/* Bifrost Cosmic Energy Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 block">
        {/* Massive background orbs */}
        <div className="absolute left-[15%] w-32 h-32 bg-gradient-to-tr from-cyan-400/20 to-indigo-400/40 dark:from-cyan-500/10 dark:to-indigo-500/20 rounded-full backdrop-blur-lg border border-white/20 dark:border-white/5 animate-[bubble-rise_20s_linear_infinite]" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute left-[75%] w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-fuchsia-400/40 dark:from-indigo-500/10 dark:to-fuchsia-500/20 rounded-full backdrop-blur-lg border border-white/20 dark:border-white/5 animate-[bubble-rise_25s_linear_infinite]" style={{ animationDelay: '-12s' }}></div>
        
        {/* Medium energy sparks */}
        <div className="absolute left-[5%] w-12 h-12 bg-gradient-to-tr from-cyan-300/40 to-blue-400/60 dark:from-cyan-400/20 dark:to-blue-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-[bubble-rise_14s_linear_infinite]" style={{ animationDelay: '0s' }}></div>
        <div className="absolute left-[35%] w-16 h-16 bg-gradient-to-tr from-indigo-300/40 to-fuchsia-400/60 dark:from-indigo-400/20 dark:to-fuchsia-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-[bubble-rise_18s_linear_infinite]" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute left-[55%] w-10 h-10 bg-gradient-to-tr from-blue-300/40 to-indigo-400/60 dark:from-blue-400/20 dark:to-indigo-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-[bubble-rise_12s_linear_infinite]" style={{ animationDelay: '-9s' }}></div>
        <div className="absolute left-[85%] w-14 h-14 bg-gradient-to-tr from-fuchsia-300/40 to-pink-400/60 dark:from-fuchsia-400/20 dark:to-pink-500/30 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(232,121,249,0.3)] animate-[bubble-rise_16s_linear_infinite]" style={{ animationDelay: '-1s' }}></div>
        
        {/* Tiny fast cosmic dust */}
        <div className="absolute left-[20%] w-3 h-3 bg-cyan-300 dark:bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[bubble-rise_7s_linear_infinite]" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute left-[45%] w-2 h-2 bg-indigo-300 dark:bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-[bubble-rise_5s_linear_infinite]" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute left-[65%] w-4 h-4 bg-fuchsia-300 dark:bg-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(232,121,249,0.8)] animate-[bubble-rise_9s_linear_infinite]" style={{ animationDelay: '-6s' }}></div>
        <div className="absolute left-[92%] w-2 h-2 bg-cyan-200 dark:bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(165,243,252,0.8)] animate-[bubble-rise_6s_linear_infinite]" style={{ animationDelay: '-4s' }}></div>
        <div className="absolute left-[12%] w-3 h-3 bg-indigo-200 dark:bg-indigo-300 rounded-full shadow-[0_0_10px_rgba(199,210,254,0.8)] animate-[bubble-rise_8s_linear_infinite]" style={{ animationDelay: '-8s' }}></div>
        <div className="absolute left-[80%] w-3 h-3 bg-fuchsia-200 dark:bg-fuchsia-300 rounded-full shadow-[0_0_10px_rgba(250,204,215,0.8)] animate-[bubble-rise_10s_linear_infinite]" style={{ animationDelay: '-10s' }}></div>

        {/* Animated Cosmic Particles */}
        <div className="block">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-gradient-to-tr from-cyan-400/20 to-indigo-400/30 dark:from-cyan-500/10 dark:to-indigo-500/20 rounded-full backdrop-blur-md border border-white/20 dark:border-white/5 animate-[bubble-rise_linear_infinite]"
              style={{ width: `${30 + (i * 20)}px`, height: `${30 + (i * 20)}px`, left: `${10 + (i * 15)}%`, animationDuration: `${9 + (i * 2)}s`, animationDelay: `${-i * 2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Unified Responsive Container */}
      <div className="relative w-full max-w-md md:max-w-[900px] h-[650px] md:h-[600px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-10 border border-white/40 dark:border-slate-700/40 group/card transition-colors duration-500 flex flex-col md:flex-row">

        {/* Forms Container (Left Side on Desktop, Middle content on Mobile) */}
        <div className="relative flex-1 md:flex-none w-full md:w-1/2 h-full flex flex-col">
          
          {/* Login Form Wrapper */}
          <div className={`absolute inset-0 flex flex-col justify-center items-center px-6 md:px-16 transition-all duration-700 ease-in-out ${isLogin && !isForgot ? 'opacity-100 z-30 translate-x-0 translate-y-0 blur-none pointer-events-auto' : `opacity-0 z-0 blur-sm pointer-events-none ${!isLogin ? 'translate-y-full translate-x-0 md:translate-y-0 md:-translate-x-12' : '-translate-x-8 translate-y-0 md:-translate-x-12'}`}`}>
             <LoginForm isActive={isLogin && !isForgot} onForgotClick={() => setIsForgot(true)} onLoginSuccess={onLoginSuccess} setGlobalLoading={setGlobalLoading} />
          </div>

          {/* Forgot Password Wrapper */}
          <div className={`absolute inset-0 flex flex-col justify-center items-center px-6 md:px-16 transition-all duration-700 ease-in-out ${isLogin && isForgot ? 'opacity-100 z-30 translate-x-0 translate-y-0 blur-none pointer-events-auto' : `opacity-0 z-0 blur-sm pointer-events-none ${!isLogin ? 'translate-y-full translate-x-0 md:translate-y-0 md:translate-x-12' : 'translate-x-8 translate-y-0 md:translate-x-12'}`}`}>
             <ForgotPasswordForm isActive={isLogin && isForgot} onBackClick={() => setIsForgot(false)} setGlobalLoading={setGlobalLoading} />
          </div>

          {/* Signup Form Wrapper */}
          <div className={`absolute inset-0 flex flex-col justify-center items-center px-6 md:px-16 transition-all duration-700 ease-in-out ${!isLogin ? 'opacity-100 z-20 translate-x-0 translate-y-0 scale-100 md:translate-x-[100%] blur-none pointer-events-auto' : 'opacity-0 z-0 -translate-y-12 scale-95 md:translate-y-0 md:scale-100 md:translate-x-[110%] blur-sm pointer-events-none'}`}>
             <SignupForm isActive={!isLogin} setGlobalLoading={setGlobalLoading} onSignupSuccess={onLoginSuccess} />
          </div>
        </div>

        {/* Sliding Overlay Container (Desktop Only) */}
        <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-[900ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-50 shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] ${isLogin ? 'translate-x-full rounded-l-[2rem]' : 'translate-x-0 rounded-r-[2rem]'}`}>
          <div className={`animate-gradient-flow bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative h-full w-[200%] transition-transform duration-[900ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isLogin ? '-translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Dynamic Floating Glass Blobs inside Overlay */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full animate-[float_6s_ease-in-out_infinite] border border-white/20 dark:border-white/10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full animate-[float-reverse_7s_ease-in-out_infinite] border border-white/20 dark:border-white/10"></div>
            
            {/* Background Decor Graphic */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-[0.05] pointer-events-none z-0">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current text-white">
                <polygon points="0,100 100,0 100,100" />
              </svg>
            </div>

            {/* Left Panel of Overlay */}
            <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-14 transition-all duration-[900ms] ease-in-out z-10 ${isLogin ? '-translate-x-[20%] opacity-0 blur-sm scale-95' : 'translate-x-0 opacity-100 blur-none scale-100 delay-200'}`}>
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">Enter the Bifrost</h2>
              <p className="text-white/90 text-sm font-medium mb-8 leading-relaxed drop-shadow">
                Authenticate your identity to resume secure access to the central nexus.
              </p>
              <button 
                onClick={() => handleToggleMode(true)} 
                className="group relative overflow-hidden border-2 border-white/80 dark:border-white/50 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-white hover:text-indigo-600 dark:hover:text-indigo-900 transition-all active:scale-95 shadow-lg"
              >
                <span className="relative z-10 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-900">INITIATE SESSION</span>
                <div className="absolute inset-0 h-full w-full bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
              </button>
            </div>

            {/* Right Panel of Overlay */}
            <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-14 transition-all duration-[900ms] ease-in-out z-10 ${isLogin ? 'translate-x-0 opacity-100 blur-none scale-100 delay-200' : 'translate-x-[20%] opacity-0 blur-sm scale-95'}`}>
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">Open a Portal</h2>
              <p className="text-white/90 text-sm font-medium mb-8 leading-relaxed drop-shadow">
                Establish a new secure uplink and synchronize your credentials with the grid.
              </p>
              <button 
                onClick={() => handleToggleMode(false)} 
                className="group relative overflow-hidden border-2 border-white/80 dark:border-white/50 text-white rounded-xl px-12 py-3.5 font-bold tracking-wide hover:bg-white hover:text-indigo-600 dark:hover:text-indigo-900 transition-all active:scale-95 shadow-lg"
              >
                <span className="relative z-10 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-900">ESTABLISH UPLINK</span>
                <div className="absolute inset-0 h-full w-full bg-white scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Toggle Footer (Visible only on mobile) */}
        <div className="md:hidden shrink-0 p-6 bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-slate-700 text-center z-30 transition-colors duration-500">
          <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => handleToggleMode(!isLogin)} 
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-indigo-600 dark:after:bg-indigo-400 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

      </div>
    </main>
  );
};

export default AuthPage;
