/**
 * Domain Types
 * These types mirror the Prisma schema exactly.
 * Prisma is the single source of truth for all data models.
 */

// ============================================================================
// ENUMS (matching Prisma schema)
// ============================================================================

export type UserRole = 'customer' | 'warehouse' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'blocked';
export type WarehouseStatus = 'pending_approval' | 'active' | 'suspended' | 'deactivated';
export type ProductStatus = 'draft' | 'pending' | 'published' | 'archived' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cod';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type RequestStatus = 'pending' | 'in_review' | 'found' | 'not_available';
export type NotificationType = 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory' | 'telegram';
export type NotificationPriority = 'high' | 'medium' | 'low';
export type PromotionType = 'banner' | 'promotion' | 'flash_deal' | 'coupon';
export type PromotionStatus = 'active' | 'inactive' | 'paused';
export type PostStatus = 'queued' | 'sending' | 'sent' | 'failed' | 'retrying' | 'cancelled';
export type TelegramTargetType = 'channel' | 'group' | 'user';
export type TelegramBotStatus = 'connected' | 'disconnected' | 'error';
export type PasswordResetStatus = 'pending' | 'used' | 'expired';

// Legacy aliases for backwards compatibility
export type Role = UserRole;
export type BannerStatus = PromotionStatus;

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  status: UserStatus;
  warehouse_id?: string | null;
  telegram_username?: string | null;
  telegram_id?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UserCredential {
  user_id: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token_hash: string;
  status: PasswordResetStatus;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
}

// Legacy alias
export type User = Profile;

// ============================================================================
// WAREHOUSE / SELLER
// ============================================================================

export interface Warehouse {
  id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  business_type?: string | null;
  bank_name?: string | null;
  bank_account?: string | null;
  tax_id?: string | null;
  status: WarehouseStatus;
  member_since: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// ============================================================================
// CATALOG
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  warehouse_id: string;
  category_id?: string | null;
  base_price: number;
  margin_percent: number;
  discount_percent: number;
  images: string[];
  rating: number;
  review_count: number;
  sold_count: number;
  status: ProductStatus;
  tags: string[];
  brand?: string | null;
  sku?: string | null;
  weight?: string | null;
  colors: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  category?: { id: string; name: string; slug?: string } | null;
  warehouse?: { id: string; name: string; owner_name?: string } | null;
  inventory?: { quantity: number; status: StockStatus }[] | null;
}

export interface Inventory {
  id: string;
  warehouse_id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  status: StockStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ORDERS
// ============================================================================

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  warehouse_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  tax: number;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_method: string;
  payment_method: string;
  payment_status: PaymentStatus;
  status: OrderStatus;
  tracking_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  color?: string | null;
  size?: string | null;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  changed_by: string;
  changed_by_name: string;
  notes?: string | null;
  created_at: string;
}

// ============================================================================
// ADDRESSES
// ============================================================================

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string;
  phone?: string | null;
  address: string;
  city: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CUSTOMER ENGAGEMENT
// ============================================================================

export interface Review {
  id: string;
  customer_id: string;
  product_id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  comment?: string | null;
  product_image?: string | null;
  created_at: string;
  updated_at: string;
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
  description: string;
  category?: string | null;
  brand?: string | null;
  image_url?: string | null;
  status: RequestStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: string | null;
  action_url?: string | null;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

// ============================================================================
// ADMIN / MARKETING
// ============================================================================

export interface Promotion {
  id: string;
  title: string;
  type: PromotionType;
  image_url?: string | null;
  target_url?: string | null;
  location?: string | null;
  target_audience: string;
  status: PromotionStatus;
  start_date?: string | null;
  end_date?: string | null;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface MarginRule {
  id: string;
  category_id?: string | null;
  product_id?: string | null;
  category_name?: string | null;
  warehouse_margin: number;
  platform_margin: number;
  total_margin: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description?: string | null;
  before_state?: string | null;
  after_state?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface SystemSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  site_email: string;
  site_phone?: string | null;
  currency: string;
  timezone: string;
  date_format: string;
  time_format: string;
  items_per_page: number;
  maintenance_mode: boolean;
  site_language: string;
  updated_at: string;
}

// ============================================================================
// TELEGRAM INTEGRATION
// ============================================================================

export interface TelegramBot {
  id: string;
  bot_token: string;
  bot_username?: string | null;
  bot_name?: string | null;
  status: TelegramBotStatus;
  webhook_url?: string | null;
  last_sync_at?: string | null;
  last_error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramChannel {
  id: string;
  bot_id: string;
  channel_id: string;
  channel_name: string;
  channel_username?: string | null;
  member_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TelegramGroup {
  id: string;
  bot_id: string;
  group_id: string;
  group_name: string;
  group_username?: string | null;
  member_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TelegramPostTemplate {
  id: string;
  bot_id: string;
  name: string;
  template: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TelegramPost {
  id: string;
  bot_id: string;
  product_id: string;
  product_name: string;
  template_id?: string | null;
  target_type: TelegramTargetType;
  channel_id?: string | null;
  group_id?: string | null;
  message: string;
  image_urls: string[];
  status: PostStatus;
  error?: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at?: string | null;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramActivityLog {
  id: string;
  bot_id: string;
  post_id?: string | null;
  action: string;
  status: string;
  message?: string | null;
  error?: string | null;
  created_at: string;
}
