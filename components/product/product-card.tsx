'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import StarRating from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    final_price?: number;
    price?: number;
    original_price?: number;
    originalPrice?: number;
    discount_percent?: number;
    discount?: number;
    images?: string[];
    image?: string;
    rating: number;
    review_count?: number;
    reviews?: number;
    category_name?: string;
    category?: string;
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Normalize data from API or legacy format
  const price = product.final_price ?? product.price ?? 0;
  const originalPrice = product.original_price ?? product.originalPrice ?? price;
  const discount = product.discount_percent ?? product.discount ?? 0;
  const image = product.images?.[0] ?? product.image ?? '';
  const reviewCount = product.review_count ?? product.reviews ?? 0;
  const category = product.category_name ?? product.category ?? '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
              setWishlisted(!wishlisted);
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
              <span className="text-base font-bold text-gray-900">${price.toFixed(2)}</span>
              {discount > 0 && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
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
