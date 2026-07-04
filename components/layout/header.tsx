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
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { SidebarIcon } from '@/components/ui/market-bridge-logo';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/auth-provider';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import NotificationBell from '@/components/notifications/notification-bell';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  const { user, isAuthenticated, isLoading } = useAuth();
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.totalItems());

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
        }
      } catch {
        // ignore
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
      case 'admin': return '/admin';
      case 'warehouse': return '/warehouse';
      default: return '/dashboard';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <SidebarIcon />
              <span className="font-bold text-gray-900 text-lg hidden sm:block tracking-tight">MarketBridge</span>
            </Link>

            {/* Categories Dropdown */}
            <div className="hidden md:block relative group">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Categories
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-200" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.length === 0 ? (
                    <p className="text-xs text-gray-400 px-3 py-2">Loading...</p>
                  ) : (
                    categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-violet-600 text-sm text-gray-700 transition-colors"
                      >
                        <span className="text-base">📦</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/products" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm text-blue-600 font-medium transition-colors">
                      View all categories
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for products, brands..."
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
            <div className="flex items-center gap-0.5">
              {/* Language */}
              <button className="hidden md:flex items-center gap-1 text-sm text-gray-500 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">EN</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Notifications */}
              {isAuthenticated && <NotificationBell />}

              {/* User */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              ) : isAuthenticated && user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors ml-1">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-blue-600">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
                  </button>

                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize font-medium">
                          {user.role}
                        </span>
                      </div>

                      <Link href={getDashboardLink()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-violet-600 text-sm text-gray-700 transition-colors">
                        <Package className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href={`${getDashboardLink()}/profile`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-violet-600 text-sm text-gray-700 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm text-gray-700 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-violet-600 ml-1">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">Login</span>
                  </button>
                </Link>
              )}

              {/* Wishlist */}
              {isAuthenticated && user?.role === 'customer' && (
                <Link href="/wishlist">
                  <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-violet-600 relative">
                    <Heart className="w-5 h-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </button>
                </Link>
              )}

              {/* Cart */}
              {isAuthenticated && user?.role === 'customer' && (
                <Link href="/dashboard/orders">
                  <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-violet-600 relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors ml-1"
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
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>

              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-gray-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>📦</span>
                  <span>{cat.name}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                  <p className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Account</p>
                  <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                    <Package className="w-4 h-4" /> Dashboard
                  </Link>
                  {user?.role === 'customer' && (
                    <>
                      <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                        <ShoppingCart className="w-4 h-4" /> My Orders
                      </Link>
                    </>
                  )}
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-sm text-red-600">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4" /> Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
