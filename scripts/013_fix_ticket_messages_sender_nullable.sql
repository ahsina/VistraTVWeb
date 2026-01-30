-- Make sender_id nullable in ticket_messages to support anonymous users
ALTER TABLE ticket_messages 
  ALTER COLUMN sender_id DROP NOT NULL;

-- Update RLS policy for inserting messages to allow anonymous users
DROP POLICY IF EXISTS "Users can send messages to their tickets (INSERT)" ON ticket_messages;
DROP POLICY IF EXISTS "Admins can send messages (INSERT)" ON ticket_messages;

-- Create a combined policy that allows both authenticated users and anonymous to insert messages
CREATE POLICY "Anyone can send messages to tickets (INSERT)"
  ON ticket_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Keep read policies as they are
-- Admins can read all messages (SELECT) - already exists
-- Users can read messages of their tickets (SELECT) - already exists
