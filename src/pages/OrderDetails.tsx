import { Link, useParams } from 'react-router-dom';
import { orders, products } from '../data/mock';
import { card, statusStyle, PageHeader, Button } from '../components/ui';

export default function OrderDetails() {
  const { id } = useParams();
  const order = orders.find(o => o.id === `#${id}`) || orders[0];
  const items = products.slice(0, order.items).map((p, i) => ({
    ...p,
    qty: i === 0 ? 1 : 1,
    lineTotal: p.price,
  }));

  const subtotal = items.reduce((a, p) => a + p.lineTotal, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const timeline = [
    { label: 'Order Placed', date: 'May 30, 2024 - 10:30 AM', done: true },
    { label: 'Payment Confirmed', date: 'May 30, 2024 - 10:35 AM', done: true },
    { label: 'Processing', date: 'May 31, 2024 - 09:00 AM', done: order.status !== 'New' },
    { label: 'Shipped', date: 'Expected: Jun 1, 2024', done: order.status === 'Shipped' || order.status === 'Delivered' },
    { label: 'Delivered', date: 'Expected: Jun 3, 2024', done: order.status === 'Delivered' },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title={`Order ${order.id}`}
        subtitle={`Placed on ${order.date}`}
        action={<Link to="/orders"><Button variant="secondary" size="md">← Back to Orders</Button></Link>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Items */}
          <section style={{ ...card, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Order Items</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eef0f5' }}>
                    {['Product', 'Price', 'Qty', 'Total'].map(h => <th key={h} style={{ textAlign: h === 'Total' ? 'right' : 'left', padding: '10px 12px', fontSize: 11.5, fontWeight: 600, color: '#8b91a3', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f4f5f8' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#8b91a3' }}>{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#5b6172' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#5b6172' }}>{p.qty}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#1f2333' }}>${p.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Summary */}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ minWidth: 240, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Shipping" value={`$${shipping.toFixed(2)}`} />
                <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
                <div style={{ borderTop: '1px solid #eef0f5', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#1f2333' }}>Total</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: 16 }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section style={{ ...card, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Order Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {timeline.map((t, i) => (
                <div key={t.label} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.done ? '#16a34a' : '#d8dbe5', border: '3px solid', borderColor: t.done ? '#e7f6ec' : '#f4f5f8' }} />
                    {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: t.done ? '#16a34a' : '#e8eaf0', minHeight: 24, margin: '2px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: 18 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: t.done ? '#1f2333' : '#8b91a3' }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: '#8b91a3', marginTop: 2 }}>{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0 }}>
          <section style={{ ...card, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Customer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{order.customer[0]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2333' }}>{order.customer}</div>
                <div style={{ fontSize: 12, color: '#8b91a3' }}>customer@email.com</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Info label="Order Status" value={<span style={statusStyle(order.status)}>{order.status}</span>} />
              <Info label="Payment" value={<span style={statusStyle(order.payment === 'Paid' ? 'Delivered' : 'Processing')}>{order.payment}</span>} />
              <Info label="Order Date" value={order.date} />
              <Info label="Items" value={`${order.items} items`} />
            </div>
          </section>

          <section style={{ ...card, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Shipping Address</h3>
            <div style={{ fontSize: 13, color: '#5b6172', lineHeight: 1.7 }}>
              {order.customer}<br />
              123 Market Street<br />
              Suite 200<br />
              San Francisco, CA 94103<br />
              United States
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="primary" size="md" style={{ width: '100%' }}>Update Status</Button>
            <Button variant="secondary" size="md" style={{ width: '100%' }}>Print Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8b91a3' }}>{label}</span><span style={{ color: '#1f2333', fontWeight: 500 }}>{value}</span></div>;
}
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 12.5, color: '#8b91a3' }}>{label}</span><span>{value}</span></div>;
}
