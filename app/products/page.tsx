import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsBrowser from '@/components/product/products-browser';
import { getCachedProducts, getCachedCategories } from '@/lib/cached-data';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [productsData, categories] = await Promise.all([
    getCachedProducts({ status: 'published', limit: 100 }).catch(() => []),
    getCachedCategories().catch(() => []),
  ]);

  const products: any[] = Array.isArray(productsData) ? productsData : (productsData as any)?.data || [];
  const cats: any[] = Array.isArray(categories) ? categories : [];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-900 font-medium">All Products</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-400 mt-1">{(products as any[]).length} products available</p>
          </div>
          <ProductsBrowser products={products} categories={cats} />
        </div>
      </main>
      <Footer />
    </>
  );
}
