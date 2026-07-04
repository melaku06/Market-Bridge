import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCardInteractive from '@/components/product/product-card-interactive';
import ProductDetailInteractive from '@/components/product/product-detail-interactive';
import { getCachedProductById, getCachedReviews, getCachedProductsByCategory } from '@/lib/cached-data';

// Force dynamic rendering to avoid build-time database requirement
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getCachedProductById(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related data in parallel
  const categoryId = (product as any).category?.id || (product as any).category_id;
  const [reviews, relatedResult] = await Promise.all([
    getCachedReviews(params.id),
    categoryId
      ? getCachedProductsByCategory(categoryId, 5)
      : Promise.resolve({ products: [] }),
  ]);

  const relatedProducts = relatedResult.products
    .filter((p) => p.id !== params.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products" className="hover:text-blue-600">Products</Link>
              {(product as any).category && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <Link href={`/categories/${(product as any).category.slug || (product as any).category_id}`} className="hover:text-blue-600">
                    {(product as any).category.name || (product as any).category_name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetailInteractive product={product} reviews={reviews} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCardInteractive key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
