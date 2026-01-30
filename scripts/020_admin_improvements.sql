-- Add new admin features and improvements

-- Create promo codes usage tracking
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system notifications for admins
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user ON promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON admin_notifications(is_read) WHERE is_read = FALSE;

-- Add revenue analytics view
CREATE OR REPLACE VIEW admin_revenue_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as transactions,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_transaction,
  COUNT(DISTINCT email) as unique_customers
FROM payment_transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Add user growth analytics view
CREATE OR REPLACE VIEW admin_user_growth AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', created_at)) as cumulative_users
FROM user_profiles
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
