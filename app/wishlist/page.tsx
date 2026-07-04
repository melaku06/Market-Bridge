'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Heart, ShoppingCart, Trash2, Share2, ChevronRight, Star } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/price';

export default function WishlistPage() {
  const { isLoading, fetchWishlist, items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => { fetchWishlist(); }, []);

  const handleAddToCart = (item: typeof items[number]) => {
    addItem({
      id: item.productId,
      name: item.name,
      image: item.image,
      basePrice: item.basePrice,
      marginPercent: item.marginPercent,
      discountPercent: item.discountPercent,
      warehouseName: 'Verified Seller',
    });
    setAddedIds(s => new Set([...Array.from(s), item.productId]));
    setTimeout(() => setAddedIds(s => { const n = new Set(s); n.delete(item.productId); return n; }), 1500);
  };

  const handleMoveAll = () => {
    items.forEach(item => addItem({
      id: item.productId, name: item.name, image: item.image,
      basePrice: item.basePrice, marginPercent: item.marginPercent,
      discountPercent: item.discountPercent, warehouseName: 'Verified Seller',
    }));
  };

  const getFinalPrice = (item: typeof items[number]) =>
    item.basePrice * (1 + item.marginPercent / 100) * (1 - item.discountPercent / 100);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Heart className="text-red-500 fill-red-500" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 style={{ width: 14, height: 14 }} /> Share
                </button>
                <button onClick={handleMoveAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                  <ShoppingCart style={{ width: 14, height: 14 }} /> Move All to Cart
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-8 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-300" style={{ width: 32, height: 32 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Save items you love and come back to them later</p>
              <Link href="/products">
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map(item => {
                const fp = getFinalPrice(item);
                const op = item.basePrice * (1 + item.marginPercent / 100);
                const isAdded = addedIds.has(item.productId);
                return (
                  <div key={item.productId} className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden group">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link href={`/products/${item.productId}`}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                      </Link>
                      <button onClick={() => removeFromWishlist(item.productId)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </button>
                    </div>
                    {/* Info */}
                    <div className="p-3.5">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} style={{ width: 11, height: 11 }} className={i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                        <span className="text-[11px] text-gray-400 ml-1">(128)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-extrabold text-gray-900">{formatPrice(fp)}</span>
                        {item.discountPercent > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(op)}</span>}
                      </div>
                      <button onClick={() => handleAddToCart(item)}
                        className={`w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${isAdded ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                        <ShoppingCart style={{ width: 13, height: 13 }} />
                        {isAdded ? 'Added!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
