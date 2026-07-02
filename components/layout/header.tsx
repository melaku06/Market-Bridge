'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Bell,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/data';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

          {/* Categories Dropdown */}
          <div className="hidden md:block relative group">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Categories
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 h-9 bg-gray-50 border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Language */}
            <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 px-2 py-2 rounded-md hover:bg-gray-50 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-xs">EN</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* User */}
            <Link href="/login">
              <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600">
                <User className="w-5 h-5" />
              </button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist">
              <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative">
                <Heart className="w-5 h-5" />
              </button>
            </Link>

            {/* Cart */}
            <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
