import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Button, Input, Select, Textarea } from '../components/ui';

export default function AddProduct() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="fade-in">
      <PageHeader
        title="Add New Product"
        subtitle="Create a new product in your catalog"
        action={<Link to="/products"><Button variant="secondary" size="md">← Back to Products</Button></Link>}
      />

      <form onSubmit={e => { e.preventDefault(); navigate('/products'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left: form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Product Name" placeholder="Enter product name" required />
              <Input label="SKU" placeholder="e.g. WH-10000" required />
              <Select label="Category" required defaultValue="">
                <option value="" disabled>Select category</option>
                <option>Electronics</option><option>Bags</option><option>Footwear</option><option>Clothing</option><option>Home</option>
              </Select>
              <Select label="Brand" defaultValue="">
                <option value="" disabled>Select brand</option>
                <option>Sony</option><option>Apple</option><option>Samsung</option><option>Nike</option><option>Generic</option>
              </Select>
              <Input label="Barcode" placeholder="1234567890123" />
              <Select label="Status" defaultValue="Active">
                <option>Active</option><option>Low Stock</option><option>Out of Stock</option>
              </Select>
            </div>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Pricing & Inventory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Input label="Price ($)" type="number" step="0.01" placeholder="0.00" required />
              <Input label="Stock Quantity" type="number" placeholder="0" required />
              <Input label="Reserved" type="number" placeholder="0" />
              <Input label="Cost ($)" type="number" step="0.01" placeholder="0.00" />
              <Input label="Tax Rate (%)" type="number" placeholder="0" />
              <Input label="Reorder Level" type="number" placeholder="10" />
            </div>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Description</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Short Description" placeholder="One-line summary" />
              <Textarea label="Detailed Description" placeholder="Full product description..." rows={4} />
            </div>
          </section>
        </div>

        {/* Right: image + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0 }}>
          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Product Image</h3>
            <div style={{
              border: '2px dashed #d8dbe5', borderRadius: 12, padding: 24, textAlign: 'center',
              cursor: 'pointer', transition: 'border-color 0.15s', background: '#f9fafc',
            }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#818cf8')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#d8dbe5')}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', borderRadius: 8 }} />
              ) : (
                <>
                  <div style={{ width: 48, height: 48, margin: '0 auto 10px', background: '#eef0fc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2333' }}>Click to upload</div>
                  <div style={{ fontSize: 12, color: '#8b91a3', marginTop: 2 }}>PNG, JPG up to 5MB</div>
                </>
              )}
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} id="file-upload"
              onChange={e => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)); }} />
            <label htmlFor="file-upload"><Button variant="secondary" size="sm" type="button" style={{ width: '100%', marginTop: 12 }}>Choose File</Button></label>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="primary" size="md" type="submit" style={{ width: '100%' }}>Save Product</Button>
              <Button variant="secondary" size="md" type="button" onClick={() => navigate('/products')} style={{ width: '100%' }}>Cancel</Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
