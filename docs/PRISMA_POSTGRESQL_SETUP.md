# Prisma & PostgreSQL Local Setup Guide

This guide covers setting up Prisma ORM with local PostgreSQL for development.

## The Error You May Encounter

```
Error: Cannot find module '.prisma/client/default'
```

**Fix:** Run `npx prisma generate` to generate the Prisma Client.

---

## Quick Start

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE marketbridge;

# Exit
\q
```

### 2. Configure Environment

Your `.env` is already configured for local PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:2134@localhost:5432/marketbridge"
DIRECT_URL="postgresql://postgres:2134@localhost:5432/marketbridge"
JWT_SECRET=marketbridge-super-secret-jwt-key-2024-production
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# (Optional) Seed demo data
npm run prisma:db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

---

## NPM Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:db:seed   # Seed demo data
```

---

## Why Prisma Generate is Required

Prisma uses code-generation:

1. You define schema in `prisma/schema.prisma`
2. `prisma generate` creates TypeScript types and query methods
3. Generated client is stored in `node_modules/@prisma/client`

**Run `prisma generate`:**
- After `npm install`
- After changing `prisma/schema.prisma`
- After cloning the repository

---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `profiles` | User accounts with roles |
| `user_credentials` | Password hashes |
| `warehouses` | Seller accounts |
| `products` | Product listings |
| `categories` | Product categories |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `reviews` | Product reviews |
| `notifications` | User notifications |

### Entity Relationships

```
profiles ─┬─< orders ────< order_items
          ├─< reviews
          ├─< wishlist_items
          └─< notifications

warehouses ─┬─< products
            └─< orders

categories ────< products
```

---

## Troubleshooting

### Error: "Cannot find module '.prisma/client/default'"

```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Error: "Can't reach database server"

Check PostgreSQL is running:

```bash
# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS
brew services list
brew services start postgresql@15

# Windows - check Services app
```

### Error: "password authentication failed"

Update your `.env` with correct password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/marketbridge"
```

### Error: "database 'marketbridge' does not exist"

```bash
psql -U postgres -c "CREATE DATABASE marketbridge;"
```

### Error: "P2021: The table does not exist"

```bash
npx prisma db push
```

---

## Using Prisma in Code

```typescript
import prisma from '@/lib/prisma';

// Find all products
const products = await prisma.product.findMany();

// Find user by email
const user = await prisma.profile.findUnique({
  where: { email: 'user@example.com' },
});

// Create product
const product = await prisma.product.create({
  data: {
    name: 'New Product',
    slug: 'new-product',
    base_price: 99.99,
    warehouse_id: 'uuid',
  },
});

// Transaction
const result = await prisma.$transaction([
  prisma.profile.create({ data: profileData }),
  prisma.userCredential.create({ data: credentialData }),
]);
```

---

## Realtime Notifications (Optional)

By default, the app uses local PostgreSQL without realtime features. Notifications work via polling (every 30 seconds).

To enable realtime notifications with Supabase:

1. Add to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Enable realtime in Supabase dashboard for the `notifications` table

---

## Production Deployment

1. Set production environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
