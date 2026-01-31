-- ============================================================================
-- VISTRATV - MIGRATION: FIXES ET AMÉLIORATIONS
-- ============================================================================
-- Version: 1.0.0
-- Date: 2026-01
-- Description: Ajoute les colonnes et tables manquantes pour les fixes
-- ============================================================================

-- ============================================================================
-- SECTION 1: COLONNES DE NOTIFICATION D'EXPIRATION
-- ============================================================================

-- Ajouter les colonnes de notification sur subscriptions
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS expiry_notified_7d TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expiry_notified_3d TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expiry_notified_1d TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_transaction_id UUID;

-- Index pour les requêtes de cron
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry_notifications 
ON subscriptions(status, end_date) 
WHERE status = 'active';

-- ============================================================================
-- SECTION 2: AMÉLIORATION DES WEBHOOK LOGS
-- ============================================================================

-- Ajouter des colonnes manquantes aux webhook_logs
ALTER TABLE webhook_logs
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS signature_valid BOOLEAN;

-- Index pour les retries
CREATE INDEX IF NOT EXISTS idx_webhook_logs_retry 
ON webhook_logs(status, next_retry_at) 
WHERE status = 'failed';

-- ============================================================================
-- SECTION 3: AMÉLIORATION DES EMAIL LOGS
-- ============================================================================

-- Ajouter des colonnes aux email_logs
ALTER TABLE email_logs
ADD COLUMN IF NOT EXISTS template VARCHAR(100),
ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Index pour les statistiques
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON email_logs(template);
CREATE INDEX IF NOT EXISTS idx_email_logs_status_date ON email_logs(status, created_at DESC);

-- ============================================================================
-- SECTION 4: TABLE DE RATE LIMITING
-- ============================================================================

-- Créer ou mettre à jour la table de rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
ON api_rate_limits(identifier, endpoint, window_start);

-- ============================================================================
-- SECTION 5: TABLE DE SESSIONS ADMIN
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_profiles(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON admin_sessions(is_active, expires_at);

-- ============================================================================
-- SECTION 6: AMÉLIORATION DES SUPPORT TICKETS
-- ============================================================================

-- Ajouter des colonnes aux support_tickets
ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES admin_profiles(id),
ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status_date ON support_tickets(status, created_at DESC);

-- ============================================================================
-- SECTION 7: TABLE DE TEMPLATES DE RÉPONSE SUPPORT
-- ============================================================================

CREATE TABLE IF NOT EXISTS support_response_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  content TEXT NOT NULL,
  language VARCHAR(5) DEFAULT 'fr',
  shortcut VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_templates_category ON support_response_templates(category, is_active);
CREATE INDEX IF NOT EXISTS idx_support_templates_shortcut ON support_response_templates(shortcut) WHERE shortcut IS NOT NULL;

-- ============================================================================
-- SECTION 8: TABLE FAQ
-- ============================================================================

CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  language VARCHAR(5) DEFAULT 'fr',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_items(category, language, is_active);
CREATE INDEX IF NOT EXISTS idx_faq_order ON faq_items(display_order) WHERE is_active = true;

-- ============================================================================
-- SECTION 9: AMÉLIORATION DU PROGRAMME AFFILIÉ
-- ============================================================================

-- Ajouter des colonnes aux affiliates
ALTER TABLE affiliates
ADD COLUMN IF NOT EXISTS referral_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS custom_commission_rate NUMERIC,
ADD COLUMN IF NOT EXISTS tier_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_payout_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Table pour les bannières affilié
CREATE TABLE IF NOT EXISTS affiliate_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  size VARCHAR(50), -- e.g., '300x250', '728x90'
  language VARCHAR(5) DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION 10: AMÉLIORATION DU BLOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  author_id UUID REFERENCES admin_profiles(id),
  category VARCHAR(100),
  tags TEXT[],
  language VARCHAR(5) DEFAULT 'fr',
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, scheduled
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category, language);

-- ============================================================================
-- SECTION 11: NOTIFICATIONS UTILISATEUR
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id, is_read, created_at DESC);

-- ============================================================================
-- SECTION 12: FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour incrémenter l'usage d'un code promo
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_code_value TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE promo_codes 
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE code = promo_code_value;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM admin_sessions 
  WHERE expires_at < NOW() OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer les stats affilié
CREATE OR REPLACE FUNCTION calculate_affiliate_stats(affiliate_uuid UUID)
RETURNS TABLE(
  total_clicks BIGINT,
  total_conversions BIGINT,
  conversion_rate NUMERIC,
  total_revenue NUMERIC,
  total_commissions NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE true) as total_clicks,
    COUNT(*) FILTER (WHERE converted = true) as total_conversions,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE converted = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END as conversion_rate,
    COALESCE(SUM(CASE WHEN converted THEN 0 ELSE 0 END), 0) as total_revenue,
    a.total_earnings as total_commissions
  FROM affiliate_clicks ac
  JOIN affiliates a ON a.id = ac.affiliate_id
  WHERE ac.affiliate_id = affiliate_uuid
  GROUP BY a.total_earnings;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 13: RLS POLICIES POUR NOUVELLES TABLES
-- ============================================================================

-- FAQ Items
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active FAQ items"
  ON faq_items FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage FAQ items"
  ON faq_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- User Notifications
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON user_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON user_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Support Response Templates
ALTER TABLE support_response_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage response templates"
  ON support_response_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admin Sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage own sessions"
  ON admin_sessions FOR ALL
  TO authenticated
  USING (admin_id = auth.uid());

-- Affiliate Banners
ALTER TABLE affiliate_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners"
  ON affiliate_banners FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage banners"
  ON affiliate_banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- SECTION 14: DONNÉES DE SEED (OPTIONNEL)
-- ============================================================================

-- Templates de réponse support par défaut
INSERT INTO support_response_templates (name, category, content, language, shortcut) VALUES
('Salutation', 'general', 'Bonjour,

Merci de nous avoir contacté.

[Votre réponse ici]

Cordialement,
L''équipe VistraTV', 'fr', '/hello'),
('Problème résolu', 'resolution', 'Bonjour,

Nous sommes heureux de vous informer que votre problème a été résolu.

N''hésitez pas à nous recontacter si vous avez d''autres questions.

Cordialement,
L''équipe VistraTV', 'fr', '/resolved'),
('Demande d''informations', 'info', 'Bonjour,

Afin de mieux vous aider, pourriez-vous nous fournir les informations suivantes :
- [Information 1]
- [Information 2]

Merci d''avance pour votre retour.

Cordialement,
L''équipe VistraTV', 'fr', '/info')
ON CONFLICT DO NOTHING;

-- FAQ par défaut
INSERT INTO faq_items (question, answer, category, language, display_order) VALUES
('Comment installer VistraTV sur ma Smart TV ?', 'Pour installer VistraTV sur votre Smart TV, suivez ces étapes :
1. Accédez à la section Tutoriels de notre site
2. Sélectionnez votre marque de TV
3. Suivez les instructions détaillées

Si vous rencontrez des difficultés, notre support est disponible 24/7.', 'installation', 'fr', 1),
('Quels modes de paiement acceptez-vous ?', 'Nous acceptons les paiements en cryptomonnaies (Bitcoin, Ethereum, USDT, etc.) via notre passerelle sécurisée PayGate.

Les paiements sont instantanés et sécurisés.', 'payment', 'fr', 2),
('Puis-je utiliser mon abonnement sur plusieurs appareils ?', 'Oui ! Selon votre forfait, vous pouvez utiliser VistraTV sur plusieurs appareils simultanément :
- Basic : 1 appareil
- Premium : 2 appareils
- Ultimate : 4 appareils', 'subscription', 'fr', 3),
('Comment contacter le support ?', 'Vous pouvez nous contacter de plusieurs façons :
- Via le widget de chat sur notre site
- Par email à support@vistratv.com
- Via WhatsApp

Notre équipe répond généralement sous 24h.', 'support', 'fr', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================

SELECT 'Migration completed successfully!' as status;
