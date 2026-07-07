-- Fix all schema mismatches between Prisma and PostgreSQL

-- Products table: add sizes and deleted_at columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN products.sizes IS 'Available sizes for the product';
COMMENT ON COLUMN products.deleted_at IS 'Soft delete timestamp';

-- Profiles table: add deleted_at if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Reviews table: add updated_at if not exists (Prisma has it)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ProductRequests table: add updated_at if not exists (Prisma has it)
ALTER TABLE product_requests 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- MarginRules table: add product_id foreign key relation if needed
-- Note: product_id in margin_rules should reference products.id
-- But it was set as unique in Prisma, check if constraint exists

-- TelegramPosts table: ensure all columns match Prisma
ALTER TABLE telegram_posts 
ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- SystemSettings: ensure id can be cuid format (text, not uuid)
-- Already text, good

-- Add index for new columns
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);
