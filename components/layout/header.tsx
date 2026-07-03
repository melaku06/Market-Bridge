'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/auth-provider';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          // API returns { data: [...] } format
          setCategories(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'warehouse':
        return '/warehouse';
      default:
        return '/dashboard';
    }
  };

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
                    <span>📦</span>
                    <span>{cat.name}</span>
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

            {/* Notifications - Only for authenticated users */}
            {isAuthenticated && (
              <Link href={`${getDashboardLink()}/notifications`}>
                <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative">
                  <Bell className="w-5 h-5" />
                </button>
              </Link>
            )}

            {/* User / Auth */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      href={`${getDashboardLink()}/profile`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm text-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">Login</span>
                </button>
              </Link>
            )}

            {/* Wishlist - Only for customers */}
            {isAuthenticated && user?.role === 'customer' && (
              <Link href="/wishlist">
                <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative">
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
            )}

            {/* Cart - Only for customers */}
            {isAuthenticated && user?.role === 'customer' && (
              <Link href="/dashboard/orders">
                <button className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </Link>
            )}

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
                <span>📦</span>
                <span>{cat.name}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <p className="px-3 text-xs text-gray-500 mb-2">Account</p>
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Package className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-100 my-2 pt-2">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-blue-600 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
