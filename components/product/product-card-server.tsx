import Link from 'next/link';
import { Star } from 'lucide-react';
import { formatPrice, toNumber } from '@/lib/price';
import { cn } from '@/lib/utils';

export interface ProductCardData {
  id: string;
  name: string;
  slug?: string;
  base_price: number | { toNumber(): number };
  margin_percent?: number | { toNumber(): number };
  discount_percent?: number | { toNumber(): number };
  images?: string[];
  rating: number | { toNumber(): number };
  review_count?: number;
  warehouse?: { id?: string; name: string } | null;
  category?: { id?: string; name: string; slug?: string } | null;
  brand?: string | null;
}

/**
 * Server-rendered product card. No client-side state.
 * Interactive actions (add to cart, wishlist) are handled
 * by the client wrapper component when needed.
 */
export default function ProductCardServer({ product, className }: { product: ProductCardData; className?: string }) {
  const basePrice = toNumber(product.base_price);
  const margin = toNumber(product.margin_percent) || 15;
  const discount = toNumber(product.discount_percent);
  const rating = toNumber(product.rating);

  const finalPrice = basePrice * (1 + margin / 100) * (1 - discount / 100);
  const originalPrice = basePrice * (1 + margin / 100);
  const image = product.images?.[0] || '';
  const warehouseName = product.warehouse?.name || 'Verified Seller';

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
        </div>
        <div className="p-3">
          <p className="text-xs text-blue-600 font-medium mb-1">{warehouseName}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">{rating.toFixed(1)} ({product.review_count || 0})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
