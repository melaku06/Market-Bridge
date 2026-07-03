# MarketBridge Database Schema Documentation

This document provides comprehensive documentation for the MarketBridge database schema, including all tables, relationships, enums, indexes, and business rules.

## Table of Contents

1. [Overview](#overview)
2. [Database Configuration](#database-configuration)
3. [Enums](#enums)
4. [Tables](#tables)
5. [Relationships](#relationships)
6. [Indexes](#indexes)
7. [Business Rules](#business-rules)
8. [Zod Validation](#zod-validation)
9. [Migration Guide](#migration-guide)

---

## Overview

MarketBridge uses **PostgreSQL** as its primary database with **Prisma** as the ORM. The schema supports a multi-vendor marketplace with:

- **User Management**: Customers, Warehouses, Admins
- **Product Catalog**: Categories, Products, Inventory
- **Order Processing**: Orders, Order Items, Payments
- **Customer Engagement**: Reviews, Wishlist, Product Requests
- **Platform Administration**: Notifications, Promotions, Margin Rules, Audit Logs

### Key Features

- **Row Level Security (RLS)** ready for Supabase
- **Normalized design** with proper relationships
- **Comprehensive indexes** for performance
- **Audit logging** for compliance
- **Flexible margin system** for pricing

---

## Database Configuration

### Environment Variables

```env
# PostgreSQL Connection (Required)
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Example for Local PostgreSQL
# DATABASE_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"
# DIRECT_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"

# Example for Supabase
# DATABASE_URL="postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[ref]:[password]@...pooler.supabase.com:5432/postgres"
```

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (development)
npm run prisma:push

# Create and apply migrations (production)
npx prisma migrate dev --name description
npx prisma migrate deploy

# Open Prisma Studio
npm run prisma:studio

# Seed demo data
npm run prisma:db:seed
```

---

## Enums

### UserRole
| Value | Description |
|-------|-------------|
| `customer` | Regular marketplace customer |
| `warehouse` | Seller/warehouse owner |
| `admin` | Platform administrator |

### UserStatus
| Value | Description |
|-------|-------------|
| `active` | Account is active |
| `suspended` | Temporarily restricted |
| `blocked` | Permanently banned |

### WarehouseStatus
| Value | Description |
|-------|-------------|
| `pending_approval` | Awaiting admin approval |
| `active` | Can sell products |
| `suspended` | Temporarily disabled |
| `deactivated` | Permanently closed |

### ProductStatus
| Value | Description |
|-------|-------------|
| `draft` | Work in progress |
| `pending` | Awaiting admin approval |
| `published` | Live on marketplace |
| `archived` | Removed from listing |
| `rejected` | Rejected by admin |

### OrderStatus
| Value | Description |
|-------|-------------|
| `pending` | Just placed |
| `confirmed` | Warehouse confirmed |
| `processing` | Being prepared |
| `shipped` | In transit |
| `delivered` | Successfully delivered |
| `cancelled` | Order cancelled |

### PaymentStatus
| Value | Description |
|-------|-------------|
| `pending` | Awaiting payment |
| `paid` | Payment complete |
| `failed` | Payment failed |
| `refunded` | Money returned |
| `cod` | Cash on delivery |

### StockStatus
| Value | Description |
|-------|-------------|
| `in_stock` | Available |
| `low_stock` | Below threshold |
| `out_of_stock` | No inventory |

### RequestStatus
| Value | Description |
|-------|-------------|
| `pending` | Submitted |
| `in_review` | Being reviewed |
| `found` | Added to catalog |
| `not_available` | Cannot source |

### NotificationType
| Value | Description |
|-------|-------------|
| `order` | Order updates |
| `product` | Product changes |
| `system` | System messages |
| `promotion` | Marketing |
| `account` | Account updates |
| `inventory` | Stock alerts |

### NotificationPriority
| Value | Description |
|-------|-------------|
| `high` | Immediate attention |
| `medium` | Important |
| `low` | Informational |

### PromotionType
| Value | Description |
|-------|-------------|
| `banner` | Homepage banner |
| `promotion` | General promotion |
| `flash_deal` | Time-limited deal |
| `coupon` | Discount code |

### PromotionStatus
| Value | Description |
|-------|-------------|
| `active` | Currently running |
| `inactive` | Not active |
| `paused` | Temporarily paused |

### PostStatus
| Value | Description |
|-------|-------------|
| `queued` | Waiting to send |
| `sent` | Successfully posted |
| `failed` | Failed to post |
| `retrying` | Retry in progress |

---

## Tables

### profiles

User accounts with role-based access control.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | - | Primary key |
| `email` | TEXT | NO | - | Unique email |
| `name` | TEXT | NO | - | Display name |
| `phone` | TEXT | YES | - | Phone number |
| `avatar_url` | TEXT | YES | - | Profile image URL |
| `role` | UserRole | NO | `customer` | User role |
| `status` | UserStatus | NO | `active` | Account status |
| `warehouse_id` | UUID | YES | - | Linked warehouse |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (email)`
- `FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL`

---

### user_credentials

Password hashes for authentication.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `user_id` | UUID | NO | - | FK to profiles.id |
| `password_hash` | TEXT | NO | - | bcrypt hash |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (user_id)`
- `FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE`

---

### warehouses

Seller accounts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `name` | TEXT | NO | - | Warehouse name |
| `owner_name` | TEXT | NO | - | Owner's full name |
| `email` | TEXT | NO | - | Unique email |
| `phone` | TEXT | NO | - | Contact phone |
| `address` | TEXT | NO | - | Physical address |
| `city` | TEXT | NO | - | City |
| `country` | TEXT | NO | `Ethiopia` | Country |
| `business_type` | TEXT | YES | - | Business category |
| `bank_name` | TEXT | YES | - | Bank for payments |
| `bank_account` | TEXT | YES | - | Bank account number |
| `tax_id` | TEXT | YES | - | Tax identification |
| `status` | WarehouseStatus | NO | `pending_approval` | Account status |
| `member_since` | DATE | NO | `CURRENT_DATE` | Join date |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (email)`

---

### categories

Product categories with hierarchy support.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `name` | TEXT | NO | - | Unique name |
| `slug` | TEXT | NO | - | URL-friendly name |
| `description` | TEXT | YES | - | Description |
| `image_url` | TEXT | YES | - | Category image |
| `parent_id` | UUID | YES | - | Parent category |
| `is_active` | BOOLEAN | NO | `true` | Active status |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (name)`
- `UNIQUE (slug)`
- `FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL`

---

### products

Product catalog.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `name` | TEXT | NO | - | Product name |
| `slug` | TEXT | NO | - | URL-friendly name |
| `description` | TEXT | YES | - | Full description |
| `short_description` | TEXT | YES | - | Brief summary |
| `warehouse_id` | UUID | NO | - | Seller FK |
| `category_id` | UUID | YES | - | Category FK |
| `base_price` | DECIMAL(15,2) | NO | - | Cost price |
| `margin_percent` | DECIMAL(5,2) | NO | `15` | Margin rate |
| `discount_percent` | DECIMAL(5,2) | NO | `0` | Discount rate |
| `images` | TEXT[] | NO | `[]` | Image URLs |
| `rating` | DECIMAL(2,1) | NO | `0` | Average rating |
| `review_count` | INT | NO | `0` | Number of reviews |
| `sold_count` | INT | NO | `0` | Units sold |
| `status` | ProductStatus | NO | `pending` | Publication status |
| `tags` | TEXT[] | NO | `[]` | Search tags |
| `brand` | TEXT | YES | - | Brand name |
| `sku` | TEXT | YES | - | Stock keeping unit |
| `weight` | TEXT | YES | - | Product weight |
| `colors` | TEXT[] | NO | `[]` | Available colors |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (slug)`
- `UNIQUE (sku)`
- `FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE`
- `FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL`

**Pricing Formula:**
```
final_price = base_price * (1 + margin_percent/100)
display_price = final_price * (1 - discount_percent/100)
```

---

### inventory

Stock tracking per warehouse.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `warehouse_id` | UUID | NO | - | Warehouse FK |
| `product_id` | UUID | NO | - | Product FK |
| `quantity` | INT | NO | `0` | Current stock |
| `reserved_quantity` | INT | NO | `0` | Reserved by orders |
| `low_stock_threshold` | INT | NO | `10` | Alert threshold |
| `status` | StockStatus | NO | `in_stock` | Stock level |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (warehouse_id, product_id)`
- `FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE`
- `FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`

**Stock Calculations:**
```
available_stock = quantity - reserved_quantity
if available_stock == 0: status = 'out_of_stock'
elif available_stock <= low_stock_threshold: status = 'low_stock'
else: status = 'in_stock'
```

---

### orders

Customer orders.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | TEXT | NO | - | Primary key (cuid) |
| `order_number` | TEXT | NO | - | Human-readable ID |
| `customer_id` | UUID | NO | - | Customer FK |
| `warehouse_id` | UUID | NO | - | Warehouse FK |
| `customer_name` | TEXT | NO | - | Customer name |
| `customer_email` | TEXT | NO | - | Customer email |
| `customer_phone` | TEXT | YES | - | Customer phone |
| `subtotal` | DECIMAL(15,2) | NO | - | Subtotal |
| `shipping_fee` | DECIMAL(15,2) | NO | `0` | Shipping cost |
| `discount` | DECIMAL(15,2) | NO | `0` | Discount amount |
| `tax` | DECIMAL(15,2) | NO | `0` | Tax amount |
| `total` | DECIMAL(15,2) | NO | - | Grand total |
| `shipping_address` | TEXT | NO | - | Full address |
| `shipping_city` | TEXT | NO | - | City |
| `shipping_method` | TEXT | NO | - | Delivery method |
| `payment_method` | TEXT | NO | - | Payment type |
| `payment_status` | PaymentStatus | NO | `pending` | Payment state |
| `status` | OrderStatus | NO | `pending` | Order state |
| `tracking_number` | TEXT | YES | - | Shipping tracking |
| `notes` | TEXT | YES | - | Order notes |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (order_number)`
- `FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE`
- `FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE`

**Order Number Format:**
```
MB-{timestamp_base36}-{random_4_chars}
Example: MB-LKJH8X-ABCD
```

---

### order_items

Individual products in an order.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `order_id` | TEXT | NO | - | Order FK |
| `product_id` | UUID | NO | - | Product FK |
| `product_name` | TEXT | NO | - | Product name (snapshot) |
| `product_image` | TEXT | YES | - | Product image (snapshot) |
| `quantity` | INT | NO | - | Units ordered |
| `unit_price` | DECIMAL(15,2) | NO | - | Price per unit |
| `total_price` | DECIMAL(15,2) | NO | - | Line total |
| `color` | TEXT | YES | - | Selected color |
| `size` | TEXT | YES | - | Selected size |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE`

---

### addresses

Customer shipping addresses.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `customer_id` | UUID | NO | - | Customer FK |
| `label` | TEXT | NO | `Home` | Address label |
| `recipient_name` | TEXT | NO | - | Recipient name |
| `phone` | TEXT | YES | - | Contact phone |
| `address` | TEXT | NO | - | Street address |
| `city` | TEXT | NO | - | City |
| `country` | TEXT | NO | `Ethiopia` | Country |
| `is_default` | BOOLEAN | NO | `false` | Default flag |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE`

**Business Rule:** Only one address per customer can have `is_default = true`.

---

### reviews

Product reviews and ratings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `customer_id` | UUID | NO | - | Customer FK |
| `product_id` | UUID | NO | - | Product FK |
| `customer_name` | TEXT | NO | - | Reviewer name |
| `product_name` | TEXT | NO | - | Product name |
| `rating` | INT | NO | - | Rating (1-5) |
| `comment` | TEXT | YES | - | Review text |
| `product_image` | TEXT | YES | - | Product image |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE`
- `FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`

**Rating Calculation:**
```sql
-- Product avg rating and count (trigger update)
SELECT 
  AVG(rating) as rating,
  COUNT(*) as review_count
FROM reviews
WHERE product_id = ?
```

---

### wishlist_items

Customer saved products.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `customer_id` | UUID | NO | - | Customer FK |
| `product_id` | UUID | NO | - | Product FK |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (customer_id, product_id)`
- `FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE`
- `FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`

---

### product_requests

Customer product requests.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `customer_id` | UUID | NO | - | Customer FK |
| `customer_email` | TEXT | NO | - | Customer email |
| `product_name` | TEXT | NO | - | Requested product |
| `description` | TEXT | NO | - | Details |
| `category` | TEXT | YES | - | Product category |
| `brand` | TEXT | YES | - | Preferred brand |
| `image_url` | TEXT | YES | - | Reference image |
| `status` | RequestStatus | NO | `pending` | Request status |
| `admin_notes` | TEXT | YES | - | Admin response |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (customer_id) REFERENCES profiles(id) ON DELETE CASCADE`

---

### notifications

User notifications.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NO | - | User FK |
| `type` | NotificationType | NO | - | Category |
| `priority` | NotificationPriority | NO | `medium` | Urgency |
| `title` | TEXT | NO | - | Title |
| `message` | TEXT | NO | - | Message body |
| `data` | TEXT | YES | - | JSON metadata |
| `action_url` | TEXT | YES | - | Link |
| `is_read` | BOOLEAN | NO | `false` | Read status |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE`

---

### promotions

Marketing content.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `title` | TEXT | NO | - | Promotion title |
| `type` | PromotionType | NO | `banner` | Content type |
| `image_url` | TEXT | YES | - | Image |
| `target_url` | TEXT | YES | - | Click target |
| `location` | TEXT | YES | - | Display location |
| `target_audience` | TEXT | NO | `All Users` | Target segment |
| `status` | PromotionStatus | NO | `inactive` | Active status |
| `start_date` | TIMESTAMPTZ | YES | - | Campaign start |
| `end_date` | TIMESTAMPTZ | YES | - | Campaign end |
| `impressions` | INT | NO | `0` | View count |
| `clicks` | INT | NO | `0` | Click count |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`

---

### margin_rules

Category/product margin configuration.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `category_id` | UUID | YES | - | Category FK |
| `product_id` | UUID | YES | - | Product FK |
| `category_name` | TEXT | YES | - | Category name |
| `warehouse_margin` | DECIMAL(5,2) | NO | - | Seller margin % |
| `platform_margin` | DECIMAL(5,2) | NO | - | Platform margin % |
| `total_margin` | DECIMAL(5,2) | NO | - | Combined % |
| `is_active` | BOOLEAN | NO | `true` | Active status |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`
- `UNIQUE (product_id)`
- `FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL`

**Business Rule:** `total_margin = warehouse_margin + platform_margin`

---

### audit_logs

Platform activity logging.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `actor_id` | TEXT | NO | - | User who performed action |
| `actor_name` | TEXT | NO | - | User name |
| `actor_role` | TEXT | NO | - | User role |
| `action` | TEXT | NO | - | Action type |
| `entity_type` | TEXT | NO | - | Entity affected |
| `entity_id` | TEXT | NO | - | Entity ID |
| `before_state` | TEXT | YES | - | JSON before |
| `after_state` | TEXT | YES | - | JSON after |
| `ip_address` | TEXT | YES | - | Client IP |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Action time |

**Constraints:**
- `PRIMARY KEY (id)`

**Logged Actions:**
- `PRODUCT_CREATED`, `PRODUCT_APPROVED`, `PRODUCT_REJECTED`
- `ORDER_PLACED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`
- `USER_SUSPENDED`, `USER_BLOCKED`
- `WAREHOUSE_APPROVED`, `WAREHOUSE_SUSPENDED`

---

### telegram_posts

Telegram marketing posts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `product_id` | UUID | NO | - | Product FK |
| `product_name` | TEXT | NO | - | Product name |
| `channel` | TEXT | NO | - | Telegram channel |
| `message` | TEXT | NO | - | Post content |
| `status` | PostStatus | NO | `queued` | Post status |
| `error` | TEXT | YES | - | Error message |
| `sent_at` | TIMESTAMPTZ | YES | - | Send time |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation time |

**Constraints:**
- `PRIMARY KEY (id)`
- `FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE`

---

### system_settings

Platform configuration (singleton).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | TEXT | NO | - | Primary key (cuid) |
| `site_name` | TEXT | NO | `MarketBridge` | Platform name |
| `site_tagline` | TEXT | NO | - | Tagline |
| `site_email` | TEXT | NO | - | Support email |
| `site_phone` | TEXT | YES | - | Support phone |
| `currency` | TEXT | NO | `ETB` | Default currency |
| `timezone` | TEXT | NO | `Africa/Addis_Ababa` | Default timezone |
| `date_format` | TEXT | NO | `DD/MM/YYYY` | Date format |
| `time_format` | TEXT | NO | `24 Hour` | Time format |
| `items_per_page` | INT | NO | `10` | Default pagination |
| `maintenance_mode` | BOOLEAN | NO | `false` | Maintenance flag |
| `site_language` | TEXT | NO | `English` | Default language |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update |

**Constraints:**
- `PRIMARY KEY (id)`

---

## Relationships

```
profiles (User)
├── 1:1 → user_credentials
├── N:1 → warehouses (via warehouse_id)
├── 1:N → addresses
├── 1:N → orders
├── 1:N → reviews
├── 1:N → wishlist_items
├── 1:N → product_requests
└── 1:N → notifications

warehouses (Seller)
├── 1:N → profiles (warehouse users)
├── 1:N → products
├── 1:N → inventory
└── 1:N → orders

categories (Hierarchical)
├── N:1 → categories (parent)
├── 1:N → categories (children)
├── 1:N → products
└── 1:N → margin_rules

products
├── N:1 → warehouses
├── N:1 → categories
├── 1:N → inventory
├── 1:N → reviews
├── 1:N → wishlist_items
└── 1:N → telegram_posts

orders
├── N:1 → profiles (customer)
├── N:1 → warehouses
└── 1:N → order_items

margin_rules
├── N:1 → categories (optional)
└── 1:1 → products (optional, unique)
```

---

## Indexes

### Critical Indexes

```sql
-- User lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_warehouse_id ON profiles(warehouse_id);

-- Product searches
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_warehouse_id ON products(warehouse_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);

-- Order queries
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_warehouse_id ON orders(warehouse_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Inventory tracking
CREATE UNIQUE INDEX idx_inventory_unique ON inventory(warehouse_id, product_id);
CREATE INDEX idx_inventory_status ON inventory(status);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Audit logs
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## Business Rules

### Product Approval Workflow

```
Warehouse creates product
    ↓
Status: draft → pending
    ↓
Admin reviews
    ↓
┌───────────────┬────────────────┐
│   APPROVE     │    REJECT      │
↓               ↓
Status: published   Status: rejected
│               │
Visible on site  Not visible
│               │
Warehouse notified  Warehouse notified
```

### Order Lifecycle

```
Customer places order
    ↓
Status: pending, Payment: pending/cod
    ↓
Warehouse confirms
    ↓
Status: confirmed
    ↓
Warehouse processes
    ↓
Status: processing
    ↓
Warehouse ships
    ↓
Status: shipped, Tracking added
    ↓
Customer receives
    ↓
Status: delivered
    ↓
Customer can review
```

### Inventory Management

```
Order placed
    ↓
reserved_quantity += order_item.quantity
available_quantity = quantity - reserved_quantity
    ↓
If available_quantity <= 0:
    status = 'out_of_stock'
    NOTIFICATION: out_of_stock → warehouse
    ↓
Elif available_quantity <= low_stock_threshold:
    status = 'low_stock'
    NOTIFICATION: low_stock → warehouse
    ↓
Else:
    status = 'in_stock'
```

### Margin Calculation

```
base_price (from warehouse)
    ↓
Look up margin_rule by category_id or default
    ↓
warehouse_margin = margin_rule.warehouse_margin
platform_margin = margin_rule.platform_margin
    ↓
margin_percent = warehouse_margin + platform_margin
    ↓
final_price = base_price * (1 + margin_percent/100)
    ↓
If discount_percent > 0:
    display_price = final_price * (1 - discount_percent/100)
```

---

## Zod Validation

All input data is validated using Zod schemas before database operations.

### Location
```
lib/validations/
├── index.ts      # Re-exports all schemas
├── auth.ts       # Login, register, password
├── user.ts       # Profile, user status
├── product.ts    # Product, inventory
├── order.ts      # Order, order items
├── warehouse.ts  # Warehouse management
└── common.ts     # Address, review, notification, etc.
```

### Usage Example

```typescript
import { productCreateSchema } from '@/lib/validations';

// Validate API request
export async function POST(request: Request) {
  const body = await request.json();

  const result = productCreateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    );
  }

  // Use validated data
  const product = await prisma.product.create({
    data: result.data,
  });

  return NextResponse.json(product);
}
```

---

## Migration Guide

### From Mock Database to PostgreSQL

1. **Set up database connection**
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

2. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

3. **Push schema to database**
   ```bash
   npm run prisma:push
   ```

4. **Seed demo data**
   ```bash
   npm run prisma:db:seed
   ```

### Production Deployment

1. **Create migration**
   ```bash
   npx prisma migrate dev --name initial_schema
   ```

2. **Apply in production**
   ```bash
   npx prisma migrate deploy
   ```

3. **Set production env vars**
   ```env
   DATABASE_URL="<production-url>"
   DIRECT_URL="<production-direct-url>"
   JWT_SECRET="<strong-random-secret>"
   NODE_ENV=production
   ```

### Supabase RLS Policies

For Supabase deployments, enable Row Level Security:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Example: Users can only read their own data
CREATE POLICY "users_read_own" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Example: Products visible when published or owner
CREATE POLICY "products_read" ON products
  FOR SELECT TO authenticated
  USING (
    status = 'published' OR
    warehouse_id IN (
      SELECT warehouse_id FROM profiles WHERE id = auth.uid()
    )
  );
```

---

## Summary

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User accounts | Role-based, status tracking |
| `user_credentials` | Password storage | bcrypt hashing, cascade delete |
| `warehouses` | Seller accounts | Approval workflow, business info |
| `categories` | Product taxonomy | Hierarchical, slugs |
| `products` | Product catalog | Status workflow, pricing, images |
| `inventory` | Stock tracking | Per-warehouse, reservations |
| `orders` | Customer orders | Status lifecycle, payment tracking |
| `order_items` | Order contents | Product snapshot, line totals |
| `addresses` | Shipping addresses | Multi-address, default flag |
| `reviews` | Product ratings | 1-5 scale, computed averages |
| `wishlist_items` | Saved products | Unique per user-product |
| `product_requests` | Customer requests | Status workflow |
| `notifications` | User alerts | Type, priority, read status |
| `promotions` | Marketing content | Campaign tracking |
| `margin_rules` | Pricing config | Category/product level |
| `audit_logs` | Activity tracking | Before/after states |
| `telegram_posts` | Marketing posts | Queue status |
| `system_settings` | Configuration | Singleton |

**Total Tables: 18**

---

For API documentation, see [SETUP.md](./SETUP.md).
For local setup instructions, see [LOCAL_DEVELOPMENT_SETUP.md](./LOCAL_DEVELOPMENT_SETUP.md).
