'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { formatPrice } from '@/lib/price';
import type { ProductCardData } from './product-card-server';

export default function ProductCardInteractive({ product }: { product: ProductCardData }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);

  const basePrice = typeof product.base_price === 'number' ? product.base_price : product.base_price.toNumber();
  const margin = typeof product.margin_percent === 'number' ? (product.margin_percent || 15) : (product.margin_percent?.toNumber() ?? 15);
  const discount = typeof product.discount_percent === 'number' ? product.discount_percent : (product.discount_percent?.toNumber() ?? 0);
  const rating = typeof product.rating === 'number' ? product.rating : (product.rating?.toNumber?.() ?? 0);
  const finalPrice = basePrice * (1 + margin / 100) * (1 - discount / 100);
  const originalPrice = basePrice * (1 + margin / 100);
  const image = product.images?.[0] || '';
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      image,
      basePrice,
      marginPercent: margin,
      discountPercent: discount,
      warehouseName: product.warehouse?.name || 'Verified Seller',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {image ? (
            <img src={image} alt={product.name} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              -{discount.toFixed(0)}%
            </span>
          )}
          {/* Wishlist button */}
          <button onClick={handleWishlist}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm ${wishlisted ? 'bg-red-500 text-white opacity-100' : 'bg-white text-gray-400 hover:text-red-500'}`}>
            <Heart style={{ width: 13, height: 13, fill: wishlisted ? 'currentColor' : 'none' }} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5">
          {product.warehouse?.name && (
            <p className="text-[11px] text-blue-600 font-medium mb-1 truncate">{product.warehouse.name}</p>
          )}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 11, height: 11 }}
                  className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({product.review_count || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-extrabold text-gray-900">{formatPrice(finalPrice)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Add to Cart */}
          <button onClick={handleAddToCart}
            className={`w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}>
            {added ? <><Check style={{ width: 13, height: 13 }} /> Added!</> : <><ShoppingCart style={{ width: 13, height: 13 }} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </Link>
  );
}
