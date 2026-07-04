'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Share2, ChevronRight, Loader2, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useWishlistStore, useCartStore } from '@/stores';
import { formatPrice } from '@/lib/price';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];

export default function WishlistPage() {
  const { items, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const [priceRange, setPriceRange] = useState(500);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeItem = (productId: string) => {
    removeFromWishlist(productId);
  };

  const moveAllToCart = () => {
    for (const item of filtered) {
      addItem({
        id: item.productId,
        name: item.name,
        image: item.image,
        basePrice: item.basePrice,
        marginPercent: item.marginPercent,
        discountPercent: item.discountPercent,
      }, 1);
    }
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.productId,
      name: item.name,
      image: item.image,
      basePrice: item.basePrice,
      marginPercent: item.marginPercent,
      discountPercent: item.discountPercent,
    }, 1);
  };

  const getFinalPrice = (item: typeof items[0]) => {
    return item.basePrice * (1 + item.marginPercent / 100) * (1 - item.discountPercent / 100);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const price = getFinalPrice(item);
      const priceOk = price <= priceRange;
      const catOk = selectedCategories.length === 0;
      return priceOk && catOk;
    });
  }, [items, priceRange, selectedCategories]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Left Sidebar Filters */}
              <aside className="hidden lg:block w-52 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
                  <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-blue-600 mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$0</span>
                      <span>${priceRange}+</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => {
                        const count = items.filter(() => true).length;
                        const isChecked = selectedCategories.includes(cat);
                        return (
                          <label key={cat} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategory(cat)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className={`text-sm transition-colors ${isChecked ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                                {cat}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="mt-3 text-xs text-blue-600 hover:underline font-medium"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">My Wishlist ({items.length})</h1>
                    <p className="text-sm text-gray-500">Your saved items</p>
                  </div>
                  {items.length > 0 && (
                    <div className="flex gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share Wishlist
                      </button>
                      <button
                        onClick={moveAllToCart}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Move All to Cart
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
                    <Link href="/products">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Browse Products</button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((item) => {
                      const finalPrice = getFinalPrice(item);
                      return (
                        <div key={item.productId} className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group">
                          <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <img
                              src={item.image || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                            >
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </button>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{item.name}</h3>
                            <div className="flex items-center gap-1 mb-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                              ))}
                              <span className="text-xs text-gray-400 ml-0.5">(128)</span>
                            </div>
                            <p className="text-base font-bold text-gray-900 mb-2">{formatPrice(finalPrice)}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => removeItem(item.productId)}
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
