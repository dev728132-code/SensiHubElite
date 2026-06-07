import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Zap, Download, Share2, Star, ShieldCheck, Gem, Crown, Target, Smartphone, Heart, Clock, AlertTriangle, Settings, CheckCircle2 } from 'lucide-react';
import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from '../lib/storage';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { PremiumBadge } from '../components/PremiumBadge';

 export function SensitivityDetail() {
  const { id } = useParams();
  const { profile, user } = useAuth();
  const [sensitivity, setSensitivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [applied, setApplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (user && sensitivity) {
      checkIfSaved();
    }
  }, [user, sensitivity]);

  const checkIfSaved = async () => {
    if (!user || !id) return;
    try {
      const histSnap = await getDocs(query(
        collection(db, 'users', user.uid, 'history'),
        where('configId', '==', id),
        where('itemType', '==', 'saved')
      ));
      if (histSnap.docs.length > 0) setIsSaved(true);
    } catch (e) {
      console.error("Error checking saved state:", e);
    }
  };

  const handleSaveToHistory = async () => {
    if (!user || !sensitivity || isSaved) return;
    setIsSaving(true);
    try {
      const historyId = `hist_${Date.now()}`;
      await setDoc(doc(db, 'users', user.uid, 'history', historyId), {
        userId: user.uid,
        itemType: 'saved',
        brand: sensitivity.brand,
        model: sensitivity.model,
        game: sensitivity.game,
        configName: sensitivity.name,
        configId: id,
        sensitivityData: JSON.stringify(sensitivity),
        createdAt: serverTimestamp()
      });
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  async function fetchDetail() {
    if (!id) return;
    try {
      const docRef = doc(db, 'sensitivities', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSensitivity({ id: snap.id, ...snap.data() });
      } else {
        setError('Sensitivity not found.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load sensitivity.');
    }
    setLoading(false);
  }

  const hasAccess = (sensPlan: string) => {
    const userPlans = profile?.activePlans || [];
    if (userPlans.includes('Website')) return true;
    if (userPlans.includes('Ultra')) return ['Basic', 'Premium', 'Ultra'].includes(sensPlan);
    if (userPlans.includes('Premium')) return ['Basic', 'Premium'].includes(sensPlan);
    if (userPlans.includes('Basic')) return sensPlan === 'Basic';
    return false;
  };

  const handleApply = () => {
    const textToCopy = `
Sensi Hub Config: ${sensitivity.name}
Device: ${sensitivity.brand} ${sensitivity.model}
Game: ${sensitivity.game}

General: ${sensitivity.general}
Red Dot: ${sensitivity.redDot}
2x Scope: ${sensitivity.scope2x}
4x Scope: ${sensitivity.scope4x}
6x Scope: ${sensitivity.scope6x || 'N/A'}
Sniper: ${sensitivity.sniperScope}
Free Look: ${sensitivity.freeLook}

Fire Button: 54%
DPI: 480
    `.trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
         <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
         <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Decrypting Config...</p>
      </div>
    );
  }

  if (error || !sensitivity) {
    return (
      <div className="min-h-screen bg-[#050505] p-6 flex flex-col items-center justify-center text-center space-y-6">
         <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
         </div>
         <h2 className="text-2xl font-black text-white">Oops! Config Missing</h2>
         <p className="text-gray-400 text-sm max-w-xs">{error || 'This sensitivity item does not exist or has been removed.'}</p>
         <Link to="/premium-library" className="px-8 py-3 bg-white text-black font-black rounded-xl uppercase tracking-widest">Back to Library</Link>
      </div>
    );
  }

  const locked = !hasAccess(sensitivity.plan);

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-gray-900 px-6 py-4 flex items-center justify-between">
        <Link to="/premium-library" className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </Link>
        <div className="flex gap-2">
           <button className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 text-gray-300"><Share2 className="w-5 h-5" /></button>
           <button className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 text-gray-300"><Heart className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="px-6 py-8 space-y-8">
        {/* Title Section */}
        <div className="space-y-3">
           <div className="flex items-center gap-2">
              <PremiumBadge status={sensitivity.plan + ' Pack'} />
              <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                 <Clock className="w-3 h-3" /> Updated Today
              </div>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">{sensitivity.name}</h1>
           <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1.5">
                 <Smartphone className="w-4 h-4 text-cyan-400" />
                 <span className="text-sm font-bold">{sensitivity.brand} {sensitivity.model}</span>
              </div>
           </div>
        </div>

        {/* Access Restriction Overlay */}
        {locked ? (
           <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
              <LockOverlay plan={sensitivity.plan} />
           </div>
        ) : (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8"
           >
              {/* Primary Stats */}
              <div className="grid grid-cols-2 gap-4">
                 <StatCard label="General Sensitivity" value={sensitivity.general} icon={<Target className="w-5 h-5" />} color="cyan" />
                 <StatCard label="Red Dot Scope" value={sensitivity.redDot} icon={<Zap className="w-5 h-5" />} color="red" />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 gap-4">
                 <StatCard label="2x Scope" value={sensitivity.scope2x} color="yellow" />
                 <StatCard label="4x Scope" value={sensitivity.scope4x} color="purple" />
                 <StatCard label="Sniper Scope" value={sensitivity.sniperScope} color="blue" />
                 <StatCard label="Free Look" value={sensitivity.freeLook} color="green" />
              </div>

              {/* Advanced Controls */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 space-y-6">
                 <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-500" /> Advanced Controls
                 </h3>
                 <div className="space-y-4">
                    <ControlRow label="Fire Button Size" value="54%" />
                    <ControlRow label="DPI Value" value="480 (Recommended)" />
                    <ControlRow label="Pointer Speed" value="Max" />
                    <ControlRow label="Touch Response" value="Ultra Fast" />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                 <button 
                   onClick={handleApply}
                   disabled={applied}
                   className={cn(
                     "h-16 font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all",
                     applied ? "bg-green-500 text-black" : "bg-white text-black"
                   )}
                 >
                    {applied ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                    <span className="text-xs uppercase tracking-tighter">{applied ? 'COPIED!' : 'APPLY'}</span>
                 </button>
                 
                 <button 
                   onClick={handleSaveToHistory}
                   disabled={isSaving || isSaved}
                   className={cn(
                     "h-16 border rounded-2xl flex items-center justify-center gap-3 transition-all",
                     isSaved ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" : "bg-gray-900 border-gray-800 text-white hover:bg-gray-800"
                   )}
                 >
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : isSaved ? <Star className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                    <span className="text-xs uppercase tracking-tighter">{isSaved ? 'SAVED' : 'SAVE'}</span>
                 </button>

                 <button 
                   onClick={() => {
                     navigator.share({
                       title: `Sensi Hub - ${sensitivity.name}`,
                       text: `Check out this pro sensitivity for ${sensitivity.brand} ${sensitivity.model}!`,
                       url: window.location.href
                     }).catch(() => {
                        handleApply();
                     });
                   }}
                   className="col-span-2 h-16 bg-gray-900 border border-gray-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all"
                 >
                    <Share2 className="w-6 h-6 text-cyan-400" /> SHARE WITH FRIENDS
                 </button>
              </div>
           </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon?: React.ReactNode, color: string }) {
  const colors: any = {
    cyan: 'from-cyan-500 to-cyan-400 text-cyan-400',
    red: 'from-red-500 to-red-400 text-red-500',
    yellow: 'from-yellow-500 to-yellow-400 text-yellow-500',
    purple: 'from-purple-500 to-purple-400 text-purple-400',
    blue: 'from-blue-500 to-blue-400 text-blue-500',
    green: 'from-green-500 to-green-400 text-green-500',
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-5 relative overflow-hidden group">
       <div className={cn("absolute top-0 right-0 p-4 opacity-5 scale-150 group-hover:scale-[2] transition-transform", colors[color].split(' ')[2])}>
          {icon || <Target className="w-6 h-6" />}
       </div>
       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</p>
       <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{value}</span>
          <span className="text-xs font-black text-gray-600">%</span>
       </div>
       <div className={cn("h-1 w-12 rounded-full mt-3 bg-gradient-to-r", colors[color].split(' ').slice(0,2).join(' '))} />
    </div>
  );
}

function ControlRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
       <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
       <span className="text-white font-black text-sm">{value}</span>
    </div>
  );
}

function LockOverlay({ plan }: { plan: string }) {
  return (
    <>
       <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
       </div>
       <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Access Forbidden</h2>
       <p className="text-gray-400 text-sm max-w-xs mx-auto">This configuration is exclusive to <strong className="text-white">{plan} Pack</strong> members. Upgrade your plan to unlock full access.</p>
       <Link 
          to="/premium" 
          className="block w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black rounded-2xl uppercase tracking-widest shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
       >
          Upgrade to {plan} Pack
       </Link>
    </>
  );
}

