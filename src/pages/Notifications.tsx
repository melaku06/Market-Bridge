import { useState } from 'react';
import { notifications as initial } from '../data/mock';
import { card, PageHeader, Button } from '../components/ui';

const typeColors: Record<string, { bg: string; color: string }> = {
  Orders: { bg: '#eef0fc', color: '#4f46e5' },
  Inventory: { bg: '#fef3e2', color: '#d97706' },
  System: { bg: '#e0f2fe', color: '#0284c7' },
  Promotions: { bg: '#e7f6ec', color: '#16a34a' },
};

const typeIcons: Record<string, React.ReactNode> = {
  Orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  Inventory: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>,
  System: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>,
  Promotions: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
};

export default function Notifications() {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState('All');

  const filtered = items.filter(n => filter === 'All' || n.type === filter);
  const unread = items.filter(n => !n.read).length;

  const markAll = () => setItems(items.map(n => ({ ...n, read: true })));
  const markOne = (id: string) => setItems(items.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="fade-in">
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notifications`}
        action={<Button variant="secondary" size="md" onClick={markAll}>Mark all as read</Button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', 'Orders', 'Inventory', 'System', 'Promotions'].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: filter === t ? '#4f46e5' : '#fff', color: filter === t ? '#fff' : '#5b6172',
            border: `1px solid ${filter === t ? '#4f46e5' : '#e8eaf0'}`, transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(n => {
          const c = typeColors[n.type];
          return (
            <div key={n.id} onClick={() => markOne(n.id)} style={{
              ...card, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer',
              borderLeft: n.read ? '3px solid transparent' : `3px solid ${c.color}`,
              transition: 'all 0.15s', opacity: n.read ? 0.65 : 1,
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,23,40,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,23,40,0.04)')}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {typeIcons[n.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2333' }}>{n.title}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 8, background: c.bg, color: c.color }}>{n.type}</span>
                </div>
                <p style={{ fontSize: 13, color: '#5b6172', marginTop: 4, lineHeight: 1.5 }}>{n.message}</p>
                <span style={{ fontSize: 12, color: '#8b91a3', marginTop: 6, display: 'block' }}>{n.time}</span>
              </div>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', marginTop: 6, flexShrink: 0 }} />}
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ ...card, padding: 40, textAlign: 'center', color: '#8b91a3' }}>No notifications.</div>}
      </div>
    </div>
  );
}
