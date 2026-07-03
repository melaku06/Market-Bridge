// Centralized validation schemas using Zod
// All entities validated before database operations

export * from './auth';
export * from './user';
export * from './product';
export * from './order';
export * from './warehouse';
export * from './common';

// Re-import for type exports
import { z } from 'zod';
import { userRoleSchema, userStatusSchema, profileSchema, profileUpdateSchema } from './user';
import { productStatusSchema, productSchema, productCreateSchema, productUpdateSchema } from './product';
import { orderStatusSchema, paymentStatusSchema, orderSchema, orderCreateSchema } from './order';
import { warehouseStatusSchema, warehouseSchema, warehouseCreateSchema } from './warehouse';
import { addressSchema, addressCreateSchema, reviewSchema, reviewCreateSchema } from './common';

// Type exports for all schemas
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderCreate = z.infer<typeof orderCreateSchema>;

export type WarehouseStatus = z.infer<typeof warehouseStatusSchema>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export type WarehouseCreate = z.infer<typeof warehouseCreateSchema>;

export type Address = z.infer<typeof addressSchema>;
export type AddressCreate = z.infer<typeof addressCreateSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ReviewCreate = z.infer<typeof reviewCreateSchema>;
