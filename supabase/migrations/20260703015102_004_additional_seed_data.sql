/*
# Additional Seed Data

This migration adds more products with variety:
- Products with discounts
- More categories populated
- Inventory tracking
- Higher sold counts for trending

## Tables Affected
- products: Adding 10 more products
- Updating existing products with discounts and sold counts
*/

-- Update existing products with sold counts and some with discounts
UPDATE products SET sold_count = 245 WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
UPDATE products SET sold_count = 189, discount_percent = 5 WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
UPDATE products SET sold_count = 156 WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
UPDATE products SET sold_count = 312, discount_percent = 10 WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
UPDATE products SET sold_count = 478 WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

-- Insert more products
INSERT INTO products (id, name, slug, description, short_description, warehouse_id, category_id, base_price, margin_percent, discount_percent, images, status, rating, review_count, sold_count, brand)
VALUES
  -- Electronics
  ('10101010-1010-1010-1010-101010101010', 'MacBook Pro 14" M3', 'macbook-pro-14-m3', 'Powerful laptop with M3 chip, stunning Liquid Retina XDR display.', 'Professional Apple laptop', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 145000, 15, 0, ARRAY['https://images.pexels.com/photos/18105242/pexels-photo-18105242.jpeg'], 'published', 4.9, 67, 89, 'Apple'),
  ('20202020-2020-2020-2020-202020202020', 'Dell XPS 15', 'dell-xps-15', 'Premium Windows laptop with OLED display.', 'Premium Windows ultrabook', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 98000, 15, 8, ARRAY['https://images.pexels.com/photos/7974210/pexels-photo-7974210.jpeg'], 'published', 4.6, 45, 123, 'Dell'),
  ('30303030-3030-3030-3030-303030303030', 'iPad Pro 12.9"', 'ipad-pro-12-9', 'The ultimate iPad experience with M2 chip.', 'Professional tablet', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 75000, 15, 0, ARRAY['https://images.pexels.com/photos/13345305/pexels-photo-13345305.jpeg'], 'published', 4.8, 34, 67, 'Apple'),
  
  -- Fashion
  ('40404040-4040-4040-4040-404040404040', 'Handwoven Ethiopian Shawl', 'handwoven-ethiopian-shawl', 'Traditional handwoven cotton shawl with colorful borders.', 'Traditional Ethiopian shawl', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 5500, 25, 0, ARRAY['https://images.pexels.com/photos/7289870/pexels-photo-7289870.jpeg'], 'published', 4.7, 78, 234, 'Habesha Fashion'),
  ('50505050-5050-5050-5050-505050505050', 'Leather Handbag', 'leather-handbag', 'Premium Ethiopian leather bag with elegant design.', 'Genuine leather bag', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 12000, 20, 15, ARRAY['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'], 'published', 4.5, 56, 189, 'Ethio Leather'),
  ('60606060-6060-6060-6060-606060606060', 'Men Designer Shirt', 'men-designer-shirt', 'Premium cotton shirt with modern fit.', 'Modern fit cotton shirt', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 4500, 18, 0, ARRAY['https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg'], 'published', 4.4, 23, 156, 'Fashion Hub'),
  
  -- Home & Living
  ('70707070-7070-7070-7070-707070707070', 'Ethiopian Coffee - Yirgacheffe', 'ethiopian-coffee-yirgacheffe', 'Premium single-origin Ethiopian coffee beans.', 'Premium Ethiopian coffee', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 1800, 30, 0, ARRAY['https://images.pexels.com/photos/1692045/pexels-photo-1692045.jpeg'], 'published', 4.9, 145, 567, 'Ethio Coffee'),
  ('80808080-8080-8080-8080-808080808080', 'Woven Bamboo Basket', 'woven-bamboo-basket', 'Handcrafted bamboo basket for storage.', 'Handwoven storage basket', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 2500, 25, 10, ARRAY['https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg'], 'published', 4.6, 34, 178, 'Ethio Crafts'),
  ('90909090-9090-9090-9090-909090909090', 'Modern Floor Lamp', 'modern-floor-lamp', 'Minimalist LED floor lamp with adjustable brightness.', 'Modern LED lamp', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 15000, 15, 0, ARRAY['https://images.pexels.com/photos/1112583/pexels-photo-1112583.jpeg'], 'published', 4.3, 19, 45, 'LightUp'),
  ('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0', 'Olive Wood Cutting Board', 'olive-wood-cutting-board', 'Handcrafted olive wood cutting board.', 'Natural wood cutting board', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 3800, 22, 0, ARRAY['https://images.pexels.com/photos/6968132/pexels-photo-6968132.jpeg'], 'published', 4.7, 28, 234, 'Ethio Crafts')
ON CONFLICT DO NOTHING;

-- Add Beauty category products
INSERT INTO products (id, name, slug, description, short_description, warehouse_id, category_id, base_price, margin_percent, discount_percent, images, status, rating, review_count, sold_count, brand)
VALUES
  ('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'Shea Butter Body Cream', 'shea-butter-body-cream', 'Natural shea butter moisturizer for smooth skin.', 'Natural body moisturizer', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 2500, 25, 0, ARRAY['https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'], 'published', 4.8, 67, 345, 'Natural Beauty'),
  ('c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 'Black Seed Oil', 'black-seed-oil', 'Pure Ethiopian black seed oil for health and beauty.', 'Pure black seed oil', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 1200, 30, 5, ARRAY['https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'], 'published', 4.9, 89, 456, 'Ethio Naturals')
ON CONFLICT DO NOTHING;

-- Add Sports category products
INSERT INTO products (id, name, slug, description, short_description, warehouse_id, category_id, base_price, margin_percent, discount_percent, images, status, rating, review_count, sold_count, brand)
VALUES
  ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'Running Shoes Pro', 'running-shoes-pro', 'Lightweight running shoes with memory foam.', 'Premium running shoes', '22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 8500, 15, 0, ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'], 'published', 4.6, 45, 234, 'SprintPro'),
  ('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', 'Yoga Mat Premium', 'yoga-mat-premium', 'Non-slip yoga mat with carrying strap.', 'Premium yoga mat', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 3200, 20, 0, ARRAY['https://images.pexels.com/photos/4662432/pexels-photo-4662432.jpeg'], 'published', 4.5, 34, 178, 'FitLife')
ON CONFLICT DO NOTHING;