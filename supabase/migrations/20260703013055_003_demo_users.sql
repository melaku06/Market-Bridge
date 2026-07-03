/*
# Create Demo Users

This migration creates demo accounts for testing:
- Customer: customer@demo.com / demo123
- Warehouse: warehouse@demo.com / demo123
- Admin: admin@demo.com / demo123

Note: These are for development/testing purposes only.
In production, delete these accounts or change passwords.
*/

-- Create demo users using Supabase auth
-- Note: We need to use auth functions to create users

-- Create a function to set up demo users
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  customer_id uuid;
  warehouse_id uuid;
  admin_id uuid;
  wh_uuid uuid;
BEGIN
  -- Create customer user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'customer@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Demo Customer","role":"customer"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO customer_id;

  -- Create warehouse user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'warehouse@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Demo Warehouse","role":"warehouse"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO warehouse_id;

  -- Create admin user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@demo.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Demo Admin","role":"admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO admin_id;

  -- Wait for triggers to create profiles, then update warehouse profile
  PERFORM pg_sleep(0.5);

  -- Assign warehouse_id to warehouse user
  UPDATE profiles 
  SET warehouse_id = '11111111-1111-1111-1111-111111111111'::uuid
  WHERE id = warehouse_id;

EXCEPTION WHEN OTHERS THEN
  -- Handle case where users already exist
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT create_demo_users();

-- Clean up function
DROP FUNCTION IF EXISTS create_demo_users();