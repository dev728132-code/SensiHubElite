import { Search, Sparkles, TrendingUp, ChevronRight, Cpu, Target, Zap, Shield, Star, Users, Trophy, ChevronRightIcon, CheckCircle2, Crown, LayoutDashboard } from 'lucide-react';
import { BRANDS, MOCK_CONFIGS } from '../data';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const stepTime = Math.abs(Math.floor((duration * 1000) / end));
      const target = end;
      
      const timer = setInterval(() => {
        start += Math.ceil(target / 50);
        if (start > target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime || 20);
      
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{end > 1000 ? '+' : ''}</span>;
}

export function Home() {
  const featured = MOCK_CONFIGS.slice(0, 2);

  const mockAiResults = [
    { device: 'iPhone 15 Pro Max', rating: '99.8%', score: 98, time: '2 mins ago' },
    { device: 'Samsung S24 Ultra', rating: '99.5%', score: 96, time: '5 mins ago' },
    { device: 'POCO X6 Pro', rating: '98.9%', score: 94, time: '12 mins ago' },
    { device: 'Realme GT 5', rating: '98.5%', score: 92, time: '25 mins ago' },
    { device: 'OnePlus 12', rating: '99.1%', score: 95, time: '1 hr ago' },
  ];

  const topPlayers = [
    { name: 'Raistar', hs: '98%', device: 'iPhone 14 Pro Max', tag: 'Aggressive' },
    { name: 'White444', hs: '99%', device: 'iPad Pro M2', tag: 'Sniper/One-Tap' },
    { name: 'Ruok FF', hs: '97%', device: 'ROG Phone 8', tag: 'Movement' },
    { name: 'Vincenzo', hs: '95%', device: 'iPhone 13 Pro', tag: 'Versatile' }
  ];

  const testimonials = [
    { name: 'Alex M.', review: 'Best AI sensitivity website I\'ve used. My headshot rate skyrocketed!', stars: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Sarah K.', review: 'The premium configs are insane. Definitely worth the upgrade.', stars: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { name: 'John D.', review: 'UI is smooth and the AI logic is actually smart. Real results.', stars: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">
      {/* Background Animated Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black opacity-80"></div>
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
        {/* Glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10 p-6 space-y-16 pb-24"
      >
        {/* Header section */}
        <section className="space-y-4 pt-4 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider uppercase">Gaming Experience AI System</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-tight"
          >
            Customize Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Gaming Experience</span>
          </motion.h1>

          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-gray-400 text-sm md:text-base max-w-md mx-auto"
          >
             AI-powered configurations calibrated for your exact device model to maximize headshot accuracy and movement speed.
          </motion.p>
        </section>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-xl mx-auto group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search devices or games..." 
            className="w-full h-14 pl-12 pr-4 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl text-sm focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-600 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Live Website Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Users', val: 56420, icon: <Users className="text-cyan-400 w-5 h-5" /> },
            { label: 'AI Generated', val: 124500, icon: <Cpu className="text-purple-400 w-5 h-5" /> },
            { label: 'Premium Members', val: 3200, icon: <Crown className="text-yellow-400 w-5 h-5" /> },
            { label: 'Verified Devices', val: 450, icon: <Target className="text-green-400 w-5 h-5" /> },
          ].map((stat, i) => (
             <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-4 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-2 bg-gray-800/50 rounded-lg mb-2">{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  <AnimatedCounter end={stat.val} />
                </h3>
                <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
             </div>
          ))}
        </motion.section>

        {/* Popular Brands */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Popular Brands</h2>
            <Link to="/sensitivity" className="text-xs text-cyan-500 flex items-center hover:text-cyan-400 font-bold uppercase">View all <ChevronRight className="w-3 h-3 ml-1" /></Link>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {BRANDS.slice(0, 8).map((brand, i) => (
              <div
                key={brand}
                className="flex-shrink-0 px-5 py-2.5 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl whitespace-nowrap text-sm font-medium hover:bg-gray-800 hover:border-gray-600 transition-colors cursor-pointer text-gray-300"
              >
                {brand}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Featured AI Results */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Trending AI Results</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {mockAiResults.map((res, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-900/40 border border-gray-800/80 p-4 rounded-2xl hover:bg-gray-800/40 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                     <Target className="w-5 h-5 text-purple-400" />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-100 text-sm">{res.device}</h4>
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{res.time}</p>
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-extrabold">{res.rating}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">HS Rate</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Top Players Sensitivity */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Pro Player Presets</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-4 -mx-6 px-6">
            {topPlayers.map((player, i) => (
              <div key={i} className="flex-shrink-0 w-64 bg-gradient-to-b from-gray-900/80 to-black border border-gray-800 rounded-2xl p-5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-20"><Crown className="w-12 h-12 text-yellow-500" /></div>
                 <div className="relative z-10">
                   <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[9px] font-bold uppercase rounded-lg border border-yellow-500/20 inline-block mb-3">
                     {player.tag}
                   </span>
                   <h3 className="text-lg font-bold text-white mb-1">{player.name} Config</h3>
                   <p className="text-xs text-gray-400 mb-4">{player.device}</p>
                   <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <div className="text-xl font-bold text-yellow-400">{player.hs}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Headshot</div>
                      </div>
                      <Link to="/premium" className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Premium Membership Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-1 overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-[spin_4s_linear_infinite] opacity-50 blur-lg"></div>
           <div className="relative bg-black rounded-[22px] p-8 md:p-10 border border-gray-800 text-center flex flex-col items-center justify-center space-y-6">
              <Crown className="w-16 h-16 text-yellow-400 absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-4" />
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Unlock Premium Features
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                  Get access to exclusive VIP configs, admin packs, priority support, and advanced AI tuning.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['Premium AI Sensitivity', 'Admin Packs', 'VIP Updates', 'Priority Access'].map((feature, i) => (
                  <span key={i} className="flex items-center text-xs font-bold text-gray-300 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 mr-2" />
                    {feature}
                  </span>
                ))}
              </div>

              <Link to="/premium" className="mt-4 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-extrabold rounded-xl uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                Become Premium
              </Link>
           </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 pt-6"
        >
          <h2 className="text-center text-xl font-bold text-white mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cpu />, title: 'AI Powered', desc: 'Smart logic tuning.' },
              { icon: <Zap />, title: 'Fast Updates', desc: 'Daily config fixes.' },
              { icon: <Target />, title: 'High Accuracy', desc: 'Maximized HS rate.' },
              { icon: <Shield />, title: 'Safe to Use', desc: 'No ban risk settings.' },
            ].map((f, i) => (
               <div key={i} className="bg-gray-900/30 border border-gray-800 p-5 rounded-2xl text-center space-y-3">
                 <div className="w-10 h-10 mx-auto bg-gray-800 rounded-xl flex items-center justify-center text-cyan-400">
                   {f.icon}
                 </div>
                 <h3 className="font-bold text-sm text-gray-200">{f.title}</h3>
                 <p className="text-[10px] text-gray-500">{f.desc}</p>
               </div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 pt-6"
        >
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">User Testimonials</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl space-y-4 relative">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.stars ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic">"{t.review}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full bg-gray-800" />
                  <span className="text-xs font-bold text-gray-400">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t border-gray-800 pt-12 pb-24 md:pb-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                 <Target className="w-5 h-5 text-white" />
               </div>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-lg uppercase tracking-tight leading-none">Gaming <br/>Experience</span>
            </div>
            <p className="text-[10px] text-gray-500">The ultimate AI-powered sensitivity generator for competitive mobile gamers.</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300 text-sm">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-500">
               <Link to="/" className="hover:text-cyan-400 transition-colors">Main Hub</Link>
               <Link to="/sensitivity" className="hover:text-cyan-400 transition-colors">AI Sensi</Link>
               <Link to="/premium" className="hover:text-cyan-400 transition-colors">VIP Packs</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-300 text-sm">Legal</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-500">
               <span className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy</span>
               <span className="hover:text-cyan-400 transition-colors cursor-pointer">Terms</span>
               <span className="hover:text-cyan-400 transition-colors cursor-pointer">Legal Info</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-300 text-sm">Follow</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-500">
               <span className="hover:text-[#5865F2] transition-colors cursor-pointer font-bold">Discord</span>
               <span className="hover:text-[#0088cc] transition-colors cursor-pointer font-bold">Groups</span>
               <span className="hover:text-[#FF0000] transition-colors cursor-pointer font-bold">Videos</span>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] text-gray-600 border-t border-gray-800/50 pt-6">
          © {new Date().getFullYear()} Customize Your Gaming Experience. Not affiliated with Garena or any game studio.
        </div>
      </footer>
    </div>
  );
}

