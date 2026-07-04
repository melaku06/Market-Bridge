'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, RotateCcw, Shield, Headphones, Store, Send, Share2, Check } from 'lucide-react';
import StarRating from '@/components/ui/star-rating';
import { formatPrice } from '@/lib/price';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

interface ProductDetailInteractiveProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    short_description?: string | null;
    base_price: number | { toNumber(): number };
    margin_percent?: number | { toNumber(): number };
    discount_percent?: number | { toNumber(): number };
    images: string[];
    rating: number | { toNumber(): number };
    review_count?: number;
    sold_count?: number;
    colors?: string[];
    brand?: string | null;
    sku?: string | null;
    weight?: string | null;
    tags?: string[];
    warehouse?: { name: string; owner_name: string } | null;
    category?: { name: string } | null;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    customer_name: string;
    created_at: string | Date;
  }>;
}

export default function ProductDetailInteractive({ product, reviews }: ProductDetailInteractiveProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const basePrice = typeof product.base_price === 'number' ? product.base_price : product.base_price.toNumber();
  const margin = typeof product.margin_percent === 'number' ? (product.margin_percent || 15) : (product.margin_percent?.toNumber() ?? 15);
  const discount = typeof product.discount_percent === 'number' ? product.discount_percent : (product.discount_percent?.toNumber() ?? 0);
  const rating = typeof product.rating === 'number' ? product.rating : product.rating.toNumber();

  const finalPrice = basePrice * (1 + margin / 100) * (1 - discount / 100);
  const originalPrice = basePrice * (1 + margin / 100);

  const tabs = ['description', 'specifications', 'reviews', 'shipping'] as const;

  return (
    <>
      {/* Product Main */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails on left */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-3">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === i ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={product.images[selectedImage] || product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={rating} showValue count={product.review_count} size="md" />
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">{product.sold_count || 0} sold</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-full">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.short_description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{product.short_description}</p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Color: <span className="font-normal">{selectedColor}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    image: product.images[0] || '',
                    basePrice: basePrice,
                    marginPercent: margin,
                    discountPercent: discount,
                    color: selectedColor,
                    warehouseName: product.warehouse?.name,
                  }, quantity);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedToCart ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
              <button className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist({
                  productId: product.id,
                  name: product.name,
                  image: product.images[0] || '',
                  basePrice: basePrice,
                  marginPercent: margin,
                  discountPercent: discount,
                })}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isInWishlist ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: <Truck className="w-4 h-4 text-blue-600" />, text: 'Free Shipping', sub: 'On orders over 500 Br' },
                { icon: <RotateCcw className="w-4 h-4 text-blue-600" />, text: '30-Day Returns', sub: 'Easy returns' },
                { icon: <Shield className="w-4 h-4 text-blue-600" />, text: 'Secure Payments', sub: '100% secure' },
                { icon: <Headphones className="w-4 h-4 text-blue-600" />, text: '24/7 Support', sub: 'Dedicated support' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            {product.warehouse && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Sold by</p>
                  <p className="text-sm font-semibold text-gray-900">{product.warehouse.name}</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Store className="w-4 h-4" />
                  View Store
                </button>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium text-gray-700">Share:</span>
              <div className="flex gap-2">
                {['fb', 'tw', 'tg'].map((s) => (
                  <button key={s} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} {tab === 'reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</p>
                  <StarRating rating={rating} size="md" className="justify-center my-1" />
                  <p className="text-sm text-gray-500">{product.review_count || 0} reviews</p>
                </div>
              </div>
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                        {review.customer_name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.customer_name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" className="mb-1.5" />
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
              )}
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-2 gap-3">
              {product.brand && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">Brand</span>
                  <span className="text-sm text-gray-900">{product.brand}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">SKU</span>
                  <span className="text-sm text-gray-900">{product.sku}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">Weight</span>
                  <span className="text-sm text-gray-900">{product.weight}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <span className="text-sm text-gray-900">{product.category.name}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">Sold</span>
                <span className="text-sm text-gray-900">{product.sold_count || 0} units</span>
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              {[
                { title: 'Standard Shipping', time: '3-5 business days', price: 'Free on orders over 5000 Br' },
                { title: 'Express Shipping', time: '1-2 business days', price: '999 Br' },
                { title: 'Returns', time: 'Within 30 days', price: 'Free return shipping' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.time} - {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
