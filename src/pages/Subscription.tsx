import { useState } from 'react';
import { Crown, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { PaymentFlow } from '../components/PaymentFlow';

export function Subscription() {
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);

  const plans = [
    {
      name: 'Basic Pack',
      price: '₹49',
      amount: 49,
      features: ['Standard Sensitivity Configs', '2-Step optimization', 'Basic support'],
      color: 'silver',
      planKey: 'Basic'
    },
    {
      name: 'Premium Pack',
      price: '₹99',
      amount: 99,
      features: ['Premium Sensitivity Database', 'Patch support', 'Priority support', 'Gold Member Badge'],
      color: 'gold',
      planKey: 'Premium'
    },
    {
      name: 'Ultra Premium Pack',
      price: '₹199',
      amount: 199,
      features: ['Ultra-Rare Configs', 'DPI & HUD settings', 'Anti-recoil logic', 'Diamond Member Badge'],
      color: 'diamond',
      planKey: 'Ultra'
    },
    {
      name: 'Website Premium Membership',
      price: '₹299',
      amount: 299,
      features: [
        'Lifetime Full Access', 
        'RGB RGB Badge & VIP Crown', 
        'All future sensitivities included', 
        'Early access to AI features'
      ],
      color: 'website',
      popular: true,
      planKey: 'Website'
    }
  ];

  const ownedPlans = profile?.activePlans || [];
  const isWebsiteMember = profile?.membershipStatus?.includes('Website');
  const isAnyPremium = profile?.membershipStatus !== 'Free Member';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8 pb-24"
    >
      <header className="space-y-4 mt-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.3)] mb-2">
          <Crown className="w-8 h-8 text-black" fill="currentColor" />
        </div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Premium Access
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed px-4">
          Upgrade your experience with our specialized gaming configurations. Choose a plan that fits your competitive needs.
        </p>
      </header>

      {profile && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-gray-800">
              <ShieldAlert className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Current Status</p>
              <h3 className={cn("font-bold text-sm", 
                isAnyPremium ? 'text-yellow-500' : 'text-white'
              )}>
                {profile.membershipStatus}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-[10px] font-black uppercase text-gray-300">
            {isAnyPremium ? 'Active' : 'Free Member'}
          </span>
        </div>
      )}

      {isAnyPremium && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-3xl relative overflow-hidden"
        >
          <Crown className="absolute -right-4 -bottom-4 w-24 h-24 text-yellow-500 opacity-10" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                <h3 className="text-yellow-500 font-black uppercase tracking-widest text-xs">Premium Access Enabled</h3>
             </div>
             <div>
                <p className="text-white font-extrabold text-lg">Sensitivities Unlocked</p>
                <p className="text-gray-400 text-xs mt-1">You have active premium plans. Access your exclusive items in the library.</p>
             </div>
             <Link 
               to="/premium-library" 
               className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
             >
                <Sparkles className="w-4 h-4" /> Go to Premium Library
             </Link>
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {plans.map((plan, i) => {
          const isPlanOwned = ownedPlans.includes(plan.planKey) || (plan.planKey === 'Website' && isWebsiteMember);
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-[1px] transition-all",
                plan.color === 'website' ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' :
                plan.color === 'diamond' ? 'bg-gradient-to-b from-cyan-400 to-blue-600' :
                plan.color === 'gold' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
                'bg-gray-400'
              )}
            >
              <div className="bg-gray-900 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className={cn("text-lg font-bold text-sm", 
                    plan.color === 'website' ? 'text-red-400' : 
                    plan.color === 'diamond' ? 'text-cyan-400' :
                    plan.color === 'gold' ? 'text-yellow-500' : 'text-gray-300'
                  )}>
                    {plan.name}
                  </h3>
                  {isPlanOwned && (
                    <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">OWNED</span>
                  )}
                </div>
                <div className="mt-2 mb-6">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start text-[13px] text-gray-300 leading-tight">
                      <CheckCircle2 className={cn("w-4 h-4 mr-3 shrink-0 mt-0.5", 
                        plan.color === 'silver' ? 'text-gray-500' : 'text-yellow-500'
                      )} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

              <button 
                  disabled={isPlanOwned}
                  onClick={() => setSelectedPlan({ name: plan.name, price: plan.amount })}
                  className={cn(
                  "w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center space-x-2 tracking-widest text-xs uppercase",
                  isPlanOwned ? 'bg-gray-800/50 text-gray-400 border border-gray-800/50 shadow-none' :
                  plan.color === 'website' ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' :
                  plan.color === 'diamond' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                  plan.color === 'gold' ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                  'bg-gray-800 text-white hover:bg-gray-700'
                )}>
                  {isPlanOwned ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Access Active</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
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
