import Link from 'next/link';
import { ChevronRight, Heart, Eye } from 'lucide-react';
import { products } from '@/lib/data';
import StarRating from '@/components/ui/star-rating';

export default function RecentlyViewedPage() {
  const recentProducts = [...products].reverse();

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Recently Viewed</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Recently Viewed</h1>
        <p className="text-sm text-gray-500">Products you have recently viewed.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
              <StarRating rating={product.rating} count={product.reviews} className="mb-2" />
              <p className="text-sm font-bold text-gray-900 mb-2">{product.price.toLocaleString()} Br</p>
              <Link href={`/products/${product.id}`}>
                <button className="w-full py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium transition-colors">
                  View Product
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center pt-2">
        <Link href="/products">
          <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            View More Products
          </button>
        </Link>
      </div>
    </div>
  );
}
