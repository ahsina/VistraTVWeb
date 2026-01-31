// app/subscriptions/page.tsx
import type { Metadata } from "next"
import SubscriptionsClient from "./subscriptions-client"
import { ProductSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/schema-org"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

export const metadata: Metadata = {
  title: "Abonnements IPTV - Plans et Tarifs à partir de 9.99€ | VistraTV",
  description:
    "Choisissez votre abonnement IPTV VistraTV. Plans Mensuel (9.99€), Trimestriel (24.99€) et Annuel (79.99€). 20,000+ chaînes, qualité 4K/8K, support 24/7. Essai gratuit 24h.",
  keywords: [
    "abonnement IPTV",
    "prix IPTV",
    "tarifs IPTV",
    "plans IPTV",
    "IPTV pas cher",
    "abonnement streaming",
    "IPTV mensuel",
    "IPTV annuel",
    "IPTV France",
    "meilleur IPTV",
  ],
  openGraph: {
    title: "Abonnements IPTV - Plans et Tarifs | VistraTV",
    description: "Plans Mensuel, Trimestriel et Annuel. À partir de 9.99€/mois. 20,000+ chaînes en 4K.",
    type: "website",
    url: `${BASE_URL}/subscriptions`,
    images: [
      {
        url: `${BASE_URL}/og/subscriptions.png`,
        width: 1200,
        height: 630,
        alt: "VistraTV - Abonnements IPTV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abonnements IPTV - Plans et Tarifs | VistraTV",
    description: "Plans à partir de 9.99€/mois. 20,000+ chaînes en 4K.",
  },
  alternates: {
    canonical: `${BASE_URL}/subscriptions`,
  },
}

// Plans data for schema
const plans = [
  {
    name: "Plan Mensuel",
    description: "Abonnement IPTV mensuel avec accès à 20,000+ chaînes, films et séries en HD/4K",
    price: 9.99,
    currency: "EUR",
    duration: "P1M",
    features: ["20,000+ chaînes", "HD/4K qualité", "1 connexion", "Support 24/7"],
  },
  {
    name: "Plan Trimestriel",
    description: "Abonnement IPTV trimestriel avec accès à 20,000+ chaînes, films et séries en HD/4K. Économisez 17%",
    price: 24.99,
    currency: "EUR",
    duration: "P3M",
    features: ["20,000+ chaînes", "HD/4K/8K qualité", "2 connexions", "Support 24/7", "VOD inclus"],
  },
  {
    name: "Plan Annuel",
    description: "Abonnement IPTV annuel avec accès complet. Meilleur rapport qualité-prix. Économisez 33%",
    price: 79.99,
    currency: "EUR",
    duration: "P1Y",
    features: ["20,000+ chaînes", "HD/4K/8K qualité", "3 connexions", "Support prioritaire", "VOD illimité", "Chaînes premium"],
  },
]

// FAQ data for schema
const subscriptionFaqs = [
  {
    question: "Comment fonctionne l'abonnement VistraTV ?",
    answer: "Après votre paiement, vous recevez immédiatement vos identifiants par email et WhatsApp. Vous pouvez alors accéder à plus de 20,000 chaînes sur tous vos appareils.",
  },
  {
    question: "Puis-je essayer avant d'acheter ?",
    answer: "Oui ! Nous offrons un essai gratuit de 24 à 48 heures. Contactez notre support pour en bénéficier.",
  },
  {
    question: "Sur combien d'appareils puis-je regarder ?",
    answer: "Cela dépend de votre plan : 1 appareil pour le plan Mensuel, 2 pour le Trimestriel, et 3 pour l'Annuel.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les paiements par crypto-monnaie (Bitcoin, Ethereum, USDT) via PayGate.to et par carte bancaire via Stripe.",
  },
  {
    question: "L'abonnement se renouvelle-t-il automatiquement ?",
    answer: "Non, nos abonnements ne se renouvellent pas automatiquement. Vous gardez le contrôle total.",
  },
]

export default function SubscriptionsPage() {
  return (
    <>
      {/* Product Schema for Rich Snippets */}
      <ProductSchema plans={plans} />
      
      {/* FAQ Schema */}
      <FAQSchema faqs={subscriptionFaqs} />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: BASE_URL },
          { name: "Abonnements", url: `${BASE_URL}/subscriptions` },
        ]}
      />
      
      <SubscriptionsClient />
    </>
  )
}
