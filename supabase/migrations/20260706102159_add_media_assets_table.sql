/*
# Media Assets Table — Cloudinary Metadata Storage

## Overview
This migration creates the `media_assets` table to track all Cloudinary uploads.
Only metadata is stored in the database — actual image files live in Cloudinary.

## New Table
- `media_assets` — Stores Cloudinary upload metadata (public_id, secure_url, format, dimensions, file size, folder, type, uploader)

## Security
- RLS enabled
- Authenticated users can read all media metadata (needed for product images, banners, etc.)
- Users can only insert/update/delete their own uploaded assets
- Admins have full access to all media assets

## Important Notes
1. The `public_id` column is unique — each Cloudinary asset maps to exactly one DB record
2. The `uploaded_by` column links to the user who uploaded the asset (nullable for system uploads)
3. The `type` column categorizes assets (product_image, warehouse_logo, profile_picture, etc.)
4. When an image is replaced, the old Cloudinary resource should be deleted and the DB record updated
*/

CREATE TYPE media_type_enum AS ENUM (
  'product_image',
  'warehouse_logo',
  'profile_picture',
  'promotional_banner',
  'category_image',
  'brand_logo',
  'review_image',
  'telegram_media',
  'general'
);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id text NOT NULL UNIQUE,
  secure_url text NOT NULL,
  url text,
  format text,
  width integer,
  height integer,
  bytes integer,
  resource_type text NOT NULL DEFAULT 'image',
  folder text NOT NULL DEFAULT 'marketbridge',
  type media_type_enum NOT NULL DEFAULT 'general',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read media metadata (needed for product images, banners, etc.)
DROP POLICY IF EXISTS "authenticated_select_media_assets" ON media_assets;
CREATE POLICY "authenticated_select_media_assets" ON media_assets
  FOR SELECT TO authenticated USING (true);

-- Users can insert media assets for themselves
DROP POLICY IF EXISTS "insert_own_media_assets" ON media_assets;
CREATE POLICY "insert_own_media_assets" ON media_assets
  FOR INSERT TO authenticated WITH CHECK (uploaded_by IS NULL OR uploaded_by = auth.uid());

-- Users can update their own media assets; admins can update any
DROP POLICY IF EXISTS "update_media_assets" ON media_assets;
CREATE POLICY "update_media_assets" ON media_assets
  FOR UPDATE TO authenticated USING (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Users can delete their own media assets; admins can delete any
DROP POLICY IF EXISTS "delete_media_assets" ON media_assets;
CREATE POLICY "delete_media_assets" ON media_assets
  FOR DELETE TO authenticated USING (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_media_assets_public_id ON media_assets(public_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON media_assets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(type);
CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON media_assets(folder);
CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON media_assets(created_at);
