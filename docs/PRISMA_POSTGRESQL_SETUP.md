# Prisma & PostgreSQL Local Setup Guide

This guide covers setting up Prisma ORM with PostgreSQL for local development.

## The Error You Encountered

```
Error: Cannot find module '.prisma/client/default'
```

This error occurs when the Prisma Client hasn't been generated. Run this command to fix it:

```bash
npx prisma generate
```

---

## Quick Fix (If You Got the Error)

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Clear Next.js cache and restart
rm -rf .next
npm run dev
```

---

## Complete Local Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Supabase)
- npm or yarn

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Market-Bridge

# Install dependencies
npm install
```

### Step 2: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

#### Option A: Local PostgreSQL

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/marketbridge"
DIRECT_URL="postgresql://postgres:your_password@localhost:5432/marketbridge"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Option B: Supabase PostgreSQL

```env
# Supabase PostgreSQL (Connection Pooling - for app)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase PostgreSQL (Direct - for migrations)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Client (for real-time features)
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Create Database (Local PostgreSQL Only)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE marketbridge;

# Exit
\q
```

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma Client in `node_modules/@prisma/client` based on your schema.

### Step 5: Push Schema to Database

```bash
# Sync Prisma schema to database (development)
npx prisma db push
```

### Step 6: Seed Demo Data (Optional)

```bash
npm run prisma:db:seed
```

This creates demo accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

### Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## NPM Scripts Reference

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production (includes prisma generate)

# Prisma Commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:db:seed   # Seed demo data
```

---

## Why Prisma Generate is Required

Prisma uses a **code-generation** approach:

1. You define your schema in `prisma/schema.prisma`
2. `prisma generate` reads the schema and generates TypeScript types and query methods
3. The generated client is stored in `node_modules/@prisma/client`
4. Your application imports from `@prisma/client`

**You must run `prisma generate`:**
- After `npm install` (first time setup)
- After changing `prisma/schema.prisma`
- After cloning the repository
- Before building for production

---

## Troubleshooting

### Error: "Cannot find module '.prisma/client/default'"

**Cause:** Prisma Client wasn't generated.

**Fix:**
```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Error: "Can't reach database server"

**Cause:** PostgreSQL isn't running or connection string is wrong.

**Fix (Local):**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Start if stopped
sudo systemctl start postgresql   # Linux
brew services start postgresql@15 # macOS
```

**Fix (Supabase):**
- Check if your project is paused (free tier pauses after inactivity)
- Verify DATABASE_URL and DIRECT_URL in `.env`
- Check if IP restrictions are enabled in Supabase

### Error: "P2021: The table does not exist"

**Cause:** Database schema not pushed.

**Fix:**
```bash
npx prisma db push
```

### Error: "PrismaClient is unable to be run in the browser"

**Cause:** Prisma Client can only run on the server side.

**Fix:** Use `"use server"` or ensure code runs in:
- API routes (`app/api/*`)
- Server Components
- Server Actions

### Build Errors After Schema Changes

```bash
# Clear caches and regenerate
rm -rf node_modules/.prisma
rm -rf .next
npx prisma generate
npm run build
```

### Authentication Not Working

1. Check user exists in database:
```bash
npx prisma studio
# Open 'profiles' table
```

2. Check password hash exists:
```bash
# Open 'user_credentials' table in Prisma Studio
```

3. Clear browser cookies and try again

---

## Database Schema Overview

The schema is defined in `prisma/schema.prisma`:

### Core Tables

| Table | Description |
|-------|-------------|
| `profiles` | User accounts with roles (customer, warehouse, admin) |
| `user_credentials` | Password hashes for authentication |
| `warehouses` | Seller/warehouse accounts |
| `products` | Product listings |
| `categories` | Product categories |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `reviews` | Product reviews |
| `wishlist_items` | User wishlists |
| `notifications` | User notifications |

### ERD (Entity Relationship)

```
profiles ─┬─< orders ────< order_items
          │
          ├─< reviews
          ├─< wishlist_items
          ├─< notifications
          └─< addresses

warehouses ─┬─< products ────< reviews
            │               ────< wishlist_items
            │               ────< inventory
            └─< orders

categories ────< products
```

---

## Using Prisma in Your Code

### Import

```typescript
import prisma from '@/lib/prisma';
```

### Common Operations

```typescript
// Find all
const products = await prisma.product.findMany();

// Find with filter
const user = await prisma.profile.findUnique({
  where: { email: 'user@example.com' },
  include: { warehouse: true },
});

// Create
const product = await prisma.product.create({
  data: {
    name: 'New Product',
    slug: 'new-product',
    base_price: 99.99,
    warehouse_id: 'uuid',
  },
});

// Update
const updated = await prisma.product.update({
  where: { id: 'uuid' },
  data: { status: 'published' },
});

// Delete
await prisma.product.delete({
  where: { id: 'uuid' },
});

// Transaction
const result = await prisma.$transaction([
  prisma.profile.create({ data: profileData }),
  prisma.userCredential.create({ data: credentialData }),
]);
```

---

## Production Checklist

Before deploying:

1. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Set production environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Build:**
   ```bash
   npm run build
   ```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Next.js with Prisma](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

For complete local setup with Cloudinary and troubleshooting, see `docs/LOCAL_DEVELOPMENT_SETUP.md`.
