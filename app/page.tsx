// app/page.tsx
// ⚠️ REMPLACE ton fichier app/page.tsx existant
// Ton <ClientPage /> reste intact - on ajoute juste les métadonnées et schemas SEO

import type { Metadata } from "next"
import ClientPage from "./ClientPage"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

// ============================================================================
// METADATA SEO OPTIMISÉES
// ============================================================================
export const metadata: Metadata = {
  title: "VistraTV - Meilleur IPTV France | 20,000+ Chaînes TV HD/4K/8K",
  description:
    "Service IPTV #1 en France. 20,000+ chaînes TV, 50,000 films/séries en HD 4K 8K. Essai gratuit 24h. Support 24/7. Installation facile. À partir de 9.99€/mois.",
  keywords: [
    "IPTV",
    "IPTV France",
    "abonnement IPTV",
    "streaming TV",
    "chaînes TV en direct",
    "films streaming",
    "séries streaming",
    "IPTV 4K",
    "IPTV pas cher",
    "meilleur IPTV",
    "TV en ligne",
    "sport en direct",
  ],
  authors: [{ name: "VistraTV", url: BASE_URL }],
  creator: "VistraTV",
  publisher: "VistraTV",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA", "es_ES", "it_IT"],
    url: BASE_URL,
    siteName: "VistraTV",
    title: "VistraTV - Le Meilleur Service IPTV | 20,000+ Chaînes",
    description: "Service IPTV avec 20,000+ chaînes TV, 50,000 films en HD/4K/8K. Essai gratuit 24h.",
    images: [
      {
        url: `${BASE_URL}/og/homepage.png`,
        width: 1200,
        height: 630,
        alt: "VistraTV - Streaming IPTV Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vistratv",
    creator: "@vistratv",
    title: "VistraTV - Meilleur IPTV France | 20,000+ Chaînes",
    description: "Service IPTV #1. 20,000+ chaînes TV, 50,000 films en HD/4K.",
    images: [`${BASE_URL}/og/homepage.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr-FR": BASE_URL,
      "en-US": `${BASE_URL}?lang=en`,
      "ar-SA": `${BASE_URL}?lang=ar`,
      "es-ES": `${BASE_URL}?lang=es`,
      "it-IT": `${BASE_URL}?lang=it`,
    },
  },
  verification: {
    google: "VOTRE_CODE_GOOGLE_SEARCH_CONSOLE", // ← À remplacer
  },
}

// ============================================================================
// SCHEMAS JSON-LD
// ============================================================================

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "VistraTV",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "Service IPTV premium avec 20,000+ chaînes TV et 50,000+ contenus VOD en HD/4K/8K.",
  foundingDate: "2018",
  email: "support@vistratv.com",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["French", "English", "Arabic", "Spanish", "Italian"],
  },
  sameAs: [
    "https://facebook.com/vistratv",
    "https://twitter.com/vistratv",
    "https://instagram.com/vistratv",
  ],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "VistraTV",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/browse/channels?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "IPTV Streaming Service",
  name: "VistraTV - Service IPTV Premium",
  description: "Service de streaming IPTV avec 20,000+ chaînes TV, 50,000+ films et séries en HD/4K/8K.",
  provider: { "@id": `${BASE_URL}/#organization` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Abonnements VistraTV",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Abonnement Mensuel",
        price: "9.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Abonnement Trimestriel",
        price: "24.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Abonnement Annuel",
        price: "79.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "12847",
    bestRating: "5",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que VistraTV ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VistraTV est un service IPTV premium offrant 20,000+ chaînes TV et 50,000+ films/séries en HD/4K/8K, compatible avec tous les appareils.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne l'essai gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nous offrons un essai gratuit de 24-48h. Contactez notre support via WhatsApp pour recevoir vos identifiants de test.",
      },
    },
    {
      "@type": "Question",
      name: "Quels appareils sont compatibles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VistraTV fonctionne sur Smart TV, Android Box, Fire Stick, Apple TV, iPhone, Android, PC, Mac, Kodi et plus encore.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte un abonnement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nos abonnements: 9.99€/mois, 24.99€/3 mois (-17%), ou 79.99€/an (-33%). Tous incluent 20,000+ chaînes et support 24/7.",
      },
    },
  ],
}

// ============================================================================
// COMPOSANT PAGE
// ============================================================================
export default function HomePage() {
  return (
    <>
      {/* Schemas JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ton composant ClientPage existant - AUCUNE MODIFICATION */}
      <ClientPage />
    </>
  )
}
