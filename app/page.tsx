import Link from 'next/link';
import { ChevronRight, Star, Truck, RotateCcw, Shield, Headphones, ArrowRight, Zap } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomeCTA from '@/components/home/home-cta';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import { getCachedFeaturedProducts, getCachedTrendingProducts, getCachedCategories } from '@/lib/cached-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredResult, trendingResult, categories] = await Promise.all([
    getCachedFeaturedProducts(10),
    getCachedTrendingProducts(10),
    getCachedCategories({ is_active: true }),
  ]);

  const featuredProducts = featuredResult.products.slice(0, 5);
  const trendingProducts = trendingResult.products.slice(0, 5);
  const topCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="rounded-2xl overflow-hidden relative flex min-h-[320px]">
              {/* Left: blue gradient panel */}
              <div className="relative flex-1 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 flex items-center px-8 md:px-12 py-12">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -left-10 -top-10 w-56 h-56 bg-white rounded-full" />
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white rounded-full" />
                </div>
                <div className="relative z-10 max-w-sm">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    Best Deals 2024
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                    Discover Quality<br />
                    Products from{' '}
                    <span className="text-yellow-300">Trusted Warehouses</span>
                  </h1>
                  <p className="text-blue-100 text-sm mb-7 leading-relaxed">
                    Shop the best products at competitive prices. Quality first, delivered right to your door.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/products">
                      <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-md">
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="border border-white/40 text-white hover:bg-white/10 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors backdrop-blur-sm">
                        Become a Seller
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right: product image */}
              <div className="hidden lg:block w-72 xl:w-96 relative bg-gray-50">
                <img
                  src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Featured Products"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/20" />
                {/* Floating price card */}
                <div className="absolute bottom-6 left-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Top Rated</p>
                    <p className="text-xs text-gray-500">10,000+ products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'On orders over 500 Br', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Star, title: 'Quality Products', desc: 'Carefully selected', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy & hassle-free', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Shield, title: 'Secure Payments', desc: '100% protected', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Categories */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
                <p className="text-sm text-gray-500 mt-0.5">Browse by category</p>
              </div>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {topCategories.map((cat, i) => {
                const icons = ['📱', '💻', '🎧', '📷', '🏠', '👕', '⌚', '🎮'];
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 bg-white transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">
                      {icons[i % icons.length]}
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-blue-700 line-clamp-2">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Best Selling Products */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Best Selling Products</h2>
                <p className="text-sm text-gray-500 mt-0.5">Our most popular items</p>
              </div>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 mb-4">No products available yet.</p>
                <Link href="/register">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                    Register as a Seller
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCardInteractive key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Auth-dependent CTA */}
        <HomeCTA />

        {/* Trending Products */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
                <p className="text-sm text-gray-500 mt-0.5">What everyone is buying</p>
              </div>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingProducts.map((product) => (
                <ProductCardInteractive key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Trust */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'On orders over 500 Br', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: RotateCcw, title: '30-Day Returns', desc: 'Easy returns policy', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Headphones, title: '24/7 Support', desc: 'We are here to help', color: 'text-orange-600', bg: 'bg-orange-50' },
                { icon: Shield, title: 'Secure Checkout', desc: '100% secure payments', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
