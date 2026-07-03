/*
# Seed Data for MarketBridge

This migration populates the database with initial data:
1. Sample warehouses
2. Sample categories
3. Sample products

## Tables Created

### categories
Product categories for organizing products.

### products
Products sold on the marketplace with pricing, inventory, and status.

## Security
- RLS enabled on all tables
- Public read access for published products
- Warehouse-scoped access for warehouse users
- Admin full access
*/

-- Create sample warehouses
INSERT INTO warehouses (id, name, owner_name, email, phone, address, city, country, business_type, status, member_since)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Addis Electronics Store', 'Abebe Bikila', 'warehouse1@market.com', '+251911234567', 'Bole Sub-City, Woreda 03', 'Addis Ababa', 'Ethiopia', 'Electronics', 'active', '2024-01-15'),
  ('22222222-2222-2222-2222-222222222222', 'Habesha Fashion House', 'Tirunesh Dibaba', 'warehouse2@market.com', '+251922345678', 'Mercato Area, Woreda 15', 'Addis Ababa', 'Ethiopia', 'Fashion', 'active', '2024-02-20'),
  ('33333333-3333-3333-3333-333333333333', 'Ethio Home & Living', 'Kenenisa Bekele', 'warehouse3@market.com', '+251933456789', 'Piassa, Woreda 08', 'Addis Ababa', 'Ethiopia', 'Home & Living', 'active', '2024-03-10')
ON CONFLICT DO NOTHING;

-- Create sample categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
CREATE POLICY "Categories are publicly readable"
ON categories FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Electronics', 'electronics', 'Electronic devices and accessories'),
  ('55555555-5555-5555-5555-555555555555', 'Fashion', 'fashion', 'Clothing, shoes, and accessories'),
  ('66666666-6666-6666-6666-666666666666', 'Home & Living', 'home-living', 'Furniture, decor, and household items'),
  ('77777777-7777-7777-7777-777777777777', 'Beauty', 'beauty', 'Skincare, makeup, and personal care'),
  ('88888888-8888-8888-8888-888888888888', 'Sports', 'sports', 'Sports equipment and activewear')
ON CONFLICT DO NOTHING;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  short_description text,
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  base_price numeric NOT NULL,
  margin_percent numeric DEFAULT 15,
  discount_percent numeric DEFAULT 0,
  images text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  sold_count integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  tags text[] DEFAULT '{}',
  brand text,
  sku text UNIQUE,
  weight text,
  colors text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published products are publicly readable" ON products;
CREATE POLICY "Published products are publicly readable"
ON products FOR SELECT
TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "Warehouse owners can view own products" ON products;
CREATE POLICY "Warehouse owners can view own products"
ON products FOR SELECT
TO authenticated
USING (
  warehouse_id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Warehouse owners can manage own products" ON products;
CREATE POLICY "Warehouse owners can manage own products"
ON products FOR ALL
TO authenticated
USING (
  warehouse_id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  warehouse_id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create index on products
CREATE INDEX IF NOT EXISTS idx_products_warehouse_id ON products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Trigger for products updated_at
DROP TRIGGER IF EXISTS handle_products_updated_at ON products;
CREATE TRIGGER handle_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, warehouse_id, category_id, base_price, margin_percent, images, status, rating, review_count, brand)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'The latest Samsung flagship with S Pen, 200MP camera, and AI features.', 'Flagship Samsung smartphone with S Pen', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 95000, 15, ARRAY['https://images.pexels.com/photos/6098238/pexels-photo-6098238.jpeg'], 'published', 4.8, 45, 'Samsung'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Apple iPhone 15 Pro Max', 'apple-iphone-15-pro-max', 'Dynamic Island, A17 Pro chip, titanium design.', 'Premium iPhone with titanium design', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 115000, 15, ARRAY['https://images.pexels.com/photos/12990843/pexels-photo-12990843.jpeg'], 'published', 4.9, 78, 'Apple'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5', 'Industry-leading noise cancellation headphones.', 'Premium noise-canceling headphones', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 28000, 15, ARRAY['https://images.pexels.com/photos/164977/pexels-photo-164977.jpeg'], 'published', 4.7, 32, 'Sony'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ethiopian Traditional Dress', 'ethiopian-traditional-dress', 'Handmade traditional Ethiopian dress with intricate embroidery.', 'Authentic Ethiopian traditional dress', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 15000, 20, ARRAY['https://images.pexels.com/photos/9963895/pexels-photo-9963895.jpeg'], 'published', 4.8, 56, 'Habesha Fashion'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Ethiopian Coffee Set - Jebena', 'ethiopian-coffee-set-jebena', 'Traditional clay coffee pot with cups and serving tray.', 'Traditional Ethiopian coffee ceremony set', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 5500, 20, ARRAY['https://images.pexels.com/photos/1692045/pexels-photo-1692045.jpeg'], 'published', 4.9, 89, 'Ethio Crafts')
ON CONFLICT DO NOTHING;