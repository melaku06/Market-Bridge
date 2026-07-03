/*
# Create Demo Users

This migration creates demo accounts for testing:
- admin@demo.com / demo123
- customer@demo.com / demo123  
- warehouse@demo.com / demo123
*/

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
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'authenticated',
  'authenticated',
  'admin@demo.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User","role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT DO NOTHING;

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
  'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
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
) ON CONFLICT DO NOTHING;

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
  'ccccccea-cccc-cccc-cccc-cccccccccccc',
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
) ON CONFLICT DO NOTHING;

-- Insert into identities with provider column
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  created_at,
  updated_at
) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","email":"admin@demo.com"}', now(), now()),
  ('bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'email', '{"sub":"bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb","email":"customer@demo.com"}', now(), now()),
  ('ccccccea-cccc-cccc-cccc-cccccccccccc', 'ccccccea-cccc-cccc-cccc-cccccccccccc', 'ccccccea-cccc-cccc-cccc-cccccccccccc', 'email', '{"sub":"ccccccea-cccc-cccc-cccc-cccccccccccc","email":"warehouse@demo.com"}', now(), now())
ON CONFLICT DO NOTHING;

-- Update profiles with correct roles
UPDATE profiles SET role = 'admin', name = 'Admin User' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
UPDATE profiles SET role = 'customer', name = 'Demo Customer' WHERE id = 'bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
UPDATE profiles SET role = 'warehouse', name = 'Demo Warehouse', warehouse_id = '11111111-1111-1111-1111-111111111111' WHERE id = 'ccccccea-cccc-cccc-cccc-cccccccccccc';