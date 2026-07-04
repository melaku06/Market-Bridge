import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../data/mock';
import { card, statusStyle, PageHeader, Button } from '../components/ui';

export default function Orders() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = orders.filter(o =>
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'All' || o.status === filter)
  );

  const tabs = ['All', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="fade-in">
      <PageHeader
        title="Orders"
        subtitle="Manage and track all customer orders"
        action={<Button variant="primary" size="md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Order
        </Button>}
      />

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const count = t === 'All' ? orders.length : orders.filter(o => o.status === t).length;
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: filter === t ? '#4f46e5' : '#fff', color: filter === t ? '#fff' : '#5b6172',
              border: `1px solid ${filter === t ? '#4f46e5' : '#e8eaf0'}`, transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t}
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 8,
                background: filter === t ? 'rgba(255,255,255,0.2)' : '#f4f5f8', color: filter === t ? '#fff' : '#8b91a3',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ ...card, padding: 16, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb3c5' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer name..."
            style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #e8eaf0', borderRadius: 10, background: '#f8f9fc', fontSize: 13.5, color: '#1f2333', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#818cf8')} onBlur={e => (e.target.style.borderColor = '#e8eaf0')} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafc', borderBottom: '1px solid #eef0f5' }}>
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 7 ? 'right' : 'left', padding: '12px 16px', fontSize: 11.5, fontWeight: 600, color: '#8b91a3', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f4f5f8', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafbfd')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>{o.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{o.customer[0]}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1f2333' }}>{o.customer}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#5b6172' }}>{o.items}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1f2333' }}>${o.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}><span style={statusStyle(o.payment === 'Paid' ? 'Delivered' : 'Processing')}>{o.payment}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={statusStyle(o.status)}>{o.status}</span></td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b91a3' }}>{o.date}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link to={`/orders/${o.id.replace('#', '')}`}>
                      <Button variant="ghost" size="sm">View →</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#8b91a3' }}>No orders found.</div>}
      </div>
    </div>
  );
}
