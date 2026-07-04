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
      {/* Icon - matches the MarketBridge brand mark from reference */}
      <div className={cn('relative flex-shrink-0', iconSizes[size])}>
        <img
          src="/new_Part_9.png"
          alt="MarketBridge"
          className="w-full h-full object-cover rounded-xl"
          style={{ objectPosition: '10px 83px', transform: 'scale(5.5)', transformOrigin: '10px 83px', borderRadius: '4px' }}
        />
      </div>

      {/* Text */}
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
    <div className={cn('relative flex-shrink-0 rounded-xl overflow-hidden', sizes[size], className)}>
      <img
        src="/new_Part_9.png"
        alt="MarketBridge"
        className="w-full h-full object-cover"
        style={{ objectPosition: '10px 83px', transform: 'scale(5.5)', transformOrigin: '10px 83px' }}
      />
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
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        {/* Top-left square */}
        <rect x="3" y="3" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
        {/* Top-right square */}
        <rect x="15" y="3" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
        {/* Bottom-left square */}
        <rect x="3" y="15" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
        {/* Bottom-right square */}
        <rect x="15" y="15" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
      </svg>
    </div>
  );
}
