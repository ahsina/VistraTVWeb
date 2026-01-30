-- ============================================================================
-- FIX SUPPORT TICKETS RLS POLICIES
-- Allow anyone (authenticated or not) to create support tickets
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Public can create tickets" ON public.support_tickets;

-- Allow anyone (authenticated or anonymous) to create tickets
CREATE POLICY "Anyone can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

-- Update the users view policy to include both authenticated and their own tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt()->>'email' = email
  );

-- Update users update policy
DROP POLICY IF EXISTS "Users can update own tickets" ON public.support_tickets;
CREATE POLICY "Users can update own tickets"
  ON public.support_tickets FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR auth.jwt()->>'email' = email
  );
