import { useState } from 'react';
import { Target, Smartphone, Crown, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { BRANDS } from '../data';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { AIGenerator } from '../components/AIGenerator';
import { Link } from 'react-router-dom';

export function Sensitivity() {
  const [activeBrand, setActiveBrand] = useState('All');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 pb-24"
    >
      <header className="space-y-1 mt-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="text-cyan-400 w-6 h-6" />
          AI Sensitivity
        </h1>
        <p className="text-sm text-gray-400">Perfect Free Fire aim configurations using AI.</p>
      </header>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
          <Smartphone className="w-3 h-3" /> Available Brands
        </label>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {['All', ...BRANDS].map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border",
                activeBrand === brand 
                  ? "bg-white text-black border-white" 
                  : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <AIGenerator activeBrand={activeBrand} />

      {/* Comparison Section */}
      <section className="space-y-4 pt-6 mt-6 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">AI vs Premium</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-cyan-400 mb-1">75-80%</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Headshot Rate</span>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-yellow-500 mb-1">95-97%</span>
            <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider">Premium HS Rate</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 text-sm mt-4">
          <h3 className="font-bold text-white">Why Upgrading to Premium Matters:</h3>
          <ul className="space-y-3">
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
               <span className="text-gray-300"><strong className="text-white">Pro Verification:</strong> AI uses raw logic calculations. Premium configs are manually tuned and verified by Pro players.</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
               <span className="text-gray-300"><strong className="text-white">Specific Updates:</strong> Premium gets updated after every game patch to handle hidden recoil changes.</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0" />
               <span className="text-gray-300"><strong className="text-white">Full DPI & Custom HUD:</strong> Gain access to precise DPI values, fire button sizing, and custom HUD layouts.</span>
             </li>
          </ul>
          
          <Link to="/premium" className="w-full flex items-center justify-center py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl mt-4 transition-colors">
            View Premium Plans <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Mini Reviews */}
      <section className="space-y-4 pt-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center">Premium User Reviews</h2>
        <div className="space-y-3">
          {[
            { tag: "Website Premium", text: "I used AI for a month and it was decent, but once I got the Website Premium, the DPI settings made my movements insane.", user: "Devil_FF" },
            { tag: "Ultra Plan", text: "Headshot rate went from 50% to 95%. Worth every single penny.", user: "Rahul_King" }
          ].map((r, i) => (
             <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 rounded font-bold uppercase">{r.tag}</span>
                  <div className="flex">
                    {[...Array(5)].map((_,j) => <Star key={j} className="w-3 h-3 text-yellow-500 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-gray-300 italic">"{r.text}"</p>
                <div className="text-[10px] text-gray-500 mt-2 text-right">- {r.user}</div>
             </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
