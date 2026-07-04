'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Star, Edit2, Loader2, MessageSquare, ArrowRight, Filter, Search } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import StarRating from '@/components/ui/star-rating';
import type { Review } from '@/lib/types';

export default function ReviewHistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchReviews() {
      try {
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

  const filtered = reviews.filter((r) =>
    !search || (r.product_name || '').toLowerCase().includes(search.toLowerCase()) || (r.comment || '').toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Review History</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review History</h1>
            <p className="text-sm text-gray-500 mt-1">Reviews you have submitted for products.</p>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-56 bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Reviews', value: reviews.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Average Rating', value: `${avgRating} ★`, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Products Reviewed', value: new Set(reviews.map(r => r.product_id)).size, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Star className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-sm text-gray-500 mb-6">Start writing reviews for products you've purchased.</p>
          <Link href="/dashboard/orders">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
              View Your Orders <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</div>
            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Review</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((review) => (
              <div key={review.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors items-start">
                {/* Product */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
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
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">Showing 1 to {filtered.length} of {reviews.length} reviews</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">‹</button>
              {[1].map((p) => (
                <button key={p} className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">{p}</button>
              ))}
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
