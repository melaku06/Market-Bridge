import Link from 'next/link';
import { ChevronRight, Users, Building2, ShoppingBag, Award, Globe2, Heart, Shield } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata = {
  title: 'About Us | MarketBridge',
  description: 'Learn about MarketBridge - Ethiopia\'s trusted marketplace connecting quality warehouses with customers across the nation.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">About Us</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About MarketBridge</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                MarketBridge is Ethiopia's premier online marketplace, connecting trusted warehouses and sellers with customers seeking quality products at fair prices. We're building a bridge between local businesses and the communities they serve.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  To empower Ethiopian businesses and customers by creating a transparent, reliable, and accessible e-commerce platform that delivers quality products while supporting local warehouses and sellers.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe every Ethiopian deserves access to quality products without compromise. That's why we verify every warehouse on our platform and ensure transparent pricing with our margin system.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team collaboration"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Trust', desc: 'Verified sellers and quality products you can rely on' },
                { icon: Heart, title: 'Community', desc: 'Supporting local businesses and Ethiopian economy' },
                { icon: Award, title: 'Quality', desc: 'Carefully curated products meeting high standards' },
                { icon: Globe2, title: 'Accessibility', desc: 'Making e-commerce available across Ethiopia' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center p-6 bg-gray-50 rounded-2xl">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '50+', label: 'Verified Warehouses' },
                { value: '10,000+', label: 'Products Available' },
                { value: '5,000+', label: 'Happy Customers' },
                { value: '12', label: 'Cities Covered' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How MarketBridge Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Building2, step: '1', title: 'Warehouses List Products', desc: 'Verified sellers and warehouses list their quality products on our platform with transparent pricing.' },
                { icon: ShoppingBag, step: '2', title: 'Customers Browse & Order', desc: 'Customers discover products, compare prices, and place orders with secure checkout.' },
                { icon: Users, step: '3', title: 'Delivery & Support', desc: 'Products are delivered to your door with full customer support every step of the way.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="w-8 h-8 text-blue-600" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join MarketBridge Today</h2>
            <p className="text-gray-600 mb-8">Whether you're a customer looking for quality products or a warehouse ready to reach new customers, MarketBridge is here for you.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Start Shopping
                </button>
              </Link>
              <Link href="/product-request">
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Request a Product
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
