-- ============================================================================
-- Fix RLS Infinite Recursion on admin_profiles
-- ============================================================================
-- The problem: The "Admins can write admin profiles" policy creates infinite
-- recursion because it queries admin_profiles to check if user is admin,
-- which triggers the same policy again.
-- 
-- Solution: Allow authenticated users to read their own profile directly,
-- and create a separate function with SECURITY DEFINER to check admin status
-- ============================================================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can write admin profiles" ON public.admin_profiles;

-- Create a function to check if user is admin (with SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- Allow users to read their own admin profile (no recursion)
DROP POLICY IF EXISTS "Users can read own admin profile" ON public.admin_profiles;
CREATE POLICY "Users can read own admin profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow admins to insert/update/delete using the helper function
DROP POLICY IF EXISTS "Admins can insert admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can insert admin profiles"
  ON public.admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can update admin profiles"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can delete admin profiles"
  ON public.admin_profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS recursion fixed! Policies updated to use SECURITY DEFINER function.';
END $$;
