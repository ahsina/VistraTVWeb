// app/support/metadata.ts
// This file contains metadata and schema for the support page
// Import this in your support/page.tsx

import type { Metadata } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"

export const supportMetadata: Metadata = {
  title: "Support Client 24/7 - Aide et Contact | VistraTV",
  description:
    "Besoin d'aide ? Notre équipe support est disponible 24/7. FAQ, tutoriels d'installation, formulaire de contact et chat en direct. Réponse garantie sous 24h.",
  keywords: [
    "support IPTV",
    "aide IPTV",
    "contact VistraTV",
    "FAQ IPTV",
    "assistance streaming",
    "problème IPTV",
    "configuration IPTV",
  ],
  openGraph: {
    title: "Support Client 24/7 | VistraTV",
    description: "Équipe support disponible 24/7. FAQ, tutoriels et chat en direct.",
    type: "website",
    url: `${BASE_URL}/support`,
  },
  twitter: {
    card: "summary",
    title: "Support Client 24/7 | VistraTV",
    description: "Équipe support disponible 24/7.",
  },
  alternates: {
    canonical: `${BASE_URL}/support`,
  },
}

// FAQ items for schema (these should match your actual FAQ content)
export const supportFaqs = [
  {
    question: "Comment installer VistraTV sur ma Smart TV ?",
    answer: "Téléchargez une application IPTV compatible (IPTV Smarters, TiviMate, etc.) depuis le store de votre TV, puis entrez vos identifiants VistraTV. Consultez nos tutoriels détaillés pour chaque marque de TV.",
  },
  {
    question: "Mes chaînes ne fonctionnent pas, que faire ?",
    answer: "Vérifiez d'abord votre connexion internet (minimum 10 Mbps recommandé). Redémarrez votre application et votre appareil. Si le problème persiste, contactez notre support avec votre numéro d'abonnement.",
  },
  {
    question: "Comment obtenir mes identifiants ?",
    answer: "Vos identifiants sont envoyés automatiquement par email et WhatsApp après confirmation du paiement. Vérifiez vos spams si vous ne les trouvez pas. Vous pouvez aussi les retrouver dans votre espace client.",
  },
  {
    question: "L'image est pixelisée ou saccadée",
    answer: "Ce problème est généralement lié à votre connexion internet. Essayez de réduire la qualité de streaming, connectez-vous en filaire (Ethernet) plutôt qu'en WiFi, ou contactez votre FAI si le problème persiste.",
  },
  {
    question: "Puis-je changer d'appareil ?",
    answer: "Oui, vous pouvez utiliser vos identifiants sur n'importe quel appareil compatible. Le nombre de connexions simultanées dépend de votre plan d'abonnement.",
  },
  {
    question: "Comment renouveler mon abonnement ?",
    answer: "Rendez-vous sur notre page Abonnements, choisissez votre plan et procédez au paiement. Vos identifiants actuels seront automatiquement prolongés.",
  },
  {
    question: "Proposez-vous un remboursement ?",
    answer: "Nous offrons un remboursement sous 7 jours si vous n'êtes pas satisfait, à condition de ne pas avoir dépassé 5% d'utilisation de votre abonnement. Contactez le support pour toute demande.",
  },
  {
    question: "Quels appareils sont compatibles ?",
    answer: "VistraTV fonctionne sur Smart TV (Samsung, LG, Sony...), Android Box, Fire Stick, Apple TV, iPhone/iPad, téléphones Android, PC/Mac, Kodi, et bien d'autres. Consultez nos tutoriels pour la liste complète.",
  },
  {
    question: "Le service fonctionne-t-il à l'étranger ?",
    answer: "Oui, VistraTV fonctionne partout dans le monde. Certaines chaînes peuvent nécessiter un VPN selon votre localisation pour des raisons de droits de diffusion.",
  },
  {
    question: "Comment contacter le support ?",
    answer: "Vous pouvez nous contacter via le formulaire sur cette page, par email à support@vistratv.com, ou via WhatsApp pour une réponse plus rapide. Notre équipe répond généralement sous 2 heures.",
  },
]

// Breadcrumb items for schema
export const supportBreadcrumbs = [
  { name: "Accueil", url: BASE_URL },
  { name: "Support", url: `${BASE_URL}/support` },
]
