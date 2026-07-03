# MarketBridge Setup Guide

This guide explains how to configure and run MarketBridge with PostgreSQL, Prisma ORM, and Cloudinary.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase or local)
- npm or yarn
- Cloudinary account (for image uploads)

## Quick Start

The `.env` file is already configured with all necessary credentials. No additional setup is needed for development.

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Use these accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

## Environment Variables

The `.env` file contains all configuration:

```env
# PostgreSQL Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET=marketbridge-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (Image Uploads)
CLOUDINARY_URL=cloudinary://[api_key]:[api_secret]@dtolkvgly
CLOUDINARY_CLOUD_NAME=dtolkvgly
CLOUDINARY_API_KEY=qrYaYqRuuzIGGHOxTdxzyGuf2PQ
CLOUDINARY_API_SECRET=[your_api_secret]

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## NPM Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production (includes prisma generate)
npm start                # Start production server

# Prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes to database
npm run prisma:db:seed   # Seed demo data
npm run prisma:studio    # Open Prisma Studio (database GUI)

# Type Checking
npm run typecheck        # Run TypeScript type checking
npm run lint             # Run ESLint
```

## Prisma ORM

The project uses Prisma as the ORM for database operations. The schema is defined in `prisma/schema.prisma`.

### Key Models

- **Profile** - User accounts with role-based access (customer, warehouse, admin)
- **UserCredential** - Password hashes for authentication
- **Warehouse** - Seller/warehouse information
- **Product** - Product listings
- **Category** - Product categories

### Database Operations

```typescript
// Using Prisma Client
import prisma from '@/lib/prisma';

// Fetch all products
const products = await prisma.product.findMany();

// Find user by email
const user = await prisma.profile.findUnique({
  where: { email: 'user@example.com' },
  include: { credentials: true },
});

// Create new user
const user = await prisma.profile.create({
  data: {
    id: crypto.randomUUID(),
    email: 'new@example.com',
    name: 'New User',
    role: 'customer',
  },
});
```

## Cloudinary Image Upload

Images are uploaded to Cloudinary. The `/api/upload` endpoint handles uploads.

### Upload Example

```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('folder', 'products');
formData.append('type', 'images');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { image } = await response.json();
// image.secure_url is the Cloudinary URL
```

### Cloudinary Helper Functions

```typescript
import { uploadImage, deleteImage, getImageUrl } from '@/lib/cloudinary';

// Upload an image
const result = await uploadImage(base64String, { folder: 'products' });

// Get optimized URL
const url = getImageUrl('products/abc123', { width: 300, height: 300 });

// Delete an image
await deleteImage('products/abc123');
```

## Authentication System

### How It Works

1. **Registration** (`POST /api/auth/register`)
   - Creates user in `profiles` table via Prisma
   - Stores bcrypt-hashed password in `user_credentials` table
   - Returns JWT token in HTTP-only cookie

2. **Login** (`POST /api/auth/login`)
   - Verifies email and password against database via Prisma
   - Returns JWT token in HTTP-only cookie

3. **Session Check** (`GET /api/auth/me`)
   - Validates JWT token from cookie
   - Returns current user data

4. **Logout** (`POST /api/auth/logout`)
   - Clears the auth cookie

### JWT Token Structure

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "customer|warehouse|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control (RBAC)

- **Customer** (`/dashboard/*`): Browse products, manage cart, place orders
- **Warehouse** (`/warehouse/*`): Manage products, inventory, orders
- **Admin** (`/admin/*`): Full system access, manage users, warehouses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload` - Delete image from Cloudinary

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/[slug]` - Get category by slug

### Users
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update profile

## Production Deployment

### Security Checklist

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Configure proper CORS settings
4. Keep Cloudinary API secret secure
5. Use HTTPS for all connections

### Updating Environment Variables for Production

```env
JWT_SECRET=your-very-strong-random-secret-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Prisma Issues

```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Authentication Not Working

1. Clear browser cookies
2. Check if `user_credentials` table has the user's password hash
3. Verify the user exists in `profiles` table

### Database Connection Issues

```bash
# Test database connection
npm run prisma:studio
```

### Common Errors

**"P2021: No table found"**
- Run `npm run prisma:push` to sync schema to database

**".slice is not a function"**
- API returns `{ data: [...] }` format, ensure you access the `data` property

## Database Migrations

For production, use Prisma migrations:

```bash
# Create a migration
npx prisma migrate dev --name description

# Apply migrations in production
npx prisma migrate deploy
```

## File Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # Customer dashboard
│   ├── warehouse/         # Warehouse dashboard
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── cloudinary.ts     # Cloudinary helpers
│   ├── jwt.ts            # JWT utilities
│   └── auth/             # Auth service
├── prisma/                # Prisma schema
│   └── schema.prisma
└── docs/                  # Documentation
```
