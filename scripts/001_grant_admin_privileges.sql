-- ============================================================================
-- GRANT ADMIN PRIVILEGES TO EXISTING USER
-- ============================================================================
-- Run this script AFTER signing up at /admin/sign-up
-- This will grant admin privileges to your account
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'mr.ahsina@gmail.com';
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- User exists, create or update admin profile
    INSERT INTO public.admin_profiles (id, full_name, email, is_admin)
    VALUES (v_user_id, 'Admin', v_email, true)
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true, updated_at = now();
    
    RAISE NOTICE '✓ Admin privileges granted successfully to: %', v_email;
    RAISE NOTICE '✓ You can now login at /admin/login';
  ELSE
    RAISE NOTICE '✗ User not found: %', v_email;
    RAISE NOTICE '→ Please sign up at /admin/sign-up first';
  END IF;
END $$;
