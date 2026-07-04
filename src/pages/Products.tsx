import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/mock';
import { card, statusStyle, PageHeader, Button } from '../components/ui';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
    (category === 'All' || p.category === category) &&
    (statusFilter === 'All' || p.status === statusFilter)
  );

  return (
    <div className="fade-in">
      <PageHeader
        title="Products Management"
        subtitle="Manage your product catalog and inventory"
        action={<Link to="/products/new"><Button variant="primary" size="md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </Button></Link>}
      />

      {/* Filters */}
      <div style={{ ...card, padding: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb3c5' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products by name or SKU..."
            style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#f8f9fc', fontSize: 13.5, color: '#1f2333', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#818cf8')} onBlur={e => (e.target.style.borderColor = '#e8eaf0')} />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#fff', fontSize: 13.5, color: '#1f2333', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: 32 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#fff', fontSize: 13.5, color: '#1f2333', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: 32 }}>
          {['All', 'Active', 'Low Stock', 'Running Low', 'Out of Stock'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafc', borderBottom: '1px solid #eef0f5' }}>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f4f5f8', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbfd')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#8b91a3' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: '#5b6172', fontFamily: 'monospace' }}>{p.sku}</td>
                  <td style={{ ...tdStyle, fontSize: 13, color: '#5b6172' }}>{p.category}</td>
                  <td style={{ ...tdStyle, fontSize: 13, fontWeight: 600, color: '#1f2333' }}>${p.price.toFixed(2)}</td>
                  <td style={{ ...tdStyle, fontSize: 13, color: '#1f2333', fontWeight: 500 }}>{p.stock} units</td>
                  <td style={tdStyle}><span style={statusStyle(p.status)}>{p.status}</span></td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <Link to={`/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#8b91a3' }}>No products found.</div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 13, color: '#8b91a3' }}>
        <span>Showing {filtered.length} of {products.length} products</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="secondary" size="sm">2</Button>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#8b91a3', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' };
