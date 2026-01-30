"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function ClientTermsPage() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-[#00d4ff] hover:text-[#e94b87] transition-colors mb-8 inline-block">
            ← {t.legal?.backHome || "Retour à l'accueil"}
          </Link>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e94b87] mb-6">
              {t.legal?.termsTitle || "Conditions Générales d'Utilisation"}
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">{t.legal?.lastUpdated || "Dernière mise à jour"}: 06 Février 2025</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. {t.legal?.acceptance || "Acceptation des Conditions"}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  En accédant et en utilisant VistraTV, vous acceptez d'être lié par ces conditions générales
                  d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. {t.legal?.serviceDescription || "Description du Service"}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  VistraTV est une plateforme de streaming IPTV qui fournit l'accès à des milliers de chaînes TV, films
                  et séries. Le service est fourni sur la base d'un abonnement mensuel ou annuel.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. {t.legal?.userAccount || "Compte Utilisateur"}
                </h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Pour utiliser VistraTV, vous devez créer un compte. Vous êtes responsable de:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Maintenir la confidentialité de vos identifiants de connexion</li>
                  <li>Toutes les activités effectuées sous votre compte</li>
                  <li>Notifier immédiatement VistraTV de toute utilisation non autorisée</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. {t.legal?.subscription || "Abonnement et Paiement"}
                </h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Les abonnements sont facturés mensuellement ou annuellement selon le plan choisi. Les paiements sont
                  traités de manière sécurisée. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau
                  de bord.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. {t.legal?.usage || "Utilisation Acceptable"}</h2>
                <p className="text-white/80 leading-relaxed mb-4">Vous acceptez de ne pas:</p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Partager votre compte avec des tiers</li>
                  <li>Utiliser le service à des fins illégales</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Redistribuer ou revendre le contenu</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. {t.legal?.termination || "Résiliation"}</h2>
                <p className="text-white/80 leading-relaxed">
                  VistraTV se réserve le droit de suspendre ou de résilier votre compte en cas de violation de ces
                  conditions. Vous pouvez également résilier votre compte à tout moment.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. {t.legal?.contact || "Contact"}</h2>
                <p className="text-white/80 leading-relaxed">
                  Pour toute question concernant ces conditions, veuillez nous contacter à: support@vistratv.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
