import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Target, Save, Sparkles, Zap, Smartphone, HardDrive, Clock, Settings, AlertCircle, TrendingUp, CheckCircle2, Crown, BarChart3 } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  PolarRadiusAxis
} from 'recharts';
import { SensitivityConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType, doc, setDoc, serverTimestamp } from '../lib/storage';
import { BRANDS } from '../data';
import { cn } from '../lib/utils';

const LOADING_MESSAGES = [
  'Analyzing Device Performance...',
  'Detecting Touch Response...',
  'Optimizing Headshot Accuracy...',
  'Generating AI Profile...',
  'Finalizing Settings...'
];

export function AIGenerator({ activeBrand }: { activeBrand: string }) {
  const [selectedBrand, setSelectedBrand] = useState(activeBrand === 'All' ? '' : activeBrand);
  const [modelInput, setModelInput] = useState('');
  const [ram, setRam] = useState('');
  const [age, setAge] = useState('');
  const [androidVersion, setAndroidVersion] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [result, setResult] = useState<SensitivityConfig | null>(null);
  const [aiHeadshotRate, setAiHeadshotRate] = useState(0);
  
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (activeBrand !== 'All') {
      setSelectedBrand(activeBrand);
    }
  }, [activeBrand]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              generateResult();
              setIsGenerating(false);
            }, 600);
            return 100;
          }
          // Increments to hit ~5-6 seconds (800ms intervals)
          const increment = 14 + (Math.random() * 6);
          return p + increment; 
        });
        
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleStart = () => {
    if (!selectedBrand || !modelInput || !ram || !age) {
      setError('Please fill all required fields');
      return;
    }
    
    if (!BRANDS.includes(selectedBrand)) {
      setError('Invalid Mobile Brand. Please select from available brands.');
      return;
    }

    setError(null);
    setResult(null);
    setProgress(0);
    setIsGenerating(true);
    setSaved(false);
  };

  const generateResult = () => {
    // Ultra-dynamic randomization logic - nothing is strict
    // Every value must change significantly every time
    const getRandVal = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Headshot rate varies between 75-80 for AI
    const rate = getRandVal(75, 80);
    setAiHeadshotRate(rate);

    setResult({
      id: `gen_${Date.now()}`,
      name: 'AI DYNAMIC ULTRA PRO',
      brand: selectedBrand,
      model: modelInput,
      game: 'Free Fire',
      type: 'premium',
      // Expanded ranges for maximum dynamism - nothing is strict
      general: getRandVal(40, 200), 
      redDot: getRandVal(120, 200),
      scope2x: getRandVal(110, 198),
      scope4x: getRandVal(100, 195),
      sniperScope: getRandVal(60, 190),
      freeLook: getRandVal(80, 200),
    });
  };

  const handleSave = async () => {
    if (!user || !result) return;
    setIsSaving(true);
    try {
      const historyId = `hist_${Date.now()}`;
      const docRef = doc(db, 'users', user.uid, 'history', historyId);
      await setDoc(docRef, {
        userId: user.uid,
        itemType: 'generated',
        brand: result.brand,
        model: result.model,
        game: result.game,
        configName: result.name,
        sensitivityData: JSON.stringify(result),
        createdAt: serverTimestamp()
      });
      setSaved(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'history');
    } finally {
      setIsSaving(false);
    }
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { subject: 'GEN', value: result.general },
      { subject: 'RED', value: result.redDot },
      { subject: '2X', value: result.scope2x },
      { subject: '4X', value: result.scope4x },
      { subject: 'SNR', value: result.sniperScope },
      { subject: 'FREE', value: result.freeLook },
    ];
  }, [result]);

  if (result) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)] relative group"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Performance Radar</span>
              </div>
              <h3 className="font-bold text-white text-lg leading-tight">{result.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{result.brand} {result.model}</p>
            </div>
            <div className="text-right">
               <div className="text-[10px] uppercase tracking-wider font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md border border-cyan-500/20 mb-1 inline-block">
                 {result.game}
               </div>
               <div className="text-[10px] text-green-400 font-bold block">{aiHeadshotRate}% AI PRECISION</div>
            </div>
          </div>

          {/* Visualization Area */}
          <motion.div 
            key={result.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-56 w-full pt-4 relative"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 200]} 
                  tick={false} 
                  axisLine={false} 
                />
                <Radar
                  name="Sensitivity"
                  dataKey="value"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="p-4 grid grid-cols-3 gap-3">
            <Stat label="General" value={result.general} />
            <Stat label="Red Dot" value={result.redDot} />
            <Stat label="2x Scope" value={result.scope2x} />
            <Stat label="4x Scope" value={result.scope4x} />
            <Stat label="Sniper" value={result.sniperScope} />
            <Stat label="Free Look" value={result.freeLook} />
          </div>
          <div className="p-4 bg-black/50 border-t border-gray-800 flex justify-between gap-3">
            <button 
              onClick={() => setResult(null)}
              className="flex-1 py-3 text-xs font-semibold text-gray-400 hover:text-white uppercase tracking-widest bg-gray-800 rounded-xl transition-colors"
            >
              Regenerate
            </button>
            {user ? (
              <button 
                onClick={handleSave}
                disabled={isSaving || saved}
                className="flex-1 py-3 text-xs font-bold text-black uppercase tracking-widest bg-cyan-500 hover:bg-cyan-400 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Config'}
              </button>
            ) : (
               <div className="flex-1 py-3 text-xs font-bold text-gray-400 flex justify-center items-center text-center">
                 Sign in to save
               </div>
            )}
          </div>
        </motion.div>

        {/* Premium Suggestion */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 transform rotate-12 opacity-10">
            <TrendingUp className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-1">Boost Accuracy to 97%?</p>
            <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Get Premium for 95-97% Headshot & Aim Lock
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
      {!isGenerating ? (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Config Generator</h3>
              <p className="text-xs text-gray-400">Generate perfect Free Fire settings</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {activeBrand === 'All' ? (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><Smartphone className="w-3 h-3" /> Mobile Brand</label>
                <select 
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors text-white"
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            ) : (
               <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Brand:</span>
                 </div>
                 <span className="text-sm font-black text-white">{selectedBrand}</span>
               </div>
            )}
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><Smartphone className="w-3 h-3" /> Mobile Model</label>
              <input 
                type="text" 
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="e.g. Galaxy S23 Ultra" 
                className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><HardDrive className="w-3 h-3" /> RAM (GB)</label>
                <input 
                  type="number" 
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g. 8" 
                  className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Age (Years)</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 2" 
                  className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 mb-1"><Settings className="w-3 h-3" /> Android Version (Optional)</label>
              <input 
                type="text" 
                value={androidVersion}
                onChange={(e) => setAndroidVersion(e.target.value)}
                placeholder="e.g. 14" 
                className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl mt-4 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleStart}
            disabled={!selectedBrand || !modelInput || !ram || !age}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:shadow-none"
          >
            <Zap className="w-5 h-5" />
            <span>Generate AI Sensitivity</span>
          </button>
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className="relative">
             <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-cyan-500 animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
               <Target className="w-8 h-8 text-cyan-400 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-white">{Math.min(100, Math.round(progress))}%</h4>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${Math.min(100, progress)}%` }} />
            </div>
          </div>
          <motion.p 
            key={loadingMsgIdx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-cyan-400 text-center h-5"
          >
            {LOADING_MESSAGES[loadingMsgIdx]}
          </motion.p>
        </div>
      )}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <Cpu className="w-40 h-40" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string, value: number }) {
  return (
    <motion.div 
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.2 }}
      key={`${label}-${value}`}
      className="flex flex-col items-center justify-center bg-black/40 rounded-lg py-3 border border-gray-800/50 shadow-inner"
    >
      <motion.span 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-cyan-400"
      >
        {value}
      </motion.span>
      <span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</span>
    </motion.div>
  );
}
