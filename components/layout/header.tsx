'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, LogOut, Settings, Package, ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCartStore } from '@/stores/cart/cart-store';
import { useWishlistStore } from '@/stores/wishlist/wishlist-store';

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
      } catch { /* ignore */ }
    }
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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
          <div className="flex items-center h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-tight hidden sm:block">MarketBridge</span>
            </Link>

            {/* Categories Dropdown */}
            <div className="hidden md:block relative group flex-shrink-0">
              <button className="flex items-center gap-1 text-sm text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                Categories
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform group-hover:rotate-180 duration-200" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-1.5">
                  {categories.length === 0 ? (
                    <p className="text-xs text-gray-400 px-3 py-2">Loading...</p>
                  ) : (
                    categories.slice(0, 8).map((cat) => (
                      <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors">
                        <span className="text-base">📦</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link href="/products" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-blue-600 font-medium transition-colors">
                      View all categories
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 focus-within:bg-white focus-within:border-blue-400 transition-colors">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="flex-shrink-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <Search className="text-white" style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Language */}
              <button className="hidden md:flex items-center gap-1 text-sm text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-xs font-medium">EN</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* User */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              ) : isAuthenticated && user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-blue-600">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-1.5">
                      <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize font-medium">{user.role}</span>
                      </div>
                      <Link href={getDashboardLink()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors">
                        <Package className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href={`${getDashboardLink()}/profile`} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors">
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
                  <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-blue-600">
                    <User style={{ width: 20, height: 20 }} />
                  </button>
                </Link>
              )}

              {/* Wishlist */}
              <Link href={isAuthenticated && user?.role === 'customer' ? '/wishlist' : '/login'}>
                <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-blue-600 relative">
                  <Heart style={{ width: 20, height: 20 }} className={wishlistCount > 0 && isAuthenticated ? 'fill-red-500 text-red-500' : ''} />
                  {wishlistCount > 0 && isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link href={isAuthenticated && user?.role === 'customer' ? '/dashboard/orders' : '/login'}>
                <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-blue-600 relative">
                  <ShoppingCart style={{ width: 20, height: 20 }} />
                  {cartCount > 0 && isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Mobile Menu */}
              <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="w-9 h-9 bg-blue-600 flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  <span>📦</span><span>{cat.name}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                  <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                    <Package className="w-4 h-4" /> Dashboard
                  </Link>
                  {user?.role === 'customer' && (
                    <>
                      <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
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
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-sm text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>
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
