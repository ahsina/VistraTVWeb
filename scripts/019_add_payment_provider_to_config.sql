-- Add provider column to payment_gateway_config
ALTER TABLE payment_gateway_config 
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'wert';

-- Add comment
COMMENT ON COLUMN payment_gateway_config.payment_provider IS 'Payment provider: wert, moonpay, transak, guardarian, utorg, onramper';
