import type { Metadata } from "next"
import BrowseChannelsClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Catalogue de Chaînes TV - 10,000+ Chaînes | VistraTV",
  description:
    "Parcourez notre catalogue de plus de 10,000 chaînes TV. Sports, cinéma, séries, documentaires, enfants et plus. Recherche et filtres par catégorie.",
  keywords: "chaînes TV IPTV, catalogue chaînes, liste chaînes IPTV, chaînes sport, chaînes cinéma",
}

export default function BrowseChannelsPage() {
  return <BrowseChannelsClientPage />
}
