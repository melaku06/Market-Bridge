import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductsBrowser from '@/components/product/products-browser';
import { getCachedCategoryBySlug, getCachedProductsByCategory, getCachedCategories } from '@/lib/cached-data';

// Force dynamic rendering to avoid build-time database requirement
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCachedCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  // Fetch products in this category and all categories for the filter sidebar
  const [productsResult, categories] = await Promise.all([
    getCachedProductsByCategory(category.id, 100),
    getCachedCategories({ is_active: true }),
  ]);

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
              <span className="text-gray-900 font-medium">{category.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Category Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-36 shadow-sm" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb)' }}>
            <img
              src={(category as any).image_url || (category as any).image || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200'}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="relative z-10 px-8 py-6 flex items-center justify-between h-full">
              <div>
                <p className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wider">Category</p>
                <h1 className="text-2xl font-extrabold text-white">{category.name}</h1>
                <p className="text-blue-200 text-sm mt-1">
                  {category.description || `Explore the latest ${category.name.toLowerCase()} products`}
                </p>
              </div>
              <div className="text-white text-right bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-2xl font-extrabold">{productsResult.products.length}</p>
                <p className="text-xs text-blue-200">Products</p>
              </div>
            </div>
          </div>

          <ProductsBrowser
            products={productsResult.products}
            categories={categories as any}
            initialCategoryId={category.id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
