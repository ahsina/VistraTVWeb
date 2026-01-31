// app/faq/page.tsx
import { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { DynamicFAQ } from "@/components/faq/dynamic-faq"

export const metadata: Metadata = {
  title: "FAQ - Questions Fréquentes | VistraTV",
  description: "Trouvez les réponses à vos questions sur VistraTV. Installation, paiement, abonnement et support technique.",
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#0a0d2c] via-[#1a1147] to-[#2d1055]">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Questions{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
                Fréquentes
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos services
            </p>
          </div>

          {/* FAQ Component */}
          <div className="max-w-3xl mx-auto">
            <DynamicFAQ showSearch={true} showCategories={true} />
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-gray-300 mb-6">
                Notre équipe de support est disponible 24/7 pour vous aider
              </p>
              <a
                href="/support"
                className="inline-block bg-gradient-to-r from-cyan-500 to-rose-500 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
