-- ============================================================================
-- ADD CHAT SYSTEM FOR SUPPORT TICKETS
-- ============================================================================

-- Add assigned_to column to support_tickets if not exists
ALTER TABLE public.support_tickets 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.admin_profiles(id);

-- Create ticket_messages table for chat history
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Policies for ticket_messages
DROP POLICY IF EXISTS "Users can read messages of their tickets" ON public.ticket_messages;
CREATE POLICY "Users can read messages of their tickets"
  ON public.ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_messages.ticket_id
      AND (user_id = auth.uid() OR email = auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Users can send messages to their tickets" ON public.ticket_messages;
CREATE POLICY "Users can send messages to their tickets"
  ON public.ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE id = ticket_messages.ticket_id
      AND (user_id = auth.uid() OR email = auth.jwt()->>'email')
    )
  );

DROP POLICY IF EXISTS "Admins can read all messages" ON public.ticket_messages;
CREATE POLICY "Admins can read all messages"
  ON public.ticket_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can send messages" ON public.ticket_messages;
CREATE POLICY "Admins can send messages"
  ON public.ticket_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON public.ticket_messages(created_at);

-- Update support_tickets RLS policies to allow admins to see all tickets
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update all tickets" ON public.support_tickets;
CREATE POLICY "Admins can update all tickets"
  ON public.support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Enable realtime for ticket_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
