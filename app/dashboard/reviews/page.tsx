'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Edit2, Loader2 } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import StarRating from '@/components/ui/star-rating';
import type { Review } from '@/lib/mock-db';

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Using customer_id 'usr-001' as the current customer
        const res = await reviewsApi.list({ customer_id: 'usr-001' });
        const reviewList = Array.isArray(res) ? res : (res as { data?: Review[] }).data || [];
        setReviews(reviewList);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Review History</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Review History</h1>
        <p className="text-sm text-gray-500">Reviews you have submitted for products.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-sm text-gray-500 mb-4">Start writing reviews for products you've purchased.</p>
          <Link href="/dashboard/orders">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              View Your Orders
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</div>
            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Review</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</div>
          </div>

          <div className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <div key={review.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors items-start">
                {/* Product */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={review.product_image || '/placeholder.jpg'} alt={review.product_name || 'Product'} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/products/${review.product_id}`}>
                      <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">{review.product_name || 'Product'}</p>
                    </Link>
                  </div>
                </div>

                {/* Review */}
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{review.comment?.split('\n')[0] || 'Review'}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{review.comment?.split('\n').slice(1).join(' ').trim() || ''}</p>
                </div>

                {/* Rating */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{review.rating}.0</p>
                </div>

                {/* Date */}
                <div className="col-span-1">
                  <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>

                {/* Action */}
                <div className="col-span-1">
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing 1 to {reviews.length} of {reviews.length} reviews</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-50">‹</button>
              {[1].map((p) => (
                <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium bg-blue-600 text-white`}>{p}</button>
              ))}
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-50">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
