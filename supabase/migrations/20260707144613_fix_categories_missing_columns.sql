-- Add missing columns to categories table that the application expects

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add index for sort_order to improve query performance
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

COMMENT ON COLUMN categories.sort_order IS 'Order for sorting categories in lists. Lower values appear first.';
COMMENT ON COLUMN categories.updated_at IS 'Timestamp when the category was last updated.';
