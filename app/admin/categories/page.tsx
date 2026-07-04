'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Search, Filter, FolderTree, LayoutGrid, Tag, AlertCircle } from 'lucide-react';
import { useCategoriesStore } from '@/stores/categories/categories-store';
import type { Category } from '@/lib/types';

const statusBadge: Record<string, string> = {
  active:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  inactive: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
};

const fallback = [
  { id: '1', name: 'Electronics', icon: '💻', slug: 'electronics', product_count: 2845, sub_count: 12, status: 'active', sort_order: 1 },
  { id: '2', name: 'Fashion', icon: '👗', slug: 'fashion', product_count: 3421, sub_count: 8, status: 'active', sort_order: 2 },
  { id: '3', name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen', product_count: 1982, sub_count: 10, status: 'active', sort_order: 3 },
  { id: '4', name: 'Beauty & Personal Care', icon: '💄', slug: 'beauty', product_count: 1458, sub_count: 6, status: 'active', sort_order: 4 },
  { id: '5', name: 'Sports & Outdoors', icon: '⚽', slug: 'sports', product_count: 1128, sub_count: 7, status: 'active', sort_order: 5 },
  { id: '6', name: 'Books & Media', icon: '📚', slug: 'books', product_count: 823, sub_count: 5, status: 'active', sort_order: 6 },
  { id: '7', name: 'Automotive', icon: '🚗', slug: 'automotive', product_count: 642, sub_count: 6, status: 'inactive', sort_order: 7 },
  { id: '8', name: 'Toys & Games', icon: '🎮', slug: 'toys', product_count: 431, sub_count: 4, status: 'active', sort_order: 8 },
];

export default function AdminCategories() {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory: storeUpdateCategory } = useCategoriesStore();
  const [localCats, setLocalCats] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', icon: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setLocalCats(categories);
  }, [categories]);

  const handleSave = async (id: string) => {
    const cat = localCats.find(c => c.id === id);
    if (cat) { try { await storeUpdateCategory(id, cat); } catch (e) { console.error(e); } }
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!newCategory.name) return;
    try {
      await createCategory({ name: newCategory.name, slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'), description: newCategory.description, icon: newCategory.icon || '', status: 'active' });
      setNewCategory({ name: '', icon: '', description: '' });
      setShowAddForm(false);
    } catch (e) { console.error(e); }
  };

  const updateCategory = (id: string, field: string, value: string) => {
    setLocalCats(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const display = (localCats.length > 0 ? localCats : fallback as any[]).filter((c: any) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = (localCats.length > 0 ? localCats : fallback as any[]).filter((c: any) => c.status === 'active').length;

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Organize and manage all product categories.</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
          <Plus style={{ width: 14, height: 14 }} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: localCats.length || 56, sub: '4 this month', icon: FolderTree, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Active Categories', value: activeCount || 48, sub: '85.7% of total', icon: LayoutGrid, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Sub Categories', value: 189, sub: 'Across all categories', icon: Tag, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
          { label: 'Unassigned Products', value: 23, sub: 'Need category', icon: AlertCircle, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
        ].map((s, i) => { const Icon = s.icon; return (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-2`}><Icon className={s.iconColor} style={{ width: 15, height: 15 }} /></div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-gray-400">{s.sub}</p>
          </div>
        );})}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Add New Category</h2>
            <button onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X style={{ width: 15, height: 15 }} /></button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Name', key: 'name', placeholder: 'Category name' },
              { label: 'Icon (emoji)', key: 'icon', placeholder: '' },
              { label: 'Description', key: 'description', placeholder: 'Brief description' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">{f.label}</label>
                <input type="text" value={(newCategory as any)[f.key]} onChange={e => setNewCategory({ ...newCategory, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowAddForm(false)} className="px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700">
              <Save style={{ width: 13, height: 13 }} /> Save Category
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none w-52 bg-gray-50" />
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Status</option><option>Active</option><option>Inactive</option></select>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50"><Filter style={{ width: 13, height: 13 }} /> Filters</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Category', 'Sub Categories', 'Products', 'Status', 'Sort Order', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {display.map((cat: any) => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-base border border-gray-100">{cat.icon || '📦'}</div>
                        {isEditing ? (
                          <input type="text" value={cat.name} onChange={e => updateCategory(cat.id, 'name', e.target.value)} className="px-2 py-1 border border-gray-200 rounded-lg text-[13px] focus:outline-none" />
                        ) : (
                          <span className="text-[13px] font-semibold text-gray-900">{cat.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{cat.sub_count ?? cat.sub_categories ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">{(cat.product_count || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[cat.status] || statusBadge.inactive}`}>{cat.status}</span></td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{cat.sort_order || '—'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSave(cat.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Save style={{ width: 13, height: 13 }} /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X style={{ width: 13, height: 13 }} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingId(cat.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit style={{ width: 13, height: 13 }} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 style={{ width: 13, height: 13 }} /></button>
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
          <p className="text-[12px] text-gray-500">Showing 1 to 8 of {localCats.length || 56} categories</p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">7</button>
          </div>
        </div>
      </div>
    </div>
  );
}
