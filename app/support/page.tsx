import type { Metadata } from "next"
import SupportClientPage from "./support-client"

export const metadata: Metadata = {
  title: "Support Client 24/7 - Aide et Contact | VistraTV",
  description:
    "Besoin d'aide ? Notre équipe support est disponible 24/7 par email, WhatsApp, téléphone et chat. Réponse rapide garantie.",
  keywords: "support IPTV, aide IPTV, contact VistraTV, assistance IPTV",
}

export default function SupportPage() {
  return <SupportClientPage />
}
