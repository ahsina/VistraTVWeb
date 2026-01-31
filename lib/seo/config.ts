// lib/seo/config.ts
// Centralized SEO configuration for the entire site

export const seoConfig = {
  siteName: "VistraTV",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com",
  defaultTitle: "VistraTV - Streaming Premium IPTV | Films, Séries & Chaînes en Direct",
  titleTemplate: "%s | VistraTV",
  defaultDescription:
    "Découvrez VistraTV, la plateforme de streaming IPTV premium avec 20,000+ chaînes en direct, 50,000+ films et séries en HD, 4K et 8K. Essai gratuit disponible.",
  defaultKeywords: [
    "IPTV",
    "streaming",
    "films",
    "séries",
    "chaînes TV",
    "direct",
    "HD",
    "4K",
    "8K",
    "abonnement IPTV",
  ],
  defaultImage: "/og-default.png",
  twitterHandle: "@vistratv",
  locale: "fr_FR",
  alternateLocales: ["en_US", "ar_SA", "es_ES", "it_IT"],
  themeColor: "#0a0d2c",
  backgroundColor: "#0a0d2c",
}

// Helper to generate page-specific metadata
export function generateMetadata({
  title,
  description,
  keywords = [],
  path = "",
  image,
  noIndex = false,
  article,
}: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
  noIndex?: boolean
  article?: {
    publishedTime: string
    modifiedTime?: string
    author: string
    tags?: string[]
  }
}) {
  const url = `${seoConfig.siteUrl}${path}`
  const ogImage = image || `${seoConfig.siteUrl}${seoConfig.defaultImage}`
  const allKeywords = [...seoConfig.defaultKeywords, ...keywords]

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: seoConfig.siteName, url: seoConfig.siteUrl }],
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: article ? "article" : "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(article && {
        article: {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: [article.author],
          tags: article.tags,
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: seoConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": `${url}?lang=fr`,
        "en-US": `${url}?lang=en`,
        "ar-SA": `${url}?lang=ar`,
        "es-ES": `${url}?lang=es`,
        "it-IT": `${url}?lang=it`,
      },
    },
  }
}

// Page-specific SEO configurations
export const pagesSeo = {
  home: {
    title: "VistraTV - Meilleur Service IPTV | 20,000+ Chaînes TV en Streaming HD/4K/8K",
    description:
      "Découvrez VistraTV, le meilleur service IPTV avec plus de 20,000 chaînes TV, 50,000+ films et séries en HD/4K/8K. Essai gratuit 24-48h. Support 24/7.",
    keywords: ["IPTV France", "streaming TV", "chaînes françaises", "sport en direct"],
  },
  subscriptions: {
    title: "Abonnements IPTV - Plans et Tarifs à partir de 9.99€",
    description:
      "Choisissez votre abonnement IPTV VistraTV. Plans Mensuel (9.99€), Trimestriel (24.99€) et Annuel (79.99€). 20,000+ chaînes, qualité 4K/8K, support 24/7.",
    keywords: ["prix IPTV", "tarifs IPTV", "abonnement mensuel", "IPTV pas cher"],
  },
  about: {
    title: "À Propos - VistraTV | Leader du Streaming IPTV depuis 2018",
    description:
      "Découvrez VistraTV, leader du streaming IPTV depuis 2018. Plus de 50,000 clients satisfaits, 20,000+ chaînes, support 24/7.",
    keywords: ["entreprise IPTV", "histoire VistraTV"],
  },
  tutorials: {
    title: "Tutoriels IPTV - Guides d'Installation par Appareil",
    description:
      "Guides d'installation détaillés pour configurer VistraTV sur tous vos appareils : Smart TV, Android, iOS, Fire Stick, Apple TV, Kodi et plus.",
    keywords: ["tutoriel IPTV", "installation IPTV", "configuration streaming"],
  },
  support: {
    title: "Support Client 24/7 - Aide et Contact",
    description:
      "Besoin d'aide ? Notre équipe support est disponible 24/7. FAQ, tutoriels d'installation, formulaire de contact et chat en direct.",
    keywords: ["support IPTV", "aide streaming", "contact VistraTV"],
  },
  channels: {
    title: "Chaînes TV en Direct - 20,000+ Chaînes Disponibles",
    description:
      "Parcourez notre catalogue de plus de 20,000 chaînes TV en direct : sport, cinéma, divertissement, actualités, enfants et plus.",
    keywords: ["chaînes IPTV", "TV en direct", "chaînes françaises", "sport streaming"],
  },
  content: {
    title: "Films et Séries en Streaming - Catalogue VOD Complet",
    description:
      "Découvrez notre bibliothèque de 50,000+ films et séries en streaming HD/4K/8K. Dernières sorties, classiques, tous genres.",
    keywords: ["films streaming", "séries streaming", "VOD IPTV", "films 4K"],
  },
  blog: {
    title: "Blog IPTV - Actualités, Guides et Conseils",
    description:
      "Restez informé avec notre blog : actualités IPTV, guides d'utilisation, comparatifs et conseils pour optimiser votre expérience streaming.",
    keywords: ["blog IPTV", "actualités streaming", "guides IPTV"],
  },
}

// Tutorial devices for dynamic pages
export const tutorialDevices = {
  "smart-tv": {
    title: "Installation IPTV sur Smart TV - Guide Complet",
    description: "Comment installer et configurer VistraTV sur votre Smart TV Samsung, LG, Sony ou autre. Guide étape par étape avec captures d'écran.",
    keywords: ["IPTV Smart TV", "Samsung IPTV", "LG IPTV"],
  },
  "android-box": {
    title: "Installation IPTV sur Android Box - Guide Complet",
    description: "Configurez VistraTV sur votre Android Box en quelques minutes. Instructions détaillées pour toutes les marques.",
    keywords: ["IPTV Android Box", "box android TV"],
  },
  "fire-stick": {
    title: "Installation IPTV sur Fire Stick - Guide Complet",
    description: "Installez VistraTV sur Amazon Fire Stick facilement. Guide complet avec téléchargement des applications.",
    keywords: ["IPTV Fire Stick", "Amazon Fire TV IPTV"],
  },
  "apple-tv": {
    title: "Installation IPTV sur Apple TV - Guide Complet",
    description: "Configurez VistraTV sur votre Apple TV. Guide d'installation avec les meilleures applications IPTV.",
    keywords: ["IPTV Apple TV", "Apple TV streaming"],
  },
  iphone: {
    title: "Installation IPTV sur iPhone/iPad - Guide Complet",
    description: "Regardez VistraTV sur votre iPhone ou iPad. Applications recommandées et configuration rapide.",
    keywords: ["IPTV iPhone", "IPTV iPad", "iOS IPTV"],
  },
  "android-phone": {
    title: "Installation IPTV sur Android - Guide Complet",
    description: "Installez VistraTV sur votre téléphone ou tablette Android. Guide avec les meilleures applications.",
    keywords: ["IPTV Android", "téléphone IPTV"],
  },
  windows: {
    title: "Installation IPTV sur Windows PC - Guide Complet",
    description: "Regardez VistraTV sur votre PC Windows. Logiciels recommandés et configuration.",
    keywords: ["IPTV Windows", "IPTV PC", "VLC IPTV"],
  },
  mac: {
    title: "Installation IPTV sur Mac - Guide Complet",
    description: "Configurez VistraTV sur votre Mac. Applications compatibles et guide d'installation.",
    keywords: ["IPTV Mac", "macOS IPTV"],
  },
  kodi: {
    title: "Installation IPTV sur Kodi - Guide Complet",
    description: "Ajoutez VistraTV à Kodi avec les meilleurs addons IPTV. Configuration PVR IPTV Simple Client.",
    keywords: ["Kodi IPTV", "addon IPTV Kodi", "PVR IPTV"],
  },
}
