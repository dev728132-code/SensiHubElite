import { LogIn, Sparkles, Crosshair, ShieldCheck, Zap, UserPlus, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { user, login, register, error, clearError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (mode === 'signup') {
      if (!formData.username) errors.username = 'Username is required';
      else if (formData.username.length < 3) errors.username = 'Username too short';
      
      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.email) errors.email = 'Email/Username is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoggingIn(true);
    try {
      if (mode === 'signin') {
        await login(formData.email, formData.password, rememberMe);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
    } catch (err) {
      // Error handled by context
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden"
    >
      {/* Background Animated Effects */}
      <div className="absolute inset-0 z-0">
         <img 
           src="/src/assets/images/sensi_hub_hero_bg_1780809282844.png" 
           alt="Hero Background" 
           className="w-full h-full object-cover opacity-20 grayscale brightness-50"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] opacity-20" />
         
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
         />
      </div>
      
      <div className="z-10 w-full max-w-sm space-y-8 text-center pt-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-[1.8rem] p-[2px] shadow-[0_20px_50px_rgba(234,179,8,0.25)] border border-yellow-400/50"
        >
          <div className="w-full h-full bg-[#050505] rounded-[1.6rem] flex items-center justify-center">
            <Crosshair className="w-10 h-10 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
            Gaming <span className="text-yellow-500">Vault</span>
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-[1px] w-8 bg-gray-800" />
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed">
              {mode === 'signin' ? 'Unlock Elite Configs' : 'Create New Identity'}
            </p>
            <div className="h-[1px] w-8 bg-gray-800" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6 relative overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
          
          {/* Mode Selector */}
          <div className="flex bg-black/60 p-1 rounded-2xl border border-gray-800/50 relative z-10">
            <button 
              onClick={() => { setMode('signin'); clearError(); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); clearError(); }}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'signin' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'signin' ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text"
                        name="username"
                        placeholder="USERNAME"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors uppercase font-bold tracking-widest placeholder:text-gray-700"
                      />
                    </div>
                    {formErrors.username && <p className="text-[10px] text-red-500 text-left pl-4 font-bold">{formErrors.username}</p>}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text"
                      name="email"
                      placeholder={mode === 'signin' ? "EMAIL OR USERNAME" : "EMAIL ADDRESS"}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors uppercase font-bold tracking-widest placeholder:text-gray-700"
                    />
                  </div>
                  {formErrors.email && <p className="text-[10px] text-red-500 text-left pl-4 font-bold">{formErrors.email}</p>}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="password"
                      name="password"
                      placeholder="PASSWORD"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors tracking-[0.3em] font-bold placeholder:tracking-widest placeholder:text-gray-700"
                    />
                  </div>
                  {formErrors.password && <p className="text-[10px] text-red-500 text-left pl-4 font-bold">{formErrors.password}</p>}
                </div>

                {mode === 'signup' && (
                  <div className="space-y-1">
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="password"
                        name="confirmPassword"
                        placeholder="CONFIRM PASSWORD"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors tracking-[0.3em] font-bold placeholder:tracking-widest placeholder:text-gray-700"
                      />
                    </div>
                    {formErrors.confirmPassword && <p className="text-[10px] text-red-500 text-left pl-4 font-bold">{formErrors.confirmPassword}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between px-2">
              <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2 group cursor-pointer"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-yellow-500 border-yellow-500' : 'border-gray-700 group-hover:border-gray-600'}`}>
                  {rememberMe && <CheckCircle2 className="w-3 h-3 text-black" />}
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Remember Me</span>
              </button>
              
              {mode === 'signin' && (
                <button type="button" className="text-[10px] text-gray-700 hover:text-gray-500 font-bold uppercase tracking-widest transition-colors">
                  Forgot?
                </button>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left"
              >
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="group relative w-full h-16 bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center space-x-3 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,179,8,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoggingIn ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-xs font-black">Initializing...</span>
                </div>
              ) : (
                <>
                  {mode === 'signin' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span className="uppercase tracking-widest text-xs font-black">
                    {mode === 'signin' ? 'Verify Entry' : 'Establish Identity'}
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="flex justify-center items-center gap-6 opacity-30 pt-4">
             <ShieldCheck className="w-5 h-5 text-gray-400" />
             <Zap className="w-5 h-5 text-gray-400" />
             <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.4 }}
           transition={{ delay: 1 }}
           className="text-[9px] font-mono text-white tracking-[0.2em] uppercase"
        >
           Local Storage Encrypted Connection Established
        </motion.div>
      </div>
    </motion.div>
  );
}
