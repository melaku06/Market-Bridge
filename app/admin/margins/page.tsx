'use client';

import { useEffect, useState } from 'react';
import { Save, Edit, Percent, Plus, TrendingUp, Filter, Search, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/stores/admin/admin-store';
import type { MarginRule } from '@/lib/types';

const statusBadge: Record<string, string> = {
  active:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  inactive: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
};

const fallback = [
  { id: '1', category_name: 'Electronics', sub_categories: 12, warehouse_margin: 15, platform_margin: 7, min_margin: 10, max_margin: 25, status: 'active' },
  { id: '2', category_name: 'Fashion', sub_categories: 8, warehouse_margin: 20, platform_margin: 10, min_margin: 15, max_margin: 30, status: 'active' },
  { id: '3', category_name: 'Home & Kitchen', sub_categories: 10, warehouse_margin: 18, platform_margin: 8, min_margin: 10, max_margin: 25, status: 'active' },
  { id: '4', category_name: 'Beauty & Personal Care', sub_categories: 6, warehouse_margin: 22, platform_margin: 9, min_margin: 15, max_margin: 25, status: 'active' },
  { id: '5', category_name: 'Sports & Outdoors', sub_categories: 7, warehouse_margin: 16, platform_margin: 8, min_margin: 10, max_margin: 25, status: 'inactive' },
  { id: '6', category_name: 'Books & Media', sub_categories: 5, warehouse_margin: 12, platform_margin: 7, min_margin: 5, max_margin: 20, status: 'active' },
];

export default function AdminMargins() {
  const { marginRules, isLoading, fetchMarginRules, updateMarginRule } = useAdminStore();
  const [localRules, setLocalRules] = useState<MarginRule[]>([]);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'category' | 'product'>('category');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMarginRules();
  }, [fetchMarginRules]);

  useEffect(() => {
    setLocalRules(marginRules);
  }, [marginRules]);

  const handleSave = async (ruleId: string) => {
    const rule = localRules.find(r => r.id === ruleId);
    if (rule) {
      try {
        await updateMarginRule(ruleId, { warehouse_margin: rule.warehouse_margin, platform_margin: rule.platform_margin });
      } catch (e) { console.error(e); }
    }
    setEditingRule(null);
  };

  const updateRule = (ruleId: string, field: 'warehouse_margin' | 'platform_margin', value: number) => {
    setLocalRules(prev => prev.map(r => r.id === ruleId ? { ...r, [field]: value } : r));
  };

  const display = (localRules.length > 0 ? localRules : fallback as any[]).filter((r: any) =>
    !search || r.category_name.toLowerCase().includes(search.toLowerCase())
  );

  const avgMargin = localRules.length > 0
    ? (localRules.reduce((s, r) => s + r.warehouse_margin + r.platform_margin, 0) / localRules.length).toFixed(2)
    : '22.45';

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Margin Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Set and manage platform margins for categories and products.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
          <Plus style={{ width: 14, height: 14 }} /> Add Margin Rule
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Average Margin', value: `${avgMargin}%`, sub: 'Active margin rules', icon: Percent, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Total Categories', value: localRules.length || 56, sub: 'Across all categories', icon: TrendingUp, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Products Affected', value: '12,458', sub: 'Active margin rules', icon: TrendingUp, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
          { label: 'Revenue Impact', value: '+24,580 Br', sub: 'Est. this month', icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        ].map((s, i) => { const Icon = s.icon; return (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-2`}>
              <Icon className={s.iconColor} style={{ width: 15, height: 15 }} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-gray-400">{s.sub}</p>
          </div>
        );})}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex gap-1">
            {(['category', 'product'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tab === 'category' ? 'Category Margin' : 'Product Margin'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search category..." className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none w-40 bg-gray-50" />
            </div>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Categories</option></select>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Status</option></select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50">
              <Filter style={{ width: 13, height: 13 }} /> Filters
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Category', 'Sub Categories', 'Margin Type', 'Margin Value', 'Min Margin', 'Max Margin', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {display.map((rule: any) => {
                const isEditing = editingRule === rule.id;
                return (
                  <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Percent className="text-blue-600" style={{ width: 13, height: 13 }} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-900">{rule.category_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{rule.sub_categories ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">Percentage</td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <input type="number" step="0.1" value={rule.warehouse_margin} onChange={e => updateRule(rule.id, 'warehouse_margin', parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-[13px] text-center focus:outline-none" />
                      ) : (
                        <span className="text-[13px] font-semibold text-gray-900">{rule.warehouse_margin}%</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{rule.min_margin || 10}%</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{rule.max_margin || 25}%</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[rule.status] || statusBadge.inactive}`}>{rule.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <button onClick={() => handleSave(rule.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[12px] font-semibold">
                            <Save style={{ width: 12, height: 12 }} /> Save
                          </button>
                        ) : (
                          <>
                            <button onClick={() => setEditingRule(rule.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit style={{ width: 13, height: 13 }} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 style={{ width: 13, height: 13 }} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[12px] text-gray-500">Showing 1 to 6 of {localRules.length || 56} categories</p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">10</button>
          </div>
        </div>
      </div>
    </div>
  );
}
