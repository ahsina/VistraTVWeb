import type { Metadata } from "next"
import ClientTermsPage from "./ClientTermsPage"

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - VistraTV",
  description:
    "Consultez les conditions générales d'utilisation du service VistraTV. Droits, obligations, politique d'abonnement et de remboursement.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return <ClientTermsPage />
}
