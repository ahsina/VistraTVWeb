-- Table pour les articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  language TEXT NOT NULL DEFAULT 'fr',
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  author_id UUID REFERENCES admin_profiles(id),
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker l'historique de génération IA
CREATE TABLE IF NOT EXISTS blog_ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'openai/gpt-5',
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  created_by UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_ai_generations ENABLE ROW LEVEL SECURITY;

-- Public peut lire les articles publiés
CREATE POLICY "Public can read published blog posts"
ON blog_posts FOR SELECT
TO public
USING (status = 'published');

-- Admins peuvent tout faire
CREATE POLICY "Admins can manage blog posts"
ON blog_posts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_admin = true
  )
);

CREATE POLICY "Admins can manage AI generations"
ON blog_ai_generations FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.id = auth.uid()
    AND admin_profiles.is_admin = true
  )
);

-- Fonction pour générer un slug automatiquement
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(title),
        '[^a-zA-Z0-9\s-]',
        '',
        'g'
      ),
      '\s+',
      '-',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at();
