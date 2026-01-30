-- Create tables for marketing components with multilingual support

-- Urgency Banner Configuration
CREATE TABLE IF NOT EXISTS public.urgency_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'ar', 'es', 'it')),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  spots_remaining INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Live Viewers Configuration
CREATE TABLE IF NOT EXISTS public.live_viewers_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'ar', 'es', 'it')),
  min_viewers INTEGER DEFAULT 1200,
  max_viewers INTEGER DEFAULT 1300,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(language)
);

-- Recent Purchases Configuration
CREATE TABLE IF NOT EXISTS public.recent_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'ar', 'es', 'it')),
  time_ago TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.urgency_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_viewers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for urgency_banners
CREATE POLICY "Public can read active urgency banners" ON public.urgency_banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can write urgency banners" ON public.urgency_banners
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for live_viewers_config
CREATE POLICY "Public can read active live viewers config" ON public.live_viewers_config
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can write live viewers config" ON public.live_viewers_config
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for recent_purchases
CREATE POLICY "Public can read active recent purchases" ON public.recent_purchases
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can write recent purchases" ON public.recent_purchases
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default data
INSERT INTO public.live_viewers_config (label, language, min_viewers, max_viewers, is_active)
VALUES 
  ('personnes regardent en direct', 'fr', 1200, 1300, true),
  ('people watching live', 'en', 1200, 1300, true),
  ('يشاهدون مباشرة', 'ar', 1200, 1300, true)
ON CONFLICT (language) DO NOTHING;

INSERT INTO public.recent_purchases (name, location, plan_name, language, time_ago, display_order, is_active)
VALUES 
  ('Mohammed A.', 'Paris, France', 'Premium', 'fr', '2 min', 1, true),
  ('Sarah L.', 'Lyon, France', 'Ultimate', 'fr', '5 min', 2, true),
  ('Ahmed K.', 'Marseille, France', 'Basic', 'fr', '8 min', 3, true),
  ('Mohammed A.', 'Paris, France', 'Premium', 'en', '2 min', 1, true),
  ('Sarah L.', 'Lyon, France', 'Ultimate', 'en', '5 min', 2, true),
  ('Ahmed K.', 'Marseille, France', 'Basic', 'en', '8 min', 3, true);
