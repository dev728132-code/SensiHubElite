import { Home, Sliders, Diamond, User, Crown, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const location = useLocation();
  const { profile, user } = useAuth();
  
  const isPremium = profile?.membershipStatus && profile.membershipStatus !== 'Free Member';
  const isAdmin = user?.email === 'dev728132@gmail.com';

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/sensitivity', icon: Sliders, label: 'AI Sensi' },
    { path: '/premium', icon: Diamond, label: 'Membership' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const isProfile = item.path === '/profile';
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-full text-xs font-medium"
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-colors duration-300 relative",
                  isActive ? "text-cyan-400" : "text-gray-400 hover:text-white"
                )}
              >
                <item.icon className="w-6 h-6 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                
                {isProfile && isPremium && (
                   <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 z-20" />
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-cyan-400/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn("mt-1 transition-colors duration-300 flex items-center gap-1", isActive ? "text-cyan-400" : "text-gray-500", isProfile && isPremium ? "text-yellow-500" : "")}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
