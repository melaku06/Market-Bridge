import Link from 'next/link';
import { ChevronRight, Star, Truck, RotateCcw, Shield, Headphones, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomeCTA from '@/components/home/home-cta';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import { getCachedFeaturedProducts, getCachedTrendingProducts, getCachedCategories } from '@/lib/cached-data';
import { formatPrice } from '@/lib/price';

// Force dynamic rendering to avoid build-time database requirement
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all data in parallel on the server, cached via cache-aside
  const [featuredResult, trendingResult, categories] = await Promise.all([
    getCachedFeaturedProducts(10),
    getCachedTrendingProducts(10),
    getCachedCategories({ is_active: true }),
  ]);

  const featuredProducts = featuredResult.products.slice(0, 5);
  const trendingProducts = trendingResult.products.slice(0, 5);
  const topCategories = categories.slice(0, 6);

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
                  Shop the best products at great prices. Quality first, delivered to your door.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link href="/products">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                      Become a Seller
                    </button>
                  </Link>
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
                { icon: <Truck className="w-5 h-5 text-blue-600" />, title: 'Free Shipping', desc: 'On orders over 500 Br' },
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
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-gray-100 bg-white transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">
                    📦
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
            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No products available yet.</p>
                <Link href="/register">
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
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
              <h2 className="text-xl font-bold text-gray-900">Trending Products</h2>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: <Truck className="w-5 h-5" />, title: 'Free Shipping', desc: 'On orders over 500 Br' },
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
