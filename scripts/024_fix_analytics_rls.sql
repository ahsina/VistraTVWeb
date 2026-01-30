-- Fix RLS policy for analytics_events to allow anonymous tracking
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own analytics events" ON analytics_events;

-- Create new policy that allows anyone to insert analytics events
CREATE POLICY "Anyone can track analytics events"
ON analytics_events
FOR INSERT
TO public
WITH CHECK (true);

-- Keep the service role policy for full access
-- (This should already exist, but we ensure it's there)
DROP POLICY IF EXISTS "Service role has full access to analytics_events" ON analytics_events;
CREATE POLICY "Service role has full access to analytics_events"
ON analytics_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add policy for reading analytics (admins only)
CREATE POLICY "Admins can read analytics events"
ON analytics_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_admin = true
  )
);
