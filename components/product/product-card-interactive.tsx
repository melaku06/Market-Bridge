'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { formatPrice } from '@/lib/price';
import { cn } from '@/lib/utils';
import type { ProductCardData } from './product-card-server';

export default function ProductCardInteractive({ product, className }: { product: ProductCardData; className?: string }) {
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const basePrice = typeof product.base_price === 'number' ? product.base_price : product.base_price.toNumber();
  const margin = typeof product.margin_percent === 'number' ? (product.margin_percent || 15) : (product.margin_percent?.toNumber() ?? 15);
  const discount = typeof product.discount_percent === 'number' ? product.discount_percent : (product.discount_percent?.toNumber() ?? 0);
  const rating = typeof product.rating === 'number' ? product.rating : product.rating.toNumber();

  const finalPrice = basePrice * (1 + margin / 100) * (1 - discount / 100);
  const originalPrice = basePrice * (1 + margin / 100);
  const image = product.images?.[0] || '';
  const warehouseName = product.warehouse?.name || 'Verified Seller';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      image,
      basePrice,
      marginPercent: margin,
      discountPercent: discount,
      warehouseName,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      image,
      basePrice,
      marginPercent: margin,
      discountPercent: discount,
    });
  };

  return (
    <Link href={`/products/${product.id}`} className={cn('group block', className)}>
      <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label="Toggle wishlist"
          >
            <Heart className={cn('w-4 h-4', isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
        </div>
        <div className="p-3">
          <p className="text-xs text-blue-600 font-medium mb-1">{warehouseName}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">{rating.toFixed(1)} ({product.review_count || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-gray-900">{formatPrice(finalPrice)}</span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className={cn(
              'mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5',
              added
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
