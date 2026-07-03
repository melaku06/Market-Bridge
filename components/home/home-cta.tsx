'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

export default function HomeCTA() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Start Selling on MarketBridge</h2>
              <p className="text-blue-200 text-sm mb-5">
                Join thousands of sellers and reach customers across Ethiopia.<br className="hidden md:block" /> Create your free account today.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/register">
                  <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                    Create Seller Account
                  </button>
                </Link>
                <Link href="/register">
                  <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                    Shop as Customer
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Join Our Community</h2>
            <p className="text-blue-200 text-sm mb-5">
              Follow us on Telegram for exclusive deals<br className="hidden md:block" /> and new product updates.
            </p>
            <a href="#" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
              <Send className="w-4 h-4" />
              Join Telegram Channel
            </a>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
              <Send className="w-16 h-16 text-white/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
