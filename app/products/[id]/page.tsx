'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, Heart, ShoppingCart, Star, Truck, RotateCcw, Shield, Headphones,
  Facebook, Twitter, Send, Share2, Minus, Plus, Store,
} from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product/product-card';
import StarRating from '@/components/ui/star-rating';
import { productsApi, reviewsApi, warehousesApi } from '@/lib/api';
import type { Product, Review, Warehouse } from '@/lib/mock-db';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await productsApi.get(productId);
        setProduct(productRes);
        if (productRes.colors.length > 0) {
          setSelectedColor(productRes.colors[0]);
        }

        // Fetch related data in parallel
        const [reviewsRes, warehouseRes, relatedRes] = await Promise.all([
          reviewsApi.list({ product_id: productId }),
          warehousesApi.get(productRes.warehouse_id).catch(() => null),
          productsApi.list({ category: productRes.category_id, status: 'published', limit: 5 }),
        ]);

        const reviewsData = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes as { data?: Review[] }).data || [];
        const relatedData = Array.isArray(relatedRes) ? relatedRes : (relatedRes as { data?: Product[] }).data || [];
        setReviews(reviewsData);
        setWarehouse(warehouseRes);
        setRelatedProducts(relatedData.filter(p => p.id !== productId).slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
          <Link href="/products" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const tabs = ['description', 'specifications', 'reviews', 'shipping'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products" className="hover:text-blue-600">Products</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/categories/${product.category_id}`} className="hover:text-blue-600">{product.category_name}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Product Main */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-3">
                    {product.images.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === i ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StarRating rating={product.rating} showValue count={product.review_count} size="md" />
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-500">{product.sold_count} sold</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{product.final_price.toLocaleString()} Br</span>
                  {product.discount_percent > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{product.original_price.toLocaleString()} Br</span>
                      <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-full">
                        {product.discount_percent}% OFF
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{product.short_description}</p>

                {/* Colors */}
                {product.colors.length > 0 && (
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
                    onClick={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); }}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      addedToCart ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <button className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                    Buy Now
                  </button>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Trust */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: <Truck className="w-4 h-4 text-blue-600" />, text: 'Free Shipping', sub: 'On orders over $50' },
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
                {warehouse && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Sold by</p>
                      <p className="text-sm font-semibold text-gray-900">{warehouse.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600">{warehouse.rating} ({warehouse.total_orders} orders)</span>
                      </div>
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
                    {[<Facebook key="fb" className="w-4 h-4" />, <Twitter key="tw" className="w-4 h-4" />, <Send key="tg" className="w-4 h-4" />].map((icon, i) => (
                      <button key={i} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                        {icon}
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
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} {tab === 'reviews' && `(${reviews.length})`}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  {product.tags.length > 0 && (
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
                      <p className="text-4xl font-bold text-gray-900">{product.rating.toFixed(1)}</p>
                      <StarRating rating={product.rating} size="md" className="justify-center my-1" />
                      <p className="text-sm text-gray-500">{product.review_count} reviews</p>
                    </div>
                  </div>
                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.id} className="py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                            {review.customer_name[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{review.customer_name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" className="mb-1.5" />
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-2 gap-3">
                  {product.brand && <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Brand</span>
                    <span className="text-sm text-gray-900">{product.brand}</span>
                  </div>}
                  {product.sku && <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">SKU</span>
                    <span className="text-sm text-gray-900">{product.sku}</span>
                  </div>}
                  {product.weight && <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Weight</span>
                    <span className="text-sm text-gray-900">{product.weight}</span>
                  </div>}
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <span className="text-sm text-gray-900">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-500">Sold</span>
                    <span className="text-sm text-gray-900">{product.sold_count} units</span>
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

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
