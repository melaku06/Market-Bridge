'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Search, ShoppingCart, Heart, User, ChevronDown, Globe, Menu, X, LogOut, LayoutDashboard, Settings, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

const getDashboardPath = (role?: string) => {
  if (role === 'admin') return '/admin';
  if (role === 'warehouse') return '/warehouse';
  return '/dashboard';
};

export default function Header() {
  const { user, refreshUser } = useAuth();
  const { totalItems, isOpen, toggleCart } = useCartStore();
  const { totalItems: wishlistTotal } = useWishlistStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.data || d || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/search?q=${encodeURIComponent(search.trim())}`;
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    await refreshUser();
    window.location.href = '/';
  };

  const cartCount = totalItems();
  const wlCount = wishlistTotal();

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              <ShoppingBag className="text-white" style={{ width: 15, height: 15 }} />
            </div>
            <span className="font-bold text-gray-900 text-[15px] hidden sm:block">MarketBridge</span>
          </Link>

          {/* Categories dropdown */}
          <div ref={catRef} className="hidden md:flex relative flex-shrink-0">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Categories <ChevronDown className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} style={{ width: 13, height: 13 }} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <Link href="/products" onClick={() => setCatOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  All Categories
                </Link>
                <div className="border-t border-gray-50 my-1" />
                {categories.slice(0, 10).map((cat: any) => (
                  <Link key={cat.id} href={`/categories/${cat.slug}`} onClick={() => setCatOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                    <span>{cat.name}</span>
                    {cat.product_count > 0 && <span className="text-xs text-gray-400">{cat.product_count}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-10">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0 h-full bg-white"
              />
              <button type="submit" className="h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0">
                <Search className="text-white" style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Language */}
            <button className="hidden lg:flex items-center gap-1 h-9 px-2.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
              <Globe style={{ width: 13, height: 13 }} /> EN <ChevronDown style={{ width: 10, height: 10 }} />
            </button>

            {/* User */}
            <div ref={userRef} className="relative">
              <button onClick={() => setUserOpen(!userOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors relative">
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  : <User style={{ width: 16, height: 16 }} />}
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1 inline-block" style={{ background: '#eff6ff', color: '#1d4ed8' }}>{user.role}</span>
                      </div>
                      <Link href={getDashboardPath(user.role)} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard style={{ width: 14, height: 14, color: '#6b7280' }} /> Dashboard
                      </Link>
                      <Link href="/dashboard/profile" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings style={{ width: 14, height: 14, color: '#6b7280' }} /> Settings
                      </Link>
                      <div className="border-t border-gray-50 my-1" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut style={{ width: 14, height: 14 }} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors relative">
                <Heart style={{ width: 16, height: 16 }} />
                {wlCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wlCount > 99 ? '99+' : wlCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <button onClick={toggleCart}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 transition-colors relative hover:bg-gray-50 text-gray-500">
              <ShoppingCart style={{ width: 16, height: 16 }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors ml-1">
              {mobileOpen ? <X style={{ width: 16, height: 16 }} /> : <Menu style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden h-10">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  className="flex-1 px-3 text-sm focus:outline-none" />
                <button type="submit" className="w-10 bg-blue-600 flex items-center justify-center">
                  <Search className="text-white" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/products" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">
                All Products
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm">
                <Heart style={{ width: 13, height: 13 }} /> Wishlist
              </Link>
            </div>
            {categories.slice(0, 8).map(cat => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-700 border-b border-gray-50 last:border-0">
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
