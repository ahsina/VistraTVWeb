-- Table pour tracker les rappels de paiements abandonnés
CREATE TABLE IF NOT EXISTS abandoned_payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES payment_transactions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  whatsapp_phone TEXT,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, converted, expired, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  abandoned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_plan_name TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  payment_url TEXT
);

-- Index pour les requêtes de recherche
CREATE INDEX IF NOT EXISTS idx_abandoned_reminders_status ON abandoned_payment_reminders(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_reminders_email ON abandoned_payment_reminders(email);
CREATE INDEX IF NOT EXISTS idx_abandoned_reminders_created ON abandoned_payment_reminders(created_at);

-- RLS Policies
ALTER TABLE abandoned_payment_reminders ENABLE ROW LEVEL SECURITY;

-- Admins can manage all reminders
CREATE POLICY "Admins can manage abandoned reminders"
  ON abandoned_payment_reminders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE admin_profiles.id = auth.uid()
      AND admin_profiles.is_admin = true
    )
  );

-- System can insert and update reminders
CREATE POLICY "System can manage abandoned reminders"
  ON abandoned_payment_reminders
  FOR ALL
  USING (true);

COMMENT ON TABLE abandoned_payment_reminders IS 'Tracks abandoned payments and reminder emails sent to convert customers';
