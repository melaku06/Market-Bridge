import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mock';
import { card, statusStyle, PageHeader, Button } from '../components/ui';

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const enriched = products.map(p => ({
    ...p,
    available: (p.available ?? Math.max(0, p.stock - (p.reserved || 0))),
    reserved: p.reserved || 0,
  }));

  const filtered = enriched.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || p.status === filter)
  );

  const totalUnits = enriched.reduce((a, p) => a + p.stock, 0);
  const totalAvailable = enriched.reduce((a, p) => a + p.available, 0);
  const lowStock = enriched.filter(p => p.status === 'Low Stock' || p.status === 'Running Low').length;
  const outStock = enriched.filter(p => p.status === 'Out of Stock').length;

  return (
    <div className="fade-in">
      <PageHeader
        title="Inventory Management"
        subtitle="Track and manage your stock levels in real-time"
        action={<Button variant="primary" size="md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export Inventory
        </Button>}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Units', value: totalUnits, color: '#4f46e5', bg: '#eef0fc' },
          { label: 'Available', value: totalAvailable, color: '#16a34a', bg: '#e7f6ec' },
          { label: 'Low Stock', value: lowStock, color: '#f59e0b', bg: '#fef3e2' },
          { label: 'Out of Stock', value: outStock, color: '#dc2626', bg: '#fdeaea' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: 18 }}>
            <div style={{ fontSize: 13, color: '#8b91a3' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 12, color: '#8b91a3' }}>units</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb3c5' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..."
            style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#f8f9fc', fontSize: 13.5, color: '#1f2333', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#818cf8')} onBlur={e => (e.target.style.borderColor = '#e8eaf0')} />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#fff', fontSize: 13.5, color: '#1f2333', cursor: 'pointer', outline: 'none' }}>
          {['All', 'Active', 'Low Stock', 'Running Low', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafc', borderBottom: '1px solid #eef0f5' }}>
                <th style={th}>Product</th>
                <th style={th}>SKU</th>
                <th style={th}>In Stock</th>
                <th style={th}>Reserved</th>
                <th style={th}>Available</th>
                <th style={th}>Stock Level</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pct = Math.min(100, (p.stock / 40) * 100);
                const barColor = pct > 60 ? '#16a34a' : pct > 25 ? '#f59e0b' : '#dc2626';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f4f5f8' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafbfd')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ ...td, fontFamily: 'monospace', fontSize: 12.5, color: '#5b6172' }}>{p.sku}</td>
                    <td style={{ ...td, fontWeight: 600, color: '#1f2333' }}>{p.stock}</td>
                    <td style={{ ...td, color: '#5b6172' }}>{p.reserved}</td>
                    <td style={{ ...td, color: '#16a34a', fontWeight: 600 }}>{p.available}</td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                        <div style={{ flex: 1, height: 6, background: '#f4f5f8', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#8b91a3', minWidth: 30 }}>{Math.round(pct)}%</span>
                      </div>
                    </td>
                    <td style={td}><span style={statusStyle(p.status)}>{p.status}</span></td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <Link to={`/products/${p.id}/edit`}><Button variant="ghost" size="sm">Adjust</Button></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#8b91a3', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' };
