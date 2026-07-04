'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Eye, ExternalLink, Image, BarChart2, Download } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { Promotion, BannerStatus } from '@/lib/types';

const statusBadge: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  paused:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  inactive:  'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
  scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

const activeBanners = [
  { name: 'Summer Sale', bg: 'from-orange-400 to-red-500', label: 'SUMMER SALE 40% OFF', sub: 'Shop Now' },
  { name: 'New Arrivals', bg: 'from-blue-500 to-blue-700', label: 'NEW ARRIVALS', sub: 'Check Out' },
  { name: 'Electronics Big Deals', bg: 'from-gray-700 to-gray-900', label: 'ELECTRONICS BIG DEALS', sub: 'Shop Now' },
  { name: 'Free Shipping', bg: 'from-emerald-500 to-teal-600', label: 'FREE SHIPPING', sub: 'Over $50' },
];

const bannerRows = [
  { name: 'Summer Sale', placement: 'Homepage - Top', link: '#summer-sale', status: 'active', schedule: 'May 1 - May 31, 2024' },
  { name: 'New Arrivals', placement: 'Homepage - Middle', link: '#new-arrivals', status: 'active', schedule: 'May 5 - June 5, 2024' },
  { name: 'Electronics Deals', placement: 'Category Page', link: '#electronics', status: 'active', schedule: 'May 3 - May 24, 2024' },
  { name: 'Free Shipping', placement: 'Homepage - Bottom', link: '#shipping-info', status: 'active', schedule: 'Apr 25 - Jun 25, 2024' },
];

const promoRows = [
  { name: 'Summer Special', type: 'Percentage', discount: '20% OFF', usage: 1149, status: 'active', endDate: 'May 31, 2024' },
  { name: 'Weekend Deal', type: 'Flat Amount', discount: '$15 OFF', usage: 982, status: 'active', endDate: 'May 19, 2024' },
  { name: 'First Order', type: 'Percentage', discount: '10% OFF', usage: 892, status: 'active', endDate: 'Jun 30, 2024' },
  { name: 'Mega Sale', type: 'Percentage', discount: '30% OFF', usage: 3156, status: 'scheduled', endDate: 'Jun 1, 2024' },
];

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'banners' | 'promotions' | 'flash' | 'coupons'>('banners');

  useEffect(() => {
    adminApi.promotions.list()
      .then(res => setPromotions(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (promoId: string) => {
    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;
    const newStatus = promo.status === 'active' ? 'paused' : 'active';
    try {
      await adminApi.promotions.update(promoId, { status: newStatus });
      setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, status: newStatus as BannerStatus } : p));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Banner & Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage banners and promotional campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <Eye style={{ width: 14, height: 14 }} /> Preview Store
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
            <Plus style={{ width: 14, height: 14 }} /> Add Banner
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-1 px-5 py-3 border-b border-gray-100">
          {(['banners', 'promotions', 'flash', 'coupons'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab === 'flash' ? 'Flash Deals' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'banners' && (
          <div className="p-5 space-y-5">
            {/* Active Banners Preview */}
            <div>
              <h2 className="text-[13px] font-bold text-gray-900 mb-3">Active Banners</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {activeBanners.map((b, i) => (
                  <div key={i} className={`bg-gradient-to-br ${b.bg} rounded-xl p-4 text-white relative overflow-hidden h-24 flex flex-col justify-end`}>
                    <div className="absolute inset-0 opacity-20 bg-white/10" />
                    <p className="text-[11px] font-bold leading-tight relative z-10">{b.label}</p>
                    <p className="text-[10px] opacity-80 relative z-10">{b.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Banners Table */}
            <div>
              <h2 className="text-[13px] font-bold text-gray-900 mb-3">Banners</h2>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/40 border-b border-gray-50">
                      {['Banner', 'Placement', 'Link', 'Status', 'Schedule', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bannerRows.map((b, i) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{b.name}</td>
                        <td className="px-4 py-3 text-[13px] text-gray-600">{b.placement}</td>
                        <td className="px-4 py-3 text-[13px] text-blue-600">{b.link}</td>
                        <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[b.status]}`}>{b.status}</span></td>
                        <td className="px-4 py-3 text-[12px] text-gray-500">{b.schedule}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Eye style={{ width: 13, height: 13 }} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit style={{ width: 13, height: 13 }} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 style={{ width: 13, height: 13 }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active Promotions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[13px] font-bold text-gray-900">Active Promotions</h2>
                <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium">View All Promotions</button>
              </div>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/40 border-b border-gray-50">
                      {['Promotion', 'Type', 'Discount', 'Usage', 'Status', 'End Date', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(promotions.length > 0
                      ? promotions.slice(0, 4).map(p => ({ name: p.title, type: p.type, discount: '—', usage: p.impressions || 0, status: p.status, endDate: new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }))
                      : promoRows
                    ).map((p: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-[13px] text-gray-600">{p.type}</td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-blue-600">{p.discount}</td>
                        <td className="px-4 py-3 text-[13px] text-gray-600">{(p.usage || 0).toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[p.status] || statusBadge.inactive}`}>{p.status}</span></td>
                        <td className="px-4 py-3 text-[12px] text-gray-500">{p.endDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit style={{ width: 13, height: 13 }} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 style={{ width: 13, height: 13 }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="p-5">
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/40 border-b border-gray-50">
                    {['Promotion', 'Type', 'Discount', 'Usage', 'Status', 'End Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {promotions.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{p.title}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{p.type}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-blue-600">—</td>
                      <td className="px-4 py-3 text-[13px] text-gray-600">{(p.impressions || 0).toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge[p.status] || statusBadge.inactive}`}>{p.status}</span></td>
                      <td className="px-4 py-3 text-[12px] text-gray-500">{new Date(p.end_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleStatus(p.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                            {p.status === 'active' ? <Pause style={{ width: 13, height: 13 }} /> : <Play style={{ width: 13, height: 13 }} />}
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit style={{ width: 13, height: 13 }} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 style={{ width: 13, height: 13 }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {promotions.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No promotions found</div>}
            </div>
          </div>
        )}

        {(activeTab === 'flash' || activeTab === 'coupons') && (
          <div className="p-12 text-center text-gray-400">
            <BarChart2 className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-[13px]">No {activeTab === 'flash' ? 'flash deals' : 'coupons'} configured yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
