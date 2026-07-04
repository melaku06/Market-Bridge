import { card, PageHeader, Button } from '../components/ui';

export default function Analytics() {
  const kpis = [
    { label: 'Revenue', value: '$48,392', change: '+15.3%', up: true },
    { label: 'Orders', value: '1,256', change: '+8.2%', up: true },
    { label: 'Avg Order Value', value: '$38.50', change: '+2.1%', up: true },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.4%', up: false },
  ];

  const revenueData = [
    { m: 'Jan', v: 32 }, { m: 'Feb', v: 45 }, { m: 'Mar', v: 38 }, { m: 'Apr', v: 52 },
    { m: 'May', v: 48 }, { m: 'Jun', v: 62 }, { m: 'Jul', v: 55 }, { m: 'Aug', v: 68 },
  ];

  const categories = [
    { name: 'Electronics', value: 45, color: '#4f46e5' },
    { name: 'Bags', value: 22, color: '#0ea5e9' },
    { name: 'Footwear', value: 18, color: '#16a34a' },
    { name: 'Clothing', value: 10, color: '#f59e0b' },
    { name: 'Home', value: 5, color: '#dc2626' },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Analytics"
        subtitle="Insights and performance metrics for your warehouse"
        action={<Button variant="secondary" size="md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Last 8 Months
        </Button>}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 13, color: '#8b91a3' }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1f2333', marginTop: 6, letterSpacing: '-0.5px' }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: k.up ? '#16a34a' : '#dc2626' }}>{k.change}</span>
              <span style={{ fontSize: 11, color: '#8b91a3' }}>vs last period</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Revenue Chart */}
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Revenue Trend</h3>
          <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 20 }}>Monthly revenue over time</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, height: 240, paddingTop: 10 }}>
            {revenueData.map((d, i) => {
              const max = 70;
              return (
                <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#5b6172' }}>${d.v}k</div>
                  <div style={{
                    width: '100%', maxWidth: 36, height: `${(d.v / max) * 180}px`, borderRadius: '6px 6px 3px 3px',
                    background: i === revenueData.length - 1 ? 'linear-gradient(180deg, #818cf8, #4f46e5)' : '#eef0fc',
                    transition: 'all 0.3s', cursor: 'pointer',
                  }} />
                  <div style={{ fontSize: 11.5, color: '#8b91a3' }}>{d.m}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category distribution */}
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Sales by Category</h3>
          <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 18 }}>Distribution of sales</p>
          {/* Donut */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <DonutChart data={categories} />
          </div>
          {categories.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
              <span style={{ fontSize: 13, color: '#1f2333', flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{c.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top selling + Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Top Selling Products</h3>
          {[
            { name: 'Wireless Headphones', sold: 342, revenue: '$68,316' },
            { name: 'Smart Watch Series 5', sold: 289, revenue: '$43,347' },
            { name: 'Premium Backpack', sold: 215, revenue: '$19,347' },
            { name: 'Bluetooth Speaker', sold: 198, revenue: '$11,878' },
          ].map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f4f5f8' : 'none' }}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: '#eef0fc', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: '#8b91a3' }}>{p.sold} sold</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{p.revenue}</span>
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Warehouse Performance</h3>
          {[
            { label: 'Order Fulfillment Rate', value: 94, color: '#16a34a' },
            { label: 'Inventory Accuracy', value: 88, color: '#4f46e5' },
            { label: 'On-Time Shipping', value: 91, color: '#0ea5e9' },
            { label: 'Return Rate', value: 4, color: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#1f2333' }}>{m.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{m.value}%</span>
              </div>
              <div style={{ height: 8, background: '#f4f5f8', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  let offset = 0;
  const r = 60;
  const c = 2 * Math.PI * r;
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <g transform="translate(80,80) rotate(-90)">
        {data.map(d => {
          const len = (d.value / total) * c;
          const el = (
            <circle key={d.name} r={r} fill="none" stroke={d.color} strokeWidth="22"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </g>
      <text x="80" y="76" textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: '#1f2333' }}>{total}%</text>
      <text x="80" y="94" textAnchor="middle" style={{ fontSize: 11, fill: '#8b91a3' }}>Total</text>
    </svg>
  );
}
