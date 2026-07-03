'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Image, Eye } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Promotion, BannerStatus } from '@/lib/types';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await adminApi.promotions.list();
        setPromotions(res);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleStatus = async (promoId: string) => {
    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;

    const newStatus = promo.status === 'active' ? 'paused' : 'active';
    try {
      await adminApi.promotions.update(promoId, { status: newStatus });
      setPromotions(prev =>
        prev.map(p => p.id === promoId ? { ...p, status: newStatus as BannerStatus } : p)
      );
    } catch (error) {
      console.error('Failed to toggle promotion status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status: BannerStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>;
      case 'paused':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Paused</span>;
      case 'inactive':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>;
      default:
        return null;
    }
  };

  const selectedPromotionData = promotions.find(p => p.id === selectedPromotion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotion Management</h1>
          <p className="text-gray-500">Manage banners and promotional content</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Promotion
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video">
              {promo.image ? (
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Image className="w-12 h-12 text-white/50" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {getStatusBadge(promo.status)}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{promo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{promo.location}</span>
                <span>
                  {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Impressions</p>
                  <p className="font-medium text-gray-900">{promo.impressions.toLocaleString()}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Clicks</p>
                  <p className="font-medium text-gray-900">{promo.clicks.toLocaleString()}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="font-medium text-gray-900">
                    {promo.impressions > 0 ? ((promo.clicks / promo.impressions) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPromotion(promo.id)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => toggleStatus(promo.id)}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    promo.status === 'active'
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {promo.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="py-2 px-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="py-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promotions Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Active</p>
          <p className="text-2xl font-bold text-green-600">{promotions.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Impressions</p>
          <p className="text-2xl font-bold text-gray-900">{promotions.reduce((sum, p) => sum + p.impressions, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Clicks</p>
          <p className="text-2xl font-bold text-blue-600">{promotions.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPromotionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPromotion(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video">
              {selectedPromotionData.image ? (
                <img src={selectedPromotionData.image} alt={selectedPromotionData.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">{selectedPromotionData.title}</h2>
                  <p className="text-sm text-gray-500">{selectedPromotionData.type}</p>
                </div>
                {getStatusBadge(selectedPromotionData.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Target URL</p>
                  <p className="font-medium text-gray-900">{selectedPromotionData.target_url || 'None'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{selectedPromotionData.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Target Audience</p>
                  <p className="font-medium text-gray-900">{selectedPromotionData.target_audience}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedPromotionData.start_date).toLocaleDateString()} - {new Date(selectedPromotionData.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
