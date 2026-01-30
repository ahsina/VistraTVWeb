import type { Metadata } from "next"
import PrivacyClient from "./PrivacyClient"

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Protection des Données | VistraTV",
  description:
    "Notre politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles. Conformité RGPD.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
