'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Loader2, Trash2, Package, ArrowRight, Filter, Grid3x3, List } from 'lucide-react';
import { productsApi } from '@/lib/api';
import StarRating from '@/components/ui/star-rating';
import type { Product } from '@/lib/types';

export default function RecentlyViewedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productsApi.list({ limit: 20 });
        const productList = Array.isArray(res) ? res : (res as { data?: Product[] }).data || [];
        setProducts([...productList].reverse());
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Recently Viewed</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recently Viewed</h1>
            <p className="text-sm text-gray-500 mt-1">Products you have recently viewed.</p>
          </div>
          {products.length > 0 && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recently viewed products</h3>
          <p className="text-sm text-gray-500 mb-6">Start browsing to see your history here.</p>
          <Link href="/products">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
              Browse Products <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : view === 'grid' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                  <button className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">{product.category_id || 'General'}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
                  <StarRating rating={product.rating || 0} count={product.review_count || 0} className="mb-2" />
                  <p className="text-sm font-bold text-gray-900 mb-2">{product.final_price.toLocaleString()} Br</p>
                  <Link href={`/products/${product.id}`}>
                    <button className="w-full py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium transition-colors">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link href="/products">
              <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                View More Products
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">{product.category_id || 'General'}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                  <StarRating rating={product.rating || 0} count={product.review_count || 0} className="mt-1" />
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{product.final_price.toLocaleString()} Br</p>
                <Link href={`/products/${product.id}`}>
                  <button className="text-xs text-blue-600 font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
                    View
                  </button>
                </Link>
                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
