-- ============================================================================
-- VISTRATV - COMPLETE DATABASE SETUP
-- ============================================================================
-- This script contains the complete database structure and seed data
-- Run this script ONLY ONCE on a fresh Supabase project
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE ALL TABLES
-- ============================================================================

-- Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Hero Content Table
CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  background_image TEXT,
  language TEXT DEFAULT 'fr',
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Features Table
CREATE TABLE IF NOT EXISTS public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'fr',
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Channels Table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Content Table
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  poster TEXT,
  category TEXT,
  type TEXT,
  language TEXT DEFAULT 'fr',
  rating NUMERIC(3, 1),
  year INTEGER,
  duration TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  duration_months INTEGER NOT NULL,
  features JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'fr',
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  price NUMERIC(10, 2),
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tutorial Devices Table
CREATE TABLE IF NOT EXISTS public.tutorial_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  difficulty TEXT,
  duration TEXT,
  steps JSONB,
  prerequisites JSONB,
  faqs JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'fr',
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- SECTION 2: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 3: CREATE RLS POLICIES
-- ============================================================================

-- Admin Profiles Policies
DROP POLICY IF EXISTS "Authenticated users can read admin profiles" ON public.admin_profiles;
CREATE POLICY "Authenticated users can read admin profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can write admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can write admin profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- User Profiles Policies
DROP POLICY IF EXISTS "Public can read user profiles" ON public.user_profiles;
CREATE POLICY "Public can read user profiles"
  ON public.user_profiles FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Hero Content Policies
DROP POLICY IF EXISTS "Public can read hero content" ON public.hero_content;
CREATE POLICY "Public can read hero content"
  ON public.hero_content FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated can write hero content" ON public.hero_content;
CREATE POLICY "Authenticated can write hero content"
  ON public.hero_content FOR ALL
  TO authenticated
  USING (true);

-- Features Policies
DROP POLICY IF EXISTS "Public can read features" ON public.features;
CREATE POLICY "Public can read features"
  ON public.features FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can write features" ON public.features;
CREATE POLICY "Authenticated can write features"
  ON public.features FOR ALL
  TO authenticated
  USING (true);

-- Channels Policies
DROP POLICY IF EXISTS "Public can read channels" ON public.channels;
CREATE POLICY "Public can read channels"
  ON public.channels FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can write channels" ON public.channels;
CREATE POLICY "Authenticated can write channels"
  ON public.channels FOR ALL
  TO authenticated
  USING (true);

-- Content Policies
DROP POLICY IF EXISTS "Public can read active content" ON public.content;
CREATE POLICY "Public can read active content"
  ON public.content FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can write content" ON public.content;
CREATE POLICY "Authenticated can write content"
  ON public.content FOR ALL
  TO authenticated
  USING (true);

-- Subscription Plans Policies
DROP POLICY IF EXISTS "Public can read subscription plans" ON public.subscription_plans;
CREATE POLICY "Public can read subscription plans"
  ON public.subscription_plans FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can write subscription plans" ON public.subscription_plans;
CREATE POLICY "Authenticated can write subscription plans"
  ON public.subscription_plans FOR ALL
  TO authenticated
  USING (true);

-- Subscriptions Policies
DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can read own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Payments Policies
DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Tutorial Devices Policies
DROP POLICY IF EXISTS "Public can read tutorial devices" ON public.tutorial_devices;
CREATE POLICY "Public can read tutorial devices"
  ON public.tutorial_devices FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can write tutorial devices" ON public.tutorial_devices;
CREATE POLICY "Authenticated can write tutorial devices"
  ON public.tutorial_devices FOR ALL
  TO authenticated
  USING (true);

-- Support Tickets Policies
DROP POLICY IF EXISTS "Anyone can create tickets" ON public.support_tickets;
CREATE POLICY "Anyone can create tickets"
  ON public.support_tickets FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

DROP POLICY IF EXISTS "Users can update own tickets" ON public.support_tickets;
CREATE POLICY "Users can update own tickets"
  ON public.support_tickets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- SECTION 4: SEED DATA
-- ============================================================================

-- Seed Hero Content
INSERT INTO public.hero_content (title, subtitle, cta_text, cta_link, language) VALUES
('Bienvenue sur VistraTV', 'Profitez de milliers de chaînes et contenus en streaming', 'Commencer maintenant', '/register', 'fr')
ON CONFLICT DO NOTHING;

-- Seed Features
INSERT INTO public.features (title, description, icon_name, display_order, language) VALUES
('Streaming HD', 'Profitez de contenus en haute définition', 'play-circle', 1, 'fr'),
('Multi-appareils', 'Regardez sur tous vos appareils', 'tv', 2, 'fr'),
('Sans engagement', 'Annulez à tout moment', 'x-circle', 3, 'fr'),
('Support 24/7', 'Assistance disponible 24h/24', 'help-circle', 4, 'fr')
ON CONFLICT DO NOTHING;

-- Seed Channels
INSERT INTO public.channels (name, category, display_order) VALUES
('TF1', 'Généraliste', 1),
('France 2', 'Généraliste', 2),
('M6', 'Généraliste', 3),
('Canal+', 'Premium', 4),
('BeIN Sports', 'Sport', 5)
ON CONFLICT DO NOTHING;

-- Seed Subscription Plans
INSERT INTO public.subscription_plans (name, description, price, duration_months, features, display_order, language) VALUES
('Mensuel', 'Abonnement mensuel sans engagement', 9.99, 1, '["Accès à toutes les chaînes", "HD disponible", "Support prioritaire"]', 1, 'fr'),
('Trimestriel', 'Abonnement 3 mois avec 10% de réduction', 26.97, 3, '["Accès à toutes les chaînes", "HD disponible", "Support prioritaire", "Économisez 10%"]', 2, 'fr'),
('Annuel', 'Abonnement annuel avec 20% de réduction', 95.90, 12, '["Accès à toutes les chaînes", "HD disponible", "Support prioritaire", "Économisez 20%", "1 mois offert"]', 3, 'fr')
ON CONFLICT DO NOTHING;

-- Seed Tutorial Devices
INSERT INTO public.tutorial_devices (device_key, name, description, difficulty, duration, steps, display_order, language) VALUES
('android', 'Android TV / Box', 'Configuration pour Android TV et Box Android', 'Facile', '5 min', '[]', 1, 'fr'),
('firestick', 'Amazon Fire Stick', 'Installation sur Fire TV Stick', 'Facile', '5 min', '[]', 2, 'fr'),
('smart-tv', 'Smart TV', 'Configuration pour Smart TV Samsung, LG, etc.', 'Moyen', '10 min', '[]', 3, 'fr'),
('ios', 'iPhone / iPad', 'Installation sur appareils iOS', 'Facile', '3 min', '[]', 4, 'fr')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 5: CREATE ADMIN USER
-- ============================================================================
-- This section creates an admin profile for the user: mr.ahsina@gmail.com
-- The user MUST first sign up at /admin/sign-up to create the auth.users entry
-- Then this script will grant admin privileges to that account
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'mr.ahsina@gmail.com';
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- User exists, create or update admin profile
    INSERT INTO public.admin_profiles (id, full_name, email, is_admin)
    VALUES (v_user_id, 'Admin', v_email, true)
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true, updated_at = now();
    
    RAISE NOTICE 'Admin privileges granted to: %', v_email;
  ELSE
    RAISE NOTICE 'User % not found. Please sign up at /admin/sign-up first, then run this script again.', v_email;
  END IF;
END $$;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Your database is now fully configured with all tables, policies, and seed data
-- To create an admin account:
-- 1. Go to /admin/sign-up and register with: mr.ahsina@gmail.com
-- 2. Run this script again to grant admin privileges
-- 3. Login at /admin/login
-- ============================================================================
