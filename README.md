# VistraTV - Plateforme IPTV Premium

## Vue d'ensemble

VistraTV est une plateforme IPTV complète et moderne construite avec Next.js 16, React 19, TypeScript, et Tailwind CSS v4. Le projet offre une expérience utilisateur premium avec un design vibrant et moderne, optimisé pour la conversion et le SEO.

## Caractéristiques principales

### 🌍 Multilingue
- Support de 5 langues : Français, Anglais, Arabe, Espagnol, Italien
- Support RTL pour l'arabe
- Système i18n complet avec contexte React
- Sélecteur de langue dans le header

### 🎨 Design moderne
- Palette de couleurs vibrante (cyan électrique, rose magenta, violet profond)
- Gradients audacieux et animations sophistiquées
- Design responsive optimisé pour tous les appareils
- Composants réutilisables strictement typés (pas de any())

### 🔐 Authentification complète
- Connexion et inscription
- Réinitialisation de mot de passe
- Dashboard utilisateur avec gestion d'abonnement
- Intégration API REST .NET Core

### 💳 Système de paiement
- Page de checkout avec Stripe
- Gestion des abonnements
- Historique des paiements
- Plans tarifaires configurables depuis l'admin

### 📊 Panel d'administration
- Dashboard avec analytics
- Gestion des utilisateurs
- Gestion des chaînes TV
- Gestion du contenu (films/séries)
- Gestion des prix
- Gestion des paiements
- Paramètres système

### 🔍 SEO optimisé
- Métadonnées complètes sur toutes les pages
- Open Graph et Twitter Cards
- Structure sémantique HTML
- Sitemap et robots.txt ready

## Structure du projet

\`\`\`
app/
├── page.tsx                    # Page d'accueil
├── layout.tsx                  # Layout principal avec providers
├── subscriptions/              # Plans d'abonnement
├── login/                      # Connexion
├── register/                   # Inscription
├── forgot-password/            # Mot de passe oublié
├── reset-password/             # Réinitialisation mot de passe
├── checkout/                   # Paiement
│   └── success/               # Confirmation paiement
├── dashboard/                  # Dashboard utilisateur
│   └── settings/              # Paramètres utilisateur
├── browse/                     # Catalogue
│   ├── channels/              # Parcourir les chaînes
│   └── content/               # Parcourir films/séries
├── about/                      # À propos
├── how-it-works/              # Comment ça marche
├── support/                    # Support client
├── terms/                      # CGV
├── privacy/                    # Politique de confidentialité
├── admin/                      # Panel admin
│   ├── page.tsx               # Dashboard admin
│   ├── layout.tsx             # Layout admin avec sidebar
│   ├── users/                 # Gestion utilisateurs
│   ├── channels/              # Gestion chaînes
│   ├── content/               # Gestion contenu
│   ├── pricing/               # Gestion prix
│   ├── payments/              # Gestion paiements
│   ├── analytics/             # Analytics détaillées
│   └── settings/              # Paramètres système
├── api/                        # API Routes
│   ├── auth/                  # Authentification
│   ├── user/                  # Utilisateur
│   ├── admin/                 # Admin
│   ├── checkout/              # Paiement
│   └── support/               # Support
└── not-found.tsx              # Page 404

components/
├── layout/
│   ├── header.tsx             # Header avec navigation
│   └── footer.tsx             # Footer
├── sections/
│   ├── ChannelShowcase.tsx    # Showcase chaînes avec filtres
│   ├── SocialProof.tsx        # Preuves sociales
│   ├── PricingSection.tsx     # Section prix
│   ├── FAQSection.tsx         # FAQ
│   ├── LatestReleases.tsx     # Dernières sorties
│   ├── TestimonialsCarousel.tsx # Témoignages
│   ├── WhatsAppTestimonials.tsx # Retours WhatsApp
│   ├── ContentShowcase.tsx    # Showcase contenu
│   ├── AboutSection.tsx       # À propos
│   ├── DeviceCompatibility.tsx # Compatibilité appareils
│   └── FreeTrialCTA.tsx       # CTA essai gratuit
├── shared/
│   ├── ChannelLogo.tsx        # Logo chaîne
│   ├── StatCard.tsx           # Carte statistique
│   └── PricingCard.tsx        # Carte prix
├── ui/
│   ├── button.tsx             # Bouton (shadcn)
│   ├── card.tsx               # Carte (shadcn)
│   ├── carousel.tsx           # Carrousel custom
│   ├── toast.tsx              # Toast notifications
│   ├── loading.tsx            # Loading spinner
│   └── ...                    # Autres composants shadcn
├── LanguageSwitcher.tsx       # Sélecteur de langue
├── CookieConsent.tsx          # Banner cookies RGPD
└── ChannelSearch.tsx          # Recherche de chaînes

lib/
├── i18n/
│   ├── config.ts              # Configuration i18n
│   ├── translations.ts        # Toutes les traductions
│   └── LanguageContext.tsx    # Contexte React i18n
├── types.ts                    # Types TypeScript
└── api-client.ts              # Client API

\`\`\`

## Technologies utilisées

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2 avec React Compiler
- **TypeScript**: Strict mode, pas de any()
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: CSS transitions et transforms
- **API**: REST avec .NET Core backend
- **Paiement**: Stripe (intégration prête)

## Variables d'environnement

\`\`\`env
# API Backend
API_URL=https://your-api.com
NEXT_PUBLIC_API_URL=https://your-api.com

# Stripe (optionnel)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
\`\`\`

## Fonctionnalités clés

### Pages client
- ✅ Page d'accueil avec sections dynamiques
- ✅ Plans d'abonnement
- ✅ Authentification (login, register, reset password)
- ✅ Dashboard utilisateur
- ✅ Checkout et paiement
- ✅ Catalogue de chaînes et contenu
- ✅ Pages informatives (about, how-it-works)
- ✅ Support client
- ✅ Pages légales (CGV, confidentialité)

### Pages admin
- ✅ Dashboard avec analytics
- ✅ Gestion utilisateurs (CRUD)
- ✅ Gestion chaînes TV (CRUD)
- ✅ Gestion contenu films/séries (CRUD)
- ✅ Gestion plans tarifaires (CRUD)
- ✅ Suivi des paiements
- ✅ Analytics détaillées
- ✅ Paramètres système

### Composants
- ✅ Système de notifications (Toast)
- ✅ Loading states
- ✅ Cookie consent RGPD
- ✅ Recherche de chaînes
- ✅ Carrousels multiples
- ✅ Filtres et recherche
- ✅ Page 404 personnalisée

## Intégration API

Toutes les pages et composants sont prêts pour l'intégration avec votre API REST .NET Core. Les endpoints sont définis dans `app/api/` et utilisent la variable d'environnement `API_URL`.

### Endpoints principaux

**Authentification**
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`

**Utilisateur**
- GET `/api/user/subscription`
- POST `/api/user/subscription/cancel`
- GET `/api/user/payments`
- PATCH `/api/user/profile`

**Admin**
- GET/POST/PATCH/DELETE `/api/admin/users`
- GET/POST/PATCH/DELETE `/api/admin/channels`
- GET/POST/PATCH/DELETE `/api/admin/content`
- GET/POST/PATCH/DELETE `/api/pricing`
- GET `/api/admin/analytics`
- GET `/api/admin/payments`

**Autres**
- POST `/api/checkout`
- POST `/api/support`

## Optimisations SEO

- Métadonnées complètes sur toutes les pages
- Titres et descriptions optimisés
- Open Graph et Twitter Cards
- Structure HTML sémantique
- Alt text sur toutes les images
- Support multilingue pour le SEO international

## Prochaines étapes

1. Connecter l'API .NET Core backend
2. Configurer Stripe pour les paiements réels
3. Ajouter les vraies données de chaînes et contenu
4. Configurer le déploiement sur Vercel
5. Tester le flux complet utilisateur
6. Optimiser les performances (images, lazy loading)

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.

---

**VistraTV** - La meilleure plateforme IPTV du marché 🚀
