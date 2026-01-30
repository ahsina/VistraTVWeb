"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function PrivacyClient() {
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
              {t.legal?.privacyTitle || "Politique de Confidentialité"}
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">{t.legal?.lastUpdated || "Dernière mise à jour"}: 06 Février 2025</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. {t.legal?.dataCollection || "Collecte des Données"}
                </h2>
                <p className="text-white/80 leading-relaxed mb-4">Nous collectons les informations suivantes:</p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Informations de compte (nom, email, mot de passe)</li>
                  <li>Informations de paiement (traitées de manière sécurisée)</li>
                  <li>Données d'utilisation (historique de visionnage, préférences)</li>
                  <li>Informations techniques (adresse IP, type d'appareil)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. {t.legal?.dataUsage || "Utilisation des Données"}
                </h2>
                <p className="text-white/80 leading-relaxed mb-4">Vos données sont utilisées pour:</p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Fournir et améliorer nos services</li>
                  <li>Personnaliser votre expérience</li>
                  <li>Traiter vos paiements</li>
                  <li>Communiquer avec vous</li>
                  <li>Assurer la sécurité de la plateforme</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. {t.legal?.dataSharing || "Partage des Données"}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec des
                  prestataires de services tiers uniquement dans le but de fournir nos services (processeurs de
                  paiement, hébergement, etc.).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. {t.legal?.cookies || "Cookies"}</h2>
                <p className="text-white/80 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser l'utilisation du site et
                  personnaliser le contenu. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre
                  navigateur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. {t.legal?.security || "Sécurité"}</h2>
                <p className="text-white/80 leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour
                  protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. {t.legal?.rights || "Vos Droits"}</h2>
                <p className="text-white/80 leading-relaxed mb-4">Vous avez le droit de:</p>
                <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
                  <li>Accéder à vos données personnelles</li>
                  <li>Rectifier vos données</li>
                  <li>Supprimer votre compte et vos données</li>
                  <li>Vous opposer au traitement de vos données</li>
                  <li>Demander la portabilité de vos données</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. {t.legal?.contact || "Contact"}</h2>
                <p className="text-white/80 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                  contactez-nous à: privacy@vistratv.com
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
