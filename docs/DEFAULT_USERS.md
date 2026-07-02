# MarketBridge Default Users

This document lists the pre-configured user accounts available in the MarketBridge platform for development, testing, and demonstration purposes.

---

## Customer Account

### Sarah Johnson (Primary Demo Customer)

| Field | Value |
|-------|-------|
| **User ID** | `usr-001` |
| **Name** | Sarah Johnson |
| **Email** | `sarah.johnson@email.com` |
| **Password** | `sarah123` |
| **Phone** | +1 (555) 123-4567 |
| **Role** | Customer |
| **Status** | Active |
| **Avatar** | [Profile Image](https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg) |

**Account Features:**
- Active order history with multiple orders in different states
- Wishlist items
- Product reviews submitted
- Product requests submitted
- Active notifications (5 total, 2 unread)

**Use this account to:**
- Browse and search products
- Add items to cart and wishlist
- Place and track orders
- Submit product reviews
- Request products not available on the platform
- Manage profile and addresses
- View notifications

---

## Warehouse Account

### Michael Brown (Warehouse Owner - Elite Warehouse)

| Field | Value |
|-------|-------|
| **User ID** | `usr-002` |
| **Name** | Michael Brown |
| **Email** | `michael.brown@elitewarehouse.com` |
| **Password** | `warehouse123` |
| **Phone** | +1 (555) 234-5678 |
| **Role** | Warehouse |
| **Status** | Active |

**Warehouse Details:**
| Field | Value |
|-------|-------|
| **Warehouse ID** | `wh-001` |
| **Warehouse Name** | Elite Warehouse |
| **Owner** | John Doe |
| **Business Type** | Electronics & Accessories |
| **Location** | Los Angeles, CA 90001 |
| **Rating** | 4.8/5.0 |
| **Total Products** | 156 |
| **Total Orders** | 3,245 |
| **Total Sales** | $245,890.50 |
| **Performance Score** | 96% |
| **Member Since** | March 15, 2023 |
| **Status** | Active |

**Account Features:**
- Product catalog management
- Inventory tracking with stock alerts
- Order fulfillment workflow
- Analytics dashboard
- Product approval requests pending

**Use this account to:**
- Add and manage products
- Track and update inventory levels
- Process customer orders
- View sales analytics and reports
- Manage warehouse profile and settings
- Respond to product approvals/rejections

---

## Administrator Account

### Admin User (Platform Administrator)

| Field | Value |
|-------|-------|
| **User ID** | `usr-003` |
| **Name** | Admin User |
| **Email** | `admin@marketbridge.com` |
| **Password** | `admin123` |
| **Phone** | +1 (555) 000-0001 |
| **Role** | Admin |
| **Status** | Active |

**Account Features:**
- Full platform administration access
- Product approval queue management
- Warehouse approval and suspension
- Customer management and moderation
- Margin and promotion configuration
- Platform-wide analytics
- Audit log access

**Use this account to:**
- Approve or reject product submissions
- Approve or suspend warehouse accounts
- Manage customer accounts (view, suspend, ban)
- Configure platform margins per category
- Create and manage promotions and banners
- View platform-wide analytics and reports
- Review audit logs for all platform activity

---

## Additional Test Accounts

### Emily Davis (Customer)

| Field | Value |
|-------|-------|
| **User ID** | `usr-004` |
| **Email** | `emily.davis@email.com` |
| **Password** | `emily123` |
| **Role** | Customer |
| **Status** | Active |

### David Wilson (Customer)

| Field | Value |
|-------|-------|
| **User ID** | `usr-005` |
| **Email** | `david.wilson@email.com` |
| **Password** | `david123` |
| **Role** | Customer |
| **Status** | Active |

### Jessica Taylor (Customer)

| Field | Value |
|-------|-------|
| **User ID** | `usr-006` |
| **Email** | `jessica.taylor@email.com` |
| **Password** | `jessica123` |
| **Role** | Customer |
| **Status** | Active |

---

## Quick Login Reference

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Customer | `sarah.johnson@email.com` | `sarah123` | `/dashboard` |
| Warehouse | `michael.brown@elitewarehouse.com` | `warehouse123` | `/warehouse` |
| Admin | `admin@marketbridge.com` | `admin123` | `/admin` |

---

## Security Notes

- These are demo accounts for development and testing purposes only
- Passwords are intentionally simple for ease of testing
- In production, implement proper authentication with:
  - Strong password requirements
  - Multi-factor authentication
  - Password hashing with bcrypt or Argon2
  - Rate limiting on login attempts
  - Session management with secure tokens

---

## Notification Counts by User

| User | Total | Unread |
|------|-------|--------|
| Sarah Johnson (usr-001) | 5 | 2 |
| Michael Brown (usr-002) | 6 | 2 |
| Admin User (usr-003) | 5 | 2 |
| Emily Davis (usr-004) | 2 | 1 |

---

## Sample Data Summary

- **Users**: 7 total (1 admin, 2 warehouse, 4 customers)
- **Warehouses**: 8 (6 active, 1 suspended, 1 pending)
- **Products**: 12 (8 published, 3 pending approval, 1 draft)
- **Orders**: 7 (2 delivered, 1 shipped, 1 processing, 2 cancelled, 1 pending)
- **Categories**: 6 active categories
- **Notifications**: 18 total across all users
