import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomeCTA from '@/components/home/home-cta';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import { getCachedFeaturedProducts, getCachedTrendingProducts, getCachedCategories } from '@/lib/cached-data';
import { ShieldCheck, Zap, Star, Package } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  electronics: '📱', fashion: '👗', 'home-living': '🏠', beauty: '💄',
  sports: '⚽', books: '📚', toys: '🧸', food: '🍎',
};

export default async function HomePage() {
  const [featuredRaw, trendingRaw, categoriesRaw] = await Promise.all([
    getCachedFeaturedProducts(5).catch(() => ({ products: [], total: 0 })),
    getCachedTrendingProducts(8).catch(() => ({ products: [], total: 0 })),
    getCachedCategories().catch(() => []),
  ]);
  const featured: any[] = Array.isArray(featuredRaw) ? featuredRaw : (featuredRaw as any)?.products || [];
  const trending: any[] = Array.isArray(trendingRaw) ? trendingRaw : (trendingRaw as any)?.products || [];
  const categories = categoriesRaw;

  const topCats = (Array.isArray(categories) ? categories : []).slice(0, 8);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">

        {/* ─── HERO ─── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                  ✨ New Collection Available
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                  Shop Quality Products<br />
                  <span style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    From Trusted Sellers
                  </span>
                </h1>
                <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg">
                  Discover thousands of products from verified warehouses. Fast delivery, easy returns, and secure payments guaranteed.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/products">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                      Shop Now
                    </button>
                  </Link>
                  <Link href="/categories/electronics">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                      Browse Categories
                    </button>
                  </Link>
                </div>
                {/* Stats row */}
                <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                  {[
                    { value: '50K+', label: 'Products' },
                    { value: '200+', label: 'Warehouses' },
                    { value: '4.8★', label: 'Avg Rating' },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero image */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?w=800"
                    alt="Featured Products"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,rgba(29,78,216,0.15),transparent)' }} />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Star className="text-amber-500" style={{ width: 16, height: 16, fill: '#f59e0b' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Top Rated</p>
                      <p className="text-[10px] text-gray-400">4.9 / 5 stars</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-xl p-3 border border-gray-100">
                  <p className="text-xs font-bold text-blue-600">Free Shipping</p>
                  <p className="text-[10px] text-gray-400">On all orders</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRUST STRIP ─── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Quality Products', sub: 'Verified sellers', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Zap, label: 'Best Prices', sub: 'Price match guarantee', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: '🚚', label: 'Fast Delivery', sub: '2–5 business days', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: ShieldCheck, label: 'Secure Payments', sub: '100% safe checkout', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${b.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {typeof b.icon === 'string'
                      ? <span className="text-lg">{b.icon}</span>
                      : <b.icon className={b.color} style={{ width: 18, height: 18 }} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{b.label}</p>
                    <p className="text-xs text-gray-400">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-sm text-gray-400 mt-0.5">Find what you're looking for</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {topCats.map((cat: any) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-2 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {cat.icon || CATEGORY_ICONS[cat.slug] || '🛍️'}
                  </div>
                  <p className="text-[11px] font-medium text-gray-700 text-center truncate w-full">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── BEST SELLING ─── */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Best Selling Products</h2>
                <p className="text-sm text-gray-400 mt-0.5">Our most popular picks</p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {featured.map((p: any) => (
                <ProductCardInteractive key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ─── TELEGRAM CTA ─── */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <HomeCTA />
        </section>

        {/* ─── TRENDING ─── */}
        {trending.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
                <p className="text-sm text-gray-400 mt-0.5">What everyone is buying</p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
              {trending.slice(0, 4).map((p: any) => (
                <ProductCardInteractive key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ─── BOTTOM TRUST ─── */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { emoji: '🚚', t: 'Free Shipping', s: 'On all orders over 500 Br' },
                { emoji: '↩️', t: 'Easy Returns', s: '30-day return policy' },
                { emoji: '💬', t: '24/7 Support', s: 'We are always here' },
                { emoji: '🔒', t: 'Secure Checkout', s: 'Encrypted payments' },
              ].map(b => (
                <div key={b.t}>
                  <div className="text-3xl mb-2">{b.emoji}</div>
                  <p className="text-sm font-bold text-gray-800">{b.t}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{b.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
