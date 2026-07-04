import { useState } from 'react';
import { card, PageHeader, Button, Input, Select } from '../components/ui';

export default function Profile() {
  const [tab, setTab] = useState('Personal');

  return (
    <div className="fade-in">
      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...card, padding: 22, textAlign: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, margin: '0 auto 14px' }}>W</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1f2333' }}>Warehouse One</div>
            <div style={{ fontSize: 13, color: '#8b91a3', marginTop: 2 }}>Administrator</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18, paddingTop: 18, borderTop: '1px solid #f4f5f8' }}>
              <div><div style={{ fontSize: 18, fontWeight: 700, color: '#1f2333' }}>156</div><div style={{ fontSize: 11, color: '#8b91a3' }}>Products</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 700, color: '#1f2333' }}>1.2k</div><div style={{ fontSize: 11, color: '#8b91a3' }}>Orders</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 700, color: '#1f2333' }}>3y</div><div style={{ fontSize: 11, color: '#8b91a3' }}>Member</div></div>
            </div>
          </div>

          <div style={{ ...card, padding: 16 }}>
            {['Personal', 'Security', 'Notifications', 'Billing'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginBottom: 2,
                background: tab === t ? '#eef0fc' : 'transparent', color: tab === t ? '#4f46e5' : '#5b6172',
                transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ ...card, padding: 22 }}>
          {tab === 'Personal' && (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Personal Information</h3>
              <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 20 }}>Update your personal details</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="First Name" defaultValue="Warehouse" />
                <Input label="Last Name" defaultValue="One" />
                <Input label="Email" type="email" defaultValue="admin@marketbridge.com" />
                <Input label="Phone" defaultValue="+1 (555) 123-4567" />
                <Select label="Role" defaultValue="Administrator">
                  <option>Administrator</option><option>Manager</option><option>Staff</option>
                </Select>
                <Select label="Department" defaultValue="Operations">
                  <option>Operations</option><option>Logistics</option><option>Customer Service</option>
                </Select>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Address" defaultValue="123 Market Street, San Francisco, CA 94103" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <Button variant="primary" size="md">Save Changes</Button>
                <Button variant="secondary" size="md">Cancel</Button>
              </div>
            </>
          )}
          {tab === 'Security' && (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Security</h3>
              <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 20 }}>Update your password and security settings</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 460 }}>
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
              </div>
              <div style={{ marginTop: 22 }}>
                <Button variant="primary" size="md">Update Password</Button>
              </div>
            </>
          )}
          {tab === 'Notifications' && (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Notification Preferences</h3>
              <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 20 }}>Choose what you want to be notified about</p>
              {['New orders', 'Low stock alerts', 'Payment received', 'System updates', 'Promotional offers'].map(n => (
                <label key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f4f5f8' }}>
                  <span style={{ fontSize: 13.5, color: '#1f2333' }}>{n}</span>
                  <Toggle defaultOn={n !== 'Promotional offers'} />
                </label>
              ))}
              <div style={{ marginTop: 22 }}><Button variant="primary" size="md">Save Preferences</Button></div>
            </>
          )}
          {tab === 'Billing' && (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2333', marginBottom: 4 }}>Billing & Subscription</h3>
              <p style={{ fontSize: 13, color: '#8b91a3', marginBottom: 20 }}>Manage your subscription and payment methods</p>
              <div style={{ padding: 20, background: '#f9fafc', borderRadius: 12, border: '1px solid #eef0f5', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1f2333' }}>Pro Plan</div>
                    <div style={{ fontSize: 13, color: '#8b91a3', marginTop: 2 }}>$49/month • Renews on June 30, 2024</div>
                  </div>
                  <Button variant="success" size="sm">Active</Button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="primary" size="md">Upgrade Plan</Button>
                <Button variant="secondary" size="md">Manage Payment</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} style={{
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
