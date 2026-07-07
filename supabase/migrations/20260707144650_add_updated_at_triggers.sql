-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at columns
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns 
        WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trigger_%s_updated_at ON %I; 
             CREATE TRIGGER trigger_%s_updated_at 
             BEFORE UPDATE ON %I 
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            t, t, t, t
        );
    END LOOP;
END $$;
