'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import StarRating from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/stores/wishlist/wishlist-store';
import { useCartStore } from '@/stores/cart/cart-store';
import { getFinalPrice } from '@/lib/price';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product & {
    final_price?: number;
    price?: number;
    original_price?: number;
    originalPrice?: number;
    discount?: number;
    image?: string;
    reviews?: number;
    category?: { id: string; name: string } | string | null;
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const addItem = useCartStore((s) => s.addItem);

  // Normalize data from API or Prisma format
  const price = product.final_price ?? product.price ?? getFinalPrice(product);
  const originalPrice = product.original_price ?? product.originalPrice ?? (typeof product.base_price === 'number' ? product.base_price * (1 + (product.margin_percent ?? 15) / 100) : price);
  const discount = product.discount_percent ?? product.discount ?? 0;
  const image = product.images?.[0] ?? product.image ?? '';
  const reviewCount = product.review_count ?? product.reviews ?? 0;
  const category = typeof product.category === 'string' ? product.category : (product.category?.name || '');

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      image,
      basePrice: price,
      marginPercent: 0,
      discountPercent: discount,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <Link href={`/products/${product.id}`} className={cn('group block', className)}>
      <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist({
                productId: product.id,
                name: product.name,
                image,
                basePrice: price,
                marginPercent: 0,
                discountPercent: discount,
              });
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={cn('w-4 h-4', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {category && <p className="text-xs text-blue-600 font-medium mb-1">{category}</p>}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
          <StarRating rating={product.rating} count={reviewCount} className="mb-2" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-gray-900">{price.toLocaleString()} Br</span>
              {discount > 0 && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString()} Br</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className={cn(
              'mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
              addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {addedToCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
