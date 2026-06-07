import { Crown, Gem, Star, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import React from 'react';

interface PremiumBadgeProps {
  status?: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'solid' | 'outline' | 'minimal';
}

export function PremiumBadge({ status, className, showIcon = true, variant = 'solid' }: PremiumBadgeProps) {
  if (!status || status === 'Free Member' || status === 'Free Player') return null;

  const isWebsite = status.includes('Website');
  const isUltra = status.includes('Ultra');
  const isPremium = status.includes('Premium') && !isUltra && !isWebsite;
  const isBasic = status.includes('Basic');

  let config = {
    label: 'Member',
    color: 'text-gray-400 bg-gray-900 border-gray-800',
    icon: <ShieldCheck className="w-3 h-3" />
  };

  if (isWebsite) {
    config = {
      label: 'VIP WEBSITE MEMBER',
      color: 'bg-black border-none shadow-[0_0_20px_rgba(255,255,255,0.1)] relative overflow-hidden',
      icon: <Crown className="w-3.5 h-3.5 text-yellow-500 animate-bounce" fill="currentColor" />
    };
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest relative group",
        config.color,
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-20 animate-gradient-x"></div>
        <div className="absolute inset-[1px] bg-black rounded-full z-0"></div>
        <div className="relative z-10 flex items-center gap-1.5 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-purple-500 animate-pulse">
           {showIcon && config.icon}
           {config.label}
        </div>
      </div>
    );
  } else if (isUltra) {
    config = {
      label: 'Ultra VIP',
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
      icon: <Gem className="w-3 h-3" />
    };
  } else if (isPremium) {
    config = {
      label: 'Premium',
      color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
      icon: <Star className="w-3 h-3 fill-current" />
    };
  } else if (isBasic) {
    config = {
      label: 'Basic Member',
      color: 'text-gray-300 bg-gray-800/50 border-gray-700',
      icon: <ShieldCheck className="w-3 h-3" />
    };
  }

  if (variant === 'minimal') {
     return (
        <div className={cn("flex items-center gap-1", config.color.split(' ')[0], className)}>
           {showIcon && config.icon}
           <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
        </div>
     );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
      config.color,
      className
    )}>
      {showIcon && config.icon}
      {config.label}
    </div>
  );
}
