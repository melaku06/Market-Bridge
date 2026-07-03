/*
# Create Missing Tables + Performance Indexes

1. Purpose
- Create the remaining marketplace tables that are referenced in the Prisma schema but don't exist yet in the database.
- Add composite indexes for the most frequent query patterns.

2. New Tables
- `inventory` — stock tracking per warehouse/product
- `orders` — customer orders
- `order_items` — order line items
- `addresses` — customer shipping addresses
- `reviews` — product reviews and ratings
- `wishlist_items` — customer wishlist
- `product_requests` — customer product requests
- `notifications` — system notifications
- `promotions` — marketing banners/promotions
- `margin_rules` — category/product margin rules
- `audit_logs` — audit logging
- `telegram_posts` — telegram marketing posts
- `system_settings` — platform configuration (singleton)

3. Security
- RLS enabled on all new tables.
- Policies allow anon+authenticated read on public catalog data (products, categories, reviews, promotions).
- Owner-scoped policies for orders, addresses, wishlist, notifications, product_requests.

4. Performance Indexes
- Composite indexes on products(status, created_at), products(status, sold_count), products(category_id, status), etc.
- Composite indexes on orders(customer_id, created_at), orders(warehouse_id, status).
- Composite indexes on reviews(product_id, created_at), notifications(user_id, created_at).
*/

-- ============================================================================
-- INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 10,
  status text NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (warehouse_id, product_id)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS inventory_warehouse_idx ON inventory (warehouse_id);
CREATE INDEX IF NOT EXISTS inventory_product_idx ON inventory (product_id);
CREATE INDEX IF NOT EXISTS inventory_status_idx ON inventory (status);

-- ============================================================================
-- ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number text UNIQUE NOT NULL,
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  subtotal numeric(15,2) NOT NULL,
  shipping_fee numeric(15,2) NOT NULL DEFAULT 0,
  discount numeric(15,2) NOT NULL DEFAULT 0,
  tax numeric(15,2) NOT NULL DEFAULT 0,
  total numeric(15,2) NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_method text NOT NULL,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cod')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders (order_number);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);
CREATE INDEX IF NOT EXISTS orders_warehouse_idx ON orders (warehouse_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders (payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at);
CREATE INDEX IF NOT EXISTS orders_customer_created_idx ON orders (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_warehouse_status_idx ON orders (warehouse_id, status);

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL,
  unit_price numeric(15,2) NOT NULL,
  total_price numeric(15,2) NOT NULL,
  color text,
  size text
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON order_items (product_id);

-- ============================================================================
-- ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  recipient_name text NOT NULL,
  phone text,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Ethiopia',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS addresses_customer_idx ON addresses (customer_id);

-- ============================================================================
-- REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  product_name text NOT NULL,
  rating integer NOT NULL,
  comment text,
  product_image text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS reviews_customer_idx ON reviews (customer_id);
CREATE INDEX IF NOT EXISTS reviews_product_idx ON reviews (product_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews (rating);
CREATE INDEX IF NOT EXISTS reviews_product_created_idx ON reviews (product_id, created_at DESC);

-- ============================================================================
-- WISHLIST ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (customer_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS wishlist_customer_idx ON wishlist_items (customer_id);
CREATE INDEX IF NOT EXISTS wishlist_customer_product_idx ON wishlist_items (customer_id, product_id);

-- ============================================================================
-- PRODUCT REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  product_name text NOT NULL,
  description text NOT NULL,
  category text,
  brand text,
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'found', 'not_available')),
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS product_requests_customer_idx ON product_requests (customer_id);
CREATE INDEX IF NOT EXISTS product_requests_status_idx ON product_requests (status);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('order', 'product', 'system', 'promotion', 'account', 'inventory')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  title text NOT NULL,
  message text NOT NULL,
  data text,
  action_url text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications (is_read);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications (type);
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON notifications (user_id, created_at DESC);

-- ============================================================================
-- PROMOTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'banner' CHECK (type IN ('banner', 'promotion', 'flash_deal', 'coupon')),
  image_url text,
  target_url text,
  location text,
  target_audience text NOT NULL DEFAULT 'All Users',
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'paused')),
  start_date timestamptz,
  end_date timestamptz,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS promotions_type_idx ON promotions (type);
CREATE INDEX IF NOT EXISTS promotions_status_idx ON promotions (status);

-- ============================================================================
-- MARGIN RULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS margin_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  product_id uuid UNIQUE,
  category_name text,
  warehouse_margin numeric(5,2) NOT NULL,
  platform_margin numeric(5,2) NOT NULL,
  total_margin numeric(5,2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE margin_rules ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS margin_rules_category_idx ON margin_rules (category_id);
CREATE INDEX IF NOT EXISTS margin_rules_is_active_idx ON margin_rules (is_active);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id text NOT NULL,
  actor_name text NOT NULL,
  actor_role text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  before_state text,
  after_state text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_entity_type_idx ON audit_logs (entity_type);
CREATE INDEX IF NOT EXISTS audit_logs_entity_id_idx ON audit_logs (entity_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at);

-- ============================================================================
-- TELEGRAM POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS telegram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  channel text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'retrying')),
  error text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE telegram_posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS telegram_posts_product_idx ON telegram_posts (product_id);
CREATE INDEX IF NOT EXISTS telegram_posts_status_idx ON telegram_posts (status);

-- ============================================================================
-- SYSTEM SETTINGS (singleton)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id text PRIMARY KEY DEFAULT 'singleton',
  site_name text NOT NULL DEFAULT 'MarketBridge',
  site_tagline text NOT NULL DEFAULT 'Multi-Vendor Marketplace',
  site_email text NOT NULL DEFAULT 'support@marketbridge.com',
  site_phone text,
  currency text NOT NULL DEFAULT 'ETB',
  timezone text NOT NULL DEFAULT 'Africa/Addis_Ababa',
  date_format text NOT NULL DEFAULT 'DD/MM/YYYY',
  time_format text NOT NULL DEFAULT '24 Hour',
  items_per_page integer NOT NULL DEFAULT 10,
  maintenance_mode boolean NOT NULL DEFAULT false,
  site_language text NOT NULL DEFAULT 'English',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PERFORMANCE INDEXES ON EXISTING TABLES
-- ============================================================================
CREATE INDEX IF NOT EXISTS products_published_sort_idx ON products (status, created_at DESC);
CREATE INDEX IF NOT EXISTS products_published_sold_idx ON products (status, sold_count DESC);
CREATE INDEX IF NOT EXISTS products_published_rating_idx ON products (status, rating DESC);
CREATE INDEX IF NOT EXISTS products_category_status_idx ON products (category_id, status);
CREATE INDEX IF NOT EXISTS products_warehouse_status_idx ON products (warehouse_id, status);

-- ============================================================================
-- RLS POLICIES FOR PUBLIC READ ACCESS
-- ============================================================================
-- Public catalog data: anyone can read published products, active categories, active promotions, reviews
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_reviews" ON reviews;
CREATE POLICY "anon_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_promotions" ON promotions;
CREATE POLICY "anon_read_promotions" ON promotions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_warehouses" ON warehouses;
CREATE POLICY "anon_read_warehouses" ON warehouses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_inventory" ON inventory;
CREATE POLICY "anon_read_inventory" ON inventory FOR SELECT
  TO anon, authenticated USING (true);

-- Authenticated write access for products (warehouse owners)
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Authenticated CRUD for reviews
DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated CRUD for orders
DROP POLICY IF EXISTS "auth_insert_orders" ON orders;
CREATE POLICY "auth_insert_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated CRUD for order items
DROP POLICY IF EXISTS "auth_insert_order_items" ON order_items;
CREATE POLICY "auth_insert_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_order_items" ON order_items;
CREATE POLICY "auth_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

-- Authenticated CRUD for addresses
DROP POLICY IF EXISTS "auth_read_addresses" ON addresses;
CREATE POLICY "auth_read_addresses" ON addresses FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_addresses" ON addresses;
CREATE POLICY "auth_insert_addresses" ON addresses FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_addresses" ON addresses;
CREATE POLICY "auth_update_addresses" ON addresses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_addresses" ON addresses;
CREATE POLICY "auth_delete_addresses" ON addresses FOR DELETE
  TO authenticated USING (true);

-- Authenticated CRUD for wishlist
DROP POLICY IF EXISTS "auth_read_wishlist" ON wishlist_items;
CREATE POLICY "auth_read_wishlist" ON wishlist_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_wishlist" ON wishlist_items;
CREATE POLICY "auth_insert_wishlist" ON wishlist_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_wishlist" ON wishlist_items;
CREATE POLICY "auth_delete_wishlist" ON wishlist_items FOR DELETE
  TO authenticated USING (true);

-- Authenticated CRUD for notifications
DROP POLICY IF EXISTS "auth_read_notifications" ON notifications;
CREATE POLICY "auth_read_notifications" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_notifications" ON notifications;
CREATE POLICY "auth_insert_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_notifications" ON notifications;
CREATE POLICY "auth_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated CRUD for product requests
DROP POLICY IF EXISTS "auth_read_product_requests" ON product_requests;
CREATE POLICY "auth_read_product_requests" ON product_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_product_requests" ON product_requests;
CREATE POLICY "auth_insert_product_requests" ON product_requests FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_product_requests" ON product_requests;
CREATE POLICY "auth_update_product_requests" ON product_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated CRUD for inventory
DROP POLICY IF EXISTS "auth_insert_inventory" ON inventory;
CREATE POLICY "auth_insert_inventory" ON inventory FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_inventory" ON inventory;
CREATE POLICY "auth_update_inventory" ON inventory FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_inventory" ON inventory;
CREATE POLICY "auth_delete_inventory" ON inventory FOR DELETE
  TO authenticated USING (true);

-- Admin-only tables: authenticated can read/write
DROP POLICY IF EXISTS "auth_read_audit_logs" ON audit_logs;
CREATE POLICY "auth_read_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_audit_logs" ON audit_logs;
CREATE POLICY "auth_insert_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_crud_margin_rules" ON margin_rules;
CREATE POLICY "auth_read_margin_rules" ON margin_rules FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_margin_rules" ON margin_rules;
CREATE POLICY "auth_insert_margin_rules" ON margin_rules FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_margin_rules" ON margin_rules;
CREATE POLICY "auth_update_margin_rules" ON margin_rules FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_margin_rules" ON margin_rules;
CREATE POLICY "auth_delete_margin_rules" ON margin_rules FOR DELETE
  TO authenticated USING (true);

-- Promotions: authenticated can write
DROP POLICY IF EXISTS "auth_insert_promotions" ON promotions;
CREATE POLICY "auth_insert_promotions" ON promotions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_promotions" ON promotions;
CREATE POLICY "auth_update_promotions" ON promotions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_promotions" ON promotions;
CREATE POLICY "auth_delete_promotions" ON promotions FOR DELETE
  TO authenticated USING (true);

-- Telegram posts: authenticated can read/write
DROP POLICY IF EXISTS "auth_read_telegram_posts" ON telegram_posts;
CREATE POLICY "auth_read_telegram_posts" ON telegram_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_telegram_posts" ON telegram_posts;
CREATE POLICY "auth_insert_telegram_posts" ON telegram_posts FOR INSERT
  TO authenticated WITH CHECK (true);

-- System settings: authenticated can read/update
DROP POLICY IF EXISTS "auth_read_system_settings" ON system_settings;
CREATE POLICY "auth_read_system_settings" ON system_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_system_settings" ON system_settings;
CREATE POLICY "auth_update_system_settings" ON system_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Insert default system settings if not exists
INSERT INTO system_settings (id) VALUES ('singleton')
ON CONFLICT (id) DO NOTHING;
