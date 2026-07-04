'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MarketBridgeLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  tagline?: string;
  href?: string;
  className?: string;
}

export function MarketBridgeLogo({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  tagline,
  href = '/',
  className,
}: MarketBridgeLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className={cn('flex items-center gap-3', className)}>
      <MarketBridgeIcon size={size} />
      <div>
        <span className={cn(
          'font-bold tracking-tight',
          textSizes[size],
          variant === 'dark'
            ? 'text-gray-900'
            : 'bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'
        )}>
          MarketBridge
        </span>
        {showTagline && tagline && (
          <p className={cn(
            'text-[10px] font-medium uppercase tracking-wider mt-0.5',
            variant === 'dark' ? 'text-gray-400' : 'text-slate-500'
          )}>
            {tagline}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }
  return logoContent;
}

export function MarketBridgeIcon({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-12 h-12' };
  return (
    <div className={cn('relative flex-shrink-0', sizes[size], className)}>
      <svg viewBox="0 0 180 180" className="w-full h-full">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D946EF"/>
            <stop offset="45%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#38BDF8"/>
          </linearGradient>
          <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M90 10 L160 50 L160 130 L90 170 L20 130 L20 50 Z"
          fill="url(#iconGradient)"
          filter="url(#iconGlow)"
        />
        <path
          d="M90 35 L130 57.5 L130 102.5 L90 125 L50 102.5 L50 57.5 Z"
          fill="#0F172A"
          opacity="0.3"
        />
        <rect x="55" y="62" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
        <rect x="99" y="62" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="55" y="92" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="99" y="92" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
      </svg>
    </div>
  );
}

export function SidebarLogo({ tagline, variant = 'dark' }: { tagline?: string; variant?: 'light' | 'dark' }) {
  return (
    <div className="flex items-center gap-3">
      <SidebarIcon />
      <div>
        <span className={cn(
          'text-xl font-bold tracking-tight block',
          variant === 'dark'
            ? 'text-gray-900'
            : 'bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'
        )}>
          MarketBridge
        </span>
        {tagline && (
          <p className={cn(
            'text-[10px] font-semibold uppercase tracking-wider',
            variant === 'dark' ? 'text-gray-400' : 'text-slate-500'
          )}>
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}

export function SidebarIcon() {
  return (
    <div className="w-10 h-10 flex-shrink-0">
      <svg viewBox="0 0 180 180" className="w-full h-full">
        <defs>
          <linearGradient id="sidebarIconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D946EF"/>
            <stop offset="45%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#38BDF8"/>
          </linearGradient>
          <filter id="sidebarIconGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M90 10 L160 50 L160 130 L90 170 L20 130 L20 50 Z"
          fill="url(#sidebarIconGradient)"
          filter="url(#sidebarIconGlow)"
        />
        <path
          d="M90 35 L130 57.5 L130 102.5 L90 125 L50 102.5 L50 57.5 Z"
          fill="#0F172A"
          opacity="0.3"
        />
        <rect x="55" y="62" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
        <rect x="99" y="62" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="55" y="92" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="99" y="92" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
      </svg>
    </div>
  );
}

export function FullLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 980 220" className={cn('w-full', className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D946EF"/>
          <stop offset="45%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#38BDF8"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D946EF"/>
          <stop offset="45%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#38BDF8"/>
        </linearGradient>
      </defs>

      {/* Icon */}
      <g transform="translate(0, 20)">
        <path
          d="M90 10 L160 50 L160 130 L90 170 L20 130 L20 50 Z"
          fill="url(#brandGradient)"
          filter="url(#glow)"
        />
        <path
          d="M90 35 L130 57.5 L130 102.5 L90 125 L50 102.5 L50 57.5 Z"
          fill="#0F172A"
          opacity="0.3"
        />
        <rect x="55" y="62" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
        <rect x="99" y="62" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="55" y="92" width="26" height="26" rx="4" fill="white" opacity="0.6"/>
        <rect x="99" y="92" width="26" height="26" rx="4" fill="white" opacity="0.95"/>
      </g>

      {/* Text */}
      <text
        x="200"
        y="135"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="120"
        fontWeight="700"
        fill="url(#textGradient)"
      >
        MarketBridge
      </text>
    </svg>
  );
}
