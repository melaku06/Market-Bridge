'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';

export default function HomeCTA() {
  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#2563eb 100%)' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Join Our Telegram Channel</h2>
          <p className="text-blue-100 text-sm md:text-base max-w-md">
            Get exclusive deals, flash sales, and product updates directly on Telegram. Be the first to know!
          </p>
        </div>
        <Link href="https://t.me/marketbridge" target="_blank" rel="noopener noreferrer">
          <button className="flex items-center gap-2.5 px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex-shrink-0">
            <Send style={{ width: 16, height: 16 }} />
            Join Channel
          </button>
        </Link>
      </div>
    </div>
  );
}
