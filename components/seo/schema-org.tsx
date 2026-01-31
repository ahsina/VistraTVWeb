// components/seo/schema-org.tsx
"use client"

import Script from "next/script"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

// Organization Schema (global)
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VistraTV",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: "Plateforme de streaming IPTV premium avec des milliers de chaînes, films et séries en HD, 4K et 8K.",
    foundingDate: "2018",
    founders: [
      {
        "@type": "Person",
        name: "VistraTV Team",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["French", "English", "Arabic", "Spanish", "Italian"],
        email: "support@vistratv.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: ["French", "English"],
      },
    ],
    sameAs: [
      "https://facebook.com/vistratv",
      "https://twitter.com/vistratv",
      "https://instagram.com/vistratv",
      "https://youtube.com/vistratv",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Service Schema (for homepage)
export function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "IPTV Streaming Service",
    name: "VistraTV - Service IPTV Premium",
    description: "Service de streaming IPTV avec plus de 20,000 chaînes TV, 50,000+ films et séries en qualité HD, 4K et 8K.",
    provider: {
      "@type": "Organization",
      name: "VistraTV",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "GeoShape",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plans d'abonnement VistraTV",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Mensuel",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Trimestriel",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plan Annuel",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "12500",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Product Schema (for subscription/pricing page)
interface PricingPlan {
  name: string
  description: string
  price: number
  currency: string
  duration: string
  features: string[]
}

export function ProductSchema({ plans }: { plans: PricingPlan[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: plans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `VistraTV - ${plan.name}`,
        description: plan.description,
        brand: {
          "@type": "Brand",
          name: "VistraTV",
        },
        offers: {
          "@type": "Offer",
          url: `${BASE_URL}/checkout?plan=${encodeURIComponent(plan.name.toLowerCase())}`,
          priceCurrency: plan.currency,
          price: plan.price,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "8500",
        },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ Schema (for support/FAQ page)
interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// HowTo Schema (for tutorial pages)
interface TutorialStep {
  name: string
  text: string
  image?: string
}

interface TutorialSchemaProps {
  name: string
  description: string
  totalTime?: string
  steps: TutorialStep[]
  image?: string
}

export function HowToSchema({ name, description, totalTime = "PT10M", steps, image }: TutorialSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    image: image || `${BASE_URL}/tutorials/default.png`,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Article Schema (for blog posts)
interface ArticleSchemaProps {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  image?: string
  slug: string
}

export function ArticleSchema({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  image,
  slug,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${BASE_URL}/blog/default-og.png`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "VistraTV",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite Schema with SearchAction
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VistraTV",
    url: BASE_URL,
    description: "Plateforme de streaming IPTV premium",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/browse/channels?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// LocalBusiness Schema (if applicable)
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "VistraTV",
    image: `${BASE_URL}/logo.png`,
    "@id": BASE_URL,
    url: BASE_URL,
    telephone: "+33-1-23-45-67-89",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Paris",
      postalCode: "75001",
      addressCountry: "FR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Video Schema (for pages with video content)
interface VideoSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration = "PT5M",
  contentUrl,
  embedUrl,
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    embedUrl,
    publisher: {
      "@type": "Organization",
      name: "VistraTV",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
