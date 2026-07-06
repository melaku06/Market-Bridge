import { z } from 'zod';

// User roles
export const userRoleSchema = z.enum(['customer', 'warehouse', 'admin']);

// User status
export const userStatusSchema = z.enum(['active', 'suspended', 'blocked']);

// Profile schema (full entity)
export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  role: userRoleSchema,
  status: userStatusSchema,
  warehouse_id: z.string().uuid().optional().nullable(),
  telegram_username: z.string().optional().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .transform(n => n.trim())
    .optional(),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(20, 'Phone is too long')
    .optional()
    .nullable(),
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
  telegram_username: z.string()
    .max(50, 'Telegram username is too long')
    .optional()
    .nullable()
    .transform(v => v ? v.replace(/^@/, '').toLowerCase() : v),
});

// Admin updating user status
export const userStatusUpdateSchema = z.object({
  status: userStatusSchema,
  reason: z.string().min(10, 'Reason must be at least 10 characters').optional(),
});

// User query params
export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  search: z.string().min(1).max(100).optional(),
});

export type Profile = z.infer<typeof profileSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type UserStatusUpdate = z.infer<typeof userStatusUpdateSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
