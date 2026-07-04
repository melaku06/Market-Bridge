import { Link } from 'react-router-dom';
import { orders, products } from '../data/mock';
import { card, statusStyle, Button } from '../components/ui';

const stats = [
  { label: 'Total Products', value: '4,523', change: '+12.5%', up: true, icon: BoxIcon, color: '#4f46e5', bg: '#eef0fc' },
  { label: 'Active Orders', value: '1,256', change: '+8.2%', up: true, icon: CartIcon, color: '#0ea5e9', bg: '#e0f2fe' },
  { label: 'Low Stock Items', value: '89', change: '+3.1%', up: false, icon: AlertIcon, color: '#f59e0b', bg: '#fef3e2' },
  { label: 'Revenue (Month)', value: '$48,392', change: '+15.3%', up: true, icon: DollarIcon, color: '#16a34a', bg: '#e7f6ec' },
];

export default function Dashboard() {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2333', letterSpacing: '-0.3px' }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#8b91a3', marginTop: 4 }}>Welcome back! Here's what's happening in your warehouse today.</p>
        </div>
        <Button variant="secondary" size="md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <s.icon />
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                background: s.up ? '#e7f6ec' : '#fdeaea', color: s.up ? '#16a34a' : '#dc2626'
              }}>{s.change}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1f2333', marginTop: 14, letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#8b91a3', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Sales Chart */}
        <div style={{ ...card, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333' }}>Sales Overview</h3>
              <p style={{ fontSize: 13, color: '#8b91a3', marginTop: 2 }}>Monthly sales performance</p>
            </div>
            <select style={{ padding: '6px 12px', border: '1px solid #e8eaf0', borderRadius: 8, fontSize: 12.5, color: '#5b6172', background: '#fff', cursor: 'pointer', outline: 'none' }}>
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <SalesChart />
        </div>

        {/* Top Products */}
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Top Products</h3>
          <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 16 }}>Best sellers this month</p>
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f4f5f8' : 'none' }}>
              <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: '#8b91a3' }}>{p.category}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2333' }}>${p.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ ...card, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333' }}>Recent Orders</h3>
            <p style={{ fontSize: 13, color: '#8b91a3', marginTop: 2 }}>Latest orders from your store</p>
          </div>
          <Link to="/orders" style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eef0f5' }}>
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11.5, fontWeight: 600, color: '#8b91a3', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f4f5f8' }}>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>{o.id}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#1f2333', fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#5b6172' }}>{o.items}</td>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#1f2333' }}>${o.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}><span style={statusStyle(o.payment === 'Paid' ? 'Delivered' : 'Processing')}>{o.payment}</span></td>
                  <td style={{ padding: '12px' }}><span style={statusStyle(o.status)}>{o.status}</span></td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#8b91a3' }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SalesChart() {
  const data = [
    { m: 'Jan', v: 65 }, { m: 'Feb', v: 78 }, { m: 'Mar', v: 52 }, { m: 'Apr', v: 85 }, { m: 'May', v: 70 }, { m: 'Jun', v: 95 },
  ];
  const max = 100;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 220, paddingTop: 10 }}>
      {data.map((d, i) => (
        <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#5b6172' }}>${d.v}k</div>
          <div style={{
            width: '100%', maxWidth: 44, height: `${(d.v / max) * 160}px`, borderRadius: '8px 8px 4px 4px',
            background: i === data.length - 1 ? 'linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)' : '#eef0fc',
            transition: 'all 0.3s ease', cursor: 'pointer',
          }} />
          <div style={{ fontSize: 12, color: '#8b91a3' }}>{d.m}</div>
        </div>
      ))}
    </div>
  );
}

function BoxIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>; }
function CartIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>; }
function AlertIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function DollarIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>; }
