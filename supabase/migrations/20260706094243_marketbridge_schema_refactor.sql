/*
# MarketBridge Schema Refactor — Enterprise Architecture

## Overview
This migration aligns the PostgreSQL database with the refactored Prisma schema,
making it the single source of truth for the entire application. It adds support
for Telegram-based password recovery, order status history, and the full Telegram
integration data model (bot config, channels, groups, templates, post queue,
activity logs).

## New Tables
1. `password_reset_tokens` — Telegram-based password recovery tokens
2. `order_status_history` — Audit trail for order lifecycle changes
3. `telegram_bots` — Bot configuration (singleton)
4. `telegram_channels` — Channel targets for posting
5. `telegram_groups` — Group targets for posting
6. `telegram_post_templates` — Reusable message templates
7. `telegram_activity_logs` — Audit trail for all bot actions

## Modified Tables
1. `profiles` — Added telegram_username, telegram_id, deleted_at columns
2. `notifications` — Added read_at timestamp column
3. `telegram_posts` — Expanded with bot_id, template_id, target_type, channel_id,
   group_id, image_urls, retry_count, max_retries, next_retry_at, scheduled_at,
   updated_at columns

## Security
- RLS enabled on all new tables
- Owner-scoped policies on password_reset_tokens
- Admin-only policies on Telegram management tables

## Important Notes
1. All new columns are nullable or have defaults to preserve existing data
2. The telegram_posts table is expanded, not recreated — existing posts are preserved
3. Password reset tokens use hashed tokens (never store plaintext)
4. Order status history tracks every status transition with actor information
*/

-- ============================================================================
-- 1. PROFILES: Add Telegram and soft-delete columns
-- ============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS telegram_username text,
  ADD COLUMN IF NOT EXISTS telegram_id text,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_profiles_telegram_username ON profiles(telegram_username);
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- ============================================================================
-- 2. NOTIFICATIONS: Add read_at timestamp
-- ============================================================================

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- ============================================================================
-- 3. INVENTORY: Add reserved_quantity if missing
-- ============================================================================

ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS reserved_quantity integer NOT NULL DEFAULT 0;

-- ============================================================================
-- 4. PASSWORD RESET TOKENS (Telegram-based recovery)
-- ============================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status = ANY (ARRAY['pending'::text, 'used'::text, 'expired'::text])),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_password_resets" ON password_reset_tokens;
CREATE POLICY "select_own_password_resets" ON password_reset_tokens
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_status ON password_reset_tokens(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================================================
-- 5. ORDER STATUS HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL
    CHECK (to_status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  changed_by uuid NOT NULL,
  changed_by_name text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_order_status_history" ON order_status_history;
CREATE POLICY "select_order_status_history" ON order_status_history
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_history.order_id
      AND (
        orders.customer_id = auth.uid()
        OR orders.warehouse_id IN (
          SELECT warehouses.id FROM warehouses
          JOIN profiles ON profiles.warehouse_id = warehouses.id
          WHERE profiles.id = auth.uid()
        )
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_to_status ON order_status_history(to_status);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- ============================================================================
-- 6. TELEGRAM BOTS (singleton configuration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS telegram_bots (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bot_token text NOT NULL,
  bot_username text,
  bot_name text,
  status text NOT NULL DEFAULT 'disconnected'
    CHECK (status = ANY (ARRAY['connected'::text, 'disconnected'::text, 'error'::text])),
  webhook_url text,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_telegram_bots" ON telegram_bots;
CREATE POLICY "admin_select_telegram_bots" ON telegram_bots
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_insert_telegram_bots" ON telegram_bots;
CREATE POLICY "admin_insert_telegram_bots" ON telegram_bots
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_telegram_bots" ON telegram_bots;
CREATE POLICY "admin_update_telegram_bots" ON telegram_bots
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_telegram_bots" ON telegram_bots;
CREATE POLICY "admin_delete_telegram_bots" ON telegram_bots
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================================================
-- 7. TELEGRAM CHANNELS
-- ============================================================================

CREATE TABLE IF NOT EXISTS telegram_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL REFERENCES telegram_bots(id) ON DELETE CASCADE,
  channel_id text NOT NULL UNIQUE,
  channel_name text NOT NULL,
  channel_username text,
  member_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_telegram_channels" ON telegram_channels;
CREATE POLICY "admin_select_telegram_channels" ON telegram_channels
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_insert_telegram_channels" ON telegram_channels;
CREATE POLICY "admin_insert_telegram_channels" ON telegram_channels
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_telegram_channels" ON telegram_channels;
CREATE POLICY "admin_update_telegram_channels" ON telegram_channels
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_telegram_channels" ON telegram_channels;
CREATE POLICY "admin_delete_telegram_channels" ON telegram_channels
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_telegram_channels_bot_id ON telegram_channels(bot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_channels_is_active ON telegram_channels(is_active);
CREATE INDEX IF NOT EXISTS idx_telegram_channels_channel_username ON telegram_channels(channel_username);

-- ============================================================================
-- 8. TELEGRAM GROUPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS telegram_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL REFERENCES telegram_bots(id) ON DELETE CASCADE,
  group_id text NOT NULL UNIQUE,
  group_name text NOT NULL,
  group_username text,
  member_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_telegram_groups" ON telegram_groups;
CREATE POLICY "admin_select_telegram_groups" ON telegram_groups
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_insert_telegram_groups" ON telegram_groups;
CREATE POLICY "admin_insert_telegram_groups" ON telegram_groups
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_telegram_groups" ON telegram_groups;
CREATE POLICY "admin_update_telegram_groups" ON telegram_groups
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_telegram_groups" ON telegram_groups;
CREATE POLICY "admin_delete_telegram_groups" ON telegram_groups
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_telegram_groups_bot_id ON telegram_groups(bot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_groups_is_active ON telegram_groups(is_active);

-- ============================================================================
-- 9. TELEGRAM POST TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS telegram_post_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL REFERENCES telegram_bots(id) ON DELETE CASCADE,
  name text NOT NULL,
  template text NOT NULL,
  variables text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_post_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_telegram_templates" ON telegram_post_templates;
CREATE POLICY "admin_select_telegram_templates" ON telegram_post_templates
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_insert_telegram_templates" ON telegram_post_templates;
CREATE POLICY "admin_insert_telegram_templates" ON telegram_post_templates
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_telegram_templates" ON telegram_post_templates;
CREATE POLICY "admin_update_telegram_templates" ON telegram_post_templates
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_telegram_templates" ON telegram_post_templates;
CREATE POLICY "admin_delete_telegram_templates" ON telegram_post_templates
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_telegram_templates_bot_id ON telegram_post_templates(bot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_templates_is_active ON telegram_post_templates(is_active);

-- ============================================================================
-- 10. TELEGRAM POSTS: Expand existing table with new columns
-- ============================================================================

ALTER TABLE telegram_posts
  ADD COLUMN IF NOT EXISTS bot_id text REFERENCES telegram_bots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES telegram_post_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS target_type text NOT NULL DEFAULT 'channel'
    CHECK (target_type = ANY (ARRAY['channel'::text, 'group'::text, 'user'::text])),
  ADD COLUMN IF NOT EXISTS channel_id uuid REFERENCES telegram_channels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES telegram_groups(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS retry_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_retries integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS next_retry_at timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Update the status constraint to include new statuses
ALTER TABLE telegram_posts DROP CONSTRAINT IF EXISTS telegram_posts_status_check;
ALTER TABLE telegram_posts
  ADD CONSTRAINT telegram_posts_status_check
  CHECK (status = ANY (ARRAY['queued'::text, 'sending'::text, 'sent'::text, 'failed'::text, 'retrying'::text, 'cancelled'::text]));

CREATE INDEX IF NOT EXISTS idx_telegram_posts_bot_id ON telegram_posts(bot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_status ON telegram_posts(status);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_scheduled_at ON telegram_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_next_retry_at ON telegram_posts(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_channel_id ON telegram_posts(channel_id);
CREATE INDEX IF NOT EXISTS idx_telegram_posts_group_id ON telegram_posts(group_id);

-- ============================================================================
-- 11. TELEGRAM ACTIVITY LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS telegram_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id text NOT NULL REFERENCES telegram_bots(id) ON DELETE CASCADE,
  post_id uuid REFERENCES telegram_posts(id) ON DELETE SET NULL,
  action text NOT NULL,
  status text NOT NULL,
  message text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_telegram_activity_logs" ON telegram_activity_logs;
CREATE POLICY "admin_select_telegram_activity_logs" ON telegram_activity_logs
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_telegram_activity_logs_bot_id ON telegram_activity_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_telegram_activity_logs_post_id ON telegram_activity_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_telegram_activity_logs_action ON telegram_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_telegram_activity_logs_status ON telegram_activity_logs(status);
CREATE INDEX IF NOT EXISTS idx_telegram_activity_logs_created_at ON telegram_activity_logs(created_at);
