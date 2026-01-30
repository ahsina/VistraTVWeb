import type { Metadata } from "next"
import HowItWorksClient from "./how-it-works-client"

export const metadata: Metadata = {
  title: "Comment ça marche - Guide IPTV | VistraTV",
  description:
    "Découvrez comment fonctionne VistraTV en 4 étapes simples : créez votre compte, choisissez votre plan, installez l'application, profitez de vos chaînes. Guide complet et tutoriels.",
  keywords: "comment utiliser IPTV, guide IPTV, tutoriel IPTV, installation IPTV",
}

export default function HowItWorksPage() {
  return <HowItWorksClient />
}
