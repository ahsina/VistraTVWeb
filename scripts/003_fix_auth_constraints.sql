-- Fix problematic foreign key constraints that block Supabase Auth
-- These constraints must have ON DELETE SET NULL to allow auth operations

-- Drop and recreate the problematic constraints with proper ON DELETE clauses
ALTER TABLE hero_content 
DROP CONSTRAINT IF EXISTS hero_content_updated_by_fkey;

ALTER TABLE hero_content
ADD CONSTRAINT hero_content_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE features 
DROP CONSTRAINT IF EXISTS features_updated_by_fkey;

ALTER TABLE features
ADD CONSTRAINT features_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE channels 
DROP CONSTRAINT IF EXISTS channels_updated_by_fkey;

ALTER TABLE channels
ADD CONSTRAINT channels_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE subscription_plans 
DROP CONSTRAINT IF EXISTS subscription_plans_updated_by_fkey;

ALTER TABLE subscription_plans
ADD CONSTRAINT subscription_plans_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE tutorial_devices 
DROP CONSTRAINT IF EXISTS tutorial_devices_updated_by_fkey;

ALTER TABLE tutorial_devices
ADD CONSTRAINT tutorial_devices_updated_by_fkey 
FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Verify the fixes
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name,
  confrelid::regclass as foreign_table,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE confrelid = 'auth.users'::regclass
  AND conname LIKE '%_updated_by_fkey'
ORDER BY conrelid::regclass::text;

SELECT 'Foreign key constraints fixed successfully! Auth should work now.' as status;
