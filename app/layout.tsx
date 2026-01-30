import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"
import { ToastProvider } from "@/components/ui/toast"
import { MarketingProvider } from "@/lib/contexts/MarketingContext"
import { SupportWidget } from "@/components/support/support-widget"
import { ExitPopup } from "@/components/marketing/exit-popup"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vistratv.com"),
  title: {
    default: "VistraTV - Streaming Premium IPTV | Films, Séries & Chaînes en Direct",
    template: "%s | VistraTV",
  },
  description:
    "Découvrez VistraTV, la plateforme de streaming IPTV premium avec des milliers de chaînes en direct, films et séries en HD et 4K. Essai gratuit disponible.",
  keywords: [
    "IPTV",
    "streaming",
    "films",
    "séries",
    "chaînes TV",
    "direct",
    "HD",
    "4K",
    "8K",
    "abonnement IPTV",
    "TV en ligne",
    "streaming France",
    "chaînes françaises",
    "sport en direct",
    "films streaming",
  ],
  authors: [{ name: "VistraTV", url: "https://vistratv.com" }],
  creator: "VistraTV",
  publisher: "VistraTV",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA", "es_ES", "it_IT"],
    url: "https://vistratv.com",
    title: "VistraTV - Streaming Premium IPTV",
    description: "La plateforme de streaming IPTV premium avec des milliers de chaînes, films et séries.",
    siteName: "VistraTV",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "VistraTV Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VistraTV - Streaming Premium IPTV",
    description: "La plateforme de streaming IPTV premium avec des milliers de chaînes, films et séries.",
    images: ["/placeholder-logo.png"],
    creator: "@vistratv",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://vistratv.com",
    languages: {
      "fr-FR": "https://vistratv.com?lang=fr",
      "en-US": "https://vistratv.com?lang=en",
      "ar-SA": "https://vistratv.com?lang=ar",
      "es-ES": "https://vistratv.com?lang=es",
      "it-IT": "https://vistratv.com?lang=it",
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log("[v0] RootLayout rendering")

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VistraTV",
              url: "https://vistratv.com",
              logo: "https://vistratv.com/placeholder-logo.png",
              description: "Plateforme de streaming IPTV premium",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["French", "English", "Arabic", "Spanish", "Italian"],
              },
              sameAs: [
                "https://facebook.com/vistratv",
                "https://twitter.com/vistratv",
                "https://instagram.com/vistratv",
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ToastProvider>
          <LanguageProvider>
            <MarketingProvider>
              <AnalyticsProvider>
                {children}
                <SupportWidget />
                <ExitPopup />
              </AnalyticsProvider>
            </MarketingProvider>
          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
