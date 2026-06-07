import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, ShieldCheck, Zap, Sparkles, Database, Cpu } from 'lucide-react';

const LOADING_MESSAGES = [
  { text: 'Initializing System...', icon: <Database className="w-5 h-5 text-gray-500" /> },
  { text: 'Loading AI Engine...', icon: <Cpu className="w-5 h-5 text-cyan-400" /> },
  { text: 'Verifying Resources...', icon: <Crosshair className="w-5 h-5 text-yellow-500" /> },
  { text: 'Preparing Experience...', icon: <Zap className="w-5 h-5 text-blue-400" /> }
];

export function Splash() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
         <img 
           src="/src/assets/images/sensi_hub_hero_bg_1780809282844.png" 
           alt="Hero Background" 
           className="w-full h-full object-cover opacity-30 grayscale contrast-125 scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] opacity-30" />
         
         {/* Scanning Line Animation */}
         <motion.div 
           initial={{ top: '-10%' }}
           animate={{ top: '110%' }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent shadow-[0_0_15px_rgba(234,179,8,0.5)] z-20"
         />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-16 w-full max-w-sm px-6">
        <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative"
        >
           {/* Pulsing Outer Ring */}
           <motion.div 
             animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
             transition={{ duration: 1.5, repeat: Infinity }}
             className="absolute -inset-16 border-2 border-yellow-500/30 rounded-full"
           />
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
             transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
             className="absolute -inset-8 border border-yellow-400/20 rounded-full"
           />
           
           <div className="w-36 h-36 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.4)] border border-yellow-400/50 p-7 group">
             <Crosshair className="w-full h-full text-black group-hover:rotate-90 transition-transform duration-1000" strokeWidth={3} />
           </div>
        </motion.div>

        <div className="space-y-4">
           <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="flex flex-col items-center"
           >
              <h2 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-60">Initializing Tactical Interface</h2>
              <h1 className="text-6xl font-black text-white tracking-widest uppercase leading-none italic">
                SENSI<br/><span className="text-yellow-500 not-italic">HUB</span>
              </h1>
           </motion.div>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]"
           >
             Professional Standards • 2026
           </motion.p>
        </div>

        {/* Dynamic Loading Stats */}
        <div className="w-full space-y-6">
           <div className="bg-black/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-yellow-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{LOADING_MESSAGES[msgIdx].text}</span>
                 </div>
                 <span className="text-[10px] font-mono text-yellow-500 font-bold">{( (msgIdx + 1) / LOADING_MESSAGES.length * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${((msgIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
                   className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                 />
              </div>
           </div>

           <div className="flex justify-around items-center opacity-60">
              <div className="flex flex-col items-center gap-2 scale-90">
                 <ShieldCheck className="w-6 h-6 text-yellow-500" />
                 <span className="text-[8px] font-black text-white uppercase tracking-tighter">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2 scale-110">
                 <Zap className="w-6 h-6 text-yellow-500" />
                 <span className="text-[8px] font-black text-white uppercase tracking-tighter">Optimized</span>
              </div>
              <div className="flex flex-col items-center gap-2 scale-90">
                 <Sparkles className="w-6 h-6 text-yellow-500" />
                 <span className="text-[8px] font-black text-white uppercase tracking-tighter">Elite</span>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-12 flex flex-col items-center gap-1 opacity-20">
         <p className="text-[8px] font-mono text-white racking-widest uppercase">System Core Version: SHA-256_ACTIVE</p>
         <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
    </div>
  );
}
