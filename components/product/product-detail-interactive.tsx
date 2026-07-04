'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart, ShoppingCart, Zap, Star, Check, Share2,
  Truck, RotateCcw, ShieldCheck, Headphones, Store, ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { formatPrice } from '@/lib/price';
import StarRating from '@/components/ui/star-rating';
import type { Product } from '@/lib/types';

interface Review {
  id: string;
  user_name?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

const TABS = ['Description', 'Specifications', 'Reviews', 'Shipping & Returns'] as const;
type Tab = typeof TABS[number];

export default function ProductDetailInteractive({ product, reviews = [] }: { product: Product; reviews?: Review[] }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [activeTab, setActiveTab] = useState<Tab>('Description');
  const [addedToCart, setAddedToCart] = useState(false);

  const base = typeof product.base_price === 'number' ? product.base_price : Number(product.base_price);
  const margin = typeof product.margin_percent === 'number' ? (product.margin_percent || 15) : Number(product.margin_percent ?? 15);
  const discount = typeof product.discount_percent === 'number' ? product.discount_percent : Number(product.discount_percent ?? 0);
  const finalPrice = base * (1 + margin / 100) * (1 - discount / 100);
  const originalPrice = base * (1 + margin / 100);
  const rating = typeof product.rating === 'number' ? product.rating : Number(product.rating ?? 0);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        basePrice: base,
        marginPercent: margin,
        discountPercent: discount,
        color: selectedColor,
        warehouseName: (product as any).warehouse?.name || 'Verified Seller',
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      basePrice: base,
      marginPercent: margin,
      discountPercent: discount,
    });
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : rating;

  return (
    <div className="space-y-8">
      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Left: Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {(product.images?.length || 0) > 1 && (
            <div className="flex flex-col gap-2 w-16">
              {product.images?.slice(0, 5).map((img, i) => (
                <button key={i} onClick={() => setMainImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === i ? 'border-blue-500 shadow-md' : 'border-gray-100 hover:border-blue-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Main image */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {product.images?.[mainImage] ? (
              <img src={product.images[mainImage]} alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          {/* Breadcrumb category */}
          {(product as any).category && (
            <p className="text-xs font-medium text-blue-600 mb-2">{(product as any).category?.name}</p>
          )}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 16, height: 16 }}
                  className={i <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
            {(product as any).sold_count && <span className="text-sm text-gray-400">&bull; {(product as any).sold_count} sold</span>}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(finalPrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount.toFixed(0)}%</span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5 border-b border-gray-50 pb-5">{product.short_description}</p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2.5">Color: <span className="text-gray-900">{selectedColor}</span></p>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${selectedColor === c ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <p className="text-sm font-semibold text-gray-700">Quantity:</p>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg">−</button>
              <span className="w-12 text-center text-sm font-bold text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap mb-6">
            <button onClick={handleAddToCart}
              className={`flex-1 min-w-[140px] h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${addedToCart ? 'bg-emerald-500 text-white' : 'text-white hover:opacity-90'}`}
              style={addedToCart ? {} : { background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              {addedToCart ? <><Check style={{ width: 16, height: 16 }} /> Added to Cart</> : <><ShoppingCart style={{ width: 16, height: 16 }} /> Add to Cart</>}
            </button>
            <button className="flex-1 min-w-[140px] h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
              <Zap style={{ width: 16, height: 16 }} /> Buy Now
            </button>
            <button onClick={handleWishlist}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all flex-shrink-0 ${wishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}>
              <Heart style={{ width: 18, height: 18, fill: wishlisted ? 'currentColor' : 'none' }} />
            </button>
          </div>

          {/* Trust grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Orders over 500 Br' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '30-day return policy' },
              { icon: ShieldCheck, label: 'Secure Payment', sub: 'Encrypted checkout' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always here to help' },
            ].map(t => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                  <Icon className="text-blue-600 flex-shrink-0" style={{ width: 16, height: 16 }} />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{t.label}</p>
                    <p className="text-[10px] text-gray-400">{t.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seller info */}
          {(product as any).warehouse && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Store className="text-white" style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{(product as any).warehouse.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="text-amber-400 fill-amber-400" style={{ width: 11, height: 11 }} />
                    <span className="text-xs text-gray-500">{(product as any).warehouse.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
              </div>
              <Link href={`/warehouse/${(product as any).warehouse.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View Store <ChevronRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'Description' && (
            <div>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || product.short_description || 'No description available.'}
              </p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {product.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'Specifications' && (
            <div className="space-y-0">
              {[
                { label: 'Brand', value: product.brand },
                { label: 'SKU', value: product.sku },
                { label: 'Weight', value: product.weight ? `${product.weight} kg` : null },
                { label: 'Category', value: (product as any).category?.name },
              ].filter(r => r.value).map((row, i) => (
                <div key={row.label} className={`flex gap-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <span className="text-sm text-gray-400 w-32 flex-shrink-0">{row.label}</span>
                  <span className="text-sm font-medium text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Reviews' && (
            <div>
              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-50">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5 justify-center my-1">
                    {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 14, height: 14 }} className={i <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}
                  </div>
                  <p className="text-xs text-gray-400">{reviews.length} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(s => {
                    const cnt = reviews.filter(r => Math.round(r.rating) === s).length;
                    const pct = reviews.length > 0 ? (cnt / reviews.length) * 100 : 0;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-3">{s}</span>
                        <Star className="text-amber-400 fill-amber-400" style={{ width: 10, height: 10 }} />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No reviews yet.</p>
              ) : (
                <div className="space-y-5">
                  {reviews.slice(0, 5).map(r => (
                    <div key={r.id} className="border-b border-gray-50 pb-5 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                          {(r.user_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.user_name || 'Customer'}</p>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 11, height: 11 }} className={i <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />)}
                          </div>
                        </div>
                        {r.created_at && <span className="text-xs text-gray-400 ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>}
                      </div>
                      {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'Shipping & Returns' && (
            <div className="space-y-4">
              {[
                { icon: Truck, title: 'Standard Shipping', desc: 'Delivered in 3–5 business days. Free on orders over 500 Br.' },
                { icon: Zap, title: 'Express Shipping', desc: 'Delivered in 1–2 business days. Additional fees apply.' },
                { icon: RotateCcw, title: 'Returns', desc: 'Free returns within 30 days of delivery. Item must be in original condition.' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Icon className="text-blue-600 flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{s.title}</p>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
