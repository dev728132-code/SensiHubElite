import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, ChevronLeft, Search, Filter, Lock, Unlock, Zap, Database, Download, Star, Gem, Crown, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db, collection, query, getDocs, orderBy, where } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { PremiumBadge } from '../components/PremiumBadge';

export function PremiumLibrary() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sensitivities, setSensitivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activePlanFilter, setActivePlanFilter] = useState('All');

  const userPlans = profile?.activePlans || [];
  
  // Access hierarchy logic
  const hasAccess = (sensPlan: string) => {
    if (userPlans.includes('Website')) return true; // All access
    if (userPlans.includes('Ultra')) {
       return ['Basic', 'Premium', 'Ultra'].includes(sensPlan);
    }
    if (userPlans.includes('Premium')) {
       return ['Basic', 'Premium'].includes(sensPlan);
    }
    if (userPlans.includes('Basic')) {
       return sensPlan === 'Basic';
    }
    return false;
  };

  useEffect(() => {
    if (!authLoading && !profile?.activePlans?.length && profile?.membershipStatus === 'Free Member') {
      navigate('/premium');
    }
    fetchSensitivities();
  }, [profile, authLoading]);

  async function fetchSensitivities() {
    setLoading(true);
    try {
      // Fetch all premium sensitivities
      const q = query(
        collection(db, 'sensitivities'),
        where('type', '==', 'premium'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach((d: any) => {
        const data = d.data();
        list.push({ id: d.id, ...data, accessible: hasAccess(data.plan) });
      });
      setSensitivities(list);
    } catch (e) {
      console.error("Error fetching library:", e);
    }
    setLoading(false);
  }

  const filtered = sensitivities.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.model.toLowerCase().includes(search.toLowerCase()) ||
                          s.brand.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activePlanFilter === 'All' ? true : s.plan === activePlanFilter;
    return matchesSearch && matchesFilter;
  });

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Website': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Ultra': return <Gem className="w-4 h-4 text-purple-400" />;
      case 'Premium': return <Star className="w-4 h-4 text-yellow-400 fill-current" />;
      case 'Basic': return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default: return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Website': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Ultra': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Premium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Basic': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      default: return 'text-gray-400 bg-gray-900 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Link>
          <div>
             <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Premium Library
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] uppercase font-black rounded border border-yellow-500/20">Pro Content</span>
             </h1>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Exclusive Sensitivity Storage</p>
          </div>
        </div>
      </header>

      {/* Hero / Status */}
      <div className="px-6 py-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-6 relative overflow-hidden mb-8"
         >
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Crown className="w-32 h-32 text-yellow-500" />
            </div>
            <div className="relative z-10 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                     <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                     <h2 className="text-white font-black text-xl">Welcome Back, {profile?.displayName?.split(' ')[0]}!</h2>
                     <div className="flex items-center gap-2 mt-1">
                        <PremiumBadge status={profile?.membershipStatus} />
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">Benefits Active</p>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2 pt-2">
                  {userPlans.map(p => (
                     <span key={p} className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", getPlanColor(p))}>
                        {p} Active
                     </span>
                  ))}
               </div>
            </div>
         </motion.div>

         {/* Filters */}
         <div className="space-y-4 mb-6">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by device or config name..."
                  className="w-full h-14 bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
               />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
               <Filter className="w-4 h-4 text-gray-500 shrink-0 mx-2" />
               {['All', 'Basic', 'Premium', 'Ultra', 'Website'].map(f => (
                  <button 
                     key={f}
                     onClick={() => setActivePlanFilter(f)}
                     className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                        activePlanFilter === f ? "bg-yellow-500 text-black border-yellow-500 font-black" : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"
                     )}
                  >
                     {f}
                  </button>
               ))}
            </div>
         </div>

         {/* Content Grid */}
         <div className="grid gap-4">
            {loading ? (
               <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-none">Accessing Vault...</p>
               </div>
            ) : filtered.length === 0 ? (
               <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed">
                  <Database className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No premium configs found matching your search.</p>
               </div>
            ) : (
               filtered.map((s, idx) => (
                  <motion.div 
                     key={s.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className={cn(
                        "group relative bg-gray-900/80 border rounded-3xl p-5 flex flex-col gap-4 overflow-hidden shadow-xl transition-all",
                        s.accessible ? "border-gray-800 hover:border-yellow-500/50" : "border-gray-900/50 opacity-60"
                     )}
                  >
                     {/* Lock/Unlock overlay for inaccessible items */}
                     {!s.accessible && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3">
                           <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
                              <Lock className="w-6 h-6 text-red-500" />
                           </div>
                           <p className="text-red-400 font-black uppercase text-[10px] tracking-widest">{s.plan} Plan Required</p>
                           <Link to="/premium" className="px-4 py-1.5 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-wider hover:scale-105 transition-transform">Upgrade Now</Link>
                        </div>
                     )}

                     <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 bg-black transition-all group-hover:scale-110", s.accessible ? "border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "border-gray-800")}>
                               {getPlanIcon(s.plan)}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h3 className="font-extrabold text-white text-lg tracking-tight leading-none">{s.name}</h3>
                                 <PremiumBadge status={s.plan + ' Pack'} showIcon={false} />
                              </div>
                              <p className="text-gray-400 text-xs mt-1.5 font-medium">{s.brand} • {s.model}</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                           <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Added</span>
                           <span className="text-[10px] text-gray-400 font-mono">
                              {s.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'}
                           </span>
                        </div>
                     </div>

                     {/* Sensitivity Preview */}
                     <div className="grid grid-cols-4 gap-2 py-1">
                        {[
                          { label: 'GEN', val: s.general },
                          { label: 'RED', val: s.redDot },
                          { label: '2X', val: s.scope2x },
                          { label: '4X', val: s.scope4x }
                        ].map(stat => (
                          <div key={stat.label} className="bg-black/50 p-2 rounded-xl border border-gray-800/50 text-center">
                             <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter mb-0.5">{stat.label}</p>
                             <p className="text-sm font-black text-white leading-none">{stat.val}</p>
                          </div>
                        ))}
                     </div>

                     <div className="flex gap-3 pt-2">
                        <Link 
                           to={`/sensitivity/${s.id}`} 
                           className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
                        >
                           <Zap className="w-4 h-4 text-yellow-500" /> View All Settings
                        </Link>
                        <button className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex items-center justify-center transition-all">
                           <Download className="w-5 h-5" />
                        </button>
                     </div>
                  </motion.div>
               ))
            )}
         </div>
      </div>
    </div>
  );
}
