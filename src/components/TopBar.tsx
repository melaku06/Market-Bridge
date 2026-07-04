import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  searchPlaceholder?: string;
}

export default function TopBar({ searchPlaceholder = 'Search anything...' }: TopBarProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <header style={{
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #eef0f5',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#adb3c5' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            width: '100%',
            padding: '8px 14px 8px 36px',
            border: '1px solid #eef0f5',
            borderRadius: 10,
            background: '#f8f9fc',
            fontSize: 13.5,
            color: '#1f2333',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = '#818cf8')}
          onBlur={e => (e.target.style.borderColor = '#eef0f5')}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Icons */}
      <button
        onClick={() => navigate('/notifications')}
        style={{
          position: 'relative', width: 38, height: 38, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8f9fc', color: '#6b7280', border: '1px solid #eef0f5',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#eef0f5')}
        onMouseLeave={e => (e.currentTarget.style.background = '#f8f9fc')}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span style={{
          position: 'absolute', top: 7, right: 7, width: 7, height: 7,
          background: '#ef4444', borderRadius: '50%', border: '2px solid #fff',
        }} />
      </button>

      <button style={{
        width: 38, height: 38, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f9fc', color: '#6b7280', border: '1px solid #eef0f5',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#eef0f5')}
        onMouseLeave={e => (e.currentTarget.style.background = '#f8f9fc')}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 30, background: '#eef0f5' }} />

      {/* User */}
      <button
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', cursor: 'pointer', padding: '4px 8px',
          borderRadius: 10, transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fc')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}>W</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>Warehouse One</div>
          <div style={{ fontSize: 11, color: '#9aa0b4' }}>Admin</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa0b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </header>
  );
}
