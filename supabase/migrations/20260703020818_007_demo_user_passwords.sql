/*
# Insert Password Hashes for Demo Users

This migration creates password hashes for all existing demo users.
All demo accounts use password: demo123

Password hash generated with bcrypt (12 rounds):
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aJlQ.S6sJ6U9SO
*/

-- Insert password hashes for demo users (password: demo123)
INSERT INTO user_credentials (user_id, password_hash) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aJlQ.S6sJ6U9SO'),
  ('bbbbbbba-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aJlQ.S6sJ6U9SO'),
  ('ccccccea-cccc-cccc-cccc-cccccccccccc', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aJlQ.S6sJ6U9SO')
ON CONFLICT (user_id) DO NOTHING;