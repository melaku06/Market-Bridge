# MarketBridge Notification System

The in-app notification system is the **official communication channel** between the platform and its users. Every important action performed by the system, a customer, a warehouse, or an administrator must generate accurate notifications for the appropriate users.

---

## Core Principles

### 1. Real-Time Accuracy
Notifications appear as soon as the related event occurs. Examples:
- Warehouse approves an order -> Customer immediately receives a notification
- Admin approves a product -> Warehouse immediately receives a notification
- Customer places an order -> Warehouse immediately receives a notification

### 2. User-Specific Delivery
Notifications are only visible to the intended recipient:
- Customer A must never see Customer B's notifications
- One warehouse cannot see another warehouse's notifications
- Admin notifications are visible only to administrators

### 3. Event-Driven
Notifications are created automatically by system events:
- Order created, confirmed, processing, shipped, delivered, cancelled
- Product approved, rejected, archived
- Stock running low or out of stock
- Warehouse approved, suspended

### 4. Reliable Delivery
Every generated notification must be:
- Saved before being shown
- Free of duplicates
- Assigned to the correct recipient
- Timestamped accurately

---

## Notification Categories

### Customer Notifications

| Event | Title | Priority | Icon |
|-------|-------|----------|------|
| Order Placed | Order #XXX Confirmed | High | check-circle |
| Order Processing | Order #XXX Being Prepared | High | package |
| Order Shipped | Order #XXX Shipped | High | truck |
| Order Delivered | Order #XXX Delivered | Medium | check-circle |
| Order Cancelled | Order #XXX Cancelled | High | x-circle |
| Product Request Found | Product Request Found | High | package |
| Promotion | Flash Sale - 24 Hours Only! | Medium | tag |
| Welcome | Welcome to MarketBridge! | Low | user |

### Warehouse Notifications

| Event | Title | Priority | Icon |
|-------|-------|----------|------|
| New Order | New Order #XXX Received | High | package |
| Order Ready to Ship | Order #XXX Processing Complete | High | truck |
| Product Approved | Product Approved: [Name] | Medium | check-circle |
| Product Rejected | Product Rejected: [Name] | Medium | x-circle |
| Low Stock Alert | Low Stock Alert: [Product] | High | alert-triangle |
| Out of Stock | Out of Stock: [Product] | High | alert-triangle |
| Warehouse Approved | Account Approved | High | check-circle |
| Warehouse Suspended | Account Suspended | High | alert-triangle |

### Admin Notifications

| Event | Title | Priority | Icon |
|-------|-------|----------|------|
| Product Pending Approval | New Product Pending Approval | High | package |
| Warehouse Registration | New Warehouse Registration | High | warehouse |
| Customer Blocked | Customer Account Blocked | Medium | user |
| Platform Issue | System Warning | High | alert-triangle |
| Weekly Report | Weekly Sales Report Ready | Medium | bar-chart |
| Telegram Post Failed | Telegram Posting Failed | High | alert-triangle |

---

## Notification Priority Levels

### High Priority
Requires immediate attention:
- New order received
- Product awaiting approval
- Order cancellation
- Stock alerts (out of stock)
- Critical system issues

### Medium Priority
Important updates:
- Product approved
- Inventory warning (low stock)
- Warehouse approval
- Weekly reports
- Promotions

### Low Priority
Informational:
- Welcome messages
- General announcements
- Feature updates
- Delivered order confirmations (historical)

---

## Notification Structure

```typescript
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory';
  icon: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  action_url?: string;
  created_at: string;
}
```

---

## User Interface

### Notification Bell
Located in the header of every page:
- Bell icon with unread count badge
- Badge shows number of unread notifications (max display: "9+")
- Click navigates to notifications page
- Badge color: Red for unreads

### Notifications Page
Accessible from:
- Customer: `/dashboard/notifications`
- Warehouse: `/warehouse/notifications`
- Admin: `/admin/notifications`

Features:
- Tab filtering by type (All, Orders, Promotions, Account, System)
- Mark individual notification as read
- Mark all as read button
- Chronological ordering (newest first)
- Visual distinction for unread items
- Click-to-navigate to related entity

---

## Notification Flow Examples

### Order Lifecycle

```
Customer places order
    -> Warehouse: "New Order #XXX Received" (High, unread)
    -> Customer: "Order #XXX Confirmed" (High, unread)

Warehouse processes order
    -> Customer: "Order #XXX Being Prepared" (High, unread)

Warehouse ships order
    -> Customer: "Order #XXX Shipped" (High, unread)
       + tracking number in message

Order delivered
    -> Customer: "Order #XXX Delivered" (Medium, unread)
       + prompt to leave review
```

### Product Approval Flow

```
Warehouse submits product
    -> Admin: "New Product Pending Approval" (High, unread)

Admin approves product
    -> Warehouse: "Product Approved: [Name]" (Medium, unread)

Admin rejects product
    -> Warehouse: "Product Rejected: [Name]" (Medium, unread)
       + reason in message
```

### Inventory Alert Flow

```
Stock drops below threshold
    -> Warehouse: "Low Stock Alert: [Product]" (High, unread)
       + current stock count in message

Stock reaches zero
    -> Warehouse: "Out of Stock: [Product]" (High, unread)
       + call to action to restock
```

---

## Icons Reference

| Icon Name | Lucide Component | Usage |
|-----------|------------------|-------|
| `truck` | Truck | Shipping/delivery notifications |
| `package` | Package | Orders, products |
| `check-circle` | CheckCircle | Confirmations, approvals |
| `alert-triangle` | AlertTriangle | Warnings, stock alerts |
| `tag` | Tag | Promotions, discounts |
| `x-circle` | XCircle | Rejections, cancellations |
| `user` | User | Account-related |
| `warehouse` | Warehouse | Warehouse registrations |
| `bar-chart` | BarChart | Reports, analytics |
| `bell` | Bell | General, system |

---

## Persistence & History

- Notifications persist until user reads or archives them
- Read notifications remain visible in history
- Unread count only shows unread items
- Recommended retention: 90 days for read notifications
- No automatic deletion of unread notifications

---

## Future Expansion (Out of Scope for V1)

The notification system is designed for easy future expansion:

- **Email delivery**: Duplicate in-app notification to email
- **SMS alerts**: Critical notifications via SMS
- **Push notifications**: Browser/mobile push
- **Telegram bot**: Direct messages to Telegram
- **WhatsApp Business**: Notifications via WhatsApp

Each channel would be an additional delivery method for the same notification event, while the in-app notification center remains the primary and mandatory communication channel.

---

## Implementation Notes

The notification system is considered a **core platform service** alongside:
- Order System
- Inventory System
- Authentication System

All roles (customer, warehouse, admin) depend on timely, accurate communication for the platform to function smoothly. No important event should happen silently.
