import { useState } from 'react';
import { card, PageHeader, Button, Input, Select } from '../components/ui';

export default function Settings() {
  return (
    <div className="fade-in">
      <PageHeader title="Settings" subtitle="Configure your warehouse system preferences" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
        <section style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>General Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Warehouse Name" defaultValue="MarketBridge Warehouse" />
            <Input label="Contact Email" defaultValue="contact@marketbridge.com" />
            <Select label="Currency" defaultValue="USD">
              <option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option>
            </Select>
            <Select label="Timezone" defaultValue="UTC-8 (Pacific)">
              <option>UTC-8 (Pacific)</option><option>UTC-5 (Eastern)</option><option>UTC+0 (GMT)</option><option>UTC+1 (Central European)</option>
            </Select>
            <Select label="Language" defaultValue="English">
              <option>English</option><option>Spanish</option><option>French</option><option>German</option>
            </Select>
            <Select label="Date Format" defaultValue="MM/DD/YYYY">
              <option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option>
            </Select>
          </div>
        </section>

        <section style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Inventory Settings</h3>
          {[
            'Enable low stock alerts',
            'Auto-generate SKUs for new products',
            'Allow negative stock (backorders)',
            'Track serial numbers / batch codes',
          ].map((l, i) => (
            <label key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f4f5f8' : 'none' }}>
              <span style={{ fontSize: 13.5, color: '#1f2333' }}>{l}</span>
              <Toggle defaultOn={i < 2} />
            </label>
          ))}
        </section>

        <section style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Order Settings</h3>
          {[
            'Require payment before processing',
            'Auto-assign order numbers',
            'Send order confirmation emails',
            'Allow order cancellation within 24h',
          ].map((l, i) => (
            <label key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f4f5f8' : 'none' }}>
              <span style={{ fontSize: 13.5, color: '#1f2333' }}>{l}</span>
              <Toggle defaultOn={i % 2 === 0} />
            </label>
          ))}
        </section>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="md">Reset to Defaults</Button>
          <Button variant="primary" size="md">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} type="button" style={{
      width: 40, height: 22, borderRadius: 20, background: on ? '#4f46e5' : '#d8dbe5',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: 'none',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18,
        background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}
