import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { cn } from '../lib/utils';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <main className="max-w-md mx-auto min-h-screen pb-24 relative overflow-x-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}
