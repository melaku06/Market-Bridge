import { z } from 'zod';

// ============================================================================
// ADDRESS VALIDATION
// ============================================================================

export const addressSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  label: z.string().max(50),
  recipient_name: z.string().min(2).max(100),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  country: z.string().max(100),
  is_default: z.boolean(),
  created_at: z.coerce.date(),
});

export const addressCreateSchema = z.object({
  label: z.string()
    .max(50, 'Label too long')
    .default('Home'),

  recipient_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .transform(n => n.trim()),

  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(20, 'Phone too long')
    .regex(/^[\d\s\-+()]+$/, 'Invalid phone format')
    .optional()
    .nullable(),

  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address too long'),

  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City too long'),

  country: z.string()
    .max(100, 'Country name too long')
    .default('Ethiopia'),

  is_default: z.boolean().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial();

// ============================================================================
// REVIEW VALIDATION
// ============================================================================

export const reviewSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  customer_name: z.string(),
  product_name: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().nullable(),
  product_image: z.string().url().optional().nullable(),
  created_at: z.coerce.date(),
});

export const reviewCreateSchema = z.object({
  product_id: z.string().uuid('Invalid product'),

  rating: z.coerce.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  comment: z.string()
    .max(2000, 'Review is too long')
    .optional()
    .nullable()
    .transform(c => c?.trim() || null),
});

// ============================================================================
// NOTIFICATION VALIDATION
// ============================================================================

export const notificationTypeSchema = z.enum([
  'order',
  'product',
  'system',
  'promotion',
  'account',
  'inventory',
  'telegram'
]);

export const notificationPrioritySchema = z.enum(['high', 'medium', 'low']);

export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: notificationTypeSchema,
  priority: notificationPrioritySchema,
  title: z.string().max(200),
  message: z.string().max(2000),
  data: z.string().optional().nullable(),
  action_url: z.string().max(500).optional().nullable(),
  is_read: z.boolean(),
  created_at: z.coerce.date(),
});

export const notificationCreateSchema = z.object({
  user_id: z.string().uuid(),
  type: notificationTypeSchema,
  priority: notificationPrioritySchema.default('medium'),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long'),
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message too long'),
  data: z.string().optional().nullable(),
  action_url: z.string().max(500).optional().nullable(),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  is_read: z.coerce.boolean().optional(),
  type: notificationTypeSchema.optional(),
  priority: notificationPrioritySchema.optional(),
});

// ============================================================================
// WISHLIST VALIDATION
// ============================================================================

export const wishlistItemSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  created_at: z.coerce.date(),
});

export const wishlistAddSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
});

// ============================================================================
// PRODUCT REQUEST VALIDATION
// ============================================================================

export const requestStatusSchema = z.enum([
  'pending',
  'in_review',
  'found',
  'not_available'
]);

export const productRequestSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_email: z.string().email(),
  product_name: z.string(),
  description: z.string(),
  category: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  status: requestStatusSchema,
  admin_notes: z.string().optional().nullable(),
  created_at: z.coerce.date(),
});

export const productRequestCreateSchema = z.object({
  product_name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name too long')
    .transform(n => n.trim()),

  description: z.string()
    .min(10, 'Please provide more details (at least 10 characters)')
    .max(2000, 'Description too long'),

  category: z.string().max(100).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  image_url: z.string().url('Invalid image URL').optional().nullable(),
});

// ============================================================================
// CATEGORY VALIDATION
// ============================================================================

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(1000).optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
});

export const categoryCreateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .transform(n => n.trim()),

  description: z.string().max(1000).optional().nullable(),
  image_url: z.string().url('Invalid image URL').optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
});

// ============================================================================
// PROMOTION VALIDATION
// ============================================================================

export const promotionTypeSchema = z.enum(['banner', 'promotion', 'flash_deal', 'coupon']);
export const promotionStatusSchema = z.enum(['active', 'inactive', 'paused']);

export const promotionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: promotionTypeSchema,
  image_url: z.string().url().optional().nullable(),
  target_url: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  target_audience: z.string(),
  status: promotionStatusSchema,
  start_date: z.coerce.date().optional().nullable(),
  end_date: z.coerce.date().optional().nullable(),
  impressions: z.number().int(),
  clicks: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const promotionCreateSchema = z.object({
  title: z.string().min(2).max(200),
  type: promotionTypeSchema.default('banner'),
  image_url: z.string().url().optional().nullable(),
  target_url: z.string().url().optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  target_audience: z.string().max(100).default('All Users'),
  status: promotionStatusSchema.default('inactive'),
  start_date: z.coerce.date().optional().nullable(),
  end_date: z.coerce.date().optional().nullable(),
});

// ============================================================================
// MARGIN RULE VALIDATION
// ============================================================================

export const marginRuleSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid().optional().nullable(),
  category_name: z.string().optional().nullable(),
  warehouse_margin: z.coerce.number(),
  platform_margin: z.coerce.number(),
  total_margin: z.coerce.number(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const marginRuleCreateSchema = z.object({
  category_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid().optional().nullable(),
  category_name: z.string().max(100).optional().nullable(),
  warehouse_margin: z.coerce.number()
    .min(0, 'Margin cannot be negative')
    .max(50, 'Margin cannot exceed 50%'),
  platform_margin: z.coerce.number()
    .min(0, 'Margin cannot be negative')
    .max(50, 'Margin cannot exceed 50%'),
  is_active: z.boolean().default(true),
}).refine(data => {
  const total = data.warehouse_margin + data.platform_margin;
  return total >= 5 && total <= 100;
}, {
  message: 'Total margin must be between 5% and 100%',
});

// ============================================================================
// AUDIT LOG VALIDATION
// ============================================================================

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  actor_id: z.string(),
  actor_name: z.string(),
  actor_role: z.string(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  before_state: z.string().optional().nullable(),
  after_state: z.string().optional().nullable(),
  ip_address: z.string().optional().nullable(),
  created_at: z.coerce.date(),
});

// ============================================================================
// PAGINATION & COMMON QUERY PARAMS
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sort_by: z.string().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type Address = z.infer<typeof addressSchema>;
export type AddressCreate = z.infer<typeof addressCreateSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ReviewCreate = z.infer<typeof reviewCreateSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationCreate = z.infer<typeof notificationCreateSchema>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;
export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type WishlistAdd = z.infer<typeof wishlistAddSchema>;
export type ProductRequest = z.infer<typeof productRequestSchema>;
export type ProductRequestCreate = z.infer<typeof productRequestCreateSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryCreate = z.infer<typeof categoryCreateSchema>;
export type Promotion = z.infer<typeof promotionSchema>;
export type PromotionCreate = z.infer<typeof promotionCreateSchema>;
export type MarginRule = z.infer<typeof marginRuleSchema>;
export type MarginRuleCreate = z.infer<typeof marginRuleCreateSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
