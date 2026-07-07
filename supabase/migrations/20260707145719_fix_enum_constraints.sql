-- Fix enum constraint mismatches

-- Drop and recreate notification type constraint to include telegram
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY['order'::text, 'product'::text, 'system'::text, 'promotion'::text, 'account'::text, 'inventory'::text, 'telegram'::text]));

-- Fix reviews to have updated_at trigger
DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fix product_requests to have updated_at trigger  
DROP TRIGGER IF EXISTS trigger_product_requests_updated_at ON product_requests;
CREATE TRIGGER trigger_product_requests_updated_at
BEFORE UPDATE ON product_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
