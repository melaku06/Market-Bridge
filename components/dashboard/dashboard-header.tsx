'use client';

import Link from 'next/link';
import { Search, Bell, ShoppingCart, ShoppingBag, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">MarketBridge</span>
          </Link>

          {/* Breadcrumb / Title area */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 flex-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
            </button>

            {/* Bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
            </button>

            {/* User */}
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 hidden sm:block">Sarah Johnson</span>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
