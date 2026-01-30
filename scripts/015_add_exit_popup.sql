-- Create exit_popups table for event popups
CREATE TABLE IF NOT EXISTS exit_popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL, -- e.g., 'Black Friday', 'Christmas', 'New Year'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  discount_code TEXT, -- Optional promo code
  discount_percentage INTEGER, -- e.g., 50 for 50% off
  image_url TEXT, -- Optional background or product image
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'ar', 'es', 'it')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  show_countdown BOOLEAN DEFAULT true, -- Show countdown to end_date
  background_color TEXT DEFAULT '#1a1a1a', -- Popup background color
  text_color TEXT DEFAULT '#ffffff', -- Text color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_profiles(id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_exit_popups_active ON exit_popups(is_active, start_date, end_date, language);

-- Enable RLS
ALTER TABLE exit_popups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can read active exit popups"
  ON exit_popups FOR SELECT
  TO public
  USING (
    is_active = true 
    AND start_date <= NOW() 
    AND end_date >= NOW()
  );

CREATE POLICY "Authenticated can write exit popups"
  ON exit_popups FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample exit popup for Black Friday
INSERT INTO exit_popups (event_name, title, description, cta_text, cta_link, discount_code, discount_percentage, language, start_date, end_date, show_countdown) VALUES
('Black Friday', '🔥 Offre Black Friday Exclusive', 'Ne partez pas ! Profitez de 50% de réduction sur tous nos abonnements Premium. Offre limitée !', 'Profiter de l''offre', '/pricing', 'BLACKFRIDAY50', 50, 'fr', NOW(), NOW() + INTERVAL '30 days', true),
('Black Friday', '🔥 Exclusive Black Friday Deal', 'Don''t leave yet! Get 50% OFF all Premium subscriptions. Limited time offer!', 'Claim Your Offer', '/pricing', 'BLACKFRIDAY50', 50, 'en', NOW(), NOW() + INTERVAL '30 days', true),
('Black Friday', '🔥 عرض الجمعة السوداء الحصري', 'لا تغادر! احصل على خصم 50٪ على جميع الاشتراكات المميزة. عرض لفترة محدودة!', 'احصل على العرض', '/pricing', 'BLACKFRIDAY50', 50, 'ar', NOW(), NOW() + INTERVAL '30 days', true);
