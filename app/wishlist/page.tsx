'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Share2, ChevronRight, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import StarRating from '@/components/ui/star-rating';
import { wishlistApi, productsApi } from '@/lib/api';
import type { Product, WishlistItem } from '@/lib/mock-db';

interface WishlistItemWithProduct extends WishlistItem {
  product: Product | null;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        // Using customer_id 'usr-001' as the current customer
        const wishlistData = await wishlistApi.list('usr-001');
        setItems(wishlistData as WishlistItemWithProduct[]);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const removeItem = async (productId: string) => {
    try {
      await wishlistApi.remove('usr-001', productId);
      setItems(items.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearAll = async () => {
    try {
      // Remove all items one by one
      await Promise.all(items.map((item) => wishlistApi.remove('usr-001', item.product_id)));
      setItems([]);
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    }
  };

  // Extract unique categories from products
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.product?.category_id).filter(Boolean) as string[]))];

  const filtered = items.filter((item) => {
    if (!item.product) return false;
    if (selectedCategory !== 'All' && item.product.category_id !== selectedCategory) return false;
    if (item.product.final_price < priceRange[0] || item.product.final_price > priceRange[1]) return false;
    return true;
  });

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
              <span className="text-gray-900 font-medium">My Wishlist</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                  <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                    <input type="range" min={0} max={10000} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-blue-600 mb-1" />
                    <div className="flex justify-between text-xs text-gray-500"><span>Br 0</span><span>Br {priceRange[1].toLocaleString()}</span></div>
                  </div>

                  {categories.length > 1 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                      <div className="space-y-1">
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="w-4 h-4 accent-blue-600 rounded" />
                            <span className="text-sm text-gray-600">{cat}</span>
                            <span className="ml-auto text-xs text-gray-400">({items.filter((item) => cat === 'All' || item.product?.category_id === cat).length})</span>
                          </label>
                        ))}
                        <button onClick={() => { setPriceRange([0, 10000]); setSelectedCategory('All'); }} className="text-sm text-blue-600 hover:underline mt-2">Clear Filters</button>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">My Wishlist ({items.length})</h1>
                    <p className="text-sm text-gray-500">Your saved items</p>
                  </div>
                  {items.length > 0 && (
                    <div className="flex gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Share2 className="w-4 h-4" />
                        Share Wishlist
                      </button>
                      <button
                        onClick={clearAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-red-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {items.length === 0 ? "You haven't saved any products yet" : "No products match your filters"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      {items.length === 0 ? "Browse our products and save the ones you love!" : "Try adjusting your filters."}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link href="/products"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Browse Products</button></Link>
                      <Link href="/"><button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Go to Categories</button></Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item) => {
                      const product = item.product;
                      if (!product) return null;

                      return (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group">
                          <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <button
                              onClick={() => removeItem(product.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50"
                            >
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </button>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-blue-600 font-medium mb-1">{product.category_id || 'General'}</p>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                            <StarRating rating={product.rating || 0} count={product.review_count || 0} className="mb-2" />
                            <p className="text-base font-bold text-gray-900 mb-2">{product.final_price.toLocaleString()} Br</p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                                <ShoppingCart className="w-3 h-3" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => removeItem(product.id)}
                                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
