-- Fix commonly missing indexes and columns across all tables

-- Products: add indexes for common filter/sort fields
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_warehouse_id ON products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Categories: add index for active status and parent
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Orders: add indexes for customer/warehouse/status queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_warehouse_id ON orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Profiles: add indexes for role and warehouse queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_warehouse_id ON profiles(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Inventory: add composite index for warehouse-product lookup
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_product ON inventory(warehouse_id, product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);

-- Reviews: add indexes for product reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Wishlist: add unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_wishlist_unique ON wishlist_items(customer_id, product_id);

-- Notifications: add indexes for user queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Product requests: add indexes for customer and status
CREATE INDEX IF NOT EXISTS idx_product_requests_customer_id ON product_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_requests_status ON product_requests(status);

-- Addresses: add index for customer lookup
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);

-- Audit logs: add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Promotions: add indexes for status and dates
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

-- Telegram posts: add indexes for status and scheduling
CREATE INDEX IF NOT EXISTS idx_telegram_posts_status ON telegram_posts(status);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_product_id ON telegram_posts(product_id);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_scheduled_at ON telegram_posts(scheduled_at);
