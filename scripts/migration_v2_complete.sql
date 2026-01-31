-- ============================================================================
-- VISTRATV - MIGRATION COMPLÈTE V2
-- ============================================================================
-- Cette migration contient TOUTES les tables et colonnes nécessaires
-- pour les fixes implémentés. Exécutez ce script dans Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- SECTION 1: TABLES POUR L'AUTHENTIFICATION
-- ============================================================================

-- Table pour la vérification d'email
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- Table pour la configuration 2FA
CREATE TABLE IF NOT EXISTS user_2fa_setup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    backup_codes TEXT[],
    enabled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions admin
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================================================
-- SECTION 2: TABLES POUR LES PAIEMENTS
-- ============================================================================

-- Ajout de colonnes à payment_transactions
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10, 2);
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS promo_code TEXT;
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS affiliate_code TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice ON payment_transactions(invoice_number);

-- ============================================================================
-- SECTION 3: TABLES POUR LES ABONNEMENTS
-- ============================================================================

-- Ajout de colonnes pour les notifications d'expiration
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_notified_7d TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_notified_3d TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS expiry_notified_1d TIMESTAMPTZ;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_transaction_id UUID;

CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_7d ON subscriptions(end_date) 
    WHERE expiry_notified_7d IS NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_3d ON subscriptions(end_date) 
    WHERE expiry_notified_3d IS NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_1d ON subscriptions(end_date) 
    WHERE expiry_notified_1d IS NULL;

-- Table pour l'historique des changements d'abonnement
CREATE TABLE IF NOT EXISTS subscription_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    old_plan_id UUID,
    new_plan_id UUID,
    change_type TEXT CHECK (change_type IN ('upgrade', 'downgrade', 'renewal', 'cancellation')),
    proration_amount NUMERIC(10, 2) DEFAULT 0,
    credit_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: TABLES POUR LE SUPPORT
-- ============================================================================

-- Ajout de colonnes à support_tickets
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMPTZ;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS tags TEXT[];

CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- Templates de réponse support
CREATE TABLE IF NOT EXISTS support_response_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    shortcut TEXT UNIQUE,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: TABLES POUR LA FAQ
-- ============================================================================

CREATE TABLE IF NOT EXISTS faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    language TEXT DEFAULT 'fr',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_items_language ON faq_items(language);
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON faq_items(is_active);

-- ============================================================================
-- SECTION 6: TABLES POUR LE BLOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category TEXT,
    tags TEXT[],
    language TEXT DEFAULT 'fr',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at) WHERE status = 'published';

-- ============================================================================
-- SECTION 7: TABLES POUR LES NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_unread ON user_notifications(user_id) WHERE is_read = false;

-- Notifications admin
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON admin_notifications(admin_id) WHERE is_read = false;

-- ============================================================================
-- SECTION 8: TABLES POUR LES AFFILIÉS
-- ============================================================================

-- Ajout de colonnes aux affiliés
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS referral_link TEXT;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS custom_commission_rate NUMERIC(5, 2);
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS tier_level INTEGER DEFAULT 1;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS last_payout_at TIMESTAMPTZ;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS pending_earnings NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS paid_earnings NUMERIC(10, 2) DEFAULT 0;

-- Payouts affiliés
CREATE TABLE IF NOT EXISTS affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method TEXT,
    payment_details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bannières marketing affiliés
CREATE TABLE IF NOT EXISTS affiliate_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    dimensions TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 9: TABLES POUR LE MARKETING
-- ============================================================================

-- Campagnes email
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    audience TEXT DEFAULT 'all' CHECK (audience IN ('all', 'active', 'expired', 'free', 'custom')),
    custom_audience_ids UUID[],
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates email
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    variables TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 10: TABLES POUR LE CONTENU
-- ============================================================================

-- Fichiers média
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('image', 'video', 'document')),
    size INTEGER,
    width INTEGER,
    height INTEGER,
    folder TEXT DEFAULT 'uploads',
    tags TEXT[],
    alt_text TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(type);
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON media_files(folder);

-- Blocs de contenu
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('hero', 'feature', 'testimonial', 'faq', 'cta', 'banner', 'custom')),
    title TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    language TEXT DEFAULT 'fr',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    page TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 11: TABLES POUR LE LOGGING
-- ============================================================================

-- Ajout de colonnes aux logs
ALTER TABLE webhook_logs ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE webhook_logs ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;
ALTER TABLE webhook_logs ADD COLUMN IF NOT EXISTS signature_valid BOOLEAN;

ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS template TEXT;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ;
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(identifier, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON api_rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON api_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- ============================================================================
-- SECTION 12: AJOUT DE COLONNES AUX PROFILS UTILISATEURS
-- ============================================================================

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'fr';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Paris';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb;

-- ============================================================================
-- SECTION 13: POLITIQUES RLS (Row Level Security)
-- ============================================================================

-- FAQ - lecture publique pour les items actifs
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active FAQs" ON faq_items;
CREATE POLICY "Public can read active FAQs" ON faq_items
    FOR SELECT USING (is_active = true);

-- Blog - lecture publique pour les posts publiés
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
CREATE POLICY "Public can read published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Notifications utilisateur
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own notifications" ON user_notifications;
CREATE POLICY "Users can read own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own notifications" ON user_notifications;
CREATE POLICY "Users can update own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Médias - lecture publique
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read media" ON media_files;
CREATE POLICY "Public can read media" ON media_files
    FOR SELECT USING (true);

-- Bannières affiliés - lecture publique pour les actifs
ALTER TABLE affiliate_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active banners" ON affiliate_banners;
CREATE POLICY "Public can read active banners" ON affiliate_banners
    FOR SELECT USING (is_active = true);

-- ============================================================================
-- SECTION 14: DONNÉES DE SEED
-- ============================================================================

-- Templates de réponse support par défaut
INSERT INTO support_response_templates (title, content, category, shortcut) VALUES
('Salutation', 'Bonjour,\n\nMerci de nous avoir contacté. Nous avons bien reçu votre demande.', 'general', '/hello'),
('Problème résolu', 'Nous sommes heureux de vous informer que votre problème a été résolu.\n\nN''hésitez pas à nous contacter si vous avez d''autres questions.', 'resolution', '/resolved'),
('Demande d''informations', 'Pour mieux vous aider, pourriez-vous nous fournir les informations suivantes :\n- Votre adresse email\n- Une description détaillée du problème', 'info', '/info'),
('Transfert technique', 'Votre demande nécessite une intervention technique. Je transfère votre ticket à notre équipe spécialisée qui vous contactera sous peu.', 'technical', '/tech'),
('Remerciement', 'Merci pour votre patience et votre compréhension. Si vous avez d''autres questions, n''hésitez pas !', 'general', '/thanks')
ON CONFLICT (shortcut) DO NOTHING;

-- FAQ par défaut
INSERT INTO faq_items (question, answer, category, language, display_order) VALUES
('Comment installer l''application ?', 'Téléchargez l''application depuis votre store (App Store ou Google Play), installez-la et connectez-vous avec vos identifiants.', 'installation', 'fr', 1),
('Quels modes de paiement acceptez-vous ?', 'Nous acceptons les paiements par carte bancaire, PayPal et crypto-monnaies (Bitcoin, Ethereum, USDT).', 'payment', 'fr', 2),
('Puis-je utiliser mon compte sur plusieurs appareils ?', 'Oui, votre abonnement vous permet de vous connecter sur plusieurs appareils. Le nombre exact dépend de votre plan.', 'subscription', 'fr', 3),
('Comment contacter le support ?', 'Vous pouvez nous contacter via le formulaire de support sur notre site, par email à support@vistratv.com, ou via WhatsApp.', 'support', 'fr', 4),
('Comment résilier mon abonnement ?', 'Vous pouvez résilier votre abonnement à tout moment depuis votre espace client. L''accès restera actif jusqu''à la fin de la période payée.', 'subscription', 'fr', 5)
ON CONFLICT DO NOTHING;

-- Templates email par défaut
INSERT INTO email_templates (name, subject, content, category, variables) VALUES
('Bienvenue', 'Bienvenue chez VistraTV ! 🎉', '<h1>Bienvenue {{name}} !</h1><p>Merci de nous avoir rejoint.</p>', 'onboarding', ARRAY['name', 'email']),
('Rappel expiration', 'Votre abonnement expire bientôt ⏰', '<h1>Attention {{name}}</h1><p>Votre abonnement expire dans {{days}} jours.</p>', 'reminder', ARRAY['name', 'days']),
('Newsletter', '📰 Les dernières news de VistraTV', '<h1>Bonjour {{name}}</h1><p>{{content}}</p>', 'newsletter', ARRAY['name', 'content'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 15: INDEX DE PERFORMANCE
-- ============================================================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_email_status ON payment_transactions(email, status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email_status ON support_tickets(email, status);
CREATE INDEX IF NOT EXISTS idx_affiliates_code_status ON affiliates(affiliate_code, status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status_scheduled ON email_campaigns(status, scheduled_at);

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================

SELECT 'Migration V2 completed successfully!' as status;
