// Database Service Layer
// Provides a clean interface for all database operations using Prisma
// This replaces the mock-db.ts implementation

import 'server-only';
import prisma from './prisma';
import { Prisma } from '@prisma/client';

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getProducts(params?: {
  category_id?: string;
  warehouse_id?: string;
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  tags?: string[];
  brand?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.ProductWhereInput = {};

  if (params?.category_id) where.category_id = params.category_id;
  if (params?.warehouse_id) where.warehouse_id = params.warehouse_id;
  if (params?.status) where.status = params.status as any;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { brand: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params?.brand) where.brand = { contains: params.brand, mode: 'insensitive' };
  if (params?.tags && params.tags.length > 0) {
    where.tags = { hasSome: params.tags };
  }
  if (params?.min_price !== undefined || params?.max_price !== undefined) {
    where.base_price = {};
    if (params?.min_price !== undefined) where.base_price.gte = params.min_price;
    if (params?.max_price !== undefined) where.base_price.lte = params.max_price;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { created_at: 'desc' };
  if (params?.sort_by) {
    const sortField = params.sort_by as keyof Prisma.ProductOrderByWithRelationInput;
    orderBy = { [sortField]: params?.sort_order || 'desc' } as Prisma.ProductOrderByWithRelationInput;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: params?.limit || 20,
      skip: params?.offset || 0,
      select: {
        id: true,
        name: true,
        slug: true,
        short_description: true,
        base_price: true,
        margin_percent: true,
        discount_percent: true,
        images: true,
        rating: true,
        review_count: true,
        sold_count: true,
        status: true,
        brand: true,
        category: { select: { id: true, name: true, slug: true } },
        warehouse: { select: { id: true, name: true, owner_name: true } },
        inventory: { select: { quantity: true, status: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      short_description: true,
      base_price: true,
      margin_percent: true,
      discount_percent: true,
      images: true,
      rating: true,
      review_count: true,
      sold_count: true,
      status: true,
      tags: true,
      brand: true,
      sku: true,
      weight: true,
      colors: true,
      category: { select: { id: true, name: true, slug: true } },
      warehouse: { select: { id: true, name: true, owner_name: true } },
      inventory: { select: { quantity: true, status: true } },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      short_description: true,
      base_price: true,
      margin_percent: true,
      discount_percent: true,
      images: true,
      rating: true,
      review_count: true,
      sold_count: true,
      status: true,
      tags: true,
      brand: true,
      sku: true,
      weight: true,
      colors: true,
      category: { select: { id: true, name: true, slug: true } },
      warehouse: { select: { id: true, name: true, owner_name: true } },
      inventory: { select: { quantity: true, status: true } },
    },
  });
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getCategories(params?: { is_active?: boolean; parent_id?: string }) {
  const where: Prisma.CategoryWhereInput = {};
  if (params?.is_active !== undefined) where.is_active = params.is_active;
  if (params?.parent_id !== undefined) where.parent_id = params.parent_id;

  return prisma.category.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true,
      products: {
        where: { status: 'published' },
        take: 20,
      },
    },
  });
}

export async function createCategory(data: Prisma.CategoryCreateInput) {
  return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}

// ============================================================================
// WAREHOUSES
// ============================================================================

export async function getWarehouses(params?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.WarehouseWhereInput = {};
  if (params?.status) where.status = params.status as any;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
      { owner_name: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [warehouses, total] = await Promise.all([
    prisma.warehouse.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: params?.limit || 20,
      skip: params?.offset || 0,
      include: {
        _count: { select: { products: true, orders: true } },
      },
    }),
    prisma.warehouse.count({ where }),
  ]);

  // Add computed fields for each warehouse
  const warehousesWithStats = await Promise.all(
    warehouses.map(async (w) => {
      const [orderStats, productRatings] = await Promise.all([
        prisma.order.aggregate({
          where: { warehouse_id: w.id, payment_status: 'paid' },
          _sum: { total: true },
        }),
        prisma.product.aggregate({
          where: { warehouse_id: w.id, status: 'published' },
          _avg: { rating: true },
        }),
      ]);

      return {
        ...w,
        total_products: w._count.products,
        total_orders: w._count.orders,
        total_sales: Number(orderStats._sum.total || 0),
        rating: Number(productRatings._avg.rating || 0),
        performance_score: Math.min(100, Math.round(
          (w._count.orders > 0 ? 80 : 50) +
          (Number(productRatings._avg.rating || 0) * 10)
        )),
      };
    })
  );

  return { warehouses: warehousesWithStats, total };
}

export async function getWarehouseById(id: string) {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id },
    include: {
      profiles: true,
      products: { take: 10, orderBy: { created_at: 'desc' } },
      _count: { select: { products: true, orders: true } },
    },
  });

  if (!warehouse) return null;

  // Calculate derived fields
  const [orderStats, productRatings] = await Promise.all([
    prisma.order.aggregate({
      where: { warehouse_id: id, payment_status: 'paid' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.product.aggregate({
      where: { warehouse_id: id, status: 'published' },
      _avg: { rating: true },
    }),
  ]);

  return {
    ...warehouse,
    total_products: warehouse._count.products,
    total_orders: warehouse._count.orders,
    total_sales: Number(orderStats._sum.total || 0),
    rating: Number(productRatings._avg.rating || 0).toFixed(1),
    performance_score: Math.min(100, Math.round(
      (orderStats._count > 0 ? 80 : 50) +
      (Number(productRatings._avg.rating || 0) * 10)
    )),
  };
}

export async function createWarehouse(data: Prisma.WarehouseCreateInput) {
  return prisma.warehouse.create({ data });
}

export async function updateWarehouse(id: string, data: Prisma.WarehouseUpdateInput) {
  return prisma.warehouse.update({ where: { id }, data });
}

export async function deleteWarehouse(id: string) {
  return prisma.warehouse.delete({ where: { id } });
}

// ============================================================================
// INVENTORY
// ============================================================================

export async function getInventory(params?: {
  warehouse_id?: string;
  product_id?: string;
  status?: string;
  low_stock?: boolean;
}) {
  const where: Prisma.InventoryWhereInput = {};
  if (params?.warehouse_id) where.warehouse_id = params.warehouse_id;
  if (params?.product_id) where.product_id = params.product_id;
  if (params?.status) where.status = params.status as any;
  if (params?.low_stock) where.quantity = { lte: prisma.inventory.fields.low_stock_threshold };

  const items = await prisma.inventory.findMany({
    where,
    include: {
      product: { select: { id: true, name: true, slug: true, images: true, sku: true } },
      warehouse: { select: { id: true, name: true } },
    },
    orderBy: { updated_at: 'desc' },
  });

  // Transform to expected format
  return items.map(item => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product.name,
    warehouse_id: item.warehouse_id,
    sku: item.product.sku || '',
    total_stock: item.quantity,
    reserved_stock: item.reserved_quantity,
    available_stock: item.quantity - item.reserved_quantity,
    low_stock_threshold: item.low_stock_threshold,
    status: item.status,
    last_updated: item.updated_at.toISOString(),
  }));
}

export async function getInventoryItem(id: string) {
  return prisma.inventory.findUnique({
    where: { id },
    include: { product: true, warehouse: true },
  });
}

export async function updateInventory(id: string, data: Prisma.InventoryUpdateInput) {
  return prisma.inventory.update({ where: { id }, data });
}

export async function createInventory(data: Prisma.InventoryCreateInput) {
  return prisma.inventory.create({ data });
}

// ============================================================================
// ORDERS
// ============================================================================

export async function getOrders(params?: {
  customer_id?: string;
  warehouse_id?: string;
  status?: string;
  payment_status?: string;
  search?: string;
  start_date?: Date;
  end_date?: Date;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.OrderWhereInput = {};
  if (params?.customer_id) where.customer_id = params.customer_id;
  if (params?.warehouse_id) where.warehouse_id = params.warehouse_id;
  if (params?.status) where.status = params.status as any;
  if (params?.payment_status) where.payment_status = params.payment_status as any;
  if (params?.search) {
    where.OR = [
      { order_number: { contains: params.search, mode: 'insensitive' } },
      { customer_name: { contains: params.search, mode: 'insensitive' } },
      { customer_email: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params?.start_date || params?.end_date) {
    where.created_at = {};
    if (params?.start_date) where.created_at.gte = params.start_date;
    if (params?.end_date) where.created_at.lte = params.end_date;
  }

  let orderBy: Prisma.OrderOrderByWithRelationInput = { created_at: 'desc' };
  if (params?.sort_by) {
    const sortField = params.sort_by as keyof Prisma.OrderOrderByWithRelationInput;
    orderBy = { [sortField]: params?.sort_order || 'desc' } as Prisma.OrderOrderByWithRelationInput;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      take: params?.limit || 20,
      skip: params?.offset || 0,
      include: {
        items: true,
        customer: { select: { id: true, name: true, email: true } },
        warehouse: { select: { id: true, name: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true,
      warehouse: true,
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { order_number: orderNumber },
    include: { items: true, customer: true, warehouse: true },
  });
}

export async function createOrder(data: Prisma.OrderCreateInput) {
  return prisma.order.create({ data });
}

export async function updateOrder(id: string, data: Prisma.OrderUpdateInput) {
  return prisma.order.update({ where: { id }, data });
}

// ============================================================================
// ADDRESSES
// ============================================================================

export async function getAddresses(customer_id: string) {
  return prisma.address.findMany({
    where: { customer_id },
    orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
  });
}

export async function getAddressById(id: string) {
  return prisma.address.findUnique({ where: { id } });
}

export async function createAddress(data: Prisma.AddressCreateInput) {
  // If this is default, unset other defaults
  if (data.is_default) {
    const customerId = (data.customer as any)?.connect?.id || (data.customer as any)?.id;
    if (customerId) {
      await prisma.address.updateMany({
        where: { customer_id: customerId },
        data: { is_default: false },
      });
    }
  }
  return prisma.address.create({ data });
}

export async function updateAddress(id: string, data: Prisma.AddressUpdateInput) {
  return prisma.address.update({ where: { id }, data });
}

export async function deleteAddress(id: string) {
  return prisma.address.delete({ where: { id } });
}

// ============================================================================
// REVIEWS
// ============================================================================

export async function getReviews(params?: { product_id?: string; customer_id?: string }) {
  const where: Prisma.ReviewWhereInput = {};
  if (params?.product_id) where.product_id = params.product_id;
  if (params?.customer_id) where.customer_id = params.customer_id;

  return prisma.review.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, avatar_url: true } },
      product: { select: { id: true, name: true, images: true } },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({ where: { id } });
}

export async function createReview(data: Prisma.ReviewCreateInput) {
  const review = await prisma.review.create({ data });

  // Update product rating
  const stats = await prisma.review.aggregate({
    where: { product_id: review.product_id },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.product.update({
    where: { id: review.product_id },
    data: {
      rating: stats._avg.rating || 0,
      review_count: stats._count,
    },
  });

  return review;
}

export async function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}

// ============================================================================
// WISHLIST
// ============================================================================

export async function getWishlist(customer_id: string) {
  return prisma.wishlistItem.findMany({
    where: { customer_id },
    include: {
      product: {
        include: {
          category: { select: { name: true } },
          inventory: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getWishlistItem(id: string) {
  return prisma.wishlistItem.findUnique({ where: { id } });
}

export async function addToWishlist(data: Prisma.WishlistItemCreateInput) {
  return prisma.wishlistItem.create({ data });
}

export async function removeFromWishlist(id: string) {
  return prisma.wishlistItem.delete({ where: { id } });
}

export async function isInWishlist(customer_id: string, product_id: string) {
  const item = await prisma.wishlistItem.findFirst({
    where: { customer_id, product_id },
  });
  return !!item;
}

// ============================================================================
// PRODUCT REQUESTS
// ============================================================================

export async function getProductRequests(params?: { status?: string; customer_id?: string }) {
  const where: Prisma.ProductRequestWhereInput = {};
  if (params?.status) where.status = params.status as any;
  if (params?.customer_id) where.customer_id = params.customer_id;

  return prisma.productRequest.findMany({
    where,
    include: { customer: { select: { name: true, email: true } } },
    orderBy: { created_at: 'desc' },
  });
}

export async function getProductRequestById(id: string) {
  return prisma.productRequest.findUnique({ where: { id } });
}

export async function createProductRequest(data: Prisma.ProductRequestCreateInput) {
  return prisma.productRequest.create({ data });
}

export async function updateProductRequest(id: string, data: Prisma.ProductRequestUpdateInput) {
  return prisma.productRequest.update({ where: { id }, data });
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function getNotifications(params: {
  user_id: string;
  is_read?: boolean;
  type?: string;
  limit?: number;
}) {
  const where: Prisma.NotificationWhereInput = { user_id: params.user_id };
  if (params?.is_read !== undefined) where.is_read = params.is_read;
  if (params?.type) where.type = params.type as any;

  return prisma.notification.findMany({
    where,
    orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
    take: params?.limit || 20,
  });
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function createNotification(data: Prisma.NotificationCreateInput) {
  return prisma.notification.create({ data });
}

export async function markNotificationRead(id: string, is_read: boolean = true) {
  return prisma.notification.update({ where: { id }, data: { is_read } });
}

export async function deleteNotification(id: string) {
  return prisma.notification.delete({ where: { id } });
}

export async function getUnreadCount(user_id: string) {
  return prisma.notification.count({
    where: { user_id, is_read: false },
  });
}

// ============================================================================
// PROMOTIONS
// ============================================================================

export async function getPromotions(params?: { status?: string; type?: string }) {
  const where: Prisma.PromotionWhereInput = {};
  if (params?.status) where.status = params.status as any;
  if (params?.type) where.type = params.type as any;

  return prisma.promotion.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

export async function getPromotionById(id: string) {
  return prisma.promotion.findUnique({ where: { id } });
}

export async function createPromotion(data: Prisma.PromotionCreateInput) {
  return prisma.promotion.create({ data });
}

export async function updatePromotion(id: string, data: Prisma.PromotionUpdateInput) {
  return prisma.promotion.update({ where: { id }, data });
}

export async function deletePromotion(id: string) {
  return prisma.promotion.delete({ where: { id } });
}

// ============================================================================
// MARGIN RULES
// ============================================================================

export async function getMarginRules(params?: { is_active?: boolean; category_id?: string }) {
  const where: Prisma.MarginRuleWhereInput = {};
  if (params?.is_active !== undefined) where.is_active = params.is_active;
  if (params?.category_id) where.category_id = params.category_id;

  return prisma.marginRule.findMany({
    where,
    include: { category: true },
    orderBy: { created_at: 'desc' },
  });
}

export async function getMarginRuleById(id: string) {
  return prisma.marginRule.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function createMarginRule(data: Prisma.MarginRuleCreateInput) {
  return prisma.marginRule.create({ data });
}

export async function updateMarginRule(id: string, data: Prisma.MarginRuleUpdateInput) {
  return prisma.marginRule.update({ where: { id }, data });
}

export async function deleteMarginRule(id: string) {
  return prisma.marginRule.delete({ where: { id } });
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export async function getAuditLogs(params?: {
  actor_id?: string;
  entity_type?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.AuditLogWhereInput = {};
  if (params?.actor_id) where.actor_id = params.actor_id;
  if (params?.entity_type) where.entity_type = params.entity_type;
  if (params?.action) where.action = params.action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: params?.limit || 50,
      skip: params?.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

export async function createAuditLog(data: Prisma.AuditLogCreateInput) {
  return prisma.auditLog.create({ data });
}

// ============================================================================
// SYSTEM SETTINGS
// ============================================================================

export async function getSystemSettings() {
  return prisma.systemSettings.findFirst();
}

export async function updateSystemSettings(data: Record<string, any>) {
  const existing = await getSystemSettings();
  if (existing) {
    return prisma.systemSettings.update({
      where: { id: existing.id },
      data: data,
    });
  }
  return prisma.systemSettings.create({
    data: {
      id: 'default',
      ...data,
    }
  });
}

// ============================================================================
// TELEGRAM POSTS
// ============================================================================

// ============================================================================
// TELEGRAM BOT CONFIGURATION
// ============================================================================

export async function getTelegramBot() {
  return prisma.telegramBot.findFirst();
}

export async function createTelegramBot(data: Prisma.TelegramBotCreateInput) {
  return prisma.telegramBot.create({ data });
}

export async function updateTelegramBot(id: string, data: Prisma.TelegramBotUpdateInput) {
  return prisma.telegramBot.update({ where: { id }, data });
}

export async function deleteTelegramBot(id: string) {
  return prisma.telegramBot.delete({ where: { id } });
}

// ============================================================================
// TELEGRAM CHANNELS
// ============================================================================

export async function getTelegramChannels(params?: { bot_id?: string; is_active?: boolean }) {
  const where: Prisma.TelegramChannelWhereInput = {};
  if (params?.bot_id) where.bot_id = params.bot_id;
  if (params?.is_active !== undefined) where.is_active = params.is_active;

  return prisma.telegramChannel.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

export async function getTelegramChannelById(id: string) {
  return prisma.telegramChannel.findUnique({ where: { id } });
}

export async function createTelegramChannel(data: Prisma.TelegramChannelCreateInput) {
  return prisma.telegramChannel.create({ data });
}

export async function updateTelegramChannel(id: string, data: Prisma.TelegramChannelUpdateInput) {
  return prisma.telegramChannel.update({ where: { id }, data });
}

export async function deleteTelegramChannel(id: string) {
  return prisma.telegramChannel.delete({ where: { id } });
}

// ============================================================================
// TELEGRAM GROUPS
// ============================================================================

export async function getTelegramGroups(params?: { bot_id?: string; is_active?: boolean }) {
  const where: Prisma.TelegramGroupWhereInput = {};
  if (params?.bot_id) where.bot_id = params.bot_id;
  if (params?.is_active !== undefined) where.is_active = params.is_active;

  return prisma.telegramGroup.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

export async function getTelegramGroupById(id: string) {
  return prisma.telegramGroup.findUnique({ where: { id } });
}

export async function createTelegramGroup(data: Prisma.TelegramGroupCreateInput) {
  return prisma.telegramGroup.create({ data });
}

export async function updateTelegramGroup(id: string, data: Prisma.TelegramGroupUpdateInput) {
  return prisma.telegramGroup.update({ where: { id }, data });
}

export async function deleteTelegramGroup(id: string) {
  return prisma.telegramGroup.delete({ where: { id } });
}

// ============================================================================
// TELEGRAM POST TEMPLATES
// ============================================================================

export async function getTelegramTemplates(params?: { bot_id?: string; is_active?: boolean }) {
  const where: Prisma.TelegramPostTemplateWhereInput = {};
  if (params?.bot_id) where.bot_id = params.bot_id;
  if (params?.is_active !== undefined) where.is_active = params.is_active;

  return prisma.telegramPostTemplate.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
}

export async function getTelegramTemplateById(id: string) {
  return prisma.telegramPostTemplate.findUnique({ where: { id } });
}

export async function createTelegramTemplate(data: Prisma.TelegramPostTemplateCreateInput) {
  return prisma.telegramPostTemplate.create({ data });
}

export async function updateTelegramTemplate(id: string, data: Prisma.TelegramPostTemplateUpdateInput) {
  return prisma.telegramPostTemplate.update({ where: { id }, data });
}

export async function deleteTelegramTemplate(id: string) {
  return prisma.telegramPostTemplate.delete({ where: { id } });
}

// ============================================================================
// TELEGRAM POSTS (Queue, Scheduled, Published, Failed)
// ============================================================================

export async function getTelegramPosts(params?: {
  product_id?: string;
  status?: string;
  bot_id?: string;
  channel_id?: string;
  group_id?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.TelegramPostWhereInput = {};
  if (params?.product_id) where.product_id = params.product_id;
  if (params?.status) where.status = params.status as any;
  if (params?.bot_id) where.bot_id = params.bot_id;
  if (params?.channel_id) where.channel_id = params.channel_id;
  if (params?.group_id) where.group_id = params.group_id;

  return prisma.telegramPost.findMany({
    where,
    include: {
      product: { select: { id: true, name: true, images: true, base_price: true } },
      channel: { select: { id: true, channel_name: true } },
      group: { select: { id: true, group_name: true } },
      template: { select: { id: true, name: true } },
    },
    orderBy: { created_at: 'desc' },
    take: params?.limit || 50,
    skip: params?.offset || 0,
  });
}

export async function getTelegramPostById(id: string) {
  return prisma.telegramPost.findUnique({
    where: { id },
    include: {
      product: true,
      channel: true,
      group: true,
      template: true,
      activity_logs: { orderBy: { created_at: 'desc' }, take: 20 },
    },
  });
}

export async function createTelegramPost(data: Prisma.TelegramPostCreateInput) {
  return prisma.telegramPost.create({ data });
}

export async function updateTelegramPost(id: string, data: Prisma.TelegramPostUpdateInput) {
  return prisma.telegramPost.update({ where: { id }, data });
}

export async function deleteTelegramPost(id: string) {
  return prisma.telegramPost.delete({ where: { id } });
}

export async function getScheduledTelegramPosts() {
  return prisma.telegramPost.findMany({
    where: {
      status: 'queued',
      scheduled_at: { lte: new Date() },
    },
    include: {
      product: { select: { id: true, name: true, images: true, base_price: true } },
      channel: true,
      group: true,
    },
  });
}

export async function getRetryQueue() {
  return prisma.telegramPost.findMany({
    where: {
      status: 'retrying',
      next_retry_at: { lte: new Date() },
      retry_count: { lt: 3 },
    },
    include: {
      product: { select: { id: true, name: true, images: true } },
      channel: true,
      group: true,
    },
  });
}

// ============================================================================
// TELEGRAM ACTIVITY LOGS
// ============================================================================

export async function getTelegramActivityLogs(params?: {
  bot_id?: string;
  post_id?: string;
  action?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.TelegramActivityLogWhereInput = {};
  if (params?.bot_id) where.bot_id = params.bot_id;
  if (params?.post_id) where.post_id = params.post_id;
  if (params?.action) where.action = { contains: params.action, mode: 'insensitive' };
  if (params?.status) where.status = params.status;

  return prisma.telegramActivityLog.findMany({
    where,
    include: {
      post: { select: { id: true, product_name: true } },
    },
    orderBy: { created_at: 'desc' },
    take: params?.limit || 50,
    skip: params?.offset || 0,
  });
}

export async function createTelegramActivityLog(data: Prisma.TelegramActivityLogCreateInput) {
  return prisma.telegramActivityLog.create({ data });
}

// ============================================================================
// PASSWORD RESET TOKENS (Telegram-based recovery)
// ============================================================================

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
  return prisma.passwordResetToken.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });
}

export async function getPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token_hash: tokenHash },
    include: { user: true },
  });
}

export async function markPasswordResetTokenUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: {
      status: 'used',
      used_at: new Date(),
    },
  });
}

export async function expirePasswordResetTokens(userId: string) {
  return prisma.passwordResetToken.updateMany({
    where: {
      user_id: userId,
      status: 'pending',
    },
    data: { status: 'expired' },
  });
}

// ============================================================================
// ORDER STATUS HISTORY
// ============================================================================

export async function getOrderStatusHistory(orderId: string) {
  return prisma.orderStatusHistory.findMany({
    where: { order_id: orderId },
    orderBy: { created_at: 'asc' },
  });
}

export async function createOrderStatusHistory(data: Prisma.OrderStatusHistoryCreateInput) {
  return prisma.orderStatusHistory.create({ data });
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getAnalytics(warehouse_id?: string) {
  const where = warehouse_id ? { warehouse_id } : {};

  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCustomers,
    pendingOrders,
    recentOrders,
    topProducts,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.aggregate({
      where: { ...where, payment_status: 'paid' },
      _sum: { total: true },
    }),
    prisma.product.count({ where }),
    prisma.profile.count({ where: { role: 'customer' } }),
    prisma.order.count({ where: { ...where, status: 'pending' } }),
    prisma.order.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 10,
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { ...where, status: 'published' },
      orderBy: { sold_count: 'desc' },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  // Calculate order status overview
  const orderStatusOverview = ordersByStatus.map(item => ({
    status: item.status,
    count: item._count,
    percentage: totalOrders > 0 ? Math.round((item._count / totalOrders) * 100) : 0,
  }));

  // Calculate weekly revenue (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyOrders = await prisma.order.findMany({
    where: {
      ...where,
      payment_status: 'paid',
      created_at: { gte: sevenDaysAgo },
    },
    select: { created_at: true, total: true },
  });

  const weeklyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayRevenue = weeklyOrders
      .filter(o => o.created_at.toISOString().split('T')[0] === dateStr)
      .reduce((sum, o) => sum + Number(o.total), 0);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayRevenue,
    };
  });

  // Top products with revenue calculation
  const topProductsWithRevenue = topProducts.map(p => ({
    name: p.name,
    revenue: Number(p.base_price) * p.sold_count,
    units: p.sold_count,
  }));

  // Sales by category
  const categories = await prisma.category.findMany({
    where: { is_active: true },
    include: { products: { where: { status: 'published' } } },
  });

  const totalCategoryRevenue = categories.reduce((sum, c) => {
    return sum + c.products.reduce((pSum, p) => pSum + Number(p.base_price) * p.sold_count, 0);
  }, 0);

  const salesByCategory = categories
    .map(c => ({
      name: c.name,
      revenue: c.products.reduce((sum, p) => sum + Number(p.base_price) * p.sold_count, 0),
      percentage: totalCategoryRevenue > 0 ? Math.round((c.products.reduce((sum, p) => sum + Number(p.base_price) * p.sold_count, 0) / totalCategoryRevenue) * 100) : 0,
    }))
    .filter(c => c.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate new customers this month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const newCustomersThisMonth = await prisma.profile.count({
    where: {
      role: 'customer',
      created_at: { gte: firstDayOfMonth },
    },
  });

  return {
    // Flat structure for backward compatibility
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts,
    totalCustomers,
    pendingOrders,
    recentOrders,
    topProducts,
    // Nested structure for admin dashboard
    revenue: { total: Number(totalRevenue._sum.total || 0) },
    orders: { total: totalOrders },
    customers: { total: totalCustomers, new_this_month: newCustomersThisMonth },
    weekly_revenue: weeklyRevenue,
    order_status_overview: orderStatusOverview,
    top_products: topProductsWithRevenue,
    sales_by_category: salesByCategory,
  };
}

export async function getDashboardStats(user_id: string, role: string) {
  if (role === 'admin') {
    return getAnalytics();
  }

  if (role === 'warehouse') {
    const profile = await prisma.profile.findUnique({
      where: { id: user_id },
      select: { warehouse_id: true },
    });

    if (profile?.warehouse_id) {
      return getAnalytics(profile.warehouse_id);
    }
  }

  // Customer stats
  const [orders, totalSpent, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { customer_id: user_id } }),
    prisma.order.aggregate({
      where: { customer_id: user_id, payment_status: 'paid' },
      _sum: { total: true },
    }),
    prisma.wishlistItem.count({ where: { customer_id: user_id } }),
  ]);

  return {
    totalOrders: orders,
    totalSpent: totalSpent._sum.total || 0,
    wishlistCount,
  };
}

// ============================================================================
// MEDIA ASSETS (Cloudinary metadata)
// ============================================================================

export async function getMediaAssets(params?: {
  uploaded_by?: string;
  type?: string;
  folder?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.MediaAssetWhereInput = {};
  if (params?.uploaded_by) where.uploaded_by = params.uploaded_by;
  if (params?.type) where.type = params.type as any;
  if (params?.folder) where.folder = params.folder;

  return prisma.mediaAsset.findMany({
    where,
    orderBy: { created_at: 'desc' },
    take: params?.limit || 50,
    skip: params?.offset || 0,
  });
}

export async function getMediaAssetByPublicId(public_id: string) {
  return prisma.mediaAsset.findUnique({ where: { public_id } });
}

export async function createMediaAsset(data: Prisma.MediaAssetCreateInput) {
  return prisma.mediaAsset.create({ data });
}

export async function deleteMediaAsset(public_id: string) {
  return prisma.mediaAsset.delete({ where: { public_id } });
}

export async function deleteMediaAssetsByUploader(uploaded_by: string) {
  return prisma.mediaAsset.deleteMany({ where: { uploaded_by } });
}
