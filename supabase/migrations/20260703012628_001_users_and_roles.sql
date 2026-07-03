/*
# Users and Roles Schema

This migration sets up the authentication system for MarketBridge with three user types:
1. **customers** - End users who browse and purchase products
2. **warehouses** - Business users who sell products on the platform
3. **admins** - Platform administrators who manage the marketplace

## Tables Created

### profiles
Extends Supabase auth.users with additional profile information:
- `id` (uuid) - Primary key, references auth.users
- `email` (text) - User email address
- `name` (text) - Full name
- `phone` (text) - Phone number
- `avatar_url` (text) - Profile picture URL
- `role` (text) - User role: 'customer', 'warehouse', or 'admin'
- `warehouse_id` (uuid) - Optional reference to warehouse for warehouse users
- `is_active` (boolean) - Account status
- `created_at` (timestamp) - Account creation time
- `updated_at` (timestamp) - Last update time

### warehouses
Business profiles for warehouse/seller accounts:
- `id` (uuid) - Primary key
- `name` (text) - Business name
- `owner_name` (text) - Owner's name
- `email` (text) - Business email
- `phone` (text) - Business phone
- `address` (text) - Street address
- `city` (text) - City
- `country` (text) - Country (default: Ethiopia)
- `business_type` (text) - Type of business
- `bank_name` (text) - Bank name for payouts
- `bank_account` (text) - Bank account number
- `tax_id` (text) - Tax identification number
- `status` (text) - 'pending_approval', 'active', 'suspended', 'deactivated'
- `member_since` (date) - Join date
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security
- RLS enabled on all tables
- Owner-scoped policies for profiles (users can only access their own data)
- Warehouse-scoped policies for warehouses table
- Admin has read access to all data for management purposes
*/

-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'warehouse', 'admin')),
  warehouse_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Ethiopia',
  business_type text,
  bank_name text,
  bank_account text,
  tax_id text,
  status text NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'suspended', 'deactivated')),
  member_since date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add warehouse_id foreign key to profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_warehouse_id_fkey;
ALTER TABLE profiles ADD CONSTRAINT profiles_warehouse_id_fkey 
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Warehouses policies
DROP POLICY IF EXISTS "Warehouse owners can view own warehouse" ON warehouses;
CREATE POLICY "Warehouse owners can view own warehouse"
ON warehouses FOR SELECT
TO authenticated
USING (
  id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Warehouse owners can update own warehouse" ON warehouses;
CREATE POLICY "Warehouse owners can update own warehouse"
ON warehouses FOR UPDATE
TO authenticated
USING (
  id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
)
WITH CHECK (
  id IN (SELECT warehouse_id FROM profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all warehouses" ON warehouses;
CREATE POLICY "Admins can manage all warehouses"
ON warehouses FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_warehouse_id ON profiles(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_status ON warehouses(status);
CREATE INDEX IF NOT EXISTS idx_warehouses_email ON warehouses(email);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_warehouses_updated_at ON warehouses;
CREATE TRIGGER handle_warehouses_updated_at
BEFORE UPDATE ON warehouses
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();