# Prisma 7 & PostgreSQL Local Setup Guide

This guide covers setting up Prisma 7 ORM with local PostgreSQL for development.

## The Error You May Encounter

```
Error: Cannot find module '.prisma/client/default'
```

**Fix:** Run `pnpm prisma generate` to generate the Prisma Client.

---

## Quick Start

### 1. Create PostgreSQL Databases

```bash
# Connect to PostgreSQL
psql -U postgres

# Create main database
CREATE DATABASE marketbridge;

# Create shadow database (required for Prisma 7 migrations)
CREATE DATABASE marketbridge_shadow;

# Exit
\q
```

### 2. Configure Environment

Your `.env` should have:

```env
DATABASE_URL="postgresql://postgres:2134@localhost:5432/marketbridge"
DIRECT_URL="postgresql://postgres:2134@localhost:5432/marketbridge"
SHADOW_DATABASE_URL="postgresql://postgres:2134@localhost:5432/marketbridge_shadow"
JWT_SECRET=your-jwt-secret
```

### 3. Initialize Database

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Push schema to database (creates all tables)
pnpm prisma:push

# Seed demo data
pnpm prisma:db:seed
```

### 4. Start Development Server

```bash
pnpm dev
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
pnpm dev              # Start development server
pnpm build            # Build for production

# Prisma
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:push      # Push schema to database
pnpm prisma:studio    # Open Prisma Studio GUI
pnpm prisma:db:seed   # Seed demo data
```

---

## Why Prisma Generate is Required

Prisma uses code-generation:

1. You define schema in `prisma/schema.prisma`
2. `prisma generate` creates TypeScript types and query methods
3. Generated client is stored in `node_modules/@prisma/client`

**Run `prisma generate`:**
- After `pnpm install`
- After changing `prisma/schema.prisma`
- After cloning the repository

---

## Prisma 7 Configuration

Prisma 7 uses a new configuration format:

### `prisma.config.ts`

```typescript
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: {
    datasourceUrl: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
```

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

Note: URLs are now in `prisma.config.ts`, not in the schema file.

### `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const adapter = new PrismaPg(new pg.Pool({ connectionString: process.env.DATABASE_URL }));
export const prisma = new PrismaClient({ adapter });

export default prisma;
```

---

## Troubleshooting

### Error: "Cannot find module '.prisma/client/default'"

```bash
pnpm prisma generate
rm -rf .next
pnpm dev
```

### Error: "Can't reach database server at `localhost:5432`"

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
psql -U postgres -c "CREATE DATABASE marketbridge_shadow;"
```

### Error: "The table does not exist"

```bash
pnpm prisma:push
```

### Error: "shadow database appears to be the same as the main database"

Create a shadow database:

```bash
psql -U postgres -c "CREATE DATABASE marketbridge_shadow;"
```

Then add to `.env`:

```env
SHADOW_DATABASE_URL="postgresql://postgres:2134@localhost:5432/marketbridge_shadow"
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

---

## Additional Resources

- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
