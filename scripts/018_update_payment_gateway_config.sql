-- Update payment gateway config for PayGate.to
ALTER TABLE payment_gateway_config 
ADD COLUMN IF NOT EXISTS usdc_polygon_address TEXT,
ADD COLUMN IF NOT EXISTS affiliate_address TEXT,
ADD COLUMN IF NOT EXISTS encrypted_wallet TEXT;

-- Add webhook secret for security
ALTER TABLE payment_gateway_config
ADD COLUMN IF NOT EXISTS webhook_secret TEXT;

COMMENT ON COLUMN payment_gateway_config.usdc_polygon_address IS 'USDC Polygon wallet address to receive payouts';
COMMENT ON COLUMN payment_gateway_config.affiliate_address IS 'Optional affiliate wallet address for commission';
COMMENT ON COLUMN payment_gateway_config.encrypted_wallet IS 'Encrypted wallet address from PayGate.to';
