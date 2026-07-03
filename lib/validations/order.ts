import { z } from 'zod';

// Order status
export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]);

// Payment status
export const paymentStatusSchema = z.enum([
  'pending',
  'paid',
  'failed',
  'refunded',
  'cod'
]);

// Order item schema
export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string().min(1).max(200),
  product_image: z.string().url().optional().nullable(),
  quantity: z.number().int().min(1).max(100),
  unit_price: z.coerce.number().positive(),
  total_price: z.coerce.number().positive(),
  color: z.string().max(50).optional().nullable(),
  size: z.string().max(20).optional().nullable(),
});

// Order schema (full entity)
export const orderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  customer_id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string().optional().nullable(),
  subtotal: z.coerce.number(),
  shipping_fee: z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  tax: z.coerce.number().default(0),
  total: z.coerce.number().positive(),
  shipping_address: z.string(),
  shipping_city: z.string(),
  shipping_method: z.string(),
  payment_method: z.string(),
  payment_status: paymentStatusSchema,
  status: orderStatusSchema,
  tracking_number: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(orderItemSchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Order create schema
export const orderCreateSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid('Invalid product'),
    quantity: z.number().int().min(1).max(100, 'Maximum 100 items per product'),
    color: z.string().max(50).optional(),
    size: z.string().max(20).optional(),
  })).min(1, 'At least one item is required'),

  shipping_address_id: z.string().uuid('Invalid address'),

  shipping_method: z.string().min(1, 'Shipping method required'),

  payment_method: z.enum([
    'telebirr',
    'cbe_birr',
    'mpesa',
    'cod',
    'bank_transfer'
  ], { errorMap: () => ({ message: 'Invalid payment method' }) }),

  notes: z.string().max(500, 'Notes too long').optional(),
});

// Order status update
export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
  tracking_number: z.string()
    .min(3, 'Tracking number too short')
    .max(50, 'Tracking number too long')
    .optional(),
  notes: z.string().max(500).optional(),
});

// Cancel order
export const orderCancelSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason for cancellation').max(500),
});

// Order query params
export const orderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: orderStatusSchema.optional(),
  payment_status: paymentStatusSchema.optional(),
  customer_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid().optional(),
  search: z.string().min(1).max(100).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  sort_by: z.enum(['created_at', 'total', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MB-${timestamp}-${random}`;
}

export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
export type OrderCancel = z.infer<typeof orderCancelSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
