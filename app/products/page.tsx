import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsBrowser from '@/components/product/products-browser';
import { getCachedProducts, getCachedCategories } from '@/lib/cached-data';

// Force dynamic rendering to avoid build-time database requirement
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Fetch products and categories in parallel on the server
  const [{ products }, categories] = await Promise.all([
    getCachedProducts({ status: 'published', limit: 100 }),
    getCachedCategories({ is_active: true }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">All Products</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProductsBrowser products={products} categories={categories} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
