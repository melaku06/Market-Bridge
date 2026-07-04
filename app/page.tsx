import Link from 'next/link';
import { ChevronRight, Star, Truck, RotateCcw, Shield, Headphones, ArrowRight, Tag } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomeCTA from '@/components/home/home-cta';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import { getCachedFeaturedProducts, getCachedTrendingProducts, getCachedCategories } from '@/lib/cached-data';

export const dynamic = 'force-dynamic';

const categoryIcons = ['📱', '👗', '🏠', '💄', '⚽', '🧸', '🚗', '📚'];

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
            <div className="rounded-2xl overflow-hidden flex min-h-[300px] bg-white border border-gray-100 shadow-sm">
              {/* Left: text content */}
              <div className="flex-1 flex items-center px-8 md:px-14 py-12 bg-white">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                      <Tag className="w-3 h-3" />
                      Best Deals 2024
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    Discover Quality<br />
                    Products from<br />
                    <span className="text-blue-600 relative">
                      Trusted Warehouses
                      <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 300 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 2 Q150 0 300 2" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
                      </svg>
                    </span>
                  </h1>
                  <p className="text-gray-500 text-base mb-8 leading-relaxed">
                    Shop the best products at great prices.<br />
                    Website first, delivered to your door.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/products">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm">
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 px-7 py-3 rounded-xl font-semibold text-sm transition-colors">
                        How It Works
                      </button>
                    </Link>
                  </div>
                  {/* Price badge */}
                  <div className="inline-flex items-center gap-2 mt-8 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">From $9.99</p>
                      <p className="text-[10px] text-gray-500">10,000+ products</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: lifestyle image */}
              <div className="hidden lg:block w-[420px] xl:w-[500px] flex-shrink-0 relative">
                <img
                  src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Quality Products"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Star, title: 'Quality Products', desc: 'Carefully selected', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Tag, title: 'Best Prices', desc: 'Fair pricing always', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Truck, title: 'Fast Delivery', desc: 'Quick & reliable', color: 'text-orange-600', bg: 'bg-orange-50' },
                { icon: Shield, title: 'Secure Payments', desc: '100% secure', color: 'text-purple-600', bg: 'bg-purple-50' },
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
              <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {topCategories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 bg-white transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
                    {categoryIcons[i % categoryIcons.length]}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-blue-700 line-clamp-2">
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

        {/* Join Our Community CTA */}
        <HomeCTA />

        {/* Trending Products */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
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
