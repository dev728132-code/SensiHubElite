import { History, User, LogOut, Settings, CreditCard, ChevronRight, Crown, LogIn, Calendar, Star, Gem, Target, X, CheckCircle2, Ticket, Sparkles, Database, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, serverTimestamp, arrayUnion, db } from '../lib/storage';
import { PremiumBadge } from '../components/PremiumBadge';

import confetti from 'canvas-confetti';

export function Profile() {
  const { user, profile, login, logout } = useAuth();
  const [stats, setStats] = useState({ generated: 0, purchased: 0 });
  const [payments, setPayments] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchStatsAndPayments = async () => {
        try {
          const q = query(collection(db, 'users', user.uid, 'history'));
          const snap = await getDocs(q);
          let gen = 0;
          let pur = 0;
          snap.forEach(doc => {
            const data = doc.data();
            if (data.itemType === 'generated' || data.itemType === 'saved') gen++;
            if (data.itemType === 'purchased') pur++;
          });
          setStats({ generated: gen, purchased: pur });

          const pQ = query(collection(db, 'users', user.uid, 'payments'));
          const pSnap = await getDocs(pQ);
          const pList: any[] = [];
          pSnap.forEach(d => pList.push({ id: d.id, ...d.data(), ref: d.ref }));
          
          // Check for newly approved payments for celebration
          let shouldCelebrate = false;
          for (const p of pList) {
            if (p.status === 'verified' && !p.celebrated) {
              shouldCelebrate = true;
              await updateDoc(p.ref, { celebrated: true });
            }
          }
          if (shouldCelebrate) {
            triggerCelebration();
          }

          pList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPayments(pList);
        } catch (e) {
          console.error('Failed to get stats', e);
        }
      };
      fetchStatsAndPayments();
    }
  }, [user]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#eab308', '#a855f7', '#ef4444']
    });
    alert("🎉 Congratulations! Thank you for purchasing. Your premium benefits are now active.");
  };

  const redeemPromo = async () => {
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode || !user) return;
    setPromoLoading(true);
    setPromoMessage({ text: '', type: '' });
    
    try {
      // Very simple promo check logic
      const promoRef = doc(db, 'promoCodes', cleanCode);
      const pDoc = await getDoc(promoRef);
      if (pDoc.exists() && pDoc.data().active !== false) {
        const data = pDoc.data();
        if ((data.usedCount || 0) < (data.maxUses || 100)) {
          await updateDoc(promoRef, { usedCount: (data.usedCount || 0) + 1 });
          
          await setDoc(doc(db, 'users', user.uid, 'history', `promo_${Date.now()}`), {
             userId: user.uid, itemType: 'promo_redeemed', code: cleanCode, membershipBonus: data.membershipBonus || 'Premium Member', createdAt: serverTimestamp()
          });

          // Assume promo grants VIP
          const userRef = doc(db, 'users', user.uid);
          const bonus = data.membershipBonus || 'Premium Member';
          const planKey = bonus.includes('Website') ? 'Website' : 
                         bonus.includes('Ultra') ? 'Ultra' : 
                         bonus.includes('Premium') ? 'Premium' : 'Basic';
          
          await updateDoc(userRef, { 
            membershipStatus: bonus,
            activePlans: arrayUnion(planKey)
          });
          
          setPromoMessage({ text: `✅ Promo Code Applied Successfully! ${data.membershipBonus || 'Premium'} activated.`, type: 'success' });
          triggerCelebration();
        } else {
          setPromoMessage({ text: '❌ Code Limit Reached or Invalid.', type: 'error' });
        }
      } else {
        setPromoMessage({ text: '❌ Invalid or Expired Code.', type: 'error' });
      }
    } catch (e: any) {
      console.error(e);
      setPromoMessage({ text: `❌ Error applying code: ${e.message}`, type: 'error' });
    }
    setPromoLoading(false);
  };

  const getMembershipStyle = (status: string) => {
    if (status?.includes('Website')) {
      return { border: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse', icon: <Crown className="w-5 h-5 text-yellow-400" />, badge: 'Website Member', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]', label: '👑 Website Premium Member' };
    }
    if (status?.includes('Ultra')) {
      return { border: 'bg-gradient-to-tr from-cyan-300 to-blue-500', icon: <Gem className="w-5 h-5 text-cyan-300" />, badge: 'Diamond Badge', glow: 'shadow-[0_0_15px_rgba(103,232,249,0.5)]', label: '💎 Ultra Premium Member' };
    }
    if (status?.includes('Premium')) { // 99 plan
      return { border: 'bg-gradient-to-tr from-yellow-500 to-yellow-300', icon: <Star className="w-5 h-5 text-yellow-400 fill-current" />, badge: 'Gold Badge', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]', label: '⭐ Premium Member' };
    }
    if (status?.includes('Basic')) { // 49 plan
      return { border: 'bg-gradient-to-tr from-gray-400 to-gray-200', icon: <Target className="w-5 h-5 text-gray-300" />, badge: 'Silver Badge', glow: 'shadow-[0_0_10px_rgba(156,163,175,0.3)]', label: '⚡ Basic Member' };
    }
    return { border: 'bg-gray-700', icon: null, badge: 'Free Member', glow: '', label: 'Free Player' };
  };

  const style = getMembershipStyle(profile?.membershipStatus || '');

  if (user && !profile) {
    return <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Synchronizing Profile...</p>
    </div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-6 space-y-6 pb-24 relative"
    >
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="text-cyan-400 w-6 h-6" />
          Profile
        </h1>
        <button className="p-2 bg-gray-900 border border-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {user && profile ? (
        <>
          {/* Welcome Banner for Premium */}
          {profile.membershipStatus !== 'Free Member' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-600/20 to-transparent border-l-4 border-yellow-500 p-4 rounded-r-xl"
            >
              <div className="flex items-center gap-3">
                 <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                 <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">Welcome Back Premium Member</p>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Your premium benefits are active</p>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Admin Floating Button */}
          {user.email === 'dev728132@gmail.com' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed bottom-24 right-4 z-50"
            >
              <button 
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white font-extrabold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Target className="w-5 h-5 animate-spin-slow" />
                Admin Panel
              </button>
            </motion.div>
          )}

          {/* User Info Card */}
          <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center space-x-5 relative overflow-hidden group ${style.glow}`}>
            {style.icon && (
               <div className="absolute top-0 right-0 p-3 opacity-10 scale-150">
                 {style.icon}
               </div>
            )}
            <div className={`w-20 h-20 rounded-full p-[3px] z-10 ${style.border}`}>
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>
            <div className="z-10 flex-1">
              <h2 className="text-xl font-extrabold text-white">{profile.displayName}</h2>
              <div className="mt-1">
                <PremiumBadge status={profile.membershipStatus} />
                {profile.membershipStatus === 'Free Member' && (
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Free Player</span>
                )}
              </div>
              <div className="flex items-center space-x-1 mt-2 text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                <Calendar className="w-3 h-3" />
                <span id="user-joined-date">Joined: {profile.createdAt ? (typeof profile.createdAt === 'object' && 'toDate' in profile.createdAt ? (profile.createdAt as any).toDate().toLocaleDateString() : new Date(profile.createdAt).toLocaleDateString()) : '...'}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div id="user-stats-grid" className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-center hover:bg-gray-800 transition-colors">
              <div className="text-2xl font-extrabold text-cyan-400">{stats.generated}</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Generated Sensitivities</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-center hover:bg-gray-800 transition-colors">
              <div className="text-2xl font-extrabold text-yellow-500">{stats.purchased}</div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Premium Purchases</div>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 border-dashed relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Ticket className="w-16 h-16 text-cyan-500" /></div>
            <h3 className="font-bold text-white mb-2 flex items-center gap-2 relative z-10"><Ticket className="w-4 h-4 text-cyan-400" /> Redeem Promo Code</h3>
            <p className="text-xs text-gray-400 mb-4 relative z-10">Got a promo code? Enter it below to unlock instant benefits.</p>
            <div className="flex gap-2 relative z-10">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="PROMO-CODE"
                className="flex-1 bg-black border border-gray-800 rounded-xl px-4 text-sm font-mono text-center text-white focus:border-cyan-500 outline-none uppercase"
              />
              <button 
                onClick={redeemPromo} disabled={promoLoading || !promoCode}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold px-4 rounded-xl transition-colors text-sm"
              >
                {promoLoading ? 'Checking...' : 'Apply'}
              </button>
            </div>
            {promoMessage.text && (
              <p className={`text-xs font-bold mt-3 text-center ${promoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{promoMessage.text}</p>
            )}
          </div>

          {/* Payment Status Trackers */}
          {payments.length > 0 && (
             <div className="space-y-3">
               <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wider pl-2 mt-4 flex items-center gap-2">
                 <CreditCard className="w-4 h-4 text-gray-500" /> Recent Purchases
               </h3>
               {payments.slice(0, 3).map((p, i) => (
                 <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.planName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">₹{p.amount} • {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    {p.status === 'pending' && <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Pending</span>}
                    {p.status === 'verified' && <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                    {p.status === 'rejected' && <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><X className="w-3 h-3" /> Rejected</span>}
                 </div>
               ))}
             </div>
          )}

          {/* Menu Options */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mt-6">
            {profile.activePlans?.length ? (
               <MenuItem icon={<Database className="w-5 h-5 text-yellow-500" />} label="Premium Sensitivity Library" to="/premium-library" />
            ) : null}
            <MenuItem icon={<Crown className="w-5 h-5 text-yellow-500" />} label="Premium Plans" to="/premium" />
            <MenuItem icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />} label="Website Subscription" to="/subscription" />
            <MenuItem icon={<History className="w-5 h-5 text-gray-400" />} label="Sensitivity History" to="/history" />
            <MenuItem icon={<MessageSquare className="w-5 h-5 text-green-400" />} label="Admin Customer Support" to="/support" />
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg border border-gray-800">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-semibold text-gray-200">Sign Out</span>
              </div>
            </button>
          </div>
        </>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-black rounded-full mx-auto flex items-center justify-center border border-gray-800">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Not Signed In</h2>
            <p className="text-sm text-gray-400">Sign in to unlock premium tracking.</p>
          </div>
          <Link 
            to="/login"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center space-x-2 rounded-xl transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In to Access Vault</span>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function MenuItem({ icon, label, to, hideBorder }: { icon: React.ReactNode, label: string, to: string, hideBorder?: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors ${hideBorder ? '' : 'border-b border-gray-800'}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-black rounded-lg border border-gray-800">
          {icon}
        </div>
        <span className="font-semibold text-gray-200">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-600" />
    </Link>
  );
}

