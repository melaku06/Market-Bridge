import { z } from 'zod';

// Warehouse status
export const warehouseStatusSchema = z.enum([
  'pending_approval',
  'active',
  'suspended',
  'deactivated'
]);

// Warehouse schema (full entity)
export const warehouseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  owner_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100).default('Ethiopia'),
  business_type: z.string().max(100).optional().nullable(),
  bank_name: z.string().max(100).optional().nullable(),
  bank_account: z.string().max(50).optional().nullable(),
  tax_id: z.string().max(50).optional().nullable(),
  status: warehouseStatusSchema,
  member_since: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Warehouse create schema
export const warehouseCreateSchema = z.object({
  name: z.string()
    .min(2, 'Warehouse name must be at least 2 characters')
    .max(100, 'Warehouse name is too long')
    .transform(n => n.trim()),

  owner_name: z.string()
    .min(2, 'Owner name must be at least 2 characters')
    .max(100, 'Owner name is too long')
    .transform(n => n.trim()),

  email: z.string()
    .email('Invalid email address')
    .transform(e => e.toLowerCase().trim()),

  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(20, 'Phone is too long')
    .regex(/^[\d\s\-+()]+$/, 'Invalid phone format'),

  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address is too long'),

  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City name is too long'),

  country: z.string().default('Ethiopia'),

  business_type: z.string().max(100).optional().nullable(),

  bank_name: z.string().max(100).optional().nullable(),
  bank_account: z.string().max(50).optional().nullable(),
  tax_id: z.string().max(50).optional().nullable(),
});

// Warehouse update schema
export const warehouseUpdateSchema = warehouseCreateSchema.partial();

// Warehouse status update (admin)
export const warehouseStatusUpdateSchema = z.object({
  status: warehouseStatusSchema,
  reason: z.string().min(10, 'Reason must be at least 10 characters').optional(),
});

// Warehouse query params
export const warehouseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: warehouseStatusSchema.optional(),
  search: z.string().min(1).max(100).optional(),
  sort_by: z.enum(['name', 'created_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type Warehouse = z.infer<typeof warehouseSchema>;
export type WarehouseCreate = z.infer<typeof warehouseCreateSchema>;
export type WarehouseUpdate = z.infer<typeof warehouseUpdateSchema>;
export type WarehouseStatusUpdate = z.infer<typeof warehouseStatusUpdateSchema>;
export type WarehouseQuery = z.infer<typeof warehouseQuerySchema>;
