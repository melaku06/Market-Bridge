import type { CSSProperties } from 'react';

export const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #eef0f5',
  borderRadius: 14,
  boxShadow: '0 1px 2px rgba(20,23,40,0.04)',
};

export function statusStyle(status: string): CSSProperties {
  const map: Record<string, CSSProperties> = {
    'Active': { background: '#e7f6ec', color: '#16a34a' },
    'In Stock': { background: '#e7f6ec', color: '#16a34a' },
    'Delivered': { background: '#e7f6ec', color: '#16a34a' },
    'Low Stock': { background: '#fef3e2', color: '#d97706' },
    'Running Low': { background: '#fef3e2', color: '#d97706' },
    'Processing': { background: '#eef0fc', color: '#4f46e5' },
    'New': { background: '#eef0fc', color: '#4f46e5' },
    'Shipped': { background: '#e0f2fe', color: '#0284c7' },
    'Out of Stock': { background: '#fdeaea', color: '#dc2626' },
    'Cancelled': { background: '#fdeaea', color: '#dc2626' },
  };
  return {
    ...(map[status] || { background: '#f4f5f8', color: '#6b7280' }),
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11.5,
    fontWeight: 600,
    display: 'inline-block',
    whiteSpace: 'nowrap',
  };
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2333', letterSpacing: '-0.3px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: '#8b91a3', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', onClick, style, type = 'button', disabled }: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: CSSProperties;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const variants: Record<string, CSSProperties> = {
    primary: { background: '#4f46e5', color: '#fff' },
    secondary: { background: '#fff', color: '#1f2333', border: '1px solid #e8eaf0' },
    ghost: { background: 'transparent', color: '#5b6172' },
    danger: { background: '#dc2626', color: '#fff' },
    success: { background: '#16a34a', color: '#fff' },
  };
  const sizes: Record<string, CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: 12.5 },
    md: { padding: '9px 16px', fontSize: 13.5 },
    lg: { padding: '12px 22px', fontSize: 14.5 },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = '#4338ca';
        else if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.background = '#f8f9fc';
        else if (variant === 'danger') (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c';
        else if (variant === 'success') (e.currentTarget as HTMLButtonElement).style.background = '#15803d';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = '#4f46e5';
        else if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.background = '#fff';
        else if (variant === 'danger') (e.currentTarget as HTMLButtonElement).style.background = '#dc2626';
        else if (variant === 'success') (e.currentTarget as HTMLButtonElement).style.background = '#16a34a';
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3f4456', marginBottom: 6 }}>{label}</label>}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1px solid ${error ? '#dc2626' : '#e8eaf0'}`,
          borderRadius: 10,
          background: '#fff',
          fontSize: 13.5,
          color: '#1f2333',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...props.style,
        }}
        onFocus={e => (e.target.style.borderColor = '#818cf8')}
        onBlur={e => (e.target.style.borderColor = error ? '#dc2626' : '#e8eaf0')}
      />
      {error && <span style={{ display: 'block', fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</span>}
    </div>
  );
}

const chevronIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa0b4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")";

export function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3f4456', marginBottom: 6 }}>{label}</label>}
      <select
        {...props}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #e8eaf0',
          borderRadius: 10,
          background: '#fff',
          fontSize: 13.5,
          color: '#1f2333',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: chevronIcon,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: 36,
          ...props.style,
        }}
        onFocus={e => (e.target.style.borderColor = '#818cf8')}
        onBlur={e => (e.target.style.borderColor = '#e8eaf0')}
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#3f4456', marginBottom: 6 }}>{label}</label>}
      <textarea
        {...props}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #e8eaf0',
          borderRadius: 10,
          background: '#fff',
          fontSize: 13.5,
          color: '#1f2333',
          outline: 'none',
          transition: 'border-color 0.15s',
          resize: 'vertical',
          minHeight: 90,
          fontFamily: 'inherit',
          ...props.style,
        }}
        onFocus={e => (e.target.style.borderColor = '#818cf8')}
        onBlur={e => (e.target.style.borderColor = '#e8eaf0')}
      />
    </div>
  );
}
