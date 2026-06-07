import { ArrowLeft, Save, ShoppingBag, Cpu, Target, Filter, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, db } from '../lib/storage';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { HistoryItem, SensitivityConfig } from '../types';
import { cn } from '../lib/utils';

export function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<SensitivityConfig | { isPack: boolean, name: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'generated' | 'saved' | 'purchased'>('all');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'history'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: HistoryItem[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() } as HistoryItem);
      });
      setHistory(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/history`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.itemType === filter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-6 min-h-screen bg-black pb-24"
    >
      <header className="flex items-center space-x-4 mt-4">
        <Link to="/profile" className="p-2 bg-gray-900 border border-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">History</h1>
      </header>

      {selectedConfig ? (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedConfig(null)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" /> Back to History
          </button>
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden p-[1px] relative">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none" />
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{'isPack' in selectedConfig ? selectedConfig.name : selectedConfig.name}</h3>
                <p className="text-xs text-cyan-400 mt-1 font-medium">{!('isPack' in selectedConfig) && `${selectedConfig.brand} ${selectedConfig.model}`}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-white/10 text-white px-2 py-1 rounded-md">
                {!('isPack' in selectedConfig) ? selectedConfig.game : 'Premium Pack'}
              </span>
            </div>
            
            {!("isPack" in selectedConfig) ? (
              <div className="p-4 grid grid-cols-3 gap-3 relative z-10">
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.general}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">General</span></div>
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.redDot}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">Red Dot</span></div>
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.scope2x}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">2x Scope</span></div>
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.scope4x}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">4x Scope</span></div>
                {selectedConfig.scope6x !== undefined && (
                  <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.scope6x}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">6x Scope</span></div>
                )}
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.sniperScope}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">Sniper</span></div>
                <div className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"><span className="text-xl font-bold text-gray-100">{selectedConfig.freeLook}</span><span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">Free Look</span></div>
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center relative z-10 space-y-4">
                {selectedConfig.name.includes('Code') || selectedConfig.name.includes('Promo') ? (
                   <Ticket className="w-12 h-12 text-cyan-500" />
                ) : (
                   <ShoppingBag className="w-12 h-12 text-yellow-500" />
                )}
                <p className="text-sm text-gray-300 text-center font-medium">
                  {selectedConfig.name.includes('Promo') || selectedConfig.name.includes('Code') 
                     ? 'You successfully redeemed a promo code. Benefits are active.'
                     : 'This Premium Purchase has been approved by the Admin and the benefits are active on your account.'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'generated', 'saved', 'purchased'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border",
                  filter === f 
                    ? "bg-white text-black border-white" 
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {!user ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Sign in to view history.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No {filter !== 'all' ? filter : ''} history found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredHistory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    if (item.model === 'Subscription/Pack') {
                      setSelectedConfig({ isPack: true, name: item.configName });
                    } else {
                      const parsed = JSON.parse(item.sensitivityData);
                      setSelectedConfig(parsed);
                    }
                  }}
                  className="bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-800 hover:border-gray-700 rounded-2xl p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-black rounded-xl border border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors">
                      {item.itemType === 'used' && <Target className="w-5 h-5 text-gray-400" />}
                      {item.itemType === 'saved' && <Save className="w-5 h-5 text-cyan-400" />}
                      {item.itemType === 'purchased' && <ShoppingBag className="w-5 h-5 text-yellow-500" />}
                      {item.itemType === 'generated' && <Cpu className="w-5 h-5 text-purple-500" />}
                      {item.itemType === 'promo_redeemed' && <Ticket className="w-5 h-5 text-cyan-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{item.itemType === 'promo_redeemed' ? `Promo Code: ${item.code}` : item.configName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500">{item.itemType === 'promo_redeemed' ? 'Promo' : item.game}</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <div className="text-xs text-gray-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                  </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                      item.itemType === 'purchased' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      item.itemType === 'promo_redeemed' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                      item.itemType === 'saved' || item.itemType === 'generated' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {item.itemType}
                    </span>
                    <span className="text-xs text-gray-600 group-hover:text-cyan-500 transition-colors font-medium">View →</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </motion.div>
  );
}
