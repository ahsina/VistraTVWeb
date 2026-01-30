import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "VistraTV - Meilleur Service IPTV | 10,000+ Chaînes TV en Streaming HD/4K/8K",
  description:
    "Découvrez VistraTV, le meilleur service IPTV avec plus de 10,000 chaînes TV, films et séries en HD/4K/8K. Essai gratuit 24-48h. Support 24/7. Compatible tous appareils.",
  keywords:
    "IPTV, streaming TV, chaînes TV, films streaming, séries streaming, IPTV France, abonnement IPTV, TV en ligne, 4K streaming, sport en direct",
  openGraph: {
    title: "VistraTV - Meilleur Service IPTV | 10,000+ Chaînes",
    description: "Plus de 10,000 chaînes TV, films et séries en streaming HD/4K/8K",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA", "es_ES", "it_IT"],
    url: "https://vistratv.com",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "VistraTV - Streaming IPTV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VistraTV - Meilleur Service IPTV",
    description: "Plus de 10,000 chaînes TV, films et séries en streaming",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://vistratv.com",
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "IPTV Streaming Service",
            provider: {
              "@type": "Organization",
              name: "VistraTV",
              url: "https://vistratv.com",
            },
            areaServed: "FR",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Subscription Plans",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Plan Basique",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Plan Premium",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Plan Ultimate",
                  },
                },
              ],
            },
          }),
        }}
      />
      <ClientPage />
    </>
  )
}
