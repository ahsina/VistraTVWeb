import type { Metadata } from "next"
import ClientPage from "./client"

export const metadata: Metadata = {
  title: "Films et Séries en Streaming - Catalogue Complet | VistraTV",
  description:
    "Découvrez notre bibliothèque de films et séries en streaming HD/4K/8K. Dernières sorties, classiques, tous genres. Mise à jour quotidienne.",
  keywords: "films streaming IPTV, séries streaming, VOD IPTV, films HD, séries 4K",
}

export default function BrowseContentPage() {
  return <ClientPage />
}
