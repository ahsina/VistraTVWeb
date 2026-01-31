-- ============================================================================
-- VISTRATV - FONCTIONS RPC ET TRIGGERS
-- ============================================================================
-- Fonctions et triggers pour les opérations atomiques
-- ============================================================================

-- ============================================================================
-- SECTION 1: FONCTIONS FAQ
-- ============================================================================

-- Incrémenter les vues d'une FAQ
CREATE OR REPLACE FUNCTION increment_faq_view(faq_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE faq_items 
  SET view_count = view_count + 1
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrémenter les votes "utile" d'une FAQ
CREATE OR REPLACE FUNCTION increment_faq_helpful(faq_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE faq_items 
  SET helpful_count = helpful_count + 1
  WHERE id = faq_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 2: FONCTIONS PROMO CODES
-- ============================================================================

-- Incrémenter l'utilisation d'un code promo
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_code_value TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE promo_codes 
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE code = UPPER(promo_code_value);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Valider un code promo
CREATE OR REPLACE FUNCTION validate_promo_code(
  code_value TEXT,
  plan_id UUID DEFAULT NULL,
  purchase_amount NUMERIC DEFAULT 0
)
RETURNS TABLE (
  is_valid BOOLEAN,
  discount_type TEXT,
  discount_value NUMERIC,
  error_message TEXT
) AS $$
DECLARE
  promo RECORD;
BEGIN
  SELECT * INTO promo
  FROM promo_codes
  WHERE code = UPPER(code_value)
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, 0::NUMERIC, 'Code promo invalide';
    RETURN;
  END IF;

  -- Vérifier les dates
  IF promo.start_date IS NOT NULL AND NOW() < promo.start_date THEN
    RETURN QUERY SELECT false, NULL::TEXT, 0::NUMERIC, 'Code promo pas encore actif';
    RETURN;
  END IF;

  IF promo.end_date IS NOT NULL AND NOW() > promo.end_date THEN
    RETURN QUERY SELECT false, NULL::TEXT, 0::NUMERIC, 'Code promo expiré';
    RETURN;
  END IF;

  -- Vérifier le nombre d'utilisations
  IF promo.max_uses IS NOT NULL AND promo.current_uses >= promo.max_uses THEN
    RETURN QUERY SELECT false, NULL::TEXT, 0::NUMERIC, 'Code promo épuisé';
    RETURN;
  END IF;

  -- Vérifier le montant minimum
  IF promo.min_purchase_amount IS NOT NULL AND purchase_amount < promo.min_purchase_amount THEN
    RETURN QUERY SELECT false, NULL::TEXT, 0::NUMERIC, 
      format('Montant minimum requis: %s', promo.min_purchase_amount);
    RETURN;
  END IF;

  -- Code valide
  RETURN QUERY SELECT true, promo.discount_type, promo.discount_value, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 3: FONCTIONS AFFILIÉS
-- ============================================================================

-- Calculer les statistiques d'un affilié
CREATE OR REPLACE FUNCTION calculate_affiliate_stats(affiliate_uuid UUID)
RETURNS TABLE (
  total_clicks BIGINT,
  total_conversions BIGINT,
  conversion_rate NUMERIC,
  total_revenue NUMERIC,
  total_commissions NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH click_stats AS (
    SELECT 
      COUNT(*) as clicks,
      COUNT(*) FILTER (WHERE converted = true) as conversions
    FROM affiliate_clicks
    WHERE affiliate_id = affiliate_uuid
  ),
  affiliate_data AS (
    SELECT total_earnings
    FROM affiliates
    WHERE id = affiliate_uuid
  )
  SELECT 
    cs.clicks,
    cs.conversions,
    CASE 
      WHEN cs.clicks > 0 THEN 
        ROUND((cs.conversions::NUMERIC / cs.clicks::NUMERIC) * 100, 2)
      ELSE 0
    END,
    COALESCE((SELECT SUM(commission_amount) FROM affiliate_referrals WHERE affiliate_id = affiliate_uuid), 0),
    COALESCE(ad.total_earnings, 0)
  FROM click_stats cs
  CROSS JOIN affiliate_data ad;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enregistrer un clic affilié
CREATE OR REPLACE FUNCTION track_affiliate_click(
  aff_code TEXT,
  visitor_ip TEXT DEFAULT NULL,
  visitor_ua TEXT DEFAULT NULL,
  ref_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  aff_id UUID;
  click_id UUID;
BEGIN
  -- Trouver l'affilié
  SELECT id INTO aff_id
  FROM affiliates
  WHERE affiliate_code = UPPER(aff_code)
    AND status = 'active';

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Créer le clic
  INSERT INTO affiliate_clicks (affiliate_id, ip_address, user_agent, referrer)
  VALUES (aff_id, visitor_ip, visitor_ua, ref_url)
  RETURNING id INTO click_id;

  RETURN click_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 4: FONCTIONS ANALYTICS
-- ============================================================================

-- Enregistrer un événement analytics
CREATE OR REPLACE FUNCTION track_analytics_event(
  event_type_param TEXT,
  page_url_param TEXT DEFAULT NULL,
  session_id_param TEXT DEFAULT NULL,
  user_id_param UUID DEFAULT NULL,
  event_data_param JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO analytics_events (event_type, page_url, session_id, user_id, event_data)
  VALUES (event_type_param, page_url_param, session_id_param, user_id_param, event_data_param)
  RETURNING id INTO event_id;

  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 5: FONCTIONS NOTIFICATIONS
-- ============================================================================

-- Créer une notification utilisateur
CREATE OR REPLACE FUNCTION create_user_notification(
  user_uuid UUID,
  notif_type TEXT,
  notif_title TEXT,
  notif_message TEXT,
  notif_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notif_id UUID;
BEGIN
  INSERT INTO user_notifications (user_id, type, title, message, link)
  VALUES (user_uuid, notif_type, notif_title, notif_message, notif_link)
  RETURNING id INTO notif_id;

  RETURN notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Marquer les notifications comme lues
CREATE OR REPLACE FUNCTION mark_notifications_read(user_uuid UUID, notif_ids UUID[] DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  IF notif_ids IS NULL THEN
    UPDATE user_notifications
    SET is_read = true, read_at = NOW()
    WHERE user_id = user_uuid AND is_read = false;
  ELSE
    UPDATE user_notifications
    SET is_read = true, read_at = NOW()
    WHERE user_id = user_uuid AND id = ANY(notif_ids) AND is_read = false;
  END IF;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 6: TRIGGERS
-- ============================================================================

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur les tables principales
DO $$
DECLARE
  tables TEXT[] := ARRAY[
    'user_profiles', 'admin_profiles', 'subscriptions', 'subscription_plans',
    'support_tickets', 'promo_codes', 'affiliates', 'faq_items', 'blog_posts',
    'hero_content', 'features', 'channels', 'content', 'tutorial_devices'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END $$;

-- Trigger pour créer une notification admin sur nouveau ticket support
CREATE OR REPLACE FUNCTION notify_admin_new_ticket()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (type, title, message, priority, link)
  VALUES (
    'new_ticket',
    'Nouveau ticket support',
    format('Ticket #%s: %s - %s', LEFT(NEW.id::TEXT, 8), NEW.subject, NEW.email),
    CASE WHEN NEW.priority = 'urgent' THEN 'high' ELSE 'normal' END,
    format('/admin/dashboard/support?ticket=%s', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_support_ticket ON support_tickets;
CREATE TRIGGER on_new_support_ticket
  AFTER INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_ticket();

-- Trigger pour notifier sur paiement complété
CREATE OR REPLACE FUNCTION notify_payment_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO admin_notifications (type, title, message, priority, link)
    VALUES (
      'payment_completed',
      'Nouveau paiement reçu',
      format('Paiement de %s %s reçu de %s', NEW.final_amount, NEW.currency, NEW.email),
      'normal',
      format('/admin/dashboard/payments?id=%s', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_payment_completed ON payment_transactions;
CREATE TRIGGER on_payment_completed
  AFTER INSERT OR UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_completed();

-- ============================================================================
-- SECTION 7: VUES ANALYTIQUES
-- ============================================================================

-- Vue pour le dashboard admin - KPIs
CREATE OR REPLACE VIEW admin_dashboard_kpis AS
SELECT
  (SELECT COUNT(*) FROM user_profiles) as total_users,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
  (SELECT COALESCE(SUM(final_amount), 0) FROM payment_transactions WHERE status = 'completed') as total_revenue,
  (SELECT COALESCE(SUM(final_amount), 0) FROM payment_transactions WHERE status = 'completed' AND created_at >= DATE_TRUNC('month', NOW())) as monthly_revenue,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
  (SELECT COUNT(*) FROM channels WHERE is_active = true) as active_channels,
  (SELECT COUNT(*) FROM content WHERE is_active = true) as total_content,
  (SELECT COUNT(*) FROM affiliates WHERE status = 'active') as active_affiliates;

-- Vue pour les revenus par jour
CREATE OR REPLACE VIEW admin_daily_revenue AS
SELECT 
  DATE_TRUNC('day', created_at)::DATE as date,
  COUNT(*) as transactions,
  COALESCE(SUM(final_amount), 0) as revenue,
  ROUND(AVG(final_amount), 2) as avg_transaction,
  COUNT(DISTINCT email) as unique_customers
FROM payment_transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Vue pour la croissance des utilisateurs
CREATE OR REPLACE VIEW admin_user_growth AS
SELECT 
  DATE_TRUNC('day', created_at)::DATE as date,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', created_at)) as cumulative_users
FROM user_profiles
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- ============================================================================
-- FIN DES FONCTIONS RPC
-- ============================================================================

SELECT 'RPC Functions and Triggers created successfully!' as status;
