-- Promo Codes System
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  currency TEXT DEFAULT 'EUR',
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applies_to TEXT[] DEFAULT ARRAY['all'], -- 'all' or specific plan_ids
  min_purchase_amount NUMERIC DEFAULT 0,
  description TEXT,
  created_by UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Code Usage History
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID,
  subscription_id UUID REFERENCES subscriptions(id),
  discount_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate System
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE, -- NULL for external affiliates
  affiliate_code TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 20 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  payment_method TEXT,
  payment_details JSONB, -- Bank info, PayPal, etc.
  total_earnings NUMERIC DEFAULT 0,
  pending_earnings NUMERIC DEFAULT 0,
  paid_earnings NUMERIC DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  approved_by UUID REFERENCES admin_profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Referrals
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID,
  subscription_id UUID REFERENCES subscriptions(id),
  commission_amount NUMERIC NOT NULL,
  commission_status TEXT NOT NULL DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),
  subscription_amount NUMERIC NOT NULL,
  payment_id UUID REFERENCES payments(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Payouts
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  processed_by UUID REFERENCES admin_profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Clicks/Visits Tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for Promo Codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active promo codes"
  ON promo_codes FOR SELECT
  TO public
  USING (is_active = true AND (end_date IS NULL OR end_date > NOW()));

CREATE POLICY "Admins can write promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for Promo Code Usage
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own promo usage"
  ON promo_code_usage FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all promo usage"
  ON promo_code_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "System can insert promo usage"
  ON promo_code_usage FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for Affiliates
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own affiliate profile"
  ON affiliates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create affiliate application"
  ON affiliates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own affiliate profile"
  ON affiliates FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all affiliates"
  ON affiliates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all affiliates"
  ON affiliates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for Affiliate Referrals
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can read own referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all referrals"
  ON affiliate_referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "System can insert referrals"
  ON affiliate_referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update referrals"
  ON affiliate_referrals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for Affiliate Payouts
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can read own payouts"
  ON affiliate_payouts FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage payouts"
  ON affiliate_payouts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for Affiliate Clicks
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliates can read own clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert clicks"
  ON affiliate_clicks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read all clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Indexes for performance
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, end_date);
CREATE INDEX idx_promo_code_usage_user ON promo_code_usage(user_id);
CREATE INDEX idx_promo_code_usage_promo ON promo_code_usage(promo_code_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliates_user ON affiliates(user_id);
CREATE INDEX idx_affiliates_status ON affiliates(status);
CREATE INDEX idx_affiliate_referrals_affiliate ON affiliate_referrals(affiliate_id);
CREATE INDEX idx_affiliate_referrals_user ON affiliate_referrals(referred_user_id);
CREATE INDEX idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_referrals_updated_at
  BEFORE UPDATE ON affiliate_referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_payouts_updated_at
  BEFORE UPDATE ON affiliate_payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
