import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, CreditCard, LayoutDashboard, Database, Crosshair, X, ChevronLeft, Search, Check, Ticket, TrendingUp, Settings, Trash2, Edit, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, doc, updateDoc, orderBy, collectionGroup, setDoc, serverTimestamp, deleteDoc, getDoc, arrayUnion, db, addDoc } from '../../lib/storage';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-start overflow-hidden">
      <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-300" />
          </Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></span>
            Gaming Exp Admin
          </h1>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase rounded-lg">Admin Active</span>
        </div>
      </header>

      <div className="flex w-full flex-1 overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Sidebar */}
        <div className="w-20 md:w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 flex flex-col shrink-0 z-10">
          <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
             <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">Main</div>
            <AdminTab icon={<LayoutDashboard />} label="Overview" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <AdminTab icon={<Users />} label="Users & Premium" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            <AdminTab icon={<CreditCard />} label="Payments" isActive={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
            
             <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">Management</div>
            <AdminTab icon={<Ticket />} label="Promo Codes" isActive={activeTab === 'promos'} onClick={() => setActiveTab('promos')} />
            <AdminTab icon={<Crosshair />} label="Sensitivities" isActive={activeTab === 'sensitivities'} onClick={() => setActiveTab('sensitivities')} />
            <AdminTab icon={<Database />} label="AI Manager" isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
            
             <div className="px-4 mt-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">System</div>
            <AdminTab icon={<TrendingUp />} label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <AdminTab icon={<Settings />} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
            {activeTab === 'users' && <UsersView key="users" />}
            {activeTab === 'payments' && <PaymentsView key="payments" />}
            {activeTab === 'promos' && <PromosView key="promos" />}
            {activeTab === 'sensitivities' && <SensitivitiesView key="sensitivities" />}
            {(activeTab === 'ai' || activeTab === 'analytics' || activeTab === 'settings') && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Settings className="w-16 h-16 mb-4 opacity-20" />
                  <h2 className="text-xl font-bold text-white mb-2">Module Coming Soon</h2>
                  <p>This panel is currently under development.</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AdminTab({ icon, label, isActive, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 mx-3 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-red-600/20 to-red-500/5 text-red-500 border border-red-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'}`}
      title={label}
    >
      <div className={isActive ? 'text-red-500' : 'text-gray-400'}>
        {icon}
      </div>
      <span className="hidden md:block font-bold text-sm">{label}</span>
    </button>
  );
}

// ==========================================
// Sub-Views
// ==========================================

function DashboardView() {
  const [stats, setStats] = useState<any>({
    users: 0, purchases: 0, pending: 0, approved: 0, rejected: 0, premium: 0, dailyRev: 0, monthlyRev: 0, ultra: 0, basic: 0, website: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const uSnap = await getDocs(collection(db, 'users'));
        const pSnap = await getDocs(collectionGroup(db, 'payments'));
        
        let premiumCount = 0, ultraCount = 0, websiteCount = 0, basicCount = 0;
        uSnap.forEach(d => {
           const mem = d.data().membershipStatus;
           if (mem && mem !== 'Free Member') {
             premiumCount++;
             if (mem.includes('Ultra')) ultraCount++;
             else if (mem.includes('Website')) websiteCount++;
             else if (mem.includes('Premium')) basicCount++; // Standard
             else basicCount++; // fallback
           }
        });

        let pend = 0, app = 0, rej = 0, rev = 0;
        pSnap.forEach(d => {
          const s = d.data().status;
          if (s === 'pending') pend++;
          if (s === 'verified') {
            app++;
            rev += Number(d.data().amount) || 0;
          }
          if (s === 'rejected') rej++;
        });

        setStats({
          users: uSnap.size, purchases: pSnap.size, pending: pend, approved: app, rejected: rej, 
          premium: premiumCount, dailyRev: rev, monthlyRev: rev, ultra: ultraCount, basic: basicCount, website: websiteCount
        });
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-extrabold text-white">System Overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.dailyRev}`} color="green" icon={<CreditCard />} />
        <StatCard title="Total Users" value={stats.users} color="cyan" icon={<Users />} />
        <StatCard title="Total Premium" value={stats.premium} color="yellow" icon={<Crown/>} />
        <StatCard title="Pending Payments" value={stats.pending} color="purple" icon={<TrendingUp/>} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
           <h3 className="font-bold text-white mb-4">Membership Breakdown</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Website Members</span><span className="font-bold text-red-400">{stats.website}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Ultra Premium</span><span className="font-bold text-purple-400">{stats.ultra}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Standard Premium</span><span className="font-bold text-yellow-400">{stats.basic}</span></div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-800"><span className="text-gray-400 text-sm font-bold">Total Premium</span><span className="font-extrabold text-white">{stats.premium}</span></div>
           </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
           <h3 className="font-bold text-white mb-4">Payment Stats</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Total Requests</span><span className="font-bold text-blue-400">{stats.purchases}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Approved</span><span className="font-bold text-green-400">{stats.approved}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Pending Verification</span><span className="font-bold text-yellow-400">{stats.pending}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Rejected</span><span className="font-bold text-red-500">{stats.rejected}</span></div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, color, icon }: any) {
  const colors: any = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    green: 'text-green-400 border-green-500/30 bg-green-500/10',
    red: 'text-red-400 border-red-500/30 bg-red-500/10',
  };
  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} flex flex-col relative overflow-hidden`}>
      <div className="absolute right-[-10px] top-[-10px] opacity-10 scale-150">{icon}</div>
      <span className="text-xs uppercase tracking-wider font-extrabold mt-1 opacity-70 mb-2 z-10">{title}</span>
      <span className="text-3xl font-black z-10">{value}</span>
    </div>
  );
}

function PaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const pSnap = await getDocs(query(collectionGroup(db, 'payments'), orderBy('createdAt', 'desc')));
      const list: any[] = [];
      pSnap.forEach(d => list.push({ id: d.id, ref: d.ref, ...d.data() }));
      setPayments(list);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleAction(payment: any, status: 'verified' | 'rejected') {
    try {
      await updateDoc(payment.ref, { status, celebrated: false });
      
      if (status === 'verified') {
        const userRef = doc(db, 'users', payment.userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        
        let newStatus = userData?.membershipStatus || 'Free Member';
        const currentPlans = userData?.activePlans || [];
        
        // Map plan names to standardized values
        const planMap: any = {
           'Basic Pack': 'Basic',
           'Premium Pack': 'Premium',
           'Ultra Premium Pack': 'Ultra',
           'Website Premium Membership': 'Website'
        };
        
        const planKey = planMap[payment.planName] || payment.planName;
        
        // Define hierarchy
        const hierarchy = ['Free Member', 'Basic', 'Premium', 'Ultra', 'Website'];
        const getRank = (s: string) => {
           if (s.includes('Website')) return 4;
           if (s.includes('Ultra')) return 3;
           if (s.includes('Premium')) return 2;
           if (s.includes('Basic')) return 1;
           return 0;
        };

        const incomingRank = getRank(planKey);
        const currentRank = getRank(newStatus);
        
        if (incomingRank > currentRank) {
           if (planKey === 'Website') newStatus = 'Website Premium Membership';
           else if (planKey === 'Ultra') newStatus = 'Ultra Premium Member';
           else if (planKey === 'Premium') newStatus = 'Premium Member';
           else if (planKey === 'Basic') newStatus = 'Basic Member';
        }
        
        await updateDoc(userRef, { 
          membershipStatus: newStatus,
          activePlans: arrayUnion(planKey),
          lastActivationDate: serverTimestamp()
        });

        const historyId = `hist_${Date.now()}`;
        await setDoc(doc(db, 'users', payment.userId, 'history', historyId), {
          userId: payment.userId, 
          itemType: 'purchased', 
          planName: payment.planName,
          configName: `${payment.planName} Activated`, 
          createdAt: serverTimestamp()
        });
      }

      fetchPayments();
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to update status");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  }

  const filtered = payments.filter(p => filter === 'all' ? true : p.status === filter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Payment Management</h2>
        <div className="flex items-center gap-2">
           <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-red-500">
             <option value="all">All</option>
             <option value="pending">Pending</option>
             <option value="verified">Approved</option>
             <option value="rejected">Rejected</option>
           </select>
           <button onClick={fetchPayments} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold text-white transition-colors">Refresh</button>
        </div>
      </div>
      
      {errorMsg && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl text-sm">{errorMsg}</div>}
      
      <div className="space-y-4">
        {loading ? <div className="text-center py-10 text-gray-500">Loading...</div> : filtered.length === 0 ? <div className="text-center py-10 bg-gray-900/50 rounded-2xl border border-gray-800 text-gray-400">No payment records found.</div> : null}
        {filtered.map(p => (
          <div key={p.id} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 hover:border-gray-700 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-white text-lg">{p.userName}</h3>
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                  p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                  p.status === 'verified' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                  'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>{p.status === 'verified' ? 'Approved' : p.status}</span>
              </div>
              <p className="text-sm text-gray-300">Plan Requested: <span className="text-cyan-400 font-bold">{p.planName}</span> (₹{p.amount})</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-xs font-mono text-gray-500 bg-black px-2 py-1 rounded border border-gray-800">UTR: <span className="text-yellow-400 font-bold uppercase">{p.utrNumber}</span></p>
                <p className="text-xs text-gray-600">Mobile: {p.mobileNumber}</p>
              </div>
              <p className="text-[10px] text-gray-600 mt-3">{p.createdAt ? new Date(p.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
            {p.status === 'pending' && (
              <div className="flex md:flex-col gap-3 items-center justify-center">
                <button onClick={() => handleAction(p, 'verified')} className="w-full md:w-32 py-2 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => handleAction(p, 'rejected')} className="w-full md:w-32 py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PromosView() {
  const [promos, setPromos] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({ code: '', discount: 100, maxUses: 10, membershipBonus: 'Website Premium Membership', active: true });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchPromos(); }, []);

  async function fetchPromos() {
    const snap = await getDocs(query(collection(db, 'promoCodes')));
    const list: any[] = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data(), ref: d.ref }));
    setPromos(list);
  }

  async function handleSave() {
    if (!form.code) {
      setErrorMsg('Please enter a promo code');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'promoCodes', form.code.toUpperCase()), { ...form, code: form.code.toUpperCase(), usedCount: 0, createdAt: serverTimestamp() });
      setAdding(false);
      setSuccessMsg('Promo code created successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchPromos();
    } catch (e: any) {
       console.error(e);
       setErrorMsg("Error: " + e.message);
       setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Promo Codes</h2>
        <button onClick={() => setAdding(true)} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-colors">+ New Code</button>
      </div>

      {errorMsg && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl text-sm font-bold text-center">{errorMsg}</div>}
      {successMsg && <div className="p-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl text-sm font-bold text-center">{successMsg}</div>}

      {adding && (
         <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4">
           <h3 className="font-bold text-white">Create Promo Code</h3>
           <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="CODE (e.g. FFVIP50)" className="w-full bg-black border border-gray-800 px-4 py-3 rounded-xl text-white outline-none focus:border-red-500 uppercase font-mono" />
              <input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: Number(e.target.value)})} placeholder="Max Uses" className="w-full bg-black border border-gray-800 px-4 py-3 rounded-xl text-white outline-none focus:border-red-500" />
              <select value={form.membershipBonus} onChange={e => setForm({...form, membershipBonus: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 rounded-xl text-white outline-none focus:border-red-500 col-span-2 md:col-span-1">
                 <option value="Premium Member">Premium Member</option>
                 <option value="Ultra Premium Member">Ultra Premium Member</option>
                 <option value="Website Premium Membership">Website Premium Membership</option>
              </select>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setAdding(false)} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl">Cancel</button>
             <button 
               onClick={handleSave} 
               disabled={isSaving}
               className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Create Code'}
             </button>
           </div>
         </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
         {promos.map(pr => (
            <div key={pr.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-5"><Ticket className="w-16 h-16 text-red-500" /></div>
               <div className="flex justify-between items-start mb-2 relative z-10">
                 <span className="text-xl font-mono font-black text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20">{pr.code}</span>
                 <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${pr.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-500'}`}>{pr.active ? 'Active' : 'Disabled'}</span>
               </div>
               <div className="space-y-1 mt-4 relative z-10 text-sm">
                 <p className="text-gray-400">Bonus: <strong className="text-white">{pr.membershipBonus}</strong></p>
                 <p className="text-gray-400">Uses: <strong className="text-yellow-400">{pr.usedCount}</strong> / {pr.maxUses}</p>
               </div>
               <div className="flex gap-2 mt-4 relative z-10 border-t border-gray-800 pt-4">
                  <button onClick={async () => { await updateDoc(pr.ref, { active: !pr.active }); fetchPromos(); }} className="flex-1 py-2 bg-gray-800 rounded-lg text-xs font-bold text-white hover:bg-gray-700">Toggle active</button>
                  <button onClick={async () => { await deleteDoc(pr.ref); fetchPromos(); }} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4"/></button>
               </div>
            </div>
         ))}
      </div>
    </motion.div>
  );
}

function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userRecords, setUserRecords] = useState<any>({ payments: [], history: [] });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const snap = await getDocs(query(collection(db, 'users')));
    const list: any[] = [];
    snap.forEach(d => list.push({ id: d.id, ref: d.ref, ...d.data() }));
    setUsers(list);
  }

  async function fetchUserDetails(u: any) {
    setSelectedUser(u);
    const pSnap = await getDocs(query(collection(db, 'users', u.id, 'payments')));
    const pList: any[] = [];
    pSnap.forEach(d => pList.push(d.data()));

    const hSnap = await getDocs(query(collection(db, 'users', u.id, 'history')));
    const hList: any[] = [];
    hSnap.forEach(d => hList.push(d.data()));

    setUserRecords({ payments: pList, history: hList });
  }

  const filtered = users.filter(u => 
    u.displayName.toLowerCase().includes(search.toLowerCase()) || 
    u.membershipStatus?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedUser) {
    return (
       <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center gap-4">
             <button onClick={() => setSelectedUser(null)} className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700">
               <ChevronLeft className="w-5 h-5 text-gray-300" />
             </button>
             <h2 className="text-2xl font-bold text-white">User Details</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             <div className="md:col-span-1 border border-gray-800 bg-gray-900 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
               <img src={selectedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.displayName}`} alt="" className="w-24 h-24 rounded-full border-4 border-gray-800" />
               <div>
                  <h3 className="font-bold text-xl text-white">{selectedUser.displayName}</h3>
                  <p className="text-sm text-gray-400">{selectedUser.email}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {selectedUser.userId}</p>
               </div>
               <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-500 rounded-xl text-xs font-black uppercase tracking-wider border border-yellow-500/30">
                 {selectedUser.membershipStatus || 'Free Member'}
               </span>
               <div className="w-full text-left pt-4 border-t border-gray-800 space-y-2 text-sm mt-4">
                  <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="text-white font-bold">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Payments</span><span className="text-white font-bold">{userRecords.payments.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Activity</span><span className="text-white font-bold">{userRecords.history.length}</span></div>
               </div>
             </div>

             <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                   <h3 className="font-bold text-white mb-4 text-lg">Financial History</h3>
                   <div className="space-y-3">
                      {userRecords.payments.length === 0 ? <p className="text-sm text-gray-500">No payment records found.</p> : userRecords.payments.map((p: any, i: number) => (
                         <div key={i} className="flex justify-between items-center bg-black border border-gray-800 p-3 rounded-xl">
                            <div>
                               <p className="font-bold text-sm text-white">{p.planName} <span className="text-gray-500 font-normal ml-2">₹{p.amount}</span></p>
                               <p className="text-xs text-gray-500 mt-1">UTR: {p.utrNumber}</p>
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                               p.status === 'verified' ? 'bg-green-500/20 text-green-500' :
                               p.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                               'bg-yellow-500/20 text-yellow-500'
                            }`}>{p.status}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                   <h3 className="font-bold text-white mb-4 text-lg">Platform Activity</h3>
                   <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                      {userRecords.history.length === 0 ? <p className="text-sm text-gray-500">No activity recorded.</p> : userRecords.history.map((h: any, i: number) => (
                         <div key={i} className="flex justify-between items-center bg-black border border-gray-800 p-3 rounded-xl">
                            <div>
                               <p className="font-bold text-sm text-white">{h.itemType === 'promo_redeemed' ? `Redeemed Promo: ${h.code}` : h.configName}</p>
                               <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{h.itemType === 'generated' ? 'Generated DB' : h.itemType === 'saved' ? 'Saved Preset' : h.itemType === 'purchased' ? 'Premium Item' : h.itemType}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Users Database</h2>
      
      <div className="relative">
        <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or membership..." 
          className="w-full h-14 pl-12 pr-4 bg-gray-900 border border-gray-800 rounded-2xl text-sm focus:border-red-500 outline-none transition-colors text-white"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => (
          <div key={u.id} className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
            {u.membershipStatus !== 'Free Member' && <div className="absolute top-0 right-0 p-3 opacity-10"><Crown className="w-12 h-12 text-yellow-500" /></div>}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden shrink-0 border-2 border-gray-700">
                {u.photoURL ? <img src={u.photoURL} alt="" /> : <Users className="w-6 h-6 m-2.5 text-gray-500" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{u.displayName}</h3>
                <p className="text-[10px] text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="relative z-10 border-t border-gray-800/50 pt-2 mt-1">
              <p className={`text-[11px] font-black uppercase tracking-wider ${u.membershipStatus === 'Free Member' ? 'text-gray-500' : 'text-yellow-400'}`}>{u.membershipStatus || 'Free Member'}</p>
              <p className="text-[10px] text-gray-600 mt-1">Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            
             <div className="flex gap-2 mt-2">
                 <button onClick={() => fetchUserDetails(u)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-[10px] font-bold text-white uppercase transition-colors">View Details</button>
                 <select 
                    value={u.membershipStatus} 
                    onChange={async (e) => { 
                      const newStatus = e.target.value;
                      const planKey = newStatus.includes('Website') ? 'Website' : 
                                     newStatus.includes('Ultra') ? 'Ultra' : 
                                     newStatus.includes('Premium') ? 'Premium' : 
                                     newStatus.includes('Basic') ? 'Basic' : null;
                      
                      const updateData: any = { membershipStatus: newStatus };
                      if (planKey) {
                        updateData.activePlans = arrayUnion(planKey);
                      } else {
                        updateData.activePlans = [];
                      }
                      
                      await updateDoc(u.ref, updateData); 
                      fetchUsers(); 
                    }}
                    className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-[10px] font-bold text-white uppercase outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                 >
                    <option value="Free Member">Free</option>
                    <option value="Premium Member">Premium</option>
                    <option value="Ultra Premium Member">Ultra</option>
                    <option value="Website Premium Membership">Website</option>
                 </select>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SensitivitiesView() {
  const [sensitivities, setSensitivities] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [showConfigOptions, setShowConfigOptions] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: 'Ultimate Config', brand: 'Apple', model: 'iPhone 15 Pro Max', game: 'Free Fire',
    general: 100, redDot: 100, scope2x: 100, scope4x: 100, scope6x: 100, sniperScope: 100, freeLook: 100,
    type: 'premium', plan: 'Basic'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSensitivities();
  }, []);

  async function fetchSensitivities() {
    try {
      const snap = await getDocs(query(collection(db, 'sensitivities'), orderBy('createdAt', 'desc')));
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data(), ref: d.ref }));
      setSensitivities(list);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addDoc('sensitivities', { ...form, createdAt: serverTimestamp() });
      setSuccessMsg("Configuration Added Successfully!");
      setTimeout(() => setSuccessMsg(''), 3000);
      setAdding(false);
      setShowConfigOptions(false);
      fetchSensitivities();
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Error: " + e.message);
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (ref: any) => {
    try {
      await deleteDoc(ref);
      fetchSensitivities();
    } catch (e) {
      console.error(e);
    }
  };

  if (adding) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl pb-24 mx-auto">
        <div className="flex justify-between items-center bg-gray-900/80 p-4 rounded-full border border-gray-800">
          <h2 className="text-xl font-bold text-white px-4">Create Configuration</h2>
          <button onClick={() => setAdding(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {!showConfigOptions ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Config Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-red-500 outline-none text-white transition-colors" />
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Game / Target</label>
                <input type="text" value={form.game} onChange={e => setForm({...form, game: e.target.value})} className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-red-500 outline-none text-white transition-colors" />
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Device Brand</label>
                <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-red-500 outline-none text-white transition-colors" />
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Device Model</label>
                <input type="text" value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-red-500 outline-none text-white transition-colors" />
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative">
              <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-red-500" />
                Sensitivity Values
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['general', 'redDot', 'scope2x', 'scope4x', 'scope6x', 'sniperScope', 'freeLook'].map((field) => (
                  <div key={field} className="relative group">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider absolute -top-2 left-3 bg-gray-900 px-1 z-10">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                    <input 
                      type="number" 
                      value={(form as any)[field]} 
                      onChange={e => setForm({...form, [field]: Number(e.target.value)})}
                      className="w-full h-14 px-4 bg-black border border-gray-800 rounded-lg text-lg font-black focus:border-red-500 outline-none text-white text-center transition-colors hover:border-gray-700" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowConfigOptions(true)} className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:scale-[1.02] text-white font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Continue to Placement
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-900/80 border border-gray-800 p-8 rounded-3xl space-y-8 backdrop-blur-md">
            <div>
              <h3 className="font-extrabold text-2xl text-white">Placement Rules</h3>
              <p className="text-gray-400 text-sm mt-1">Where will this configuration be accessible?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Access Category</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setForm({...form, type: 'premium'})} className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${form.type === 'premium' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-700'}`}>Premium Sensitivity</button>
                  <button onClick={() => setForm({...form, type: 'ai'})} className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${form.type === 'ai' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-700'}`}>AI Generated Source</button>
                </div>
              </div>

              {form.type === 'premium' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Target Plan Level</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {['Basic', 'Premium', 'Ultra', 'Website'].map(plan => (
                       <button key={plan} onClick={() => setForm({...form, plan})} className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${form.plan === plan ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-700'}`}>{plan}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button onClick={() => setShowConfigOptions(false)} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors">Back</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold rounded-xl transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                {isSaving ? 'Processing...' : 'Save Configuration'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-white">Sensitivity Database</h2>
         <button onClick={() => setAdding(true)} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:scale-105">+ Upload Config</button>
      </div>

      {successMsg && <div className="p-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl text-sm font-bold text-center">{successMsg}</div>}
      {errorMsg && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl text-sm font-bold text-center">{errorMsg}</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensitivities.length === 0 ? (
           <div className="col-span-full py-20 text-center text-gray-500 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No configurations stored.</p>
           </div>
        ) : (
          sensitivities.map(s => (
            <div key={s.id} className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl relative group">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Crosshair className="w-16 h-16 text-red-500" /></div>
               <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <h3 className="font-extrabold text-white">{s.name}</h3>
                    <p className="text-xs text-gray-400">{s.brand} • {s.model}</p>
                 </div>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                   s.type === 'premium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                 }`}>{s.type}</span>
               </div>
               <div className="relative z-10 mt-4 pt-4 border-t border-gray-800/50">
                 <p className="text-sm font-bold text-gray-300">Target Plan: <span className="text-white">{s.plan || 'N/A'}</span></p>
                 <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => handleDelete(s.ref)} className="w-10 h-10 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-lg flex items-center justify-center transition-colors">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
