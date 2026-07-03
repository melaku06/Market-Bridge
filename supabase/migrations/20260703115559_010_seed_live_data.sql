/*
# Seed Live Data for All Tables

1. Purpose
- Populate inventory, orders, order_items, reviews, notifications, addresses,
  wishlist_items, promotions, product_requests, margin_rules, and audit_logs
  with realistic data so every page has live data from the database.

2. Tables Populated
- inventory, orders, order_items, reviews, notifications, addresses,
  wishlist_items, promotions, product_requests, margin_rules, audit_logs
*/

-- INVENTORY
INSERT INTO inventory (id, warehouse_id, product_id, quantity, reserved_quantity, low_stock_threshold, status)
SELECT
  gen_random_uuid(),
  p.warehouse_id,
  p.id,
  CASE
    WHEN random() < 0.15 THEN 0
    WHEN random() < 0.35 THEN floor(random() * 8 + 1)::int
    ELSE floor(random() * 50 + 10)::int
  END,
  floor(random() * 5)::int,
  10,
  CASE
    WHEN random() < 0.15 THEN 'out_of_stock'
    WHEN random() < 0.35 THEN 'low_stock'
    ELSE 'in_stock'
  END
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM inventory i WHERE i.product_id = p.id);

-- ORDERS
INSERT INTO orders (id, order_number, customer_id, warehouse_id, customer_name, customer_email, customer_phone, subtotal, shipping_fee, discount, tax, total, status, payment_method, payment_status, shipping_address, shipping_city, shipping_method, tracking_number, created_at, updated_at)
VALUES
  ('ord-001', 'MB1001', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 95000, 500, 0, 0, 95500, 'delivered', 'Telebirr', 'paid', 'Bole, Atlas Area', 'Addis Ababa', 'Standard Shipping', 'ETB123456001', now() - interval '5 days', now() - interval '3 days'),
  ('ord-002', 'MB1002', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 15000, 0, 0, 0, 15000, 'shipped', 'CBE Birr', 'paid', 'Merkato Area', 'Addis Ababa', 'Standard Shipping', 'ETB123456789', now() - interval '2 days', now() - interval '1 day'),
  ('ord-003', 'MB1003', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 5500, 0, 0, 0, 5500, 'processing', 'M-PESA', 'paid', 'Piazza Area', 'Addis Ababa', 'Express Shipping', NULL, now() - interval '1 day', now()),
  ('ord-004', 'MB1004', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 28000, 0, 0, 0, 28000, 'pending', 'Cash on Delivery', 'cod', 'CMC Area', 'Addis Ababa', 'Standard Shipping', NULL, now() - interval '6 hours', now()),
  ('ord-005', 'MB1005', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 3200, 0, 0, 0, 3200, 'cancelled', 'Telebirr', 'refunded', 'Summit Area', 'Addis Ababa', 'Standard Shipping', NULL, now() - interval '4 days', now() - interval '3 days'),
  ('ord-006', 'MB1006', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Demo Customer', 'customer@demo.com', '+251 91 123 4567', 8900, 300, 0, 0, 9200, 'confirmed', 'CBE Birr', 'paid', 'Kazanchis Area', 'Addis Ababa', 'Express Shipping', NULL, now() - interval '12 hours', now())
ON CONFLICT DO NOTHING;

-- ORDER ITEMS
INSERT INTO order_items (id, order_id, product_id, product_name, product_image, quantity, unit_price, total_price, color, size)
VALUES
  (gen_random_uuid(), 'ord-001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Samsung Galaxy S24 Ultra', 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 95000, 95000, NULL, NULL),
  (gen_random_uuid(), 'ord-002', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ethiopian Traditional Dress', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 15000, 15000, 'White', 'M'),
  (gen_random_uuid(), 'ord-003', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Ethiopian Coffee Set - Jebena', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 5500, 5500, NULL, NULL),
  (gen_random_uuid(), 'ord-004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sony WH-1000XM5 Headphones', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 28000, 28000, 'Black', NULL),
  (gen_random_uuid(), 'ord-005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Ethiopian Traditional Dress', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 3200, 3200, 'Blue', 'L'),
  (gen_random_uuid(), 'ord-006', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Ethiopian Coffee Set - Jebena', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=200', 1, 8900, 8900, NULL, NULL)
ON CONFLICT DO NOTHING;

-- REVIEWS
INSERT INTO reviews (id, customer_id, product_id, customer_name, product_name, product_image, rating, comment, created_at)
VALUES
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Demo Customer', 'Samsung Galaxy S24 Ultra', 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 'Excellent phone! Camera quality is amazing and battery life is great.', now() - interval '3 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Demo Customer', 'Sony WH-1000XM5 Headphones', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200', 4, 'Great noise cancellation but a bit pricey. Overall satisfied.', now() - interval '2 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Demo Customer', 'Ethiopian Traditional Dress', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 'Beautiful dress, high quality fabric. Perfect for special occasions.', now() - interval '1 day'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Demo Customer', 'Ethiopian Coffee Set - Jebena', 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=200', 4, 'Authentic jebena, makes great coffee. Packaging was good.', now() - interval '6 hours'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Demo Customer', 'Apple iPhone 15 Pro Max', 'https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg?auto=compress&cs=tinysrgb&w=200', 5, 'Best phone I have ever owned. The camera is incredible!', now() - interval '4 hours')
ON CONFLICT DO NOTHING;

-- NOTIFICATIONS
INSERT INTO notifications (id, user_id, type, priority, title, message, action_url, is_read, created_at)
VALUES
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order', 'high', 'Order #MB1002 Shipped', 'Your order is on the way! Track your package with tracking number ETB123456789.', '/dashboard/orders/ord-002', false, now() - interval '1 day'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'promotion', 'medium', 'Flash Sale - 24 Hours Only!', 'Get up to 40% off on Electronics. Limited time offer!', '/categories/electronics', false, now() - interval '12 hours'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order', 'medium', 'Order #MB1001 Delivered', 'Your order has been delivered successfully. Leave a review to help others!', '/dashboard/orders/ord-001', true, now() - interval '3 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'order', 'high', 'Order #MB1004 Confirmed', 'Your order has been confirmed and is being prepared.', '/dashboard/orders/ord-004', false, now() - interval '5 hours'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'account', 'low', 'Profile Updated', 'Your profile information has been updated successfully.', '/dashboard/profile', true, now() - interval '2 days'),
  (gen_random_uuid(), '03f5ae93-0750-419d-b1b9-17c03c208ced', 'order', 'high', 'New Order Received', 'You have received a new order #MB1003 for Ethiopian Coffee Set.', '/warehouse/orders', false, now() - interval '1 day'),
  (gen_random_uuid(), '03f5ae93-0750-419d-b1b9-17c03c208ced', 'inventory', 'medium', 'Low Stock Alert', 'Ethiopian Coffee Set - Jebena is running low on stock (3 remaining).', '/warehouse/inventory', false, now() - interval '6 hours'),
  (gen_random_uuid(), '03f5ae93-0750-419d-b1b9-17c03c208ced', 'system', 'low', 'Weekly Report Available', 'Your weekly sales report is ready to view.', '/warehouse/analytics', true, now() - interval '2 days')
ON CONFLICT DO NOTHING;

-- ADDRESSES
INSERT INTO addresses (id, customer_id, label, recipient_name, phone, address, city, country, is_default)
VALUES
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Home', 'Demo Customer', '+251 91 123 4567', 'Bole, Atlas Area, HNo 123', 'Addis Ababa', 'Ethiopia', true),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Office', 'Demo Customer', '+251 91 234 5678', 'Merkato, Building 45, 2nd Floor', 'Addis Ababa', 'Ethiopia', false)
ON CONFLICT DO NOTHING;

-- WISHLIST ITEMS
INSERT INTO wishlist_items (id, customer_id, product_id, created_at)
VALUES
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now() - interval '5 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', now() - interval '3 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', now() - interval '1 day')
ON CONFLICT DO NOTHING;

-- PROMOTIONS
INSERT INTO promotions (id, title, type, image_url, target_url, target_audience, status, start_date, end_date, impressions, clicks)
VALUES
  (gen_random_uuid(), 'Summer Electronics Sale', 'flash_deal', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600', '/categories/electronics', 'all', 'active', now() - interval '2 days', now() + interval '5 days', 1542, 89),
  (gen_random_uuid(), 'Ethiopian New Year Fashion', 'promotion', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600', '/categories/fashion', 'customers', 'active', now() - interval '1 day', now() + interval '10 days', 876, 45),
  (gen_random_uuid(), 'Home Essentials Discount', 'banner', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', '/categories/home-living', 'all', 'active', now(), now() + interval '7 days', 432, 23)
ON CONFLICT DO NOTHING;

-- PRODUCT REQUESTS
INSERT INTO product_requests (id, customer_id, customer_email, product_name, category, description, brand, status, created_at)
VALUES
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'customer@demo.com', 'Nike Air Max 270', 'Fashion', 'Looking for Nike Air Max 270 in size 42, black color.', 'Nike', 'pending', now() - interval '3 days'),
  (gen_random_uuid(), 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'customer@demo.com', 'MacBook Pro M3', 'Electronics', 'Need MacBook Pro M3 14-inch with 16GB RAM.', 'Apple', 'in_review', now() - interval '1 day')
ON CONFLICT DO NOTHING;

-- MARGIN RULES
INSERT INTO margin_rules (id, category_name, warehouse_margin, platform_margin, total_margin, is_active)
VALUES
  (gen_random_uuid(), 'Electronics', 12.00, 8.00, 20.00, true),
  (gen_random_uuid(), 'Fashion', 15.00, 10.00, 25.00, true),
  (gen_random_uuid(), 'Home & Living', 14.00, 9.00, 23.00, true)
ON CONFLICT DO NOTHING;

-- AUDIT LOGS
INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, created_at)
VALUES
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin', 'approve_product', 'product', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now() - interval '5 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin', 'update_warehouse_status', 'warehouse', '11111111-1111-1111-1111-111111111111', now() - interval '3 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin', 'create_promotion', 'promotion', gen_random_uuid()::text, now() - interval '2 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin', 'update_margin', 'margin_rule', gen_random_uuid()::text, now() - interval '1 day'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin', 'reject_product', 'product', gen_random_uuid()::text, now() - interval '6 hours')
ON CONFLICT DO NOTHING;
