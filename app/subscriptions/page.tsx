import type { Metadata } from "next"
import SubscriptionsClient from "./subscriptions-client"

export const metadata: Metadata = {
  title: "Abonnements IPTV - Plans et Tarifs | VistraTV",
  description:
    "Choisissez votre abonnement IPTV VistraTV. Plans Basique, Premium et Ultimate avec 1 à 5 connexions simultanées. Qualité HD, 4K et Ultra HD. À partir de 9.99€/mois.",
  keywords: "abonnement IPTV, prix IPTV, tarifs IPTV, plans IPTV, IPTV pas cher, abonnement streaming",
  openGraph: {
    title: "Abonnements IPTV - Plans et Tarifs",
    description: "Plans Basique, Premium et Ultimate. À partir de 9.99€/mois",
    type: "website",
  },
}

export default function SubscriptionsPage() {
  return <SubscriptionsClient />
}
