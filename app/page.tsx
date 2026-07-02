'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Send, ShoppingBag, Star, Truck, RotateCcw, Shield, Headphones } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/lib/mock-db';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.list({ status: 'published', limit: 10 }),
          categoriesApi.list(),
        ]);
        // Handle both { data: [...] } and direct array responses
        setProducts(Array.isArray(productsRes) ? productsRes : (productsRes as { data: Product[] }).data || []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const featuredProducts = (products || []).slice(0, 5);
  const trendingProducts = (products || []).slice(0, 5).reverse();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="rounded-2xl overflow-hidden relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 min-h-[320px] flex items-center">
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Hero"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative z-10 px-8 md:px-16 py-12 max-w-xl">
                <p className="text-blue-400 text-sm font-medium uppercase tracking-wider mb-3">Best Deals 2024</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                  Discover Quality<br />
                  Products from{' '}
                  <span className="text-blue-400">Trusted Warehouses</span>
                </h1>
                <p className="text-gray-300 text-sm mb-6">
                  Shop the best products at great prices. Website first, delivered to your door.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/products">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                      Shop Now
                    </button>
                  </Link>
                  <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                    How It Works
                  </button>
                </div>
              </div>
              <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2">
                <img
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Featured Product"
                  className="w-72 h-72 object-cover rounded-2xl shadow-2xl opacity-90"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Truck className="w-5 h-5 text-blue-600" />, title: 'Free Shipping', desc: 'On orders over $50' },
                { icon: <Star className="w-5 h-5 text-blue-600" />, title: 'Quality Products', desc: 'Carefully selected' },
                { icon: <RotateCcw className="w-5 h-5 text-blue-600" />, title: '30-Day Returns', desc: 'Easy returns' },
                { icon: <Shield className="w-5 h-5 text-blue-600" />, title: 'Secure Payments', desc: '100% secure' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Categories */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {(categories || []).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 bg-white transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-blue-700">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Best Selling Products */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Best Selling Products</h2>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Telegram Banner */}
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

        {/* Trending Products */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Trending Products</h2>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Trust */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: <Truck className="w-5 h-5" />, title: 'Free Shipping', desc: 'On orders over $50' },
                { icon: <RotateCcw className="w-5 h-5" />, title: '30-Day Returns', desc: 'Easy returns' },
                { icon: <Headphones className="w-5 h-5" />, title: '24/7 Support', desc: 'We are here to help' },
                { icon: <Shield className="w-5 h-5" />, title: 'Secure Checkout', desc: '100% secure payments' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
