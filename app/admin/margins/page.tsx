'use client';

import { useEffect, useState } from 'react';
import { Save, Edit, Percent } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { MarginRule } from '@/lib/types';

export default function AdminMargins() {
  const [rules, setRules] = useState<MarginRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await adminApi.margins.list();
        setRules(res);
      } catch (error) {
        console.error('Failed to fetch margins:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      try {
        await adminApi.margins.update(ruleId, {
          warehouse_margin: rule.warehouse_margin,
          platform_margin: rule.platform_margin,
        });
        setRules(prev =>
          prev.map(r => r.id === ruleId ? {
            ...r,
            total_margin: rule.warehouse_margin + rule.platform_margin,
          } : r)
        );
      } catch (error) {
        console.error('Failed to save margin:', error);
      }
    }
    setEditingRule(null);
  };

  const updateRule = (ruleId: string, field: 'warehouse_margin' | 'platform_margin', value: number) => {
    setRules(prev =>
      prev.map(r => r.id === ruleId ? { ...r, [field]: value } : r)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Margin Management</h1>
        <p className="text-gray-500">Configure platform and warehouse margins for each category</p>
      </div>

      {/* Margin Rules Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Warehouse Margin</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Platform Margin</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Margin</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.map((rule) => {
              const isEditing = editingRule === rule.id;
              const total = rule.warehouse_margin + rule.platform_margin;
              return (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Percent className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{rule.category_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={rule.warehouse_margin}
                        onChange={(e) => updateRule(rule.id, 'warehouse_margin', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{rule.warehouse_margin}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={rule.platform_margin}
                        onChange={(e) => updateRule(rule.id, 'platform_margin', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{rule.platform_margin}%</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-blue-600">{total.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(rule.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingRule(rule.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How Margins Work</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Warehouse Margin: The profit margin the warehouse earns on each sale.</li>
          <li>Platform Margin: The commission MarketBridge earns on each sale.</li>
          <li>Total Margin: Combined margin applied to the base price.</li>
        </ul>
      </div>
    </div>
  );
}
