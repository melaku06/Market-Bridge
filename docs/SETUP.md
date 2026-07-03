# MarketBridge Setup Guide

This guide explains how to configure and run MarketBridge with PostgreSQL, Prisma ORM, and Cloudinary.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase or local)
- npm or yarn
- Cloudinary account (for image uploads)

## Environment Configuration

The `.env` file is included in the repository with all necessary configuration. No additional setup is needed for development.

### Environment Variables

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres.kpyktxpafbftdluubgmi:Jdb@93_geknUebh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.kpyktxpafbftdluubgmi:Jdb@93_geknUebh@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET=marketbridge-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (Image Uploads)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@dtolkvgly
CLOUDINARY_CLOUD_NAME=dtolkvgly
CLOUDINARY_API_KEY=qrYaYqRuuzIGGHOxTdxzyGuf2PQ
CLOUDINARY_API_SECRET=<your_api_secret>

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npm run prisma:generate
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Cloudinary Image Upload

The `/api/upload` endpoint handles image uploads to Cloudinary:

```typescript
// Upload an image
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'products');
formData.append('type', 'images');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { image } = await response.json();
// image.secure_url is the uploaded image URL
```

## Demo Accounts

Use these accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

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

## Database Schema

Managed by Prisma ORM. See `prisma/schema.prisma` for full schema.

### Core Models

- `Profile` - User accounts with role information
- `UserCredential` - Password hashes for authentication
- `Warehouse` - Warehouse/seller information
- `Product` - Product listings
- `Category` - Product categories
- `Inventory` - Stock levels per warehouse

## Production Deployment

### Security Checklist

1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS for all connections
3. Set `NODE_ENV=production`
4. Configure proper CORS settings
5. Review database RLS policies
6. Keep Cloudinary API secret secure

### Updating Environment Variables for Production

When deploying, update these values:

```env
JWT_SECRET=your-very-strong-random-secret-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
CLOUDINARY_API_SECRET=your-production-api-secret
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

### Authentication not working

1. Clear browser cookies
2. Check if the `user_credentials` table has data
3. Verify password hash exists for the user

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload` - Delete image from Cloudinary

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### User
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update profile

This guide explains how to configure and run MarketBridge with PostgreSQL authentication.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase or local)
- npm or yarn

## Environment Configuration

The `.env` file is included in the repository with the database connection strings. No additional configuration is needed for development.

### Environment Variables

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres.kpyktxpafbftdluubgmi:Jdb@93_geknUebh@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.kpyktxpafbftdluubgmi:Jdb@93_geknUebh@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET=marketbridge-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Use these accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

## Authentication System

### How It Works

1. **Registration** (`POST /api/auth/register`)
   - Creates user in `profiles` table
   - Stores bcrypt-hashed password in `user_credentials` table
   - Returns JWT token in HTTP-only cookie

2. **Login** (`POST /api/auth/login`)
   - Verifies email and password against database
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

## Database Schema

### Core Tables

- `profiles` - User accounts with role information
- `user_credentials` - Password hashes for authentication
- `warehouses` - Warehouse/seller information
- `products` - Product listings
- `categories` - Product categories
- `orders` - Customer orders
- `inventory` - Stock levels per warehouse

## Production Deployment

### Security Checklist

1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS for all connections
3. Set `NODE_ENV=production`
4. Configure proper CORS settings
5. Review database RLS policies

### Updating Environment Variables for Production

When deploying, update these values:

```env
JWT_SECRET=your-very-strong-random-secret-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Troubleshooting

### "Missing Supabase environment variables" error

If you see this error, the `.env` file is not being loaded. Make sure:
1. The `.env` file exists in the project root
2. The file contains both `DATABASE_URL` and `DIRECT_URL`
3. Restart the dev server after changing `.env`

### Authentication not working

1. Clear browser cookies
2. Check if the `user_credentials` table exists
3. Verify password hash was created for the user:
```sql
SELECT * FROM user_credentials WHERE user_id = 'user-uuid';
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### User
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update profile
