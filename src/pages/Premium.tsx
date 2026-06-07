import { useState } from 'react';
import { Crown, Sparkles, ShieldCheck, CheckCircle2, Crosshair } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PaymentFlow } from '../components/PaymentFlow';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const PREMIUM_PLANS = [
  {
    id: 'basic-pack',
    name: 'Basic Pack',
    price: 49,
    description: 'Perfect starting point for casual players.',
    features: ['Basic Aim Optimization', 'Red Dot Enhancement', 'Standard Support'],
    color: 'cyan'
  },
  {
    id: 'premium-pack',
    name: 'Premium Pack',
    price: 99,
    description: 'Advanced settings for competitive gameplay.',
    features: ['Advanced Aim Optimization', 'All Scopes Enhancement', 'Priority Support', 'No Recoil Configs (Basic)'],
    color: 'yellow'
  },
  {
    id: 'ultra-premium-pack',
    name: 'Ultra Premium Pack',
    price: 199,
    description: 'The ultimate config for esports level precision.',
    features: ['97% Headshot Guarantee', 'Pro Level Aim Lock', 'Zero Recoil Optimization', 'Admin Private Scopes', 'Lifetime Updates'],
    color: 'purple'
  }
];

export function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);
  const { profile } = useAuth();

  const isPurchased = (planName: string) => {
    if (profile?.activePlans?.includes('Website') || profile?.membershipStatus?.includes('Website')) return true;
    const planMap: any = {
      'Basic Pack': 'Basic',
      'Premium Pack': 'Premium',
      'Ultra Premium Pack': 'Ultra'
    };
    return profile?.activePlans?.includes(planMap[planName]);
  };

  const isWebsiteMember = profile?.activePlans?.includes('Website') || profile?.membershipStatus?.includes('Website');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 pb-32"
    >
      <header className="space-y-4 mt-8 text-center px-4">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-gradient-to-br from-yellow-400 to-yellow-600 mb-2 shadow-[0_20px_40px_rgba(250,204,21,0.2)] mx-auto"
        >
          <Crown className="w-8 h-8 text-black" fill="currentColor" />
        </motion.div>
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-yellow-500 uppercase tracking-tighter leading-none">
          Premium Arsenal
        </h1>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
          Elite level configurations chosen by pro players worldwide.
        </p>
      </header>

      <div className="space-y-8">
        {PREMIUM_PLANS.map((plan, index) => {
          const owned = isPurchased(plan.name);
          const unlockedByWebsite = isWebsiteMember && plan.name !== 'Website Premium Membership';
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "relative p-[2px] rounded-[2.5rem] transition-all",
                plan.color === 'cyan' ? 'bg-gradient-to-b from-cyan-500/40 to-transparent' :
                plan.color === 'yellow' ? 'bg-gradient-to-b from-yellow-500/40 to-transparent' :
                'bg-gradient-to-b from-purple-500/40 to-transparent',
                owned && "shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              )}
            >
              <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 relative overflow-hidden h-full border border-white/5">
                {owned && (
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ring-1 ring-green-500/20 tracking-tighter">
                    <CheckCircle2 className="w-3 h-3" /> {unlockedByWebsite ? 'Already Accessed in Website Premium' : 'Plan Active'}
                  </div>
                )}
                
                <div className="absolute -right-12 -bottom-12 opacity-[0.05] grayscale brightness-200">
                  <Crown className={cn("w-56 h-56", 
                    plan.color === 'cyan' ? 'text-cyan-500' :
                    plan.color === 'yellow' ? 'text-yellow-500' :
                    'text-purple-500'
                   )} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={cn("font-black text-2xl tracking-tighter uppercase leading-none",
                        plan.color === 'cyan' ? 'text-cyan-400' :
                        plan.color === 'yellow' ? 'text-yellow-500' :
                        'text-purple-400'
                      )}>{plan.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Optimized Core</p>
                      </div>
                    </div>
                    <div className={cn("px-5 py-2.5 border rounded-[1.25rem] font-black text-xl tracking-tighter shadow-xl bg-black/40",
                      plan.color === 'cyan' ? 'border-cyan-500/30 text-cyan-400 shadow-cyan-950/20' :
                      plan.color === 'yellow' ? 'border-yellow-500/30 text-yellow-500 shadow-yellow-950/20' :
                      'border-purple-500/30 text-purple-400 shadow-purple-950/20'
                    )}>
                      ₹{plan.price}
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 font-medium leading-relaxed italic opacity-80">
                    "{plan.description}"
                  </p>

                  <div className="space-y-3 pt-2">
                    {plan.features?.map((f, i) => (
                      <div key={i} className="flex items-center text-xs font-black text-gray-300 uppercase tracking-tight">
                        <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center mr-3 bg-white/5 border border-white/10 shadow-inner", 
                          plan.color === 'cyan' ? 'text-cyan-400' :
                          plan.color === 'yellow' ? 'text-yellow-500' :
                          'text-purple-400'
                        )}>
                           <ShieldCheck className="w-4 h-4" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>

                  {owned ? (
                    <Link 
                      to="/premium-library" 
                      className={cn("w-full py-5 mt-4 font-black rounded-2xl flex items-center justify-center space-x-3 transition-all text-white group uppercase tracking-widest text-xs",
                        plan.color === 'cyan' ? 'bg-cyan-600/10 border border-cyan-500/40 hover:bg-cyan-600/20' :
                        plan.color === 'yellow' ? 'bg-yellow-600/10 border border-yellow-500/40 hover:bg-yellow-600/20' :
                        'bg-purple-600/10 border border-purple-500/40 hover:bg-purple-600/20'
                      )}
                    >
                      <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                      <span>View Sensitivities</span>
                    </Link>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlan({ name: plan.name, price: plan.price })}
                      className={cn("w-full py-5 mt-4 font-black rounded-2xl flex items-center justify-center space-x-3 transition-all text-black uppercase tracking-widest text-xs shadow-2xl",
                        plan.color === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20' :
                        plan.color === 'yellow' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-yellow-500/20' :
                        'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-950/40'
                      )}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Unlock Now</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedPlan && (
        <PaymentFlow 
          planName={selectedPlan.name} 
          amount={selectedPlan.price} 
          onClose={() => setSelectedPlan(null)} 
        />
      )}
    </motion.div>
  );
}
