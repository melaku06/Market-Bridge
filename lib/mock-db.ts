/**
 * Mock Database
 * In-memory store that mirrors a real relational database.
 * Swap this out for Supabase by updating lib/db.ts adapter.
 * All IDs use string UUIDs for Supabase compatibility.
 */

// ─── Types ─────────────────────────────────────────────────────────────
export type Role = 'customer' | 'warehouse' | 'admin';
export type ProductStatus = 'draft' | 'pending' | 'approved' | 'published' | 'archived' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type WarehouseStatus = 'pending_approval' | 'active' | 'suspended' | 'deactivated';
export type RequestStatus = 'pending' | 'in_review' | 'found' | 'not_available';
export type PostStatus = 'queued' | 'sent' | 'failed' | 'retrying';
export type BannerStatus = 'active' | 'inactive' | 'paused';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: Role;
  status: 'active' | 'suspended' | 'banned';
  avatar?: string;
  created_at: string;
  last_login: string;
}

export interface Warehouse {
  id: string;
  user_id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  business_type: string;
  status: WarehouseStatus;
  rating: number;
  total_products: number;
  total_orders: number;
  total_sales: number;
  performance_score: number;
  member_since: string;
  avatar?: string;
  bank_name?: string;
  bank_account?: string;
  tax_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon: string;
  parent_id?: string;
  status: 'active' | 'inactive';
  product_count: number;
  sub_category_count: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  warehouse_id: string;
  category_id: string;
  category_name: string;
  base_price: number;
  margin_percent: number;
  final_price: number;
  discount_percent: number;
  original_price: number;
  images: string[];
  rating: number;
  review_count: number;
  sold_count: number;
  status: ProductStatus;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: string;
  colors: string[];
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  product_name: string;
  warehouse_id: string;
  sku: string;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  last_updated: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  warehouse_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'refunded' | 'cod';
  shipping_address: string;
  shipping_city: string;
  shipping_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
  icon: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  product_image: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string;
  created_at: string;
}

export interface ProductRequest {
  id: string;
  customer_id: string;
  customer_email: string;
  product_name: string;
  category?: string;
  description: string;
  brand?: string;
  image_url?: string;
  status: RequestStatus;
  admin_notes?: string;
  created_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  type: 'banner' | 'promotion' | 'flash_deal' | 'coupon';
  image?: string;
  target_url?: string;
  location?: string;
  target_audience: string;
  status: BannerStatus;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  created_at: string;
}

export interface MarginRule {
  id: string;
  category_id?: string;
  category_name: string;
  product_id?: string;
  warehouse_margin: number;
  platform_margin: number;
  total_margin: number;
  status: 'active' | 'inactive';
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: Role;
  action: string;
  entity_type: string;
  entity_id: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface TelegramPost {
  id: string;
  product_id: string;
  product_name: string;
  channel: string;
  message: string;
  status: PostStatus;
  sent_at?: string;
  error?: string;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface SystemSettings {
  site_name: string;
  site_tagline: string;
  site_email: string;
  site_phone: string;
  currency: string;
  timezone: string;
  date_format: string;
  time_format: string;
  items_per_page: number;
  maintenance_mode: boolean;
  site_language: string;
  site_status: 'active' | 'maintenance';
}

// ─── Mock Data Store ────────────────────────────────────────────────────

export const db = {
  users: [
    { id: 'usr-001', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '+1 (555) 123-4567', password_hash: '$2b$10$hash', role: 'customer' as Role, status: 'active' as const, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', created_at: '2024-01-15T10:00:00Z', last_login: '2024-05-20T14:00:00Z' },
    { id: 'usr-002', name: 'Michael Brown', email: 'michael.brown@elitewarehouse.com', phone: '+1 (555) 234-5678', password_hash: '$2b$10$hash', role: 'warehouse' as Role, status: 'active' as const, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', created_at: '2023-03-15T10:00:00Z', last_login: '2024-05-18T09:00:00Z' },
    { id: 'usr-003', name: 'Admin User', email: 'admin@marketbridge.com', phone: '+1 (555) 000-0001', password_hash: '$2b$10$hash', role: 'admin' as Role, status: 'active' as const, created_at: '2023-01-01T10:00:00Z', last_login: '2024-05-20T10:00:00Z' },
    { id: 'usr-004', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1 (555) 345-6789', password_hash: '$2b$10$hash', role: 'customer' as Role, status: 'active' as const, created_at: '2024-02-10T10:00:00Z', last_login: '2024-05-15T11:00:00Z' },
    { id: 'usr-005', name: 'David Wilson', email: 'david.wilson@email.com', phone: '+1 (555) 456-7890', password_hash: '$2b$10$hash', role: 'customer' as Role, status: 'active' as const, created_at: '2024-03-05T10:00:00Z', last_login: '2024-05-14T16:00:00Z' },
    { id: 'usr-006', name: 'Jessica Taylor', email: 'jessica.taylor@email.com', phone: '+1 (555) 567-8901', password_hash: '$2b$10$hash', role: 'customer' as Role, status: 'active' as const, created_at: '2024-01-20T10:00:00Z', last_login: '2024-05-12T10:00:00Z' },
    { id: 'usr-007', name: 'Daniel Lee', email: 'daniel.lee@email.com', phone: '+1 (555) 678-9012', password_hash: '$2b$10$hash', role: 'customer' as Role, status: 'blocked' as const, created_at: '2024-02-28T10:00:00Z', last_login: '2024-05-10T08:00:00Z' },
  ] as User[],

  warehouses: [
    { id: 'wh-001', user_id: 'usr-002', name: 'Elite Warehouse', owner_name: 'John Doe', email: 'john.doe@elitewarehouse.com', phone: '+251 91 123 4567', address: 'Bole Sub-City, Woreda 03', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Electronics & Accessories', status: 'active' as WarehouseStatus, rating: 4.8, total_products: 156, total_orders: 3245, total_sales: 14261629, performance_score: 96, member_since: '2023-03-15', bank_name: 'Commercial Bank of Ethiopia', bank_account: '•••• •••• •••• 7890', tax_id: 'TIN-98-7654321' },
    { id: 'wh-002', user_id: 'usr-008', name: 'TechHub Warehouse', owner_name: 'Michael Brown', email: 'michael@techhub.com', phone: '+251 91 234 5678', address: 'Kirkos Sub-City, Woreda 08', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Consumer Electronics', status: 'active' as WarehouseStatus, rating: 4.6, total_products: 98, total_orders: 1876, total_sales: 7804492, performance_score: 91, member_since: '2023-04-10' },
    { id: 'wh-003', user_id: 'usr-009', name: 'Fashion Hub', owner_name: 'Emily Davis', email: 'emily@fashionhub.com', phone: '+251 91 345 6789', address: 'Gulele Sub-City, Woreda 05', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Fashion & Apparel', status: 'active' as WarehouseStatus, rating: 4.4, total_products: 72, total_orders: 987, total_sales: 3293282, performance_score: 88, member_since: '2023-05-05' },
    { id: 'wh-004', user_id: 'usr-010', name: 'Gadget Store', owner_name: 'David Wilson', email: 'david@gadgetstore.com', phone: '+251 91 456 7890', address: 'Yeka Sub-City, Woreda 12', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Consumer Electronics', status: 'suspended' as WarehouseStatus, rating: 3.9, total_products: 64, total_orders: 543, total_sales: 1882100, performance_score: 72, member_since: '2023-06-12' },
    { id: 'wh-005', user_id: 'usr-011', name: 'Home Essentials', owner_name: 'Sarah Johnson', email: 'sarah@homeessentials.com', phone: '+251 91 567 8901', address: 'Lideta Sub-City, Woreda 04', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Home & Living', status: 'active' as WarehouseStatus, rating: 4.3, total_products: 48, total_orders: 765, total_sales: 2504215, performance_score: 85, member_since: '2023-06-20' },
    { id: 'wh-006', user_id: 'usr-012', name: 'Style House', owner_name: 'Jessica Taylor', email: 'jessica@stylehouse.com', phone: '+251 91 678 9012', address: 'Arada Sub-City, Woreda 06', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Fashion & Accessories', status: 'pending_approval' as WarehouseStatus, rating: 4.5, total_products: 55, total_orders: 432, total_sales: 1676217, performance_score: 82, member_since: '2023-07-01' },
    { id: 'wh-007', user_id: 'usr-013', name: 'Sound World', owner_name: 'Daniel Lee', email: 'daniel@soundworld.com', phone: '+251 91 789 0123', address: 'Nifas Silk-Lafto, Woreda 02', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Audio Equipment', status: 'active' as WarehouseStatus, rating: 4.7, total_products: 36, total_orders: 654, total_sales: 3937626, performance_score: 93, member_since: '2023-07-10' },
    { id: 'wh-008', user_id: 'usr-014', name: 'Beauty Zone', owner_name: 'Olivia Martinez', email: 'olivia@beautyzone.com', phone: '+251 91 890 1234', address: 'Kolfe Keranio, Woreda 07', city: 'Addis Ababa', country: 'Ethiopia', business_type: 'Beauty & Personal Care', status: 'suspended' as WarehouseStatus, rating: 4.1, total_products: 41, total_orders: 389, total_sales: 1128146, performance_score: 75, member_since: '2023-07-15' },
  ] as Warehouse[],

  categories: [
    { id: 'cat-001', name: 'Electronics', slug: 'electronics', description: 'Latest electronic gadgets and devices', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', icon: '💻', status: 'active' as const, product_count: 856, sub_category_count: 12, created_at: '2023-01-01T00:00:00Z' },
    { id: 'cat-002', name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes and accessories', image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg', icon: '👗', status: 'active' as const, product_count: 732, sub_category_count: 15, created_at: '2023-01-01T00:00:00Z' },
    { id: 'cat-003', name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg', icon: '💄', status: 'active' as const, product_count: 245, sub_category_count: 8, created_at: '2023-01-01T00:00:00Z' },
    { id: 'cat-004', name: 'Home & Living', slug: 'home-living', description: 'Home decor and furniture', image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg', icon: '🏠', status: 'active' as const, product_count: 312, sub_category_count: 10, created_at: '2023-01-01T00:00:00Z' },
    { id: 'cat-005', name: 'Sports & Outdoors', slug: 'sports', description: 'Sports equipment and outdoor gear', image: 'https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg', icon: '⚽', status: 'active' as const, product_count: 186, sub_category_count: 7, created_at: '2023-01-01T00:00:00Z' },
    { id: 'cat-006', name: 'Toys & Games', slug: 'toys-baby', description: 'Toys and games for all ages', image: '', icon: '🧸', status: 'active' as const, product_count: 127, sub_category_count: 6, created_at: '2023-01-01T00:00:00Z' },
  ] as Category[],

  products: [
    { id: 'prod-001', name: 'Wireless Headphones Premium Sound', slug: 'wireless-headphones-premium', description: 'High quality sound with noise cancellation, long battery life and comfortable design.', short_description: 'Premium noise-cancelling wireless headphones', warehouse_id: 'wh-001', category_id: 'cat-001', category_name: 'Electronics', base_price: 2900, margin_percent: 18.0, final_price: 3500, discount_percent: 25, original_price: 4600, images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, review_count: 128, sold_count: 1245, status: 'published' as ProductStatus, tags: ['wireless', 'bluetooth', 'headphones', 'audio'], brand: 'Sony', sku: 'WH-10001-BLK', weight: '250g', colors: ['Black', 'White', 'Navy'], created_at: '2024-01-10T00:00:00Z', updated_at: '2024-05-18T00:00:00Z' },
    { id: 'prod-002', name: 'Smart Watch Series 8', slug: 'smart-watch-series-8', description: 'Advanced smartwatch with health monitoring, GPS, and 48-hour battery life.', short_description: 'Feature-rich smartwatch with health tracking', warehouse_id: 'wh-002', category_id: 'cat-001', category_name: 'Electronics', base_price: 4350, margin_percent: 16.7, final_price: 5200, discount_percent: 0, original_price: 5200, images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, review_count: 198, sold_count: 987, status: 'published' as ProductStatus, tags: ['smartwatch', 'health', 'GPS'], brand: 'TechBand', sku: 'WH-10001-002', weight: '45g', colors: ['Black', 'Silver', 'Gold'], created_at: '2024-01-15T00:00:00Z', updated_at: '2024-05-18T00:00:00Z' },
    { id: 'prod-003', name: "Men's Casual Shoes", slug: 'mens-casual-shoes', description: 'Comfortable and stylish casual shoes perfect for everyday wear.', short_description: 'Comfortable everyday casual shoes', warehouse_id: 'wh-003', category_id: 'cat-002', category_name: 'Fashion', base_price: 2450, margin_percent: 16.0, final_price: 2900, discount_percent: 0, original_price: 2900, images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, review_count: 76, sold_count: 654, status: 'published' as ProductStatus, tags: ['shoes', 'casual', 'men'], brand: 'UrbanStep', sku: 'WH-10001-003', weight: '0.6kg', colors: ['Black', 'White', 'Brown'], created_at: '2024-02-01T00:00:00Z', updated_at: '2024-05-17T00:00:00Z' },
    { id: 'prod-004', name: "Women's Handbag", slug: 'womens-handbag', description: 'Elegant leather handbag with multiple pockets and adjustable strap.', short_description: 'Premium leather handbag', warehouse_id: 'wh-003', category_id: 'cat-002', category_name: 'Fashion', base_price: 1700, margin_percent: 17.0, final_price: 2050, discount_percent: 0, original_price: 2050, images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.2, review_count: 97, sold_count: 543, status: 'published' as ProductStatus, tags: ['handbag', 'women', 'leather'], brand: 'LuxStyle', sku: 'WH-10001-004', weight: '0.4kg', colors: ['Brown', 'Black'], created_at: '2024-02-05T00:00:00Z', updated_at: '2024-05-17T00:00:00Z' },
    { id: 'prod-005', name: 'Portable Speaker', slug: 'portable-bluetooth-speaker', description: '360-degree sound with 12-hour battery life and waterproof design.', short_description: '360° waterproof Bluetooth speaker', warehouse_id: 'wh-001', category_id: 'cat-001', category_name: 'Electronics', base_price: 1450, margin_percent: 16.7, final_price: 1750, discount_percent: 0, original_price: 1750, images: ['https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, review_count: 84, sold_count: 432, status: 'published' as ProductStatus, tags: ['speaker', 'bluetooth', 'portable'], brand: 'SoundWave', sku: 'WH-10021-005', weight: '0.32kg', colors: ['Black', 'Blue', 'Red'], created_at: '2024-02-10T00:00:00Z', updated_at: '2024-05-17T00:00:00Z' },
    { id: 'prod-006', name: 'Sunglasses UV400', slug: 'sunglasses-uv400', description: 'Polarized sunglasses with UV400 protection and lightweight frame.', short_description: 'UV400 polarized sunglasses', warehouse_id: 'wh-003', category_id: 'cat-002', category_name: 'Fashion', base_price: 950, margin_percent: 18.7, final_price: 1150, discount_percent: 0, original_price: 1150, images: ['https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, review_count: 45, sold_count: 398, status: 'published' as ProductStatus, tags: ['sunglasses', 'UV400', 'polarized'], brand: 'SunStyle', sku: 'WH-10021-006', weight: '0.08kg', colors: ['Black', 'Brown', 'Gold'], created_at: '2024-02-15T00:00:00Z', updated_at: '2024-05-18T00:00:00Z' },
    { id: 'prod-007', name: 'Perfume Bottle', slug: 'perfume-bottle', description: 'Long-lasting floral fragrance with elegant bottle design.', short_description: 'Long-lasting floral fragrance', warehouse_id: 'wh-008', category_id: 'cat-003', category_name: 'Beauty', base_price: 1200, margin_percent: 20.0, final_price: 1450, discount_percent: 0, original_price: 1450, images: ['https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, review_count: 93, sold_count: 287, status: 'published' as ProductStatus, tags: ['perfume', 'fragrance', 'beauty'], brand: 'Essence', sku: 'WH-10021-007', weight: '0.15kg', colors: [], created_at: '2024-02-20T00:00:00Z', updated_at: '2024-05-18T00:00:00Z' },
    { id: 'prod-008', name: 'Gaming Mouse', slug: 'gaming-mouse', description: 'High precision gaming mouse with RGB lighting and 7 programmable buttons.', short_description: 'High precision RGB gaming mouse', warehouse_id: 'wh-002', category_id: 'cat-001', category_name: 'Electronics', base_price: 1350, margin_percent: 17.4, final_price: 1620, discount_percent: 0, original_price: 1620, images: ['https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, review_count: 66, sold_count: 432, status: 'published' as ProductStatus, tags: ['gaming', 'mouse', 'RGB'], brand: 'GameTech', sku: 'WH-10021-008', weight: '0.15kg', colors: ['Black'], created_at: '2024-03-01T00:00:00Z', updated_at: '2024-05-16T00:00:00Z' },
    // Pending approval products
    { id: 'prod-009', name: 'Bluetooth Earbuds Pro', slug: 'bluetooth-earbuds-pro', description: 'True wireless earbuds with ANC and 24-hour battery case.', short_description: 'ANC true wireless earbuds', warehouse_id: 'wh-001', category_id: 'cat-001', category_name: 'Electronics', base_price: 1200, margin_percent: 20.0, final_price: 1450, discount_percent: 28, original_price: 2050, images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 0, review_count: 0, sold_count: 0, status: 'pending' as ProductStatus, tags: ['earbuds', 'wireless', 'ANC'], brand: 'SoundPro', sku: 'WH-10021-009', weight: '0.05kg', colors: ['Black', 'White'], created_at: '2024-05-16T00:00:00Z', updated_at: '2024-05-16T00:00:00Z' },
    { id: 'prod-010', name: 'Fitness Watch Pro', slug: 'fitness-watch-pro', description: 'Advanced fitness tracker with heart rate, GPS, and sleep monitoring.', short_description: 'Full-featured fitness tracker', warehouse_id: 'wh-002', category_id: 'cat-001', category_name: 'Electronics', base_price: 3400, margin_percent: 20.7, final_price: 4100, discount_percent: 22, original_price: 5200, images: ['https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 0, review_count: 0, sold_count: 0, status: 'pending' as ProductStatus, tags: ['fitness', 'watch', 'health'], brand: 'FitPro', sku: 'WH-10021-010', weight: '0.04kg', colors: ['Black', 'Blue', 'Pink'], created_at: '2024-05-17T00:00:00Z', updated_at: '2024-05-17T00:00:00Z' },
    { id: 'prod-011', name: 'Backpack Travel Bag', slug: 'backpack-travel-bag', description: 'Durable travel backpack with multiple compartments and laptop sleeve.', short_description: '40L travel backpack with laptop sleeve', warehouse_id: 'wh-005', category_id: 'cat-002', category_name: 'Fashion', base_price: 1950, margin_percent: 17.3, final_price: 2350, discount_percent: 0, original_price: 2350, images: ['https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 0, review_count: 0, sold_count: 0, status: 'pending' as ProductStatus, tags: ['backpack', 'travel', 'laptop'], brand: 'TravelPro', sku: 'WH-10021-011', weight: '0.8kg', colors: ['Black', 'Navy', 'Gray'], created_at: '2024-05-16T00:00:00Z', updated_at: '2024-05-16T00:00:00Z' },
    { id: 'prod-012', name: 'LED Desk Lamp', slug: 'led-desk-lamp', description: 'Adjustable LED desk lamp with touch dimmer and USB charging port.', short_description: 'Adjustable LED desk lamp with USB', warehouse_id: 'wh-005', category_id: 'cat-004', category_name: 'Home & Living', base_price: 1100, margin_percent: 17.3, final_price: 1350, discount_percent: 0, original_price: 1350, images: ['https://images.pexels.com/photos/1124982/pexels-photo-1124982.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, review_count: 52, sold_count: 189, status: 'published' as ProductStatus, tags: ['lamp', 'LED', 'desk'], brand: 'LightPro', sku: 'WH-10021-012', weight: '0.9kg', colors: ['White', 'Black'], created_at: '2024-03-10T00:00:00Z', updated_at: '2024-05-15T00:00:00Z' },
  ] as Product[],

  inventory: [
    { id: 'inv-001', product_id: 'prod-001', product_name: 'Wireless Headphones Premium Sound', warehouse_id: 'wh-001', sku: 'WH-10001-BLK', total_stock: 50, reserved_stock: 5, available_stock: 45, low_stock_threshold: 10, status: 'in_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-002', product_id: 'prod-002', product_name: 'Smart Watch Series 8', warehouse_id: 'wh-002', sku: 'WH-10001-002', total_stock: 35, reserved_stock: 5, available_stock: 30, low_stock_threshold: 10, status: 'in_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-003', product_id: 'prod-003', product_name: "Men's Casual Shoes", warehouse_id: 'wh-001', sku: 'WH-10001-003', total_stock: 0, reserved_stock: 0, available_stock: 0, low_stock_threshold: 10, status: 'out_of_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-004', product_id: 'prod-004', product_name: "Women's Handbag", warehouse_id: 'wh-001', sku: 'WH-10001-004', total_stock: 20, reserved_stock: 5, available_stock: 15, low_stock_threshold: 10, status: 'in_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-005', product_id: 'prod-005', product_name: 'Portable Speaker', warehouse_id: 'wh-001', sku: 'WH-10021-005', total_stock: 12, reserved_stock: 4, available_stock: 8, low_stock_threshold: 10, status: 'low_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-006', product_id: 'prod-006', product_name: 'Sunglasses UV400', warehouse_id: 'wh-001', sku: 'WH-10021-006', total_stock: 30, reserved_stock: 5, available_stock: 25, low_stock_threshold: 10, status: 'in_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-007', product_id: 'prod-007', product_name: 'Perfume Bottle', warehouse_id: 'wh-001', sku: 'WH-10021-007', total_stock: 0, reserved_stock: 0, available_stock: 0, low_stock_threshold: 10, status: 'out_of_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
    { id: 'inv-008', product_id: 'prod-008', product_name: 'Gaming Mouse', warehouse_id: 'wh-001', sku: 'WH-10021-008', total_stock: 40, reserved_stock: 7, available_stock: 33, low_stock_threshold: 10, status: 'in_stock' as const, last_updated: '2024-05-18T10:00:00Z' },
  ] as Inventory[],

  orders: [
    { id: 'MB1256', customer_id: 'usr-001', customer_name: 'Sarah Johnson', customer_email: 'sarah.johnson@email.com', customer_phone: '+251 91 123 4567', warehouse_id: 'wh-001', items: [{ product_id: 'prod-001', name: 'Wireless Headphones', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100', price: 3500, qty: 1 }, { product_id: 'prod-008', name: 'Gaming Mouse', image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=100', price: 1620, qty: 1 }], subtotal: 5120, shipping_fee: 580, discount: 0, tax: 0, total: 5700, status: 'delivered' as OrderStatus, payment_method: 'Telebirr', payment_status: 'paid' as const, shipping_address: 'Bole, Atlas Area', shipping_city: 'Addis Ababa', shipping_method: 'Standard Shipping', tracking_number: 'ETB123456001', created_at: '2024-05-20T10:24:00Z', updated_at: '2024-05-20T14:15:00Z' },
    { id: 'MB1255', customer_id: 'usr-002', customer_name: 'Michael Brown', customer_email: 'michael.brown@email.com', customer_phone: '+251 91 234 5678', warehouse_id: 'wh-001', items: [{ product_id: 'prod-003', name: "Men's Casual Shoes", image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100', price: 2900, qty: 1, color: 'Black', size: '42' }, { product_id: 'prod-004', name: "Women's Handbag", image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100', price: 2050, qty: 1, color: 'Brown' }], subtotal: 4950, shipping_fee: 0, discount: 0, tax: 0, total: 4950, status: 'shipped' as OrderStatus, payment_method: 'CBE Birr', payment_status: 'paid' as const, shipping_address: 'Merkato Area', shipping_city: 'Addis Ababa', shipping_method: 'Standard Shipping', tracking_number: 'ETB123456789', notes: 'Please handle with care. Gift packaging requested.', created_at: '2024-05-18T10:34:00Z', updated_at: '2024-05-19T09:30:00Z' },
    { id: 'MB1254', customer_id: 'usr-004', customer_name: 'Emily Davis', customer_email: 'emily.davis@email.com', warehouse_id: 'wh-002', items: [{ product_id: 'prod-011', name: 'Backpack Travel Bag', image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=100', price: 2350, qty: 1 }], subtotal: 2350, shipping_fee: 0, discount: 0, tax: 0, total: 2350, status: 'processing' as OrderStatus, payment_method: 'M-PESA', payment_status: 'paid' as const, shipping_address: 'Piazza Area', shipping_city: 'Addis Ababa', shipping_method: 'Express Shipping', created_at: '2024-05-17T09:00:00Z', updated_at: '2024-05-17T11:00:00Z' },
    { id: 'MB1253', customer_id: 'usr-005', customer_name: 'David Wilson', customer_email: 'david.wilson@email.com', warehouse_id: 'wh-001', items: [{ product_id: 'prod-002', name: 'Smart Watch Series 8', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100', price: 5200, qty: 1 }, { product_id: 'prod-005', name: 'Portable Speaker', image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=100', price: 1750, qty: 1 }], subtotal: 6950, shipping_fee: 0, discount: 0, tax: 0, total: 6950, status: 'delivered' as OrderStatus, payment_method: 'Cash on Delivery', payment_status: 'cod' as const, shipping_address: 'CMC Area', shipping_city: 'Addis Ababa', shipping_method: 'Standard Shipping', created_at: '2024-05-16T08:00:00Z', updated_at: '2024-05-17T14:00:00Z' },
    { id: 'MB1252', customer_id: 'usr-006', customer_name: 'Jessica Taylor', customer_email: 'jessica.taylor@email.com', warehouse_id: 'wh-001', items: [{ product_id: 'prod-009', name: 'Bluetooth Earbuds', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=100', price: 1450, qty: 1 }], subtotal: 1450, shipping_fee: 0, discount: 0, tax: 0, total: 1450, status: 'cancelled' as OrderStatus, payment_method: 'Telebirr', payment_status: 'refunded' as const, shipping_address: 'Summit Area', shipping_city: 'Addis Ababa', shipping_method: 'Standard Shipping', created_at: '2024-05-15T10:00:00Z', updated_at: '2024-05-15T12:00:00Z' },
    { id: 'MB1251', customer_id: 'usr-007', customer_name: 'Daniel Lee', customer_email: 'daniel.lee@email.com', warehouse_id: 'wh-001', items: [{ product_id: 'prod-001', name: 'Wireless Headphones', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100', price: 3500, qty: 1 }, { product_id: 'prod-006', name: 'Sunglasses UV400', image: 'https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&w=100', price: 1150, qty: 1 }], subtotal: 4650, shipping_fee: 0, discount: 0, tax: 0, total: 4650, status: 'delivered' as OrderStatus, payment_method: 'CBE Birr', payment_status: 'paid' as const, shipping_address: 'Kazanchis Area', shipping_city: 'Addis Ababa', shipping_method: 'Express Shipping', created_at: '2024-05-14T08:00:00Z', updated_at: '2024-05-15T16:00:00Z' },
    { id: 'MB1250', customer_id: 'usr-008', customer_name: 'Olivia Martinez', customer_email: 'olivia.martinez@email.com', warehouse_id: 'wh-003', items: [{ product_id: 'prod-004', name: "Women's Handbag", image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100', price: 2050, qty: 1 }], subtotal: 2050, shipping_fee: 0, discount: 0, tax: 0, total: 2050, status: 'cancelled' as OrderStatus, payment_method: 'M-PESA', payment_status: 'refunded' as const, shipping_address: 'Sar Bet Area', shipping_city: 'Addis Ababa', shipping_method: 'Standard Shipping', created_at: '2024-05-12T10:00:00Z', updated_at: '2024-05-12T11:00:00Z' },
  ] as Order[],

  notifications: [
    // Customer (usr-001) notifications
    { id: 'notif-001', user_id: 'usr-001', title: 'Order #MB1255 Shipped', message: 'Your order is on the way! Track your package with tracking number FSR123456789.', type: 'order' as const, icon: 'truck', priority: 'high' as const, read: false, action_url: '/dashboard/orders/MB1255', created_at: '2024-05-19T09:30:00Z' },
    { id: 'notif-002', user_id: 'usr-001', title: 'Flash Sale - 24 Hours Only!', message: 'Get up to 40% off on Electronics. Limited time offer!', type: 'promotion' as const, icon: 'tag', priority: 'medium' as const, read: false, action_url: '/categories/electronics', created_at: '2024-05-18T12:00:00Z' },
    { id: 'notif-003', user_id: 'usr-001', title: 'Order #MB1253 Delivered', message: 'Your order has been delivered successfully. Leave a review to help others!', type: 'order' as const, icon: 'check-circle', priority: 'medium' as const, read: true, action_url: '/dashboard/orders/MB1253', created_at: '2024-05-17T14:00:00Z' },
    { id: 'notif-004', user_id: 'usr-001', title: 'Product Request Found', message: 'Great news! Nike Air Max 270 you requested is now available.', type: 'product' as const, icon: 'package', priority: 'high' as const, read: true, action_url: '/products?search=nike+air+max', created_at: '2024-05-16T10:00:00Z' },
    { id: 'notif-005', user_id: 'usr-001', title: 'Order #MB1251 Confirmed', message: 'Your order has been confirmed and is being prepared.', type: 'order' as const, icon: 'check-circle', priority: 'high' as const, read: true, action_url: '/dashboard/orders/MB1251', created_at: '2024-05-14T08:30:00Z' },

    // Warehouse owner (usr-002) notifications
    { id: 'notif-006', user_id: 'usr-002', title: 'New Order #MB1256 Received', message: 'Sarah Johnson placed an order for 2 items. Total: 5,700 Br', type: 'order' as const, icon: 'package', priority: 'high' as const, read: false, action_url: '/warehouse/orders/MB1256', created_at: '2024-05-20T10:24:00Z' },
    { id: 'notif-007', user_id: 'usr-002', title: 'Low Stock Alert: Portable Speaker', message: 'Only 8 units left. Reorder soon to avoid stockouts.', type: 'inventory' as const, icon: 'alert-triangle', priority: 'high' as const, read: false, action_url: '/warehouse/inventory', created_at: '2024-05-20T08:15:00Z' },
    { id: 'notif-008', user_id: 'usr-002', title: 'Product Approved: Bluetooth Earbuds Pro', message: 'Your product has been approved and is now live on the marketplace.', type: 'product' as const, icon: 'check-circle', priority: 'medium' as const, read: true, action_url: '/warehouse/products', created_at: '2024-05-18T14:00:00Z' },
    { id: 'notif-009', user_id: 'usr-002', title: 'Order #MB1254 Processing Complete', message: 'Order is ready for shipping. Print shipping label now.', type: 'order' as const, icon: 'truck', priority: 'high' as const, read: true, action_url: '/warehouse/orders/MB1254', created_at: '2024-05-17T11:00:00Z' },
    { id: 'notif-010', user_id: 'usr-002', title: 'Out of Stock: Men\'s Casual Shoes', message: 'This product is now out of stock. Update inventory immediately.', type: 'inventory' as const, icon: 'alert-triangle', priority: 'high' as const, read: true, action_url: '/warehouse/inventory', created_at: '2024-05-16T09:00:00Z' },
    { id: 'notif-011', user_id: 'usr-002', title: 'New Order #MB1255 Received', message: 'Michael Brown placed an order for 2 items. Total: 4,950 Br', type: 'order' as const, icon: 'package', priority: 'high' as const, read: true, action_url: '/warehouse/orders/MB1255', created_at: '2024-05-18T10:34:00Z' },

    // Admin (usr-003) notifications
    { id: 'notif-012', user_id: 'usr-003', title: 'New Product Pending Approval', message: 'Bluetooth Earbuds Pro from Elite Warehouse awaits your review.', type: 'product' as const, icon: 'package', priority: 'high' as const, read: false, action_url: '/admin/products', created_at: '2024-05-20T10:00:00Z' },
    { id: 'notif-013', user_id: 'usr-003', title: 'New Product Pending Approval', message: 'Fitness Watch Pro from TechHub Warehouse awaiting review.', type: 'product' as const, icon: 'package', priority: 'high' as const, read: false, action_url: '/admin/products', created_at: '2024-05-19T14:00:00Z' },
    { id: 'notif-014', user_id: 'usr-003', title: 'New Warehouse Registration', message: 'Style House has applied to join MarketBridge. Review their application.', type: 'system' as const, icon: 'warehouse', priority: 'high' as const, read: true, action_url: '/admin/warehouses', created_at: '2024-05-18T16:00:00Z' },
    { id: 'notif-015', user_id: 'usr-003', title: 'Weekly Sales Report Ready', message: 'View the weekly sales performance report for all warehouses.', type: 'system' as const, icon: 'bar-chart', priority: 'medium' as const, read: true, action_url: '/admin', created_at: '2024-05-17T09:00:00Z' },
    { id: 'notif-016', user_id: 'usr-003', title: 'Product Rejected: Invalid Pricing', message: 'Super Cheap Phone was rejected due to pricing policy violation.', type: 'product' as const, icon: 'x-circle', priority: 'medium' as const, read: true, action_url: '/admin/products', created_at: '2024-05-16T11:00:00Z' },

    // Additional customer notifications (usr-004)
    { id: 'notif-017', user_id: 'usr-004', title: 'Order #MB1254 Being Prepared', message: 'Your order is being prepared for shipment.', type: 'order' as const, icon: 'package', priority: 'high' as const, read: false, action_url: '/dashboard/orders/MB1254', created_at: '2024-05-17T11:30:00Z' },
    { id: 'notif-018', user_id: 'usr-004', title: 'Welcome to MarketBridge!', message: 'Thank you for joining. Start shopping and discover great deals!', type: 'account' as const, icon: 'user', priority: 'low' as const, read: true, created_at: '2024-02-10T10:00:00Z' },
  ] as Notification[],

  reviews: [
    { id: 'rev-001', customer_id: 'usr-001', customer_name: 'Sarah Johnson', product_id: 'prod-001', product_name: 'Wireless Headphones Premium Sound', product_image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 5, comment: 'Great sound quality! The noise cancellation is excellent.', created_at: '2024-05-18T10:00:00Z' },
    { id: 'rev-002', customer_id: 'usr-002', customer_name: 'Michael Brown', product_id: 'prod-002', product_name: 'Smart Watch Series 8', product_image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100', rating: 4, comment: 'Excellent smartwatch. Health tracking is very accurate.', created_at: '2024-05-10T10:00:00Z' },
  ] as Review[],

  wishlist: [] as WishlistItem[],

  product_requests: [
    { id: 'req-001', customer_id: 'usr-001', customer_email: 'sarah.johnson@email.com', product_name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', description: 'Looking for the latest Sony noise-cancelling headphones', brand: 'Sony', status: 'in_review' as RequestStatus, created_at: '2024-05-15T10:00:00Z' },
    { id: 'req-002', customer_id: 'usr-001', customer_email: 'sarah.johnson@email.com', product_name: 'Nike Air Max 270', category: 'Fashion', description: 'Looking for Nike Air Max 270 in size 10', brand: 'Nike', status: 'found' as RequestStatus, created_at: '2024-04-28T10:00:00Z' },
    { id: 'req-003', customer_id: 'usr-004', customer_email: 'emily.davis@email.com', product_name: 'Dyson V12 Vacuum', category: 'Home & Living', description: 'Looking for the Dyson V12 cordless vacuum', brand: 'Dyson', status: 'pending' as RequestStatus, created_at: '2024-04-10T10:00:00Z' },
  ] as ProductRequest[],

  promotions: [
    { id: 'promo-001', title: 'Summer Sale - Up to 50% OFF', type: 'banner' as const, image: 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=400', target_url: '/products', location: 'Home - Top', target_audience: 'All Users', status: 'active' as BannerStatus, start_date: '2024-05-01', end_date: '2024-06-30', impressions: 85420, clicks: 4245, created_at: '2024-04-28T10:00:00Z' },
    { id: 'promo-002', title: 'New Arrivals - Check Out Now', type: 'banner' as const, image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400', target_url: '/products?filter=new', location: 'Home - Middle', target_audience: 'All Users', status: 'active' as BannerStatus, start_date: '2024-05-10', end_date: '2024-07-31', impressions: 62150, clicks: 3128, created_at: '2024-05-08T10:00:00Z' },
    { id: 'promo-003', title: 'Electronics Deals - Best Prices', type: 'banner' as const, image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400', target_url: '/categories/electronics', location: 'Category Page', target_audience: 'Electronics Users', status: 'active' as BannerStatus, start_date: '2024-05-15', end_date: '2024-06-15', impressions: 45230, clicks: 2654, created_at: '2024-05-13T10:00:00Z' },
    { id: 'promo-004', title: 'Beauty Essentials - Flat 30% OFF', type: 'banner' as const, image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', target_url: '/categories/beauty', location: 'Home - Bottom', target_audience: 'All Users', status: 'paused' as BannerStatus, start_date: '2024-05-01', end_date: '2024-05-31', impressions: 25680, clicks: 1324, created_at: '2024-04-28T10:00:00Z' },
  ] as Promotion[],

  margins: [
    { id: 'margin-001', category_id: 'cat-001', category_name: 'Electronics', warehouse_margin: 10.0, platform_margin: 8.0, total_margin: 18.0, status: 'active' as const, updated_at: '2024-05-01T10:00:00Z' },
    { id: 'margin-002', category_id: 'cat-002', category_name: 'Fashion', warehouse_margin: 12.0, platform_margin: 8.0, total_margin: 20.0, status: 'active' as const, updated_at: '2024-05-01T10:00:00Z' },
    { id: 'margin-003', category_id: 'cat-003', category_name: 'Beauty', warehouse_margin: 15.0, platform_margin: 10.0, total_margin: 25.0, status: 'active' as const, updated_at: '2024-05-01T10:00:00Z' },
    { id: 'margin-004', category_id: 'cat-004', category_name: 'Home & Living', warehouse_margin: 8.0, platform_margin: 7.0, total_margin: 15.0, status: 'active' as const, updated_at: '2024-05-01T10:00:00Z' },
    { id: 'margin-005', category_id: 'cat-005', category_name: 'Sports & Outdoors', warehouse_margin: 10.0, platform_margin: 6.0, total_margin: 16.0, status: 'inactive' as const, updated_at: '2024-05-01T10:00:00Z' },
    { id: 'margin-006', category_id: 'cat-006', category_name: 'Toys & Games', warehouse_margin: 9.0, platform_margin: 6.0, total_margin: 15.0, status: 'active' as const, updated_at: '2024-05-01T10:00:00Z' },
  ] as MarginRule[],

  audit_logs: [
    { id: 'log-001', actor_id: 'usr-003', actor_name: 'Admin User', actor_role: 'admin' as Role, action: 'PRODUCT_APPROVED', entity_type: 'product', entity_id: 'prod-001', created_at: '2024-05-18T10:00:00Z' },
    { id: 'log-002', actor_id: 'usr-002', actor_name: 'John Doe', actor_role: 'warehouse' as Role, action: 'PRODUCT_CREATED', entity_type: 'product', entity_id: 'prod-009', created_at: '2024-05-16T09:00:00Z' },
    { id: 'log-003', actor_id: 'usr-001', actor_name: 'Sarah Johnson', actor_role: 'customer' as Role, action: 'ORDER_PLACED', entity_type: 'order', entity_id: 'MB1256', created_at: '2024-05-20T10:24:00Z' },
  ] as AuditLog[],

  telegram_posts: [
    { id: 'tg-001', product_id: 'prod-001', product_name: 'Wireless Headphones Premium Sound', channel: '@marketbridge_deals', message: '🎧 Premium Wireless Headphones - Only $59.99!\nNoise cancellation, 30h battery. Shop now!', status: 'sent' as PostStatus, sent_at: '2024-05-18T12:00:00Z', created_at: '2024-05-18T11:55:00Z' },
    { id: 'tg-002', product_id: 'prod-002', product_name: 'Smart Watch Series 8', channel: '@marketbridge_deals', message: '⌚ Smart Watch Series 8 - $89.99!\nFull health tracking. Order now!', status: 'sent' as PostStatus, sent_at: '2024-05-17T10:00:00Z', created_at: '2024-05-17T09:55:00Z' },
    { id: 'tg-003', product_id: 'prod-009', product_name: 'Bluetooth Earbuds Pro', channel: '@marketbridge_deals', message: '🎵 Bluetooth Earbuds Pro - Coming Soon!', status: 'queued' as PostStatus, created_at: '2024-05-20T10:00:00Z' },
  ] as TelegramPost[],

  addresses: [
    { id: 'addr-001', customer_id: 'usr-001', label: 'Home', name: 'Sarah Johnson', phone: '+251 91 123 4567', address: 'Bole Sub-City, Atlas Area, House No. 48', city: 'Addis Ababa', country: 'Ethiopia', is_default: true, created_at: '2024-01-15T10:00:00Z' },
    { id: 'addr-002', customer_id: 'usr-001', label: 'Office', name: 'Sarah Johnson', phone: '+251 91 123 4568', address: 'Kirkos Sub-City, Woreda 08, Bldg. 200', city: 'Addis Ababa', country: 'Ethiopia', is_default: false, created_at: '2024-02-01T10:00:00Z' },
    { id: 'addr-003', customer_id: 'usr-001', label: 'Parents House', name: 'Aster Bekele', phone: '+251 91 456 7890', address: 'Gulele Sub-City, Woreda 05, No. 12', city: 'Addis Ababa', country: 'Ethiopia', is_default: false, created_at: '2024-03-01T10:00:00Z' },
  ] as Address[],

  system_settings: {
    site_name: 'MarketBridge',
    site_tagline: 'Bridging Markets, Building Trust',
    site_email: 'support@marketbridge.com',
    site_phone: '+251 (800) 123-4567',
    currency: 'ETB - Ethiopian Birr',
    timezone: 'Africa/Addis_Ababa (UTC+3)',
    date_format: 'DD/MM/YYYY',
    time_format: '12 Hour (AM/PM)',
    items_per_page: 10,
    maintenance_mode: false,
    site_language: 'English',
    site_status: 'active' as const,
  } as SystemSettings,

  // Analytics computed from orders/products
  analytics: {
    revenue: { today: 71601, week: 722150, month: 2837323, total: 14261629 },
    orders: { total: 1248, active: 234, completed: 602, cancelled: 16 },
    customers: { total: 18562, new_this_month: 2345, active: 14250 },
    products: { total: 156, published: 142, pending: 8, out_of_stock: 5 },
    top_products: [
      { name: 'Wireless Headphones', units: 45, revenue: 157500 },
      { name: 'Smart Watch Series 8', units: 33, revenue: 171600 },
      { name: "Men's Casual Shoes", units: 27, revenue: 78300 },
      { name: 'Portable Speaker', units: 21, revenue: 36750 },
      { name: "Women's Handbag", units: 18, revenue: 36900 },
    ],
    sales_by_category: [
      { name: 'Electronics', revenue: 355275, percentage: 49 },
      { name: 'Fashion', revenue: 188235, percentage: 26 },
      { name: 'Accessories', revenue: 110145, percentage: 15 },
      { name: 'Beauty', revenue: 49915, percentage: 7 },
      { name: 'Others', revenue: 20880, percentage: 3 },
    ],
    weekly_revenue: [
      { date: 'May 12', revenue: 116000 }, { date: 'May 13', revenue: 145000 },
      { date: 'May 14', revenue: 174000 }, { date: 'May 15', revenue: 232000 },
      { date: 'May 16', revenue: 203000 }, { date: 'May 17', revenue: 261000 },
      { date: 'May 18', revenue: 348000 },
    ],
    order_status_overview: [
      { status: 'Delivered', count: 602, percentage: 52 },
      { status: 'Processing', count: 234, percentage: 29 },
      { status: 'Shipped', count: 198, percentage: 18 },
      { status: 'Cancelled', count: 16, percentage: 9 },
      { status: 'Pending', count: 66, percentage: 6 },
    ],
  },
};

// ─── Helper: generate a simple ID ──────────────────────────────────────
let idCounter = 1000;
export function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}
