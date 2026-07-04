import Link from 'next/link';
import { ShoppingBag, Facebook, Twitter, Instagram, Send, Mail, Phone, MapPin } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];
const CATEGORIES = [
  { label: 'Electronics', href: '/categories/electronics' },
  { label: 'Fashion', href: '/categories/fashion' },
  { label: 'Home & Living', href: '/categories/home-living' },
  { label: 'Beauty', href: '/categories/beauty' },
  { label: 'Sports', href: '/categories/sports' },
  { label: 'Books', href: '/categories/books' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Trust strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $50' },
              { icon: '↩️', title: '30-Day Returns', sub: 'Easy returns' },
              { icon: '💬', title: '24/7 Support', sub: 'We are here to help' },
              { icon: '🔒', title: 'Secure Checkout', sub: '100% secure payments' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                <ShoppingBag className="text-white" style={{ width: 15, height: 15 }} />
              </div>
              <span className="font-bold text-white text-[15px]">MarketBridge</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Quality products from trusted warehouses, delivered to your door.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Send, href: 'https://t.me/marketbridge' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Icon style={{ width: 14, height: 14 }} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(c => (
                <li key={c.label}>
                  <Link href={c.href} className="text-sm text-gray-500 hover:text-white transition-colors">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm text-gray-500">123 Business Ave, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone style={{ width: 14, height: 14, flexShrink: 0 }} />
                <a href="tel:+251911234567" className="text-sm text-gray-500 hover:text-white transition-colors">+251 911 234 567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail style={{ width: 14, height: 14, flexShrink: 0 }} />
                <a href="mailto:support@marketbridge.com" className="text-sm text-gray-500 hover:text-white transition-colors">support@marketbridge.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} MarketBridge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <Link key={t} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
