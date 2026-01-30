-- Create analytics tables for tracking user behavior

-- Table already exists, just ensure indexes are present
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);

-- Create funnel analytics view
CREATE OR REPLACE VIEW analytics_conversion_funnel AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'page_view' AND page_url LIKE '%/subscriptions%') as viewed_pricing,
  COUNT(*) FILTER (WHERE event_type = 'button_click' AND event_data->>'label' LIKE '%subscribe%') as clicked_subscribe,
  COUNT(*) FILTER (WHERE event_type = 'page_view' AND page_url LIKE '%/checkout%') as reached_checkout,
  COUNT(*) FILTER (WHERE event_type = 'purchase') as completed_purchase
FROM analytics_events
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create engagement metrics view
CREATE OR REPLACE VIEW analytics_engagement_metrics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as identified_users,
  COUNT(*) FILTER (WHERE event_type = 'engagement') as total_interactions
FROM analytics_events
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create popular content view with subquery to calculate time on page
CREATE OR REPLACE VIEW analytics_popular_pages AS
WITH page_times AS (
  SELECT 
    page_url as page,
    session_id,
    created_at,
    LEAD(created_at) OVER (PARTITION BY session_id ORDER BY created_at) as next_time
  FROM analytics_events
  WHERE event_type = 'page_view'
)
SELECT 
  page,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(EXTRACT(EPOCH FROM (next_time - created_at))) as avg_time_on_page
FROM page_times
GROUP BY page
ORDER BY views DESC
LIMIT 20;
