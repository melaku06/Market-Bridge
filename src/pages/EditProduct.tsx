import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mock';
import { PageHeader, Button, Input, Select, Textarea } from '../components/ui';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id) || products[0];
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku,
    category: product.category,
    brand: product.brand || '',
    barcode: product.barcode || '',
    price: String(product.price),
    stock: String(product.stock),
    reserved: String(product.reserved || 0),
    status: product.status,
    shortDescription: product.shortDescription || '',
    detailedDescription: product.detailedDescription || '',
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fade-in">
      <PageHeader
        title="Edit Product"
        subtitle={`Editing: ${product.name}`}
        action={<Link to="/products"><Button variant="secondary" size="md">← Back to Products</Button></Link>}
      />

      <form onSubmit={e => { e.preventDefault(); navigate('/products'); }} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Product Name" value={form.name} onChange={e => set('name', e.target.value)} required />
              <Input label="SKU" value={form.sku} onChange={e => set('sku', e.target.value)} required />
              <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
                <option>Electronics</option><option>Bags</option><option>Footwear</option><option>Clothing</option><option>Home</option>
              </Select>
              <Select label="Brand" value={form.brand} onChange={e => set('brand', e.target.value)}>
                <option value="">Select brand</option>
                <option>Sony</option><option>Apple</option><option>Samsung</option><option>Nike</option><option>Generic</option>
              </Select>
              <Input label="Barcode" value={form.barcode} onChange={e => set('barcode', e.target.value)} />
              <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option><option>Low Stock</option><option>Running Low</option><option>Out of Stock</option>
              </Select>
            </div>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Pricing & Inventory</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
              <Input label="Stock Quantity" type="number" value={form.stock} onChange={e => set('stock', e.target.value)} required />
              <Input label="Reserved" type="number" value={form.reserved} onChange={e => set('reserved', e.target.value)} />
            </div>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Description</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Short Description" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} />
              <Textarea label="Detailed Description" value={form.detailedDescription} onChange={e => set('detailedDescription', e.target.value)} rows={4} />
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0 }}>
          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Product Image</h3>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }} />
            <Button variant="secondary" size="sm" type="button" style={{ width: '100%', marginTop: 12 }}>Change Image</Button>
          </section>

          <section style={{ background: '#fff', border: '1px solid #eef0f5', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1f2333', marginBottom: 16 }}>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="primary" size="md" type="submit" style={{ width: '100%' }}>Save Changes</Button>
              <Button variant="secondary" size="md" type="button" onClick={() => navigate('/products')} style={{ width: '100%' }}>Cancel</Button>
              <Button variant="danger" size="md" type="button" style={{ width: '100%' }}>Delete Product</Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
