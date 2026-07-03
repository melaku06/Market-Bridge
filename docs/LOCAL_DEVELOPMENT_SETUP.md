# MarketBridge Local Development Setup Guide

This guide explains how to set up MarketBridge on your local machine with either a local PostgreSQL database or Supabase cloud database.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Local PostgreSQL Setup](#local-postgresql-setup)
4. [Supabase Setup](#supabase-setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Initialization](#database-initialization)
7. [Running the Application](#running-the-application)
8. [Demo Accounts](#demo-accounts)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure the following are installed on your system:

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |
| npm | 9+ | Comes with Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com/) |

### Verify Installations

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
psql --version    # Should be 15.x or higher
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd Market-Bridge

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env with your database credentials (see sections below)

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Push database schema
npm run prisma:push

# 7. (Optional) Seed demo data
npm run prisma:seed

# 8. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Local PostgreSQL Setup

### Step 1: Install PostgreSQL

#### Windows
1. Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the wizard
3. Remember the password you set for the `postgres` user

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database and User

 Open your terminal and run:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# In the PostgreSQL shell, run:
```

```sql
-- Create a dedicated user for MarketBridge
CREATE USER marketbridge WITH PASSWORD 'your_secure_password_here';

-- Create the database
CREATE DATABASE marketbridge OWNER marketbridge;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE marketbridge TO marketbridge;

-- Connect to the database
\c marketbridge

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO marketbridge;

-- Exit
\q
```

### Step 3: Configure Environment

Edit your `.env` file:

```env
# Local PostgreSQL Configuration
DATABASE_URL="postgresql://marketbridge:your_secure_password_here@localhost:5432/marketbridge"
DIRECT_URL="postgresql://marketbridge:your_secure_password_here@localhost:5432/marketbridge"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Supabase (optional, only if switching to Supabase later)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Initialize Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Create tables in database (development)
npm run prisma:push

# (Optional) Seed demo data
npm run prisma:db:seed
```

### Step 5: Verify Connection

```bash
# Open Prisma Studio to view your database
npm run prisma:studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) where you can view and edit data.

---

## Supabase Setup

Supabase is a managed PostgreSQL service. Switching to Supabase only requires changing environment variables.

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name (e.g., `marketbridge`)
4. Set a strong database password
5. Choose a region close to your users
6. Click "Create new project"

### Step 2: Get Connection Strings

1. In Supabase Dashboard, go to **Project Settings** > **Database**
2. Scroll to **Connection string** section
3. Copy both connection strings:

#### Connection Pooling (for Prisma)
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### Direct Connection (for migrations)
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### Step 3: Get API Keys

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 4: Configure Environment

Edit your `.env` file:

```env
# Supabase PostgreSQL Database
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Client (for real-time features, auth, storage)
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 5: Initialize Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to Supabase database
npm run prisma:push

# (Optional) Seed demo data
npm run prisma:db:seed
```

### Step 6: Enable Row Level Security (Supabase Only)

Supabase requires RLS policies for security. The migration files in `supabase/migrations/` handle this.

If using a fresh Supabase project, apply migrations:

```bash
# Apply migrations (if you have Supabase CLI installed)
npx supabase db push
```

Or manually run the SQL files in the Supabase SQL Editor.

---

## Environment Configuration

### Complete .env.example Reference

```env
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

# Option 1: Local PostgreSQL
# DATABASE_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"
# DIRECT_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"

# Option 2: Supabase PostgreSQL
# DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# =============================================================================
# SUPABASE CLIENT (Optional - for real-time, auth, storage features)
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# =============================================================================
# JWT AUTHENTICATION
# =============================================================================
# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# =============================================================================
# CLOUDINARY (Image Upload Service)
# =============================================================================
# Get these from: https://cloudinary.com/console
CLOUDINARY_URL=cloudinary://[api_key]:[api_secret]@[cloud_name]
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Security Notes

1. **Never commit `.env` to version control**
2. Use different secrets for development and production
3. Generate a strong JWT secret: `openssl rand -base64 32`
4. Rotate secrets periodically

---

## Database Initialization

### Step 1: Generate Prisma Client

Prisma Client is generated from your schema:

```bash
npm run prisma:generate
```

Or with direct command:

```bash
npx prisma generate
```

### Step 2: Push Schema to Database

For development (without migrations):

```bash
npm run prisma:push
```

This directly syncs your Prisma schema to the database.

### Step 3: Seed Demo Data (Optional)

```bash
npm run prisma:db:seed
```

This creates demo users and sample products:

| Email | Password | Role |
|-------|----------|------|
| admin@demo.com | demo123 | Admin |
| customer@demo.com | demo123 | Customer |
| warehouse@demo.com | demo123 | Warehouse |

### Step 4: Verify Setup

```bash
# Open Prisma Studio
npm run prisma:studio

# Or query directly
npx prisma db execute --stdin <<EOF
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
EOF
```

### Production Migrations

For production deployments, use proper migrations:

```bash
# Create a migration
npx prisma migrate dev --name description_of_change

# Apply migrations in production
npx prisma migrate deploy
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application runs at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema changes to database |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:db:seed` | Seed demo data |

---

## Demo Accounts

After seeding the database, use these accounts:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@demo.com | demo123 | Admin | `/admin/*` - Full system access |
| customer@demo.com | demo123 | Customer | `/dashboard/*` - Shopping features |
| warehouse@demo.com | demo123 | Warehouse | `/warehouse/*` - Inventory management |

---

## Troubleshooting

### Database Connection Issues

#### Error: "Can't reach database server"

**Local PostgreSQL:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Start if stopped
sudo systemctl start postgresql   # Linux
brew services start postgresql@15 # macOS
```

**Supabase:**
- Check if your IP is whitelisted (Project Settings > Database)
- Verify connection string is correct
- Check if project is paused (free tier pauses after inactivity)

#### Error: "password authentication failed"

```bash
# Reset PostgreSQL password (local)
psql -U postgres
ALTER USER marketbridge WITH PASSWORD 'new_password';
```

Update your `.env` file with the new password.

#### Error: "database 'marketbridge' does not exist"

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE marketbridge;"
```

### Prisma Issues

#### Error: "Prisma Client could not be generated"

```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
npm install @prisma/client
npm run prisma:generate
```

#### Error: "Table does not exist"

```bash
# Sync schema to database
npm run prisma:push
```

#### Error: "P2021: The table does not exist"

The schema hasn't been pushed to the database:

```bash
npm run prisma:push
```

### Build Issues

#### Error: "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules
rm -rf .next
npm install
```

#### Error: "Type error"

```bash
# Regenerate Prisma Client (most common fix)
npm run prisma:generate

# Then rebuild
npm run build
```

### Authentication Issues

#### Can't log in with demo accounts

1. Ensure database is seeded:
   ```bash
   npm run prisma:db:seed
   ```

2. Check if user exists:
   ```bash
   npm run prisma:studio
   # Open profiles table
   ```

3. Verify password in `user_credentials` table

#### JWT token errors

1. Ensure `JWT_SECRET` is set in `.env`
2. Clear browser cookies
3. Restart development server

### Cloudinary Upload Issues

#### Error: "Invalid API key"

1. Verify credentials in `.env`
2. Check Cloudinary dashboard for correct values
3. Ensure API secret is correct (not API key)

#### Error: "Upload preset not found"

Cloudinary setup is correct; the issue is the upload preset configuration.

---

## Switching Between Local and Supabase

To switch databases, simply update the `.env` file:

### Local PostgreSQL → Supabase

```env
# Comment out local
# DATABASE_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"
# DIRECT_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"

# Uncomment Supabase
DATABASE_URL="postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@...pooler.supabase.com:5432/postgres"
```

### Supabase → Local PostgreSQL

```env
# Comment out Supabase
# DATABASE_URL="postgresql://postgres.[ref]:[password]@..."
# DIRECT_URL="postgresql://postgres.[ref]:[password]@..."

# Uncomment local
DATABASE_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"
DIRECT_URL="postgresql://marketbridge:password@localhost:5432/marketbridge"
```

After changing, regenerate Prisma Client:

```bash
npm run prisma:generate
npm run prisma:push  # If target database is empty
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│  Pages (app/)                                                │
│  ├── admin/         → Admin dashboard                        │
│  ├── dashboard/     → Customer dashboard                    │
│  ├── warehouse/     → Warehouse dashboard                   │
│  └── api/           → REST API endpoints                    │
├─────────────────────────────────────────────────────────────┤
│  Components (components/)                                    │
│  ├── ui/            → Shadcn/UI components                   │
│  ├── layout/        → Header, Footer, Sidebar                │
│  └── dashboard/     → Dashboard-specific components          │
├─────────────────────────────────────────────────────────────┤
│  Libraries (lib/)                                            │
│  ├── prisma.ts      → Prisma client singleton                │
│  ├── auth/          → Authentication service                 │
│  └── cloudinary.ts  → Image upload service                   │
├─────────────────────────────────────────────────────────────┤
│  State Management (stores/)                                 │
│  └── Zustand stores for client-side state                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  (Local or Supabase)                                         │
├─────────────────────────────────────────────────────────────┤
│  Tables:                                                     │
│  ├── profiles        → Users with roles                      │
│  ├── user_credentials → Password hashes                     │
│  ├── warehouses      → Seller accounts                       │
│  ├── products        → Product listings                      │
│  ├── categories      → Product categories                    │
│  └── ...            → Other entities                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. Review the full schema: `prisma/schema.prisma`
2. Read API documentation: `docs/SETUP.md`
3. Understand RBAC: `docs/DEFAULT_USERS.md`
4. Start the dev server: `npm run dev`

For production deployment, see the deployment section in `docs/SETUP.md`.
