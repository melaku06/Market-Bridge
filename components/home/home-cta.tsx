'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';

export default function HomeCTA() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-2xl">💬</span>
              <span className="text-slate-400 text-sm font-medium">Telegram Community</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Join Our Community</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md">
              Stay updated with the latest deals, new arrivals, and exclusive offers. Join thousands of shoppers in our Telegram channel.
            </p>
            <a
              href="https://t.me/marketbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Join Telegram Channel
            </a>
          </div>
          <div className="hidden md:flex items-center justify-center flex-shrink-0">
            <div className="w-40 h-40 bg-slate-700/50 rounded-2xl flex items-center justify-center">
              <div className="w-24 h-24 bg-sky-500/20 rounded-xl flex items-center justify-center">
                <Send className="w-12 h-12 text-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
