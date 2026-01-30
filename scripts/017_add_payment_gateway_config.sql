-- Table pour la configuration de la payment gateway
CREATE TABLE IF NOT EXISTS payment_gateway_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL DEFAULT 'Custom Gateway',
  api_url TEXT NOT NULL,
  api_key TEXT,
  merchant_id TEXT,
  polygon_wallet_address TEXT,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  test_mode BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES admin_profiles(id)
);

-- Table pour les transactions de paiement
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  subscription_id UUID REFERENCES subscriptions(id),
  email TEXT NOT NULL,
  whatsapp_phone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  promo_code TEXT,
  discount_amount NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  failed_reason TEXT
);

-- RLS policies
ALTER TABLE payment_gateway_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Admins can manage gateway config
CREATE POLICY "Admins can manage gateway config"
  ON payment_gateway_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.is_admin = true
    )
  );

-- Anyone can read active gateway config (for client-side)
CREATE POLICY "Anyone can read active gateway"
  ON payment_gateway_config
  FOR SELECT
  USING (is_active = true);

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions"
  ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.is_admin = true
    )
  );

-- System can insert transactions
CREATE POLICY "System can insert transactions"
  ON payment_transactions
  FOR INSERT
  WITH CHECK (true);

-- System can update transactions
CREATE POLICY "System can update transactions"
  ON payment_transactions
  FOR UPDATE
  USING (true);

-- Insert default gateway configuration
INSERT INTO payment_gateway_config (gateway_name, api_url, test_mode)
VALUES ('Payment Gateway', 'https://api.paymentgateway.com/v1', true)
ON CONFLICT DO NOTHING;
