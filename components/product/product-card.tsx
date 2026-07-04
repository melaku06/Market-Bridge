'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price?: number;
  final_price?: number;
  original_price?: number;
  originalPrice?: number;
  discount_percent?: number;
  discount?: number;
  images?: string[];
  image?: string;
  rating?: number;
  review_count?: number;
  reviews?: number;
  category_name?: string;
  category?: string;
  warehouse_name?: string;
  brand?: string;
  className?: string;
}

const formatPrice = (n: number) => `${Number(n).toLocaleString()} Br`;

export default function ProductCard(props: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const image = props.images?.[0] || props.image || '';
  const finalPrice = props.final_price || props.price || 0;
  const originalPrice = props.original_price || props.originalPrice || 0;
  const discount = props.discount_percent || props.discount || 0;
  const rating = props.rating || 0;
  const reviewCount = props.review_count || props.reviews || 0;
  const seller = props.warehouse_name || props.brand || '';

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${props.id}`} className={cn('group block', props.className)}>
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {image ? (
            <img src={image} alt={props.name} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              -{discount.toFixed(0)}%
            </span>
          )}
          <button onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm ${wishlisted ? 'bg-red-500 text-white opacity-100' : 'bg-white text-gray-400 hover:text-red-500'}`}>
            <Heart style={{ width: 12, height: 12, fill: wishlisted ? 'currentColor' : 'none' }} />
          </button>
        </div>
        <div className="p-3.5">
          {seller && <p className="text-[11px] text-blue-600 font-medium mb-1 truncate">{seller}</p>}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug">{props.name}</h3>
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 11, height: 11 }}
                  className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-extrabold text-gray-900">{formatPrice(finalPrice)}</span>
            {originalPrice > finalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
          <button onClick={handleCart}
            className={`w-full h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${added ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
            {added ? <><Check style={{ width: 13, height: 13 }} /> Added!</> : <><ShoppingCart style={{ width: 13, height: 13 }} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </Link>
  );
}
