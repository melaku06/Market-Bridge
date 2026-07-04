/**
 * Domain Types
 * These types mirror the Supabase PostgreSQL schema (Prisma models).
 * All data is persisted in Supabase — these interfaces are used by
 * client components and Zustand stores for type safety.
 */

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
  status: 'active' | 'suspended' | 'blocked';
  avatar?: string;
  created_at: string;
  last_login: string;
}

export interface Warehouse {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  business_type?: string;
  status: WarehouseStatus;
  rating: number;
  total_products: number;
  total_orders: number;
  total_sales: number;
  performance_score: number;
  member_since: string;
  bank_name?: string;
  bank_account?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
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
