import { z } from 'zod';

// Product status
export const productStatusSchema = z.enum([
  'draft',
  'pending',
  'published',
  'archived',
  'rejected'
]);

// Stock status
export const stockStatusSchema = z.enum([
  'in_stock',
  'low_stock',
  'out_of_stock'
]);

// Decimal as string for precision
const decimalSchema = z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format');

// Product schema (full entity)
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(250),
  description: z.string().max(5000).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  warehouse_id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  base_price: decimalSchema,
  margin_percent: decimalSchema,
  discount_percent: decimalSchema,
  images: z.array(z.string().url()),
  rating: decimalSchema,
  review_count: z.number().int().min(0),
  sold_count: z.number().int().min(0),
  status: productStatusSchema,
  tags: z.array(z.string().max(50)),
  brand: z.string().max(100).optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  weight: z.string().max(50).optional().nullable(),
  colors: z.array(z.string().max(50)),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Product create schema
export const productCreateSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name is too long')
    .transform(n => n.trim()),

  description: z.string()
    .max(5000, 'Description is too long')
    .optional()
    .nullable(),

  short_description: z.string()
    .max(300, 'Short description is too long')
    .optional()
    .nullable(),

  category_id: z.string().uuid('Invalid category').optional().nullable(),

  base_price: z.coerce.number()
    .positive('Price must be positive')
    .max(100000000, 'Price exceeds maximum'),

  margin_percent: z.coerce.number()
    .min(0, 'Margin cannot be negative')
    .max(100, 'Margin cannot exceed 100%')
    .default(15),

  discount_percent: z.coerce.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),

  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .default([]),

  tags: z.array(z.string().max(50))
    .max(20, 'Maximum 20 tags allowed')
    .default([]),

  brand: z.string().max(100).optional().nullable(),

  sku: z.string()
    .max(50, 'SKU is too long')
    .regex(/^[A-Z0-9\-_]+$/i, 'SKU can only contain letters, numbers, hyphens, and underscores')
    .optional()
    .nullable(),

  weight: z.string().max(50).optional().nullable(),

  colors: z.array(z.string().max(50))
    .max(20, 'Maximum 20 colors allowed')
    .default([]),

  quantity: z.coerce.number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .default(0),
});

// Product update schema
export const productUpdateSchema = productCreateSchema.partial();

// Product status update (admin approve/reject)
export const productStatusUpdateSchema = z.object({
  status: z.enum(['published', 'rejected']),
  reason: z.string().min(10, 'Reason must be at least 10 characters').optional(),
});

// Product query params
export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().min(1).optional(),
  warehouse_id: z.string().uuid().optional(),
  status: productStatusSchema.optional(),
  min_price: z.coerce.number().positive().optional(),
  max_price: z.coerce.number().positive().optional(),
  search: z.string().min(1).max(100).optional(),
  sort_by: z.enum(['name', 'base_price', 'rating', 'sold_count', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  tags: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  in_stock: z.coerce.boolean().optional(),
});

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 250);
}

export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductStatusUpdate = z.infer<typeof productStatusUpdateSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type StockStatus = z.infer<typeof stockStatusSchema>;
